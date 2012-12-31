#New application template



Comes with
* Joshfire framework, based on Backbone.js
* Grunt tasks
	* Sass compiling
	* JS optimizing
* Views/Controllers Structure
	* Home View is a List menu + an Item
	* Stuff is whatever you want it to be

##Init

### Joshfire Framework
	$ git submodule update --init --recursive

### Dependencies
	$ npm install

###Sass
	$ sudo gem install compass

##Grunt tasks
	$ grunt watch

Run in the background
To watch for .scss file modification & update css files

	$ grunt joshoptimize
To optimize your JS
Debug app is `./index.html`
Optimized app is `./index.optimized.html`

##Data ?
Even if this a boilerplate, i added two datasources from `datajs.com`
A RSS Feed, used for the menu & the details view, and a Google News entry for the home page