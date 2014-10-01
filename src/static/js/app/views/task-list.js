define(function(require, exports, module) {

var marionette = require('marionette');
var TaskView   = require('app/views/cells/task').TaskView;

var TasksView = marionette.CollectionView.extend({

    tagName: 'ul',
    itemView: TaskView,

    ui: {
        item: '.item'
    },

    events: {
        'mouseenter @ui.item': 'onMouseenter',
        'mouseleave @ui.item': 'onMouseleave'
    },

    onMouseenter: function(e) {
        $(e.currentTarget).addClass('on');
    },

    onMouseleave: function(e) {
        $(e.currentTarget).removeClass('on');
    }

});

exports.TasksView = TasksView;

});
