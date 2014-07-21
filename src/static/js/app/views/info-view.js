define(function(require, exports, module) {

var marionette = require('marionette');
var unicorn    = require('unicorn');
var templateFooter = require('hbs!app/templates/footer');

var InfoView = marionette.ItemView.extend({

    template: templateFooter,

    ui: {
		all: '.all',
		active: '.active',
		completed: '.completed',
		complete: '.complete',
		count: '.count',
		clearCompleted: '.clear-completed',
		unicorn: '.unicorns',
	},

    events: {
        'click @ui.clearCompleted': 'clearCompleted',
        'click @ui.active': 'showActive',
        'click @ui.all': 'showAll',
        'click @ui.completed': 'showCompleted',
        'click @ui.unicorn': 'unicornShow'
    },

    initialize: function() {
        this.listenTo(this.collection, 'all', this.updateCount);
    },

    updateCount: function() {
        this.ui.count.html(this.collection.getActive().length);
    },

    clearCompleted: function() {
        var completed = this.collection.getCompleted();
            completed.forEach(function destroy(todo) {
            todo.destroy();
        });
    },

    unicornShow: function() {
        cornify_add();
    }

});

exports.InfoView = InfoView;

});
