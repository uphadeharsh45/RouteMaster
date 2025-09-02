require('dotenv').config();
const express = require('express');
const router = express.Router();
var fetchuser = require('../middleware/fetchuser');
const Routes = require('../models/Route');
const TWRoutes = require('../models/TWRoute');
const { body, validationResult } = require('express-validator');
const twilio = require('twilio');

const accountSid = process.env.TWILIO_ACC_SID;
const authToken = process.env.TWILIO_ATUH_TOKEN;
const twilioPhoneNumber = process.env.TWILIO_PH;

const client = twilio(accountSid, authToken);


// Route 1 : Get all the routes using GET "/api/notes/fetchallnotes".Login required.
router.get('/fetchallroutes', fetchuser, async (req, res) => {
  try {
    const routes = await Routes.find({ user: req.user.id })
    res.json(routes)
  } catch (err) {
    console.log(err.message);
    res.status(500).send("Internal Server error");
  }

})


// Route 2 : Add route in DB
router.post('/addroute', fetchuser, async (req, res) => {
  try {
    const { user, locations } = req.body;

    const newRoute = new Routes({

      locations,
      user: req.user.id
    });

    const savedRoute = await newRoute.save();

    res.status(201).json(savedRoute);
  } catch (error) {
    console.error('Error adding new route:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Route 3 : Delete a Route By Id
router.delete("/deleteroute/:id", fetchuser, async (req, res) => {
  try {
    let route = await Routes.findById(req.params.id);
    if (!route) { return res.status(404).send("Not found") }
    if (route.user.toString() !== req.user.id) {
      return res.status(401).send("Not allowed");
    }

    route = await Routes.findByIdAndDelete(req.params.id)
    res.json({ "Success": "Note has been deleted", route: route });
  } catch (err) {
    console.log(err.message);
    res.status(500).send("Internal Server error");
  }

})

// Route 4 : Update Route by Adding a new Place 
router.put('/updateroute/:id', fetchuser, async (req, res) => {
  const { id } = req.params;
  const { newLocations } = req.body;

  try {
    const route = await Routes.findByIdAndUpdate(id, { locations: newLocations }, { new: true });

    if (!route) {
      return res.status(404).json({ message: 'Route not found' });
    }

    res.status(200).json({ message: 'Route updated successfully', route });
  } catch (error) {
    console.error('Error updating route:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});


// Route 5 : to delete a customer from a route
router.delete('/deletecustomer/:routeId/:customerId', fetchuser, async (req, res) => {
  const { routeId, customerId } = req.params;

  try {
    const route = await Routes.findById(routeId);

    if (!route) {
      return res.status(404).json({ message: 'Route not found' });
    }

    const customerIndex = route.locations.findIndex(customer => customer._id == customerId);

    if (customerIndex === -1) {
      return res.status(404).json({ message: 'Customer not found in route' });
    }

    route.locations.splice(customerIndex, 1);

    await route.save();

    res.status(200).json({ message: 'Customer deleted successfully', route });
  } catch (error) {
    console.error('Error deleting customer:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// Route 6: to update the time of a customer in a route
router.put('/updatetime/:routeId/:customerId', fetchuser, async (req, res) => {
  const { routeId, customerId } = req.params;
  const { newTime } = req.body;

  try {
    const route = await Routes.findById(routeId);

    if (!route) {
      return res.status(404).json({ message: 'Route not found' });
    }

    const customer = route.locations.find(customer => customer._id == customerId);

    if (!customer) {
      return res.status(404).json({ message: 'Customer not found in route' });
    }

    customer.time = newTime;

    await route.save();

    res.status(200).json({ message: 'Customer time updated successfully', route });
  } catch (error) {
    console.error('Error updating customer time:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});


router.post('/send-sms', async (req, res) => {
  const { to, message } = req.body;

  try {
    const result = await client.messages.create({
      body: message,
      from: twilioPhoneNumber,
      to: to
    });

    console.log('SMS sent successfully:', result.sid);
    res.json({ success: true, message: 'SMS sent successfully' });
  } catch (error) {
    console.error('Error sending SMS:', error);
    res.status(500).json({ success: false, error: 'Failed to send SMS' });
  }
});



router.post('/addtwroute', fetchuser, async (req, res) => {
  try {
    const { user, locations } = req.body;

    const newRoute = new TWRoutes({

      locations,
      user: req.user.id
    });

    const savedRoute = await newRoute.save();

    res.status(201).json(savedRoute);
  } catch (error) {
    console.error('Error adding new route:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/fetchalltwroutes', fetchuser, async (req, res) => {
  try {
    const routes = await TWRoutes.find({ user: req.user.id })
    res.json(routes)
  } catch (err) {
    console.log(err.message);
    res.status(500).send("Internal Server error");
  }

})

router.delete("/deletetwroute/:id", fetchuser, async (req, res) => {
  try {
    let route = await TWRoutes.findById(req.params.id);
    if (!route) { return res.status(404).send("Not found") }
    if (route.user.toString() !== req.user.id) {
      return res.status(401).send("Not allowed");
    }

    route = await TWRoutes.findByIdAndDelete(req.params.id)
    res.json({ "Success": "Note has been deleted", route: route });
  } catch (err) {
    console.log(err.message);
    res.status(500).send("Internal Server error");
  }

})

router.delete('/deletetwcustomer/:routeId/:customerId', fetchuser, async (req, res) => {
  const { routeId, customerId } = req.params;

  try {
    const route = await TWRoutes.findById(routeId);

    if (!route) {
      return res.status(404).json({ message: 'Route not found' });
    }

    const customerIndex = route.locations.findIndex(customer => customer._id == customerId);

    if (customerIndex === -1) {
      return res.status(404).json({ message: 'Customer not found in route' });
    }

    route.locations.splice(customerIndex, 1);

    await route.save();

    res.status(200).json({ message: 'Customer deleted successfully', route });
  } catch (error) {
    console.error('Error deleting customer:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

router.put('/updatetwtime/:routeId/:customerId', fetchuser, async (req, res) => {
  const { routeId, customerId } = req.params;
  const { newStartTime, newEndTime } = req.body;

  try {
    const route = await TWRoutes.findById(routeId);

    if (!route) {
      return res.status(404).json({ message: 'Route not found' });
    }

    const customer = route.locations.find(customer => customer._id == customerId);

    if (!customer) {
      return res.status(404).json({ message: 'Customer not found in route' });
    }

    customer.startTime = newStartTime;
    customer.endTime = newEndTime;
    await route.save();

    res.status(200).json({ message: 'Customer time updated successfully', route });
  } catch (error) {
    console.error('Error updating customer time:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

router.put('/updatetwroute/:id', fetchuser, async (req, res) => {
  const { id } = req.params;
  const { newLocations } = req.body;

  try {
    const route = await TWRoutes.findByIdAndUpdate(id, { locations: newLocations }, { new: true });

    if (!route) {
      return res.status(404).json({ message: 'Route not found' });
    }

    res.status(200).json({ message: 'Route updated successfully', route });
  } catch (error) {
    console.error('Error updating route:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});


router.get('/fetchallroutes', fetchuser, async (req, res) => {
  try {
    const routes = await Routes.find({ user: req.user.id })
    res.json(routes)
  } catch (err) {
    console.log(err.message);
    res.status(500).send("Internal Server error");
  }

})



module.exports = router