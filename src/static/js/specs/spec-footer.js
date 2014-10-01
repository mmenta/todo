define(function(require, exports, module) {

var Tasks = require('app/collections/tasks').Tasks;
var Task = require('app/models/task').Task;

var InfoView = require('app/views/footer').InfoView;

describe('InputView: ', function() {
    var task, tasks;

    beforeEach(function() {
        loadFixtures('footer.html');

        tasks = new Tasks();
        task = new Task({title: 'First task'});
        taskTwo = new Task({title: 'Second task'});
        tasks.add(task);
        tasks.add(taskTwo);

        layout = new InfoView({
            collection: tasks
        });

        layout.render();
    });

    it('should update count', function() {
        expect(tasks.length).toEqual(2);

        taskThree = new Task({title: 'Third task'});
        tasks.add(taskThree);

        layout.updateCount();
        var count = $(layout.ui.count).html();

        expect(count).toEqual('3');
    });

    it('should clear completed', function() {





    });

    it('should filter by correct path', function(){
        var $links = layout.$el.find('a');

        console.log($links.eq(0));

        var click = jQuery.Event('click');

        $links.eq(0).trigger(click);

        console.log(layout.path);

        expect(layout.path).toBe('/all');

        $links.eq(1).click();
        //expect(layout.path).toBe('/active');

        $links.eq(2).click();
        //expect(layout.path).toBe('/completed');
    });



});

});