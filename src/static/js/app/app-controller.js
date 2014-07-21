define(function(require, exports, module) {

var $ = require('jquery');
var marionette = require('marionette');
var vent = require('built/app/vent').vent;
var activity = require('built/app/activity');
var keys = require('built/app/keys');
var modals = require('built/app/modals');
var app = require('app/app');

var Tasks               = require('app/collections/tasks').Tasks;
var Task                = require('app/models/task').Task;

var InputView           = require('app/views/input-view').InputView;
var TaskView            = require('app/views/task-view').TaskView;
var InfoView            = require('app/views/info-view').InfoView;
var TasksView           = require('app/views/tasks-view').TasksView;

var AppController = marionette.Controller.extend({

    initialize: function(options){
        // This call is required to initialize the
        // BUILT App foundation. See below for what's done.
        // You can customize that as necessary.
        this.app = app;

        this.todos = new Tasks;
        this.filtered = new Tasks;


        var input = new InputView({
            collection: this.todos
        });

        var info = new InfoView({
            collection: this.todos
        });

        this.app.header.show(input);
        this.app.footer.show(info);
    },

    index: function(){
        var composite = new TasksView({
            collection: this.todos
        });

        this.app.content.show(composite);
    },

    filterAll: function() {
        var composite = new TasksView({
            collection: this.todos
        });

        this.app.content.show(composite);
    },

    filterActive: function() {
        var results = this.todos.where({completed: false});
        this.filtered.reset(results);

        var composite = new TasksView({
            collection: this.filtered
        });

        this.app.content.show(composite);
    },

    filterCompleted: function() {
        var results = this.todos.where({completed: true});
        this.filtered.reset(results);

        var composite = new TasksView({
            collection: this.filtered
        });

        this.app.content.show(composite);
    }

});

exports.AppController = AppController;

});