require('dotenv').config();
const connectToMongo=require('./db');
const express = require('express');
var cors=require('cors')
const axios = require('axios');


connectToMongo();


const app = express()
const port = 5000

app.use(cors())
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use('/api/auth',require('./routes/auth'))
app.use('/api/routes',require('./routes/Routes'))


app.post('/get-travel-times', async (req, res) => {
  const { locations, timeWindows, numVehicles, startTime } = req.body;
  console.log(req.body);

  if (!locations || !Array.isArray(locations) || !timeWindows || !Array.isArray(timeWindows)) {
      return res.status(400).json({ error: 'Invalid input format' });
  }

  try {
      const travelTimes = await getTravelTimes(locations);
      const finalTimeWindows = getTimeDifference(timeWindows, startTime);
      const result = await sendToPython(travelTimes, finalTimeWindows, numVehicles);
      res.json(result);
      //res.json({ travelTimes, finalTimeWindows });
  } catch (error) {
      res.status(500).json({ error: error.message });
  }
});

app.listen(port, () => {
  console.log(`Milkman backend listening on port ${port}`)
})

async function getTravelTimes(locations) {
  const apiKey = process.env.GOOGLE_MAPS_API_KEY;
  const origins = locations.map(loc => `${loc.latitude},${loc.longitude}`).join('|');
  const destinations = origins;

  const url = `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${origins}&destinations=${destinations}&key=${apiKey}`;

  const response = await axios.get(url);

  if (response.data.status !== 'OK') {
      throw new Error('Error fetching data from Google Maps API');
  }

  const travelTimes = response.data.rows.map(row => row.elements.map(element => (element.duration.value / 3600)));
  return travelTimes;
}

function getTimeDifference(timeWindows, startTime) {
  const startTimeinHours = timeToHours(startTime);
  for (let i = 0; i < timeWindows.length; i++) {
      try {
          timeWindows[i][0] = timeToHours(timeWindows[i][0]) - startTimeinHours;
          timeWindows[i][1] = timeToHours(timeWindows[i][1]) - startTimeinHours;
      } catch (error) {
          console.error("Error!");
          return null;
      }
  }
  return timeWindows;
}

function timeToHours(time) {
  let [hours, minutes] = time.split(':').map(Number);

  if (isNaN(hours) || isNaN(minutes) || hours < 0 || hours >= 24 || minutes < 0 || minutes >= 60) {
      throw new Error('Invalid time format');
  }

  return hours + (minutes / 60);
}

async function sendToPython(timeMatrix, timeWindows, numVehicles) {
console.log(timeMatrix,timeWindows,numVehicles)
  /*const dummy_time_matrix = [
      [0, 6, 9, 8, 7, 3, 6, 2, 3, 2, 6, 6, 4, 4, 5, 9, 7],
      [6, 0, 8, 3, 2, 6, 8, 4, 8, 8, 13, 7, 5, 8, 12, 10, 14],
      [9, 8, 0, 11, 10, 6, 3, 9, 5, 8, 4, 15, 14, 13, 9, 18, 9],
      [8, 3, 11, 0, 1, 7, 10, 6, 10, 10, 14, 6, 7, 9, 14, 6, 16],
      [7, 2, 10, 1, 0, 6, 9, 4, 8, 9, 13, 4, 6, 8, 12, 8, 14],
      [3, 6, 6, 7, 6, 0, 2, 3, 2, 2, 7, 9, 7, 7, 6, 12, 8],
      [6, 8, 3, 10, 9, 2, 0, 6, 2, 5, 4, 12, 10, 10, 6, 15, 5],
      [2, 4, 9, 6, 4, 3, 6, 0, 4, 4, 8, 5, 4, 3, 7, 8, 10],
      [3, 8, 5, 10, 8, 2, 2, 4, 0, 3, 4, 9, 8, 7, 3, 13, 6],
      [2, 8, 8, 10, 9, 2, 5, 4, 3, 0, 4, 6, 5, 4, 3, 9, 5],
      [6, 13, 4, 14, 13, 7, 4, 8, 4, 4, 0, 10, 9, 8, 4, 13, 4],
      [6, 7, 15, 6, 4, 9, 12, 5, 9, 6, 10, 0, 1, 3, 7, 3, 10],
      [4, 5, 14, 7, 6, 7, 10, 4, 8, 5, 9, 1, 0, 2, 6, 4, 8],
      [4, 8, 13, 9, 8, 7, 10, 3, 7, 4, 8, 3, 2, 0, 4, 5, 6],
      [5, 12, 9, 14, 12, 6, 6, 7, 3, 3, 4, 7, 6, 4, 0, 9, 2],
      [9, 10, 18, 6, 8, 12, 15, 8, 13, 9, 13, 3, 4, 5, 9, 0, 9],
      [7, 14, 9, 16, 14, 8, 5, 10, 6, 5, 4, 10, 8, 6, 2, 9, 0]
  ];

  const dummy_time_windows = [
      [0, 5],
      [7, 12],
      [10, 15],
      [16, 18],
      [10, 13],
      [0, 5],
      [5, 10],
      [0, 4],
      [5, 10],
      [0, 3],
      [10, 16],
      [10, 15],
      [0, 5],
      [5, 10],
      [7, 8],
      [10, 15],
      [11, 15]
  ];

  const dummy_time_matrix2 = [
      [0, 7, 2, 5], //[0, 2, 5, 7],
      [7, 0, 5, 2], //[2, 0, 3, 5],
      [2, 5, 0, 3], //[5, 3, 0, 2],
      [5, 2, 3, 0] //[7, 5, 2, 0]
  ]

  const dummy_time_windows2 = [
      [0, 5],
      [11, 15],
      [0, 3],
      [7, 8]
  ]*/

  const response = await axios.post('http://localhost:3000/solve-vrp', {
      time_matrix: timeMatrix,
      time_windows: timeWindows,
      num_vehicles: numVehicles
  });
console.log(response.data)
  return response.data;
}
