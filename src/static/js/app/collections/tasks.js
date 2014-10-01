define(function(require, exports, module) {

var Task = require('app/models/task');
var Backbone = require('backbone');

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
    },

    clearCompleted: function(completed) {
        completed.forEach(function destroy(todo) {
            todo.destroy();
        });
    }

});

exports.Tasks = Tasks;

});