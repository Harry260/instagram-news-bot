const fetch = require('node-fetch-commonjs'); // Node fetch for commonjs
const config = require('../config.json'); // Importing configs

//Message create function
function sendMessage(message, title, image, success) {
    var embed = [{
        "title": title,
        "description": message
    }]

    if(title.toLowerCase() === "error"){
        embed[0].color = "ff0000";
    }

    if(image){
        embed[0].image = {
            "url": image
        }
    }

    if(success === true){
        embed[0].author = {
            "name": "Success",
            "icon_url": "https://img.icons8.com/emoji/2x/green-circle-emoji.png"
        }
    }
    else if(success === "/"){
        embed[0].author = {
            "name": "Log",
            "icon_url": "https://img.icons8.com/emoji/2x/blue-circle-emoji.png"
        }
    }
    else if(success === false){
        embed[0].author = {
            "name": "Failed",
            "icon_url": "https://img.icons8.com/emoji/2x/red-circle-emoji.png"
        }
    }

    fetch(config.discord_log_webhook, {
         method: "POST",
         headers: {
             "Content-Type": "application/json"
        },
        body: JSON.stringify(
        {
            "embeds":  embed
        }
        )
     });
}

// Exporting the function
module.exports = sendMessage;