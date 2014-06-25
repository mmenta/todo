define(function(require, exports, module) {

var $ = require('jquery');
var marionette = require('marionette');
var vent = require('built/app/vent').vent;
var activity = require('built/app/activity');
var keys = require('built/app/keys');
var modals = require('built/app/modals');
var app = require('app/app');

var collections         = require('app/todo/collections');
var models              = require('app/todo/models');

var inputView           = require('app/todo/views/inputView').inputView;
var listView            = require('app/todo/views/listView').listView;
var infoView            = require('app/todo/views/infoView').infoView;
var collectionView       = require('app/todo/views/collectionView').collectionView;

var Model               = require('backbone').Model;


var todos = new collections.activeCollection();
var filtered = new collections.activeCollection();

var AppController = marionette.Controller.extend({

    initialize: function(options){
        // This call is required to initialize the
        // BUILT App foundation. See below for what's done.
        // You can customize that as necessary.
        this.app = app;


        var input = new inputView({
            collection: todos
        });

        var info = new infoView({
            collection: todos
        });

        this.app.header.show(input);
        this.app.footer.show(info);

    },

    index: function(){

        /* Ready. Set. Go! */
        // Your Application's Regions are set in the app/app.js
        // everything else starts here. (or in another route :)

        var composite = new collectionView({
            collection: todos
        });

        this.app.content.show(composite);

        /* ---------- */

    },

    filterAll: function() {

        var composite = new collectionView({
            collection: todos
        });

        this.app.content.show(composite);

    },

    filterActive: function() {
        var results = todos.where({completed: false});
        filtered.reset(results);

        var composite = new collectionView({
            collection: filtered
        });

        this.app.content.show(composite);
    },

    filterCompleted: function() {
        var results = todos.where({completed: true});
        filtered.reset(results);

        var composite = new collectionView({
            collection: filtered
        });

        this.app.content.show(composite);

    }

});

exports.AppController = AppController;
});