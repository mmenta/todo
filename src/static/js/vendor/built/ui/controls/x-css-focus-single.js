
define(function(require, exports, module) {

    var marionette = require('marionette');
    var focus = require('built/core/events/focus');
    var SingleFocusManager = require('built/core/managers/focus-single').SingleFocusManager;

    var CssSingleFocusManager = marionette.Controller.extend({

        focusClass: 'focus',

        initialize: function(options) {

            this.focusManager = new SingleFocusManager({
                allowsDeselect: options.allowsDeselect || SingleFocusManager.prototype.allowsDeselect
            });


            this.listenTo(this.focusManager, focus.FOCUS, this.itemViewWantsFocus);
            this.listenTo(this.focusManager, focus.BLUR, this.itemViewWantsBlur);
        },


        itemViewWantsFocus: function(sender, itemView) {
            if (this.focusClass) {
                itemView.$el.addClass(this.focusClass);
            }

            itemView.triggerMethod('focus');
        },

        itemViewWantsBlur: function(sender, itemView) {
            if (this.focusClass) {
                itemView.$el.removeClass(this.focusClass);
            }

            itemView.triggerMethod('blur');
        },

        blur: function(obj) {

            if (!obj) {
                obj = this.focusManager.getFocusedObject();
            }

            if (obj) {
                this.focusManager.blur(obj);
            }
        },

        focus: function(obj) {
            this.focusManager.focus(obj);
        }

    });

    function focusManagerWithCollectionView(collectionView, options) {
        var focusManager = new CssSingleFocusManager(options || {});

        var collectionViewDidAddItem = function(itemView) {
            focusManager.focusManager.insertObject(itemView);
        };

        var collectionViewDidRemoveItem = function(itemView) {
            var array = focusManager.getArray();
            var index = array.indexOf(itemView);

            if (index > -1) {
                focusManager.removeObjectAt(index);
            }
        };

        focusManager.on('after:item:added', collectionViewDidAddItem);
        focusManager.on('item:removed', collectionViewDidRemoveItem);

        return focusManager;
    }

    exports.focusManagerWithCollectionView = focusManagerWithCollectionView;
    exports.CssSingleFocusManager = CssSingleFocusManager;

});
