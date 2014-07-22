define(function(require, exports, module) {

var $ = require('jquery');
var marionette = require('marionette');
var vent = require('built/app/vent').vent;
var activity = require('built/app/activity');
var keys = require('built/app/keys');
var modals = require('built/app/modals');
var app = require('app/app');

var Tasks = require('app/collections/tasks').Tasks;
var Task = require('app/models/task').Task;

var InputView = require('app/views/header').InputView;
var TaskView = require('app/views/cells/task').TaskView;
var InfoView = require('app/views/footer').InfoView;
var TasksView = require('app/views/tasks-view').TasksView;

var AppController = marionette.Controller.extend({

    initialize: function(options){
        // This call is required to initialize the
        // BUILT App foundation. See below for what's done.
        // You can customize that as necessary.
        this.app = app;

        this.todos = new Tasks();
        this.filtered = new Tasks();

        var input = new InputView({
            collection: this.todos
        });

        var info = new InfoView({
            collection: this.todos
        });

        this.app.header.show(input);
        this.app.footer.show(info);
    },

    _updateContent: function(collection) {
        this.app.content.show(
            new TasksView({ collection: collection })
        );
    },

    filterAll: function() {
        this._updateContent(this.todos);
    },

    filterActive: function() {
        this.filtered.reset(this.todos.getActive());
        this._updateContent(this.filtered);
    },

    filterCompleted: function() {
        this.filtered.reset(this.todos.getCompleted());
        this._updateContent(this.filtered);
    }

});

exports.AppController = AppController;

});






















