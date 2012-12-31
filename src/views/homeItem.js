define([
  'joshlib!ui/item',
  'src/requiretext!templates/homeItem.html'
], function(
  Item,
  itemTpl
) {
  'use strict';

  return Item.extend({
    className: 'home-item',
     initialize: function initialize(options) {
      options = options || {};
      options.template = itemTpl;
      Item.prototype.initialize.call(this, options);
    }

  });
});