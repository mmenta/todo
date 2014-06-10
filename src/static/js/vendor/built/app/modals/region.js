define(function(require, exports, module) {

var marionette = require('marionette');
var _ = require('underscore');

var ModalRegion = marionette.Region.extend({
    el: '#modal',

    open: function(view){
        marionette.Region.prototype.open.call(this, view);
        this.$el.show();
        view.$el.addClass('show');
    },

    // Close the current view, if there is one. If there is no
    // current view, it does nothing and returns immediately.
    close: function(){
        var deferred = $.Deferred();
        var view = this.currentView;

        if (!view || view.isClosed){ return; }

        var self = this;
        view.$el.removeClass('show');

        deferred.resolve();
        this.$el.hide();
        marionette.Region.prototype.close.call(this);

        return deferred.promise();
    }
});


exports.ModalRegion = ModalRegion;

});
