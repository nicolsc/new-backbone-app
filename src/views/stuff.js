define([
  'joshlib!ui/item',
  'src/requiretext!templates/stuff.html'
], function(
  Item,
  stuffTpl
) {
  'use strict';

  return Item.extend({
    className: 'stuff-panel',
     initialize: function initialize(options) {
      options = options || {};
      options.template = stuffTpl;
      Item.prototype.initialize.call(this, options);
    }

  });
});