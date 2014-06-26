define(function(require, exports, module) {

var marionette = require('marionette');

var listView = marionette.ItemView.extend({

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

        if(this.ui.checked.is(':checked')) {
            this.model.set({ completed: true });
        } else {
            this.model.set({ completed: false });
        }

    },

    onDelete: function() {
        this.model.destroy();
    }

});



exports.listView = listView;


});