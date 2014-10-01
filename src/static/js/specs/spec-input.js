define(function(require, exports, module) {

var Tasks = require('app/collections/tasks').Tasks;
var Task = require('app/models/task').Task;

var InputView = require('app/views/input').InputView;

describe('InputView: ', function() {
    var task, tasks;

    beforeEach(function() {
        loadFixtures('input.html');

        tasks = new Tasks();
        task = new Task({title: 'First task'});
        taskTwo = new Task({title: 'Second task'});
        tasks.add(task);
        tasks.add(taskTwo);

        layout = new InputView({
            collection: tasks
        });

        layout.render();
    });

    it('should create a new task', function() {
        expect(task).toEqual(jasmine.any(Task));
    });

    it('should add to Task on enter', function() {
        $input = $(layout.ui.input);
        $input.val('Third task');

        var key = jQuery.Event('keypress');
        key.which = 13;
        key.keyCode = 13;
        $input.trigger(key);

        //console.log(tasks);
        expect(tasks.length).toEqual(3);
    });

});

});