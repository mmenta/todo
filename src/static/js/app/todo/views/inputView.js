define(function(require, exports, module) {

var marionette = require('marionette');
var models = require('app/todo/models/models');
var keys = require('built/app/keys');

var inputView = marionette.ItemView.extend({

    template: '#header',

	ui: {
		input: '#new-todo'
	},

    events: {
        'keypress @ui.input': 'onKeypress'
    },

    initialize: function() {

        this.BUILT();

    },

    onKeypress: function(e){
        //check for enter key
		var todoText = this.ui.input.val().trim();
        var key = keys.getKeyFromEvent(e);

		if( e.which === 13 && todoText ) {

            var newItem = new models.activeList({ title: todoText });

            this.collection.add(newItem);

            newItem.set({ id: newItem.cid });

			//clear input
			this.ui.input.val('');
		}
    },

    BUILT: function() {

        keys.initialize();




    }

});


exports.inputView = inputView;


});
