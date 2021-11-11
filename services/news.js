/*
    News service from JustDoodle
    https://github.com/just-doodle
*/

const fetch = require('node-fetch-commonjs'); // Importing Fetch module for commonjs
const News = {

    // fetching news from shorts api
    getNews: function(type){

        const availableTypes = ["all","national","business","sports","world","politics","technology","startup","entertainment","miscellaneous","hatke","science","automobile"];
        if(!availableTypes.includes(type)){
            return "Invalid news type!"
        }

        var endpoint =`https://shorts-api.vercel.app/news?category=${type}`
        return fetch(endpoint)
        .then(function(response) {
            return response.json();
        })
        .then(function(json) {
           return json;
        })
        .catch(function(error) {
            return error;
        });
    }
}

//Exporting the module
module.exports = News;