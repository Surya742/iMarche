const express = require("express");
var http = require('http');
const bodyParser = require("body-parser");
const app = express();
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));


var nation = "IN"; //setting default to India
const baseURL = "http://universities.hipolabs.com/search";//college list API

app.get("/", (req, res) => {
    http.get(baseURL, (response) => {

        let rawData = '';
        response.on("data", function (chunk) {
            rawData += chunk;
        })

        response.on('end', function () {
            const unidata = JSON.parse(rawData);//parsing the data into JSON format


            //listing all the countries available in API
            var name_array = unidata.map((block) => { return block.country });
            var set = new Set(name_array);
            let update_array = [...set];

            //listing all the countrie's CODE available in API
            var code_array = unidata.map((block) => { return block.alpha_two_code });
            var code_set = new Set(code_array);
            let update_code_array = [...code_set];

            res.render("index", { arrayList: update_array , codeList: update_code_array });
        })

    });

})

app.get("/colleges", (req, res) => {
    http.get(baseURL, (response) => {

        let rawData = '';
        response.on("data", function (chunk) {
            rawData += chunk;
        })

        response.on('end', function () {
            const unidata = JSON.parse(rawData);//parsing the data into JSON format


            function universities(block) {//funtion to filter out the blocks of required country
                return block.alpha_two_code == nation;
            }
            var collegeArray = unidata.filter(universities).map((block) => { return block.name });  //filter and map to the data to list all the college names
            res.render("list", { collegeList: collegeArray, collegeName: nation });

        })

    });

})

app.post("/", function (req, res) {//making a post request
    let countryCode = req.body.country_code;//collecting country code
    nation = countryCode;
    res.redirect("/colleges");
})

app.listen(3000, function () {
    console.log("Server is running on port 3000...");
})

