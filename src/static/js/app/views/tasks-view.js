define(function(require, exports, module) {

var marionette = require('marionette');
var TaskView   = require('app/views/cells/task').TaskView;

var TasksView = marionette.CollectionView.extend({

    tagName: 'ul',

    itemView: TaskView,

});

exports.TasksView = TasksView;

});
