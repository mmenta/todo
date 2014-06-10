define(function (require, exports, module) {

var _ = require('underscore');
var marionette = require('marionette');
var helpers = require('built/core/utils/helpers');
var KeyResponder = require('built/core/responders/keys').KeyResponder;
var stringToHtml = require('shared/utils/string').stringToHtml;
var htmlToString = require('shared/utils/string').htmlToString;

var TextEditor = marionette.Controller.extend({
    el: null,

    constructor: function(options){
        marionette.Controller.prototype.constructor.apply(this, arguments);
        _.bindAll(this,
            'textDidChange', 'textWillChange', 'recalculateHeight',
            '_editorDidFocus', '_editorDidBlur');

        var $el = helpers.registerElement(options.el, true);

        this.$el = this.$editor = $el.find('[contenteditable]');
        this.$wrapper = $el;

        this.keyResponder = new KeyResponder({
            el: this.$editor,
            keyUp: this.textDidChange,
            keyDown: this.textWillChange
        });

        this.$wrapper.css({
            wordWrap: 'break-word',
        });

        this.$editor.css({
            overflow: 'hidden',
            outline: 'none',
            border: 'none'
        });

        this.$editor.on('focus', this._editorDidFocus);
        this.$editor.on('blur', this._editorDidBlur);

        this._currentHeight = 0;
        this.initializeHeight();
        this.listenTo(this, 'close', this._onClose);
        this.htmlToString = options.htmlToString || htmlToString;
        this.stringToHtml = options.stringToHtml || stringToHtml;
    },

    initializeHeight: function(){
        this.recalculateHeight();
    },

    onFocus: function(){
        this.$wrapper.addClass('focus');
    },

    onBlur: function(){
        this.$wrapper.removeClass('focus');
    },

    textWillChange: function(sender, e){
       _.defer(this.recalculateHeight);
    },

    textDidChange: function(sender, e){
        _.defer(this.recalculateHeight);
    },

    recalculateHeight: function(){
        var height = this.calculateHeight();
        if(height != this._currentHeight){
            // just get the padding and border height of the wrapper:
            var extras = this.$wrapper.outerHeight() - this.$wrapper.height();
            this.adjustHeight(height + extras);
        }
    },

    calculateHeight: function(){
        var heightSource = this.$editor.outerHeight();
        return heightSource;
    },


    adjustHeight: function(value){
        this._currentHeight = value;
        this.$wrapper.css({height: value});
    },

    /* jquery duck typing */
    val: function(value){
        if(value){
            this.$editor.html(this.stringToHtml(value));
        }else{
            return this.htmlToString(this.$editor[0]);
        }
    },

    focus: function(){
        this.$editor.focus();
    },

    blur: function(){
        this.$editor.blur();
    },

    show: function(){
        this.$wrapper.show();
    },

    hide: function(){
        this.$wrapper.hide();
    },
    /* end jquery proxies */

    _editorDidFocus: function(){
        this.triggerMethod('focus');
    },

    _editorDidBlur: function(){
        this.triggerMethod('blur');
    },

    // _getStyle: function(n, p){
    //     // http://www.quirksmode.org/dom/getstyles.html
    //     return n.currentStyle ?
    //         n.currentStyle[p] :
    //         document.defaultView.getComputedStyle(n, null).getPropertyValue(p);
    // },

    _toText: function(node){
        // http://stackoverflow.com/questions/20365465/extract-text-from-html-while-preserving-block-level-element-newlines/20384452#20384452
        var result = '';
        if( node.nodeType == document.TEXT_NODE ) {
            // Replace repeated spaces, newlines, and tabs with a single space.
            result = node.nodeValue.replace( /\s+/g, ' ' );
        } else {
            for( var i = 0, j = node.childNodes.length; i < j; i++ ) {
              result += this._toText( node.childNodes[i] );
            }

            var d = this._getStyle( node, 'display' );

            if( d.match( /^block/ ) || d.match( /list/ ) || d.match( /row/ ) ||
                node.tagName == 'BR' || node.tagName == 'HR' ) {
                    result += '\n';
            }
        }
        return result;
    },

    _onClose: function(){
        this.$editor.off('focus', this._editorDidFocus);
        this.$editor.off('blur', this._editorDidBlur);
    }
});

exports.TextEditor = TextEditor;

});

