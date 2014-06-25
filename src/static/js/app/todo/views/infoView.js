define(function(require, exports, module) {

var marionette = require('marionette');

var infoView = marionette.ItemView.extend({

    template: '#footer',

    ui: {
		all: '.all',
		active: '.active',
		completed: '.completed',
		complete: '.complete',
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

    clearCompleted: function(e) {
        //e.preventDefault();

        var completed = this.collection.getCompleted();
            completed.forEach(function destroy(todo) {
            todo.destroy();
        });
    },

    showActive: function(e) {
        //e.preventDefault();

        //$('.complete').parent().hide();
        //$('.done').not('.complete').parent().show();

    },

    showCompleted: function(e) {
        //e.preventDefault();

        //$('.done').parent().show();
        //$('.done').not('.complete').parent().hide();

    },

    showAll: function(e) {
        //e.preventDefault();

        //$('.done').parent().show();
    }

});



exports.infoView = infoView;

});
