define(function(require, exports, module) {

var marionette = require('marionette');
var events = require('../events');
var keys = require('built/app/keys');

var ModalView = marionette.View.extend({
    className: 'modal-group',
    view: null,

    initialize: function(options){
        this.view = options.view;
        this.region = new marionette.Region({el: this.el});
    },

    onShow: function(){
        this.view.once(events.COMPLETE, this.modalComplete, this);
        this.region.show(this.view);
    },

    modalComplete: function(){
        this.trigger(events.COMPLETE, this.view);
    },

    keyDown: function(e){
        if (e.keyCode == 27){
            this.trigger(events.COMPLETE, this.view);
        }
    },

    onClose: function(){
        this.region.close();
    }
});

exports.ModalView = ModalView;

});


