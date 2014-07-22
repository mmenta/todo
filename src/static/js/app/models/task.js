define(function(require, exports, module) {

var Task = Backbone.Model.extend({

    url: '/',

    defaults : {
        title : null,
        cid: null,
        completed: false
    },

    isCompleted: function() {
        return this.get('completed');
    },

    toggleCompleted: function(isChecked) {
        if(isChecked) {
            this.set({ completed: true });
        } else {
            this.set({ completed: false });
        }
    }

});

exports.Task = Task;

});