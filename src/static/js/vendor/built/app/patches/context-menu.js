define(function (require, exports, module) {
    var _ = require('underscore');
    var marionette = require('marionette');
    var PopView = require('built/app/popovers').PopView;
    var WindowResponder = require('built/core/responders/window').WindowResponder;
    var ScrollResponder = require('built/core/responders/scroll').ScrollResponder;

    _.extend(marionette.View.prototype, {

        uncontextMenus: function(){
            delete this.events['contextmenu'];
        },

        contextMenus: function(){
            // If you are calling this method in your classes
            // constructor() be sure to call it BEFORE you call
            // super.constructor(). The events must be in place
            // before this.delegateEvents() is called.
            //
            // Marionette.View.constructor() calls
            // Backbone.View.constructor() which calls
            // Backbone.View.initialize() after which
            // Backbone.View.delegateEvents() is called.
            //
            // So This call can be safely done in initialize() or in
            // constructor(). But again, if done in constructor()
            // you must call it prior to calling super.constructor().
            if(this.contextMenu){
                this.events['contextmenu'] = '_contextMenuOnRightClick';
            }
        },

        _contextMenuOnRightClick: function(evt){

            var contextMenuOptions = _.result(this, 'contextMenuOptions');
            contextMenuOptions = contextMenuOptions || {};

            var completeHandler = contextMenuOptions.complete ;

            if(!completeHandler && this.contextMenuComplete){
                completeHandler = _.bind(this.contextMenuComplete, this);
            } else {
                throw new Error(
                    '[ContextMenuError] You must define a ' +
                    '\'complete\' handler in contextMenuOptions ' +
                    'or provide the default \'contextMenuComplete\' '+
                    'method in this view');
            }

            var options = _.omit(contextMenuOptions, 'complete');
            var view = new this.contextMenu(options);

            var menu = new PopView();
            menu.anchorTop = this._contextMenuAnchorAction;
            menu.anchorBottom = this._contextMenuAnchorAction;
            menu.anchorLeft = this._contextMenuAnchorAction;
            menu.anchorRight = this._contextMenuAnchorAction;

            var windowResponder = new WindowResponder({
                acceptsResize: true,
                resizeDebounce: 0,
                resize: function(){
                    menu.close();
                }
            });

            var scrollResponder = new ScrollResponder({
                el: $(window),
                scroll: function(){
                    menu.close();
                }
            });

            // using clientX and clientY so we get normalized
            // coords regardless of scroll position.
            // We will factor in the scroll position in our
            // _contextMenuAnchorAction()
            menu.show(view, {
                rect: {x: evt.clientX,  y: evt.clientY},
                anchor: 'top'})

            .then(function(view){
                windowResponder.close();
                scrollResponder.close();
                completeHandler(view);
            });

            // We don't want the browsers context menu to appear, so
            // block it.
            evt.preventDefault();

            // let window know about this event.
            // When a context menu is displayed it uses the PopView
            // and a ClickTestResponder. Clicking anywhere not on the
            // will trigger it to close, but we also count a 'contextmenu'
            // event as a 'click'. ClickTestResponder monitors both
            // 'click' and 'contextmenu' events on window. So lets be
            // sure to let it know.
            $(window).trigger(evt);
        },

        _contextMenuAnchorAction: function(anchorRect, $anchorElement, viewRect, css){
            // our rects are calculated using the clientX and clientY
            // which do not take into account scroll position.
            // We add back in the scroll position so we position ourselves
            // onto the screen properly.

            var expandedX = anchorRect.x + viewRect.width;
            var expandedY = anchorRect.y + viewRect.height;
            var $window = $(window);

            if(expandedX > $window.width()){
                css.left = ($window.width() - viewRect.width) + $window.scrollLeft();
            } else {
                css.left = anchorRect.x + $window.scrollLeft();
            }

            if(expandedY > $window.height()){
                css.top = ($window.height() - viewRect.height) + $window.scrollTop();
            } else {
                css.top = anchorRect.y + $window.scrollTop();
            }
        }
    });
});
