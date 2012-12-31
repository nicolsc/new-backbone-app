define([
  'src/app',
  'src/views/home',
  'src/views/stuff',
  'src/router'
], function(
  App,
  HomeView,
  StuffView,
	Router
) {
  'use strict';

  var app = new App({
    device:         'googletv', //Google TV is the default adapter. Would definitely need a brand new name
    homeView:       HomeView,
    stuffView:      StuffView,
    router:         Router
  });

  // Debug only
  window.app = app;
});