define(function(require, exports, module) {

var marionette = require('marionette');

var TaskView = marionette.ItemView.extend({

    template: '#itemList',
    tagName: 'li',
    className: 'item',

    ui: {
		activeList: '#list',
		checked: '.done',
		clear: '.delete',
		clearComplete: '.clear-completed'
	},

    events: {
        'click @ui.checked': 'onChecked',
        'click @ui.clear': 'onDelete'
    },

    initialize: function() {
        this.listenTo(this.model, 'all', this.render);
    },

    onChecked: function() {
        var isChecked = this.ui.checked.is(':checked');

        if(isChecked) {
            this.model.set({ completed: true });
        } else {
            this.model.set({ completed: false });
        }
    },

    onDelete: function() {
        this.model.destroy();
    }

});

exports.TaskView = TaskView;

});