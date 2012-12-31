define([
  'joshlib!vendor/backbone',
  'joshlib!vendor/underscore',
  'joshlib!utils/dollar',
  'joshlib!router'
], function(
  Backbone,
  _,
  $,
  Router
) {
  'use strict';

 return Router({
    init: function init(app) {
      this.app = app;
      this.historyStart();
    },

    routes: {
      '':           'home',
      'home':       'home',
      'stuff/:idx':  'stuff'
    },

    home: function home() {
      this.app.views.main.showChild('home');
    },
    stuff: function stuff(idx){
      var model = this.app.collections.feed.at(idx);
      if (!model){
        return this.navigate('home', {trigger:true});
      }
      this.app.models.stuff.set(model);
      this.app.views.main.showChild('stuff');
    }
  });
});
