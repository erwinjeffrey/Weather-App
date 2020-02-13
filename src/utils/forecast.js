const request = require('request');

const forecast = (latitude, longitude, callback) => {
  const url = `https://api.darksky.net/forecast/58330c11d3c713967fc112da2e46bfb4/${latitude},${longitude}`;

  request({ url, json: true }, (error, response) => {
    if (error) {
      callback('Unable to connect to weater service!', undefined);
    } else if (response.body.error) {
      callback('Unable to find location!', undefined);
    } else {
      const currentData = response.body.currently;
      callback(
        undefined,
        `${response.body.daily.data[0].summary} It is currently ${currentData.temperature} degree out. There is a ${currentData.precipProbability}% change of rain`
      );
    }
  });
};

module.exports = forecast;
