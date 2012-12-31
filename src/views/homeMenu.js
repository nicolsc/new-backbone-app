define([
  'joshlib!ui/verticallist',
  'src/requiretext!templates/menu.html',
  'src/requiretext!templates/menuItem.html'
], function(
  VerticalList,
  menuTpl,
  menuItemTpl
) {
  'use strict';

  return VerticalList.extend({
    className: 'menu-list',
     initialize: function initialize(options) {
      options = options || {};
      options.template = menuTpl;
      options.itemTemplate = menuItemTpl;
      VerticalList.prototype.initialize.call(this, options);
    }

  });
});