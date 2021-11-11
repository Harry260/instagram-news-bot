// Written by: Harry Tom

// Modules Import
const config = require("./config.json"); //  Configs
const newsModule = require("./services/news"); // News Service
const schedule = require("node-schedule"); // Schedule API
const Instagram = require("instagram-web-api"); // Instagram API
const discordLog = require("./services/discord-log"); //Discord Logger
var LocalStorage = require("node-localstorage").LocalStorage; // Local Storage for Node.js

//Initilizing Modules
const bot = new Instagram({
  username: config.username,
  password: config.password,
});
var localStorage = new LocalStorage("./newslock");

//Scheduled Posting
const postIt = schedule.scheduleJob(config.interval, fetchNews);

fetchNews();
// Functions
function fetchNews() {

  // getting news from news module and selecting random article from the array
  newsModule.getNews(config.category).then((data) => {

    var length = data.data.length - 1,
      randomArticle = appFunctions.getRandomNumber(1, length),
      obj = data.data[randomArticle];

    var articleData = {
      caption: obj.content,
      link: obj.readMoreUrl,
      image: obj.imageUrl,
      title: obj.title,
    };
    pushNews(articleData);
  })
  .catch(function(error) {
    discordLog(error, "Error", false, false);
  });
}

// Valideate if the news is already posted and content is valid
function pushNews(data) {
  var newsStatus = appFunctions.checkIfAlreadyPosted(data.title);
  if (newsStatus) {

    var pImage =  data.image,
    pCaption = data.caption;

    if (data.image && data.caption) {

      var imageExt = appFunctions.getFileExtension(pImage);
      
      if(pImage.slice(-1) === "?"){
        pImage = pImage.substring(0, pImage.length - 1);
        imageExt = appFunctions.getFileExtension(pImage);
      }

      if(imageExt === "jpg" || imageExt === "jpeg") {
        console.log(pImage);
        appFunctions.createPost(
          pImage, 
          pCaption, 
          data.title
        );
      }
      else{
        fetchNews();
      }

    } else {
      fetchNews();
    }
  } else {
    fetchNews();
  }
}

// App Main Object
const appFunctions = {

  // Function to create post on Instagram
  createPost: function (photo, caption, title) {
    try {

      // Logging in to instagram
      bot.login().then(() => {

        var obj = {
          photo: photo,
          caption: title + "\n\n" + caption,
          post: "feed",
        };
  
        // Uplaoding Photo with caption
        bot.uploadPhoto(obj).then((data) => {


          if(data){
            discordLog(data, "Normal Log", false, "/");
          }

          localStorage.setItem(appFunctions.replaceSpace(title), "read") //Setting the news as send

          // Logging the results
          console.log("Successfully Posted Article [" + title + "]");
          discordLog(caption, `${title}`, photo, true);

        });

      }, (data) => {
        if(data){
          discordLog(data, "Normal Log", false, "/");
        }
      });
    } catch (error) {
      discordLog(error, "Error", false, false);
    }
  },

  // Function to get random number n to n
  getRandomNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  },

  // Function to check if the news has been posted before
  checkIfAlreadyPosted: function (title) {
    var title = appFunctions.replaceSpace(title);
    var obj = localStorage.getItem(title);

    if (obj === null) {
      return true;
    } else {
      return false;
    }
  },

  // Replcaing Spaces with hiphens
  replaceSpace: function (string) {
    return string.toLowerCase().replace(/ /g, "-");
  },

  // Get file extension
  getFileExtension: function (filename){

    const extension = filename.split('.').pop();
    return extension;

  }
};