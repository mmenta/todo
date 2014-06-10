define(function(require, exports, module) {


var models = require('app/todo/models');

var activeCollection = Backbone.Collection.extend({
    model: models.activeList,

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


exports.activeCollection = activeCollection;

});