const path = require('path');
const express = require('express');
const hbs = require('hbs');
const geocode = require('./utils/geocode');
const forecast = require('./utils/forecast');

console.log(__dirname);

const app = express();

//Define paths for Express config
const publicDirectoryPath = path.join(__dirname, '../public');

// change the default views directory to templates
const viewsPath = path.join(__dirname, '../templates/views');
const partialsPath = path.join(__dirname, '../templates/partials');

// Define paths for Express config
app.set('view engine', 'hbs');
app.set('views', viewsPath);
hbs.registerPartials(partialsPath);

//Setup static directory to serve
app.use(express.static(publicDirectoryPath));

app.get('', (req, res) => {
  res.render('index', {
    title: 'Weather App',
    name: 'Erwin Bas'
  });
});

app.get('/about', (req, res) => {
  res.render('about', {
    title: 'About Me',
    name: 'Erwin Bas'
  });
});

app.get('/help', (req, res) => {
  res.render('help', {
    message: 'Hello from Help page',
    title: 'help',
    name: 'Erwin Bas'
  });
});
//app.use('/help', express.static(publicDirectoryPath + '/help.html'));

//app.use('/about', express.static(publicDirectoryPath + '/about.html'));

app.get('/weather', (req, res) => {
  const address = req.query.address;
  if (!address) {
    return res.send({
      error: 'You must provide a valid address'
    });
  }

  geocode(address, (error, { latitude, longitude, location } = {}) => {
    if (error) {
      return res.send({
        error
      });
    }

    forecast(latitude, longitude, (error, forecastData) => {
      if (error) {
        return res.send({
          error
        });
      }
      res.send({
        address,
        forecast: forecastData,
        location
      });
    });
  });
});

app.get('/products', (req, res) => {
  if (!req.query.search) {
    return res.send({
      error: 'You must provide a search term'
    });
  }
  console.log(req.query);
  res.send({
    products: []
  });
});

app.get('/help/*', (req, res) => {
  res.render('notFound', {
    errorMessage: 'Help article not found'
  });
});
app.get('*', (req, res) => {
  res.render('notFound', {
    errorMessage: 'My 404 page'
  });
});
app.listen(3000, () => {
  console.log(`Server is up on por ${3000}`);
});
