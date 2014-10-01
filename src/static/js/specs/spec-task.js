define(function(require, exports, module) {

var Tasks = require('app/collections/tasks').Tasks;
var Task = require('app/models/task').Task;

var InputView = require('app/views/input').InputView;
var TasksView = require('app/views/task-list').TasksView;

describe('InputView: ', function() {
    var task, tasks;

    beforeEach(function() {
        loadFixtures('cells/task.html');

        tasks = new Tasks();
        task = new Task({title: 'First task'});
        taskTwo = new Task({title: 'Second task'});
        tasks.add(task);
        tasks.add(taskTwo);

        inputLayout = new InputView({
            collection: tasks
        });

        tasksView = new TasksView({
            collection: tasks
        });

        layout.render();
    });

    it('should toggle checked state', function() {
        task.toggleCompleted(false);
        expect(task.attributes.completed).toBe(false);
        task.toggleCompleted(true);
        expect(task.attributes.completed).toBe(true);
    });

    it('should delete model', function() {
        expect(tasks.length).toEqual(2);

        var click = jQuery.Event('click');
        $('.clear').find().eq(0).trigger(click);

        console.log($('.clear').find().eq(0));

        expect(tasks.length).toEqual(1);
    });

});

});