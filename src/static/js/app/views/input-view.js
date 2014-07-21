define(function(require, exports, module) {

var marionette = require('marionette');
var models = require('app/models/task');
var keys = require('built/app/keys');
var templateHeader = require('hbs!app/templates/header');

var InputView = marionette.ItemView.extend({

    template: templateHeader,

	ui: {
		input: '#new-todo'
	},

    events: {
        'keypress @ui.input': 'onKeypress'
    },

    initialize: function() {
        keys.initialize();
    },

    onKeypress: function(e){
        //check for enter key
		var todoText = this.ui.input.val().trim();
        var key = keys.getKeyFromEvent(e);
        var newItem = new models.Task({ title: todoText });

		if( key == 'enter' && todoText ) {
            this.collection.add(newItem);
			//clear input
			this.ui.input.val('');
		}
    }

});

exports.InputView = InputView;

});