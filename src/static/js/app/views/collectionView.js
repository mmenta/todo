define(function(require, exports, module) {

var marionette = require('marionette');
var ListView   = require('app/views/listView').ListView;

var CollectionView = marionette.CollectionView.extend({
    tagName: 'ul',
    itemView: ListView,

    initialize: function() {
        this.listenTo(this.collection, 'all', this.render);
    }
});

exports.CollectionView = CollectionView;

});
