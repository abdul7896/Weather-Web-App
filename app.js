const express = require("express");
const https = require("https");
const bodyParser = require("body-parser");
const port = process.env.PORT || 3000;
const dotenv = require("dotenv").config();


const app = express();

app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(express.static(__dirname + '/public'));

app.set('view engine', 'ejs')

app.get("/", function(req, res) {
    res.render("index",{weatherData: null,error: null});
});


const apiKey = process.env.API_KEY;

app.post("/", function(req, res) {
    const cityName = req.body.cityName;
    const units = "metric"

    let url = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&units=imperial&appid=${apiKey}`

    https.get(url, function(response,body) {
        if (response.statusCode === 200) {
            response.on("data", function(body) {
                let weatherData = JSON.parse(body);
                const temp = weatherData.main.temp;
                let tempInC = (Number(weatherData.main.temp) - 32) * 5 / 9;
                let weatherText = `It's currently ${tempInC.toFixed(2)} C° or ${weatherData.main.temp} F° in ${weatherData.name}!`;
                res.render('index', {
                    weatherData: weatherText,
                    error:null
                });
            });
        } else {
            res.render('index', {weatherData: null, error: 'No Match Found, try again'});
        }
    });
})



app.listen(port, function() {
    console.log("server running on ${port}!")
});
