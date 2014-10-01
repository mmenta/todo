define(function(require, exports, module) {

var marionette = require('marionette');
var templateFooter = require('hbs!app/templates/footer');

var InfoView = marionette.ItemView.extend({

    template: templateFooter,

    ui: {
		all: '.all',
		active: '.active',
		completed: '.completed',
		count: '.count',
		clearCompleted: '.clear-completed'
	},

    events: {
        'click @ui.clearCompleted': 'clearCompleted',
        'click @ui.active': 'showActive',
        'click @ui.all': 'showAll',
        'click @ui.completed': 'showCompleted'
    },

    initialize: function() {
        this.listenTo(this.collection, 'all', this.updateCount);
    },

    updateCount: function() {
        this.ui.count.html(this.collection.getActive().length);
    },

    clearCompleted: function() {
        var completed = this.collection.getCompleted();
        this.collection.clearCompleted(completed);
    }

});

exports.InfoView = InfoView;

});