define(function (require, exports, module) {

var marionette = require('marionette');
var KeyResponder = require('built/core/responders/keys').KeyResponder;
var ClickTestResponder = require('built/core/responders/clicks').ClickTestResponder;
var TextEditor = require('built/ui/controls/x-text-editor').TextEditor;

var EditSwapController = marionette.Controller.extend({
    initialize : function(options){
        this.ui = {};
        _.bindAll(this, 'wantsCancelEditing', 'onOutputClick');
        this.ui.input = options.input;
        this.ui.output = options.output;
        this.bindElements();
        this.showOutput();
    },

    bindElements: function(){
        this.ui.output.on('click', this.onOutputClick);
        this.listenForCancel();
    },

    listenForCancel: function(){
        var $el = this.ui.input instanceof jQuery ?
                  this.ui.input : this.ui.input.$el;

        this.keyResponder = new KeyResponder({
            el: $el,
            cancelOperation: this.wantsCancelEditing,
        });

        this.clickTestResponder = new ClickTestResponder({
            el: $el,
            clickOutside: this.wantsCancelEditing
        });
    },

    stopListeningForCancel: function(){
        if(this.keyResponder)
            this.keyResponder.close();

        if(this.clickTestResponder)
            this.clickTestResponder.close();
    },

    onOutputClick: function(e){
        $(window).trigger('click');
        this.showInput();
        e.stopPropagation();
    },

    wantsCancelEditing: function(){
        this.showOutput();
    },

    showOutput: function(){
        this.ui.output.show();
        this.ui.input.hide();
    },

    showInput: function(){
        this.ui.output.hide();
        this.ui.input.show();
        this.ui.input.focus();
    },

    onClose: function(){
        this.stopListeningForCancel();
    },

    val: function(){
        return this.ui.input.val();
    }
});

var swapControllerFromView = function(view, input, output){
    input = input ? input : '.input';
    output = output ? output : '.output';

    // if this is not a marionette view we assume
    // it's a jquery selector.
    var $el = view.$el || view;

    var $input = $el.find(input);
    var $output = $el.find(output);

    if($input.find('[contenteditable]').length){
        $input = new TextEditor({el: $input});
    }

    return new EditSwapController({
        input: $input,
        output: $output
    });
};



exports.EditSwapController = EditSwapController;
exports.swapControllerFromView = swapControllerFromView;

});
