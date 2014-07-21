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
    }

});

exports.Task = Task;

});