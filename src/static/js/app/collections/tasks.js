define(function(require, exports, module) {

var Task = require('app/models/task');

var Tasks = Backbone.Collection.extend({

    model: Task,

    getCompleted: function() {
        return this.filter(this._isCompleted);
    },

    getActive: function() {
        return this.reject(this._isCompleted);
    },

    _isCompleted: function(todo) {
        return todo.isCompleted();
    }

});

exports.Tasks = Tasks;

});