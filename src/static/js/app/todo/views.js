define(function(require, exports, module) {

var marionette = require('marionette');
var models = require('app/todo/models');
var collections = require('app/todo/collections');
//var _ = require('');


var inputView = marionette.ItemView.extend({

    template: '#main',

	ui: {
		input: '#new-todo'
	},

    events: {
        'keypress @ui.input': 'onKeypress'
    },

    initialize: function() {

    },

    onKeypress: function(e){
        //check for enter key
		var todoText = this.ui.input.val().trim();

		if( e.which === 13 && todoText ) {

            var newItem = new models.activeList({ title: todoText });

            this.collection.add(newItem);

            //console.log( this.collection.toJSON() );

			//clear input
			this.ui.input.val('');
		}
    }
});


var listView = marionette.ItemView.extend({

    template: '#content',

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
        this.listenTo(this.collection, 'all', this.onChange);
    },

    onChange: function() {
        var html = '';
        var obj, checked;

        if( this.collection.length > 0 ) {
            for( i = 0; i < this.collection.length; i++ ) {

                obj = this.collection.models[i];
                attr = obj.attributes;

                if( attr.completed ){
                    checked = 'checked';
                } else {
                    checked = '';
                }

                html += '<li><input class="done" type="checkbox" value="'+obj.cid+'" '+checked+' />'
                        + attr.title
                        + '<button class="delete">X</button>';
            }

            this.ui.activeList.html(html);
        }
    },

    onChecked: function(e) {
        //get cid
        var cid = $(e.currentTarget).val();
        var checked = this.collection.get(cid);

        //change status to completed
        checked.set({ completed: true });
        //console.log( this.collection.toJSON() );
    },

    onDelete: function(e) {
        //get cid
        var cid = $(e.currentTarget).siblings('input').val();

        //remove from collection
        this.collection.remove(cid);

        //console.log( this.collection.toJSON() );
    }

});


var infoView = marionette.ItemView.extend({

    template: '#info',

    ui: {
		all: '.all',
		active: '.active',
		completed: '.completed',
		count: '.count',
		clearComplete: '.clear-completed'
	},

    events: {
        'click @ui.all': 'filterAll',
        'click @ui.active': 'filterActive',
        'click @ui.completed': 'filterCompleted',
        'click @ui.clearComplete': 'clearCompleted'
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

    filterAll: function() {



    },

    filterActive: function() {

        this.ui.active.filter('[href="#active"]');

    },

    filterCompleted: function() {



    }


});


exports.infoView = infoView;
exports.listView = listView;
exports.inputView = inputView;


});



























