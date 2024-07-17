require('dotenv').config();
const connectToMongo = require('./db');
const express = require('express');
const cors = require('cors');
const axios = require('axios');

connectToMongo();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use('/api/auth', require('./routes/auth'));
app.use('/api/routes', require('./routes/Routes'));

app.post('/get-travel-times', async (req, res) => {
  const { locations, timeWindows, numVehicles, startTime,waitTime } = req.body;
  console.log('Request Body:', req.body);

  if (!locations || !Array.isArray(locations) || !timeWindows || !Array.isArray(timeWindows)) {
    console.error('Invalid input format');
    return res.status(400).json({ error: 'Invalid input format' });
  }

  try {
    const travelTimes = await getTravelTimes(locations);
    const finalTimeWindows = getTimeDifference(timeWindows, startTime);

    if (!travelTimes || !finalTimeWindows) {
      throw new Error('Failed to process travel times or time windows');
    }

    console.log('Travel Times:', travelTimes);
    console.log('Final Time Windows:', finalTimeWindows);

    const result = await sendToPython(travelTimes, finalTimeWindows, numVehicles,waitTime);
    res.json(result);
  } catch (error) {
    console.error('Error in processing:', error);
    res.status(500).json({ error: error.message });
  }
});

app.listen(port, () => {
  console.log(`Milkman backend listening on port ${port}`);
});

async function getTravelTimes(locations) {
  const apiKey = process.env.GOOGLE_MAPS_API_KEY;
  const maxElements = 100;
  const numLocations = locations.length;
  const travelTimes = Array(numLocations).fill(null).map(() => Array(numLocations).fill(null));

  // Helper function to create batches
  const createBatches = (locations, maxElements) => {
    const batches = [];
    const batchSize = Math.floor(maxElements / locations.length);

    for (let i = 0; i < locations.length; i += batchSize) {
      batches.push(locations.slice(i, i + batchSize));
    }

    return batches;
  };

  // Generate batches of locations
  const locationBatches = createBatches(locations, maxElements);

  // Fetch travel times for each batch of origins
  for (const originBatch of locationBatches) {
    const origins = originBatch.map(loc => `${loc.latitude},${loc.longitude}`).join('|');
    const destinations = locations.map(loc => `${loc.latitude},${loc.longitude}`).join('|');

    const url = `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${origins}&destinations=${destinations}&key=${apiKey}`;

    try {
      const response = await axios.get(url, { timeout: 10000 });

      if (response.data.status !== 'OK') {
        throw new Error('Error fetching data from Google Maps API');
      }

      // Populate the travelTimes matrix
      originBatch.forEach((origin, i) => {
        response.data.rows[i].elements.forEach((element, j) => {
          travelTimes[locations.indexOf(origin)][j] = element.duration.value / 3600; // Convert seconds to hours
        });
      });
    } catch (error) {
      console.error('Error fetching travel times:', error);
      throw error;
    }
  }

  return travelTimes;
}


function getTimeDifference(timeWindows, startTime) {
  try {
    const startTimeinHours = timeToHours(startTime);
    for (let i = 0; i < timeWindows.length; i++) {
      try {
        timeWindows[i][0] = timeToHours(timeWindows[i][0]) - startTimeinHours;
        timeWindows[i][1] = timeToHours(timeWindows[i][1]) - startTimeinHours;
      } catch (error) {
        console.error('Error converting time:', error);
        return null;
      }
    }
    return timeWindows;
  } catch (error) {
    console.error('Error in getTimeDifference:', error);
    return null;
  }
}

function timeToHours(time) {
  let [hours, minutes] = time.split(':').map(Number);

  if (isNaN(hours) || isNaN(minutes) || hours < 0 || hours >= 24 || minutes < 0 || minutes >= 60) {
    throw new Error('Invalid time format');
  }

  return hours + (minutes / 60);
}

async function sendToPython(timeMatrix, timeWindows, numVehicles,waitTime) {
  console.log('Time Matrix Size:', timeMatrix.length);
  console.log('Time Windows Size:', timeWindows.length);
  console.log('Number of Vehicles:', numVehicles);
  const python_url=process.env.PYTHON_URL

  try {
    const response = await axios.post(`${python_url}/solve-vrp`, {
      time_matrix: timeMatrix,
      time_windows: timeWindows,
      num_vehicles: numVehicles,
      waiting_time:waitTime
    }, { timeout: 30000 }); // 30 seconds timeout

    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error('Error sending data to Python:', error);
    throw error;
  }
}
