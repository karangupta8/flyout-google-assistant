'use strict';

// Import the Dialogflow module from the Actions on Google client library.

const {

dialogflow,

Permission,

Suggestions,

} = require('actions-on-google');

// Import the firebase-functions package for deployment.

const functions = require('firebase-functions');

const express = require("express");

const bodyParser = require("body-parser");

const request = require("request");

// Instantiate the Dialogflow client.

const app = dialogflow({debug: true});

function distDetail(userLat, userLong, airLat, airLong)

{

var secondsETA = 0;

var apiKey = 'AIza_';

var mapEndpoint = 'https://maps.googleapis.com/maps/api/distancematrix/json?origins=' + userLat + ',' + userLong + '&destinations='  + airLat + ',' + airLong + '&key=' + apiKey;

console.log(mapEndpoint);

request(mapEndpoint, function (error, response, body) {

if (error) throw new Error(error);

console.log(body);

const res_data = JSON.parse(body);

//console.log(res_data);

//console.log(res_data);

//console.log(res_data['rows']);

//console.log(res_data['rows'][0]);

//console.log(res_data['rows'][0]['elements']);

secondsETA = res_data.rows[0].elements[0].duration.value;

console.log(secondsETA);

});

return secondsETA;

}

function flightDetail(flightNum){

console.log(flightNum);

var airLat = '';

var airLong = '';

var departTimeUTC = '';

var options = {

method: 'GET',

url: 'https://aerodatabox.p.rapidapi.com/flights/' + flightNum,

qs: {withLocation: 'false', withAircraftImage: 'false'},

headers: {

'x-rapidapi-host': 'aerodatabox.p.rapidapi.com',

'x-rapidapi-key': '2eba6715',

useQueryString: true

}

};

console.log(options.url);

request(options, function (error, response, body) {

if (error) throw new Error(error);

const res_data = JSON.parse(body);

console.log(body);

airLat = res_data[0].departure.airport.location.lat;

airLong = res_data[0].departure.airport.location.lon;

departTimeUTC = res_data[0].departure.scheduledTimeUtc;

console.log('Airport Lattitude: Airport Longitude :: ' + airLat + ' : ' + airLong + ' and Flight Departing at ' + departTimeUTC);

});

return [airLat, airLong, departTimeUTC];

}

function MainProcessor(FlightNum, userLat, userLong){

var FlightDetails = flightDetail(FlightNum);

var airLat = FlightDetails[0];

var airLong = FlightDetails[1];

var departTimeUTC = FlightDetails[2];

var secondsETA = distDetail(userLat, userLong, airLat, airLong);

var time = '';

return time;

}

// Handle the Dialogflow intent named 'favorite color'.

// The intent collects a parameter named 'color'.

app.intent('Flight Number', (conv, {FlightNum}) => {

const {location} = conv.device;

const userLat = location.coordinates.latitude;

const userLong = location.coordinates.longitude;

var AskMessage = '';

conv.ask('Flight is: ' + FlightNum);

try{

var returnValue = MainProcessor(FlightNum, userLat, userLong);

AskMessage = 'Assign here';

}

catch (except){

console.log("Exception: " + except);

AskMessage = "Sorry, I couldn't process your request. Please try again later.";

}

//conv.ask('Time taken is ' + luckyNumber +  '. Location: ' + loc);

conv.ask(AskMessage + " ;Would you like to know the time for another flight?");

conv.ask(new Suggestions('Yes', 'No'));

});

app.intent('Default Welcome Intent', (conv) => {

const permissions = ['NAME'];

conv.ask('Hi, I can help you with estimating when you should leave for the airport based on your flight number by considering a buffer of 2.5 hours and real-time traffic');

console.log(conv.storage);

let context = 'To greet you personally';

if (conv.user.verification === 'VERIFIED') {

// Could use DEVICE_COARSE_LOCATION instead for city, zip code

permissions.push('DEVICE_PRECISE_LOCATION');

context += ' and determine the time';

}

const options = {

context,

permissions,

};

conv.ask(new Permission(options));

});

app.intent(['actions_intent_PERMISSION','Flight Number - yes'], (conv, params, permissionGranted) => {

const name = conv.user.raw.profile.givenName;

//const name = conv.user.storage.firstName + ",";

const location = conv.device.location;

//const { latitude, longitude } = location.coordinates;

//if(name === 'undefined' || name  == undefined || name == null)}

if (permissionGranted && name && location) {

if(name === 'undefined' || name  == undefined || name == null)

{

conv.ask('Hello there, What is your flight number.');

}

else

{

conv.ask('Hey ' + name + ', What is your flight number.');

}

} else {

conv.close(`Apologies but I cannot proceed without determining your current location`);

}

});

app.intent('actions_intent_NO_INPUT', (conv) => {

// Use the number of reprompts to vary response

const repromptCount = parseInt(conv.arguments.get('REPROMPT_COUNT'));

if (repromptCount === 0) {

conv.ask('What is your flight number?');

} else if (repromptCount === 1) {

conv.ask('Please Provide your Flight Number.');

} else if (conv.arguments.get('IS_FINAL_REPROMPT')) {

conv.close("Sorry we're having trouble. Let's " +

"try this again later. Goodbye.");

}

});

// Set the DialogflowApp object to handle the HTTPS POST request.

exports.dialogflowFirebaseFulfillment = functions.https.onRequest(app);