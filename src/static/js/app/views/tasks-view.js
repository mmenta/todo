define(function(require, exports, module) {

var marionette = require('marionette');
var TaskView   = require('app/views/task-view').TaskView;

var TasksView = marionette.CollectionView.extend({

    tagName: 'ul',

    itemView: TaskView,

    initialize: function() {
        this.listenTo(this.collection, 'all', this.render);
    }

});

exports.TasksView = TasksView;

});
