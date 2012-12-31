define([
  // Libs
  'joshlib!vendor/backbone',
  'joshlib!vendor/underscore',
  'joshlib!utils/dollar',
  'joshlib!uielement',
  // Controllers
  'src/controllers/home',
  'src/controllers/stuff',
  
  // Custom Views
  'src/views/main',
  'src/views/home',
  'src/views/homeMenu',
  'src/views/homeItem',
  'src/views/stuff',
  // Datas
  'src/data/api',
  'src/data/dictionary'
  // Utils
  //'joshlib!utils/cookie'
], function(
  Backbone,
  _,
  $,
	UIElement,

  HomeController,
  StuffController,

  MainView,
  HomeView,
  HomeMenuView,
  HomeItemView,
  StuffView,

  API,
  dictionary
  
) {
  'use strict';


  // Finally initialize the app
  var App = function(options) {
    this.initialize(options);
  };


  window.app = _.extend(App.prototype, {
    dev:true,
    dictionary: dictionary,
    // Holds references to all the app's views
    // and data objects
    views: {},
    controllers: {},
    collections: {
    },
    models: {
    },

    /* Debug utility - mirrors to console.log*/
    debug:function debug(type, data){
      if (this.dev && window.console){
        if (arguments.length === 0){ return false;}
        if (arguments.length === 1){
          return window.console.log(arguments[0]);
        }
        var args = Array.prototype.slice.call(arguments);
        window.console[type].apply(window.console, args.slice(1));
      }
    },

    /**
    * The app "constructor" which should
    * not be overriden (if all goes well).
    **/
     initialize: function(options) {
      var self = this;

      this.debug('log', 'App init: Started');

      this.controllers.home = new HomeController(this);
      this.controllers.stuff = new StuffController(this);

      this.debug('App init: Created controllers');


      this.debug('App init: initializing API');
      // Initialize the API
      this.API = API;
      this.API.init(function handleAPICallback() {
        self.debug('App init: API Callback called');

        if (!self.API.data) {
          self.debug('missing data');
          self.error('Missing data', self.dictionary.errors.missingData, {autoHide: false});
          return;
        }

        self.debug('API has data');
        self.populateCollections();
        self.populateModels();
        self.initViews();

        /* hide error msg if displayed
        * How can it happen ?
        * timeout on requests -> error msg
        * after some time, we finally got our data : give it a chance
        **/
        $('#error').hide();

        

        // Render the main view (cascade effect included for rendering other views)
        self.views.main.render();
        self.debug('App rendered');

        //Bindings
        self.initBindings();
        self.debug('Bindings initialized');
        
        // Initialize the Router
        self.initRouter(options);

        self.hideSplashscreen();


      });
    },
    /**
    * Populate models with API data
    * @function
    **/
    populateModels:function populateModels(){
      this.models.home = new Backbone.Model(this.API.data.home);
      this.models.stuff = new Backbone.Model(this.API.data.feed[0]);
    },
    /**
    * Populate collections with API data
    * @function
    **/
    populateCollections:function populateCollections(){
      this.collections.feed = new Backbone.Collection(this.API.data.feed);
    },
    /**
    * Init views
    * @function
    **/
    initViews:function initViews(){
      
      this.initHomeViews();

      this.views.stuff = new StuffView({
        app:this,
        model:this.models.stuff
      });
      this.views.main = new MainView({
        children: {
          home: this.views.home,
          stuff: this.views.stuff
        }
      });
    },
    /**
    * Init home views
    * @function
    **/
    initHomeViews:function initHomeViews(){
      this.views.homeMenu = new HomeMenuView({
        app:this,
        collection:this.collections.feed
      });

      this.views.homeItem = new HomeItemView({
        app:this,
       model:this.models.home
      });

      this.views.home = new HomeView({
        children: {
          item: this.views.homeItem,
          menu: this.views.homeMenu
          
        }
      });
    },
    /*
    * Init router
    * @function
    **/
    initRouter:function initRouter(options){
      this.router = options.router;
      this.router.init(this);
      this.debug('Router set and initialized');
      // Creates a history stack
      this.historyStack = [];
      // Adds home to it
      this.historyStack.push('home');
      this.router.bind('all', _.bind(function() {
        var fragment = Backbone.history.fragment;
        if (fragment !== _.last(this.historyStack)) {
          this.historyStack.push(fragment);
        }
      }, this));
    },
    /*
    * Init bindings
    * Do your generic $.on('') stuff here
    * @function
    **/
    initBindings:function initBindings(){

    },
    /*
    * Error management
    * @function
    **/
    error: function error(type, details, options) {
      this.debug('error','app:error', type);
      var self = this;

      options = _.extend({autoHide:true, backHome:false}, options);
      var $alert = $('#error');
      $alert.removeClass();

      if (!details) {
        details = type;
      } else {
        $alert.attr('class', type);
      }

      $alert.find('.error-box').html(details);
      // .show() doesn't seem to work on Opera...
      $alert.css({'display': 'block'});

      /* Hide after 10 seconds? */
      if (options.autoHide) {
        setTimeout(function() {
          if (options.backHome) {
            self.router.navigate('home', {trigger: true, replace: true});
          }
          $alert.fadeOut();

        }, this.timers.errorAutoHide);
      }
    },
    /**
    * hide splashscreen
    * @function
    **/
    hideSplashscreen:function hideSplashscreen(){
      $('#splashscreen').fadeOut('fast');
    }
  });

  return App;
});
