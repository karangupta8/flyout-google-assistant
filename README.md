
# FlyOut - Google Assistant Action

**FlyOut** is a Google Assistant skill that estimates when you should leave for the airport based on:
- Your flight number
- Your current location
- Real-time traffic data
- A configurable buffer (default: 2.5 hours before departure)

**Idea Date:** May 17, 2019

---

## ✨ Features
- Asks for your **flight number**.
- Fetches **flight departure details** using [AeroDatabox API](https://rapidapi.com/squawk7000/api/aerodatabox).
- Calculates travel time to the departure airport using **Google Distance Matrix API**.
- Adds a configurable **pre-departure buffer** (2.5 hours by default).
- Gives you a recommended **"leave by" time**.
- Handles **Google Assistant permissions** for location access.
- Includes regex-based validation for flight numbers.


---

## 📌 API Flow

### MainProcessor{}

```
FlightDetails(in_FlightNum) {
    // Returns: Out_DepartTime[utc], out_AirportLoc[lat&long]
}

GetTime(in_AirportLoc, in_userLoc) {
    // Returns: out_eta
}

calculateTime(in_departTime) {
    totalTime = outEta + 2.5
    Leave_time[utc] = deparTtime - totalTime
}
```

### Conversation Flow
1. **Ask Flight number** - "Do you have a flight number?"
2. **User Response** - Yes/No
3. **If Yes** - Process flight number and calculate departure time
4. **If No** - Ask for departure time or flight number

---

## 🛠 APIs Used

### Primary APIs
- **[AeroDatabox RapidAPI](https://rapidapi.com/squawk7000/api/aerodatabox?endpoint=apiendpoint_7bb681a3-45b7-49ca-bb0e-5c18888ab851)** — Flight departure time & airport location
- **[Google Distance Matrix API](https://developers.google.com/maps/documentation/distance-matrix/intro)** — Travel time between user & airport

### Alternative APIs
- **[AirportsFinder API](https://rapidapi.com/cometari/api/airportsfinder/endpoints)** — Airport information

---

## 🔍 Flight Number Regex

### Primary Regex Pattern
```regex
^([A-Z]{2}|[A-Z]\d|\d[A-Z])[1-9](\d{1,3})?$
```

### Alternative Patterns
```regex
([A-Z]{2}|[A-Z]{2}|[A-Z]\d|\d[A-Z])[1-9](\d{1,3})?
\A([A-Z]{2}|[A-Z]\d|\d[A-Z])[1-9](\d{1,3})?
```

### Sample Flight Numbers
- AI946
- 6E9314
- IGO9314

**Test your regex patterns:** [Regex Tester Golang](https://regex-golang.appspot.com/assets/html/index.html)

---

## 📚 References

### API Documentation
- [Python | Calculate distance and duration between two places using google distance matrix API](https://www.geeksforgeeks.org/python-calculate-distance-duration-two-places-using-google-distance-matrix-api/)
- [Developer Guide | Distance Matrix API](https://developers.google.com/maps/documentation/distance-matrix/intro)
- [Distance Matrix API documentation](https://distancematrix.ai/dev)

### Google Assistant Development
- [Get Current Location of a user using Helper Intents in Actions on Google](https://medium.com/voice-tech-podcast/get-current-location-of-a-user-using-helper-intents-in-actions-on-google-19fe9a8ea99f)
- [Save data in conversation | Conversational Actions](https://developers.google.com/assistant/conversational/save-data)
- [Dialogflow Quickstart Node.js](https://github.com/actions-on-google/dialogflow-quickstart-nodejs/blob/60b59d15a3ce18758262146620baa57dd750687c/helpers/functions/index.js#L48-L65)
- [Conversational Helpers](https://developers.google.com/assistant/conversational/helpers#df_nodejs_list_selected)

### Development Tools
- [Regex Tester Golang](https://regex-golang.appspot.com/assets/html/index.html)
- [Repl.it - The collaborative browser based IDE](https://repl.it/)
- [Regular Expression Library](http://regexlib.com/REDetails.aspx?regexp_id=1958&AspxAutoDetectCookieSupport=1)

### Articles & Inspiration
- [Want to Know the Exact Time to Leave for the Airport? Download This App](https://www.mydomaine.com/when-to-leave-for-airport-app)

### Known Issues
- [Basic asynchronous functionality breaking · Issue #98](https://github.com/dialogflow/dialogflow-fulfillment-nodejs/issues/98)

---

## 🐛 Issue Log

### Completed ✅
- ~~Regex Matching of Flight Numbers~~

### In Progress 
- Make Synchronous Calls
- Asking user permission every time - [Save data in conversation](https://developers.google.com/assistant/conversational/save-data)
- Considering User Time Zone

---

## 📈 Future Improvements

### High Priority
- **Google Calendar Integration** - Connect to Google Calendar to fetch flight number automatically
- **Fallback for Past Flights** - If departure time < today, now - then fall back message
- **Multi-City Support** - Handle flights from a different city than current location
- **Transit Options** - Support for Car, Public Transport, Taxi

### Enhanced Features
- **Smart Search Flow**:
  1. First search in Calendar
  2. If not found → "Not found in Calendar"
  3. Provide Departure Time or Flight Number
- **Time Zone Adjustments** for departure calculations
- **Multiple Transit Modes** (public transport, rideshare, etc.)

---

## 📱 App Information
- **Privacy Policy**: [View Privacy Policy](https://www.freeprivacypolicy.com/privacy/view/a95f7a5355c79d063f79e2e51128cd4a)

---

## 📜 License
MIT License

---

## 📝 Development Notes
- **Remove real API keys** from the code and move them into `config.js` or environment variables.
- **Document the API calls** with sample responses in `docs/api-references.md`.
- **Add unit tests** later for regex and API parsing.
- Make sure to **use async/await** instead of callbacks in `request` for cleaner, maintainable code.
