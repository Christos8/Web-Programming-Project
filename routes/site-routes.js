const express = require('express');
const path = require('path');
const router = express.Router();
const Flight = require('../models/flight');
const flightController = require('../controllers/flightController');
const userController = require('../controllers/userController');

// Global variable to store search parameters
// TODO use a better way to pass the search parameters between routes




// Route definitions

router.post('/signup', userController.signup);
router.post('/login', userController.login);

router.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'public', 'views', 'home.html'));
});

router.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'public', 'views', 'login.html'));
});

router.get('/signup', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'public', 'views', 'signup.html'));
});

router.get('/aboutus', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'public', 'views', 'aboutus.html'));
});

router.get('/top-destinations', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'public', 'views', 'top-destinations.html'));
});

router.get('/error', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'public', 'views', 'error.html'));
});

router.get('/booking-form', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'views', 'booking-form.html'));
});

router.get('/myticket', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'views', 'myticket.hbs'));
});



// Search route for flights
router.get('/search', (req, res) => {
    const { from, to, 'departure-date': departureDate, 'return-date': returnDate, 'trip-choice': tripChoice } = req.query;
    req.session.searchParams = { from, to, departureDate, returnDate, tripChoice };


    flightController.searchFlights(req, res, from, to, departureDate, returnDate, tripChoice);
});

// Return search route for flights with swapped from and to
router.get('/search_results_return', (req, res) => {
    // Use the global search parameters and swap from and to
   // const { from, to, departureDate, returnDate, tripChoice } = globalSearchParams;
    const { from, to, departureDate, returnDate, tripChoice } = req.session.searchParams;

    // Call the searchFlights function with swapped from and to
    flightController.searchFlights(req, res, to, from, returnDate, departureDate, tripChoice);
    searchFlightsReturn(req, res, to, from, returnDate, departureDate, tripChoice);

});


const searchFlightsReturn = async (req, res, from, to, departureDate, returnDate, tripChoice) => {
  
  try {
      const results = await Flight.findByOriginAndDestination(from, to);
      
      if (results.length === 0) {
          return res.status(404).sendFile(path.join(__dirname, '..', 'public', 'views', 'error.html'));
      }

      const processedResults2 = results.map(flight => ({
          ...flight,
          departure_time: flight['departure time'],
          arrival_time: flight['arrival time'],
          duration: flight['duration'],
          price: flight['price'],
          origin_city: flight['origin_city'],
          origin_code: flight['origin_code'],
          origin_country: flight['origin_country'],
          destination_city: flight['destination_city'],
          destination_code: flight['destination_code'],
          destination_country: flight['destination_country']
      }));

      res.render('search_results_return', { 
          flights: processedResults2,
          departureDate,
          returnDate
      });

  } catch (error) {
      console.error('Error searching for flights:', error);
      res.status(500).send({ error: 'An error occurred while searching for flights' });
  }
};



module.exports = router;