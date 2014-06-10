define(function(require, exports, module) {


var activeList = Backbone.Model.extend({

    defaults : {
        title : null,
        completed: false
    },

    isCompleted: function() {
        return this.get('completed');
    }

});


exports.activeList = activeList;

});