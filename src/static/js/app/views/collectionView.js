define(function(require, exports, module) {

var marionette = require('marionette');
var listView   = require('app/views/listView').listView;

var collectionView = marionette.CollectionView.extend({
    tagName: 'ul',
    itemView: listView,

    initialize: function() {
        this.listenTo(this.collection, 'all', this.render);
    }


});


exports.collectionView = collectionView;

});
