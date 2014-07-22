define(function(require, exports, module) {

var marionette = require('marionette');
var templateTask = require('hbs!app/templates/cells/task');

var TaskView = marionette.ItemView.extend({

    template: templateTask,
    tagName: 'li',
    className: 'item',

    ui: {
		done: '.done',
		clear: '.clear'
	},

    events: {
        'click @ui.done': 'onChecked',
        'click @ui.clear': 'onDelete'
    },

    onChecked: function() {
        var isChecked = this.ui.done.is(':checked');
        this.model.toggleCompleted(isChecked);
    },

    onDelete: function() {
        this.model.destroy();
    }

});

exports.TaskView = TaskView;

});