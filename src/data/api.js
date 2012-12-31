define([
  'joshlib!vendor/underscore',
  ], function(
  _
) {
  'use strict';

  return {
    requestTimeout: 3000,
    data: null,
    /** Map $.ajax
     * @function
     * @param {Object} options
     * @param {Function} callback
     **/
    request: function request(options, callback) {
var done = false;
      var params = _.extend(options, {
        success: function(data) {
          // console.log(params.url, 'ok');
          done = true;
          callback(null, data);
        },
        error: function(err) {
          // console.log(params.url, 'err');
          done = true;
          callback(err, null);
        }
      });
      window.$.ajax(params);
      setTimeout(function() {
        if(!done) {
          return callback('Request failed - ' + options.url, null);
        }
      }, this.requestTimeout);

    },
    /**
     * Init API
     * @function
     */
    init: function init(callback) {
      this.getData(_.bind(function(err, data){
        if (!err && data){
           this.data = data;
        }
        callback();
      },this));
    },
    /*
    * Get data
    * @function
    **/
    getData:function getData(callback){

      var data = {feed:null, home:null};
      var err = null;
      var cb = _.after(2, function(){callback(err, data);});

      this.getFeedData(function(feedErr, feedData){
        if (feedErr){
          err = feedErr;
        }
        else if (feedData && feedData.entries){
          data.feed = _.map(feedData.entries, function(item, key){return _.extend(item, {id:key});});
        }
        cb();
      });

      this.getHomeData(function(homeErr, homeData){
        if (homeErr){
          err = homeErr;
        }
        else if (homeData && homeData.entries && homeData.entries.length){
          data.home = homeData.entries[0];
        }
        cb();
      });
    },
    /**
    * Gather RSS data from a 'random' RSS feed.
    * We'll use it as lorem ipsum data
    * @function
    **/
    getFeedData:function getFeedData(callback){
      /*
        Not enough data coming from these RSS... 
        var feedUrl = "www.lequipe.fr/rss/actu_rss.xml";
        var feedUrl = "http://www.eurosport.fr/rss.xml";
      */
      var feedUrl = "http://sports.orange.fr/fr/cmc/rss-orange.xml";
      
      var url  = "http://api.datajs.com/api/1/feed/rss?filter=%7B%22url%22%3A%22"+encodeURIComponent(feedUrl)+"%22%7D&limit=20";

      this.request({url:url, dataType:'jsonp', jsonpCallback:'myRSSData'+Math.ceil(100*Math.random())}, callback);
    },
    /**
    * Get home data
    * @function
    */
    getHomeData:function getHomeData(callback){
      var url = "http://api.datajs.com/api/1/google/news?filter=%7B%22search%22%3A%22sport%22%2C%22language%22%3A%22fr%22%7D&limit=20";
      this.request({url:url, dataType:'jsonp', jsonpCallback:'myGoogleNewsData'+Math.ceil(100*Math.random())}, callback);
    }
  };
});