module.exports = function(finish) {

    var queue = [];
    var isRunning = true;

    this.enqueue = function(schedulable) {
        queue.push(new Task(schedulable));
    };

    this.enqueuePriority = function(schedulable) {

        insertItem(queue, 1, new Task(schedulable));

        function insertItem(array, index, item) {
            array.splice(index, 0, item);
        }
    };

    this.cancelPromise = function(){
        let count = 0;
        let interval = null;
        return new Promise((resolve, reject)=>{
            queue = [];
            interval = setInterval(function(){
                queue = [];
                if(++count >= 10 && queue.length === 0){
                    clearInterval(interval);
                    resolve();
                    return;
                }
            }, 500);
        });
    };

    this.cancel = function() {
        queue = [];
    };

    this.start = function() {
        if (queue.length > 0) {
            isRunning = true;
            queue.shift().execute();
        } else {
            isRunning = false;
            finish();
        }
    };

    this.isRunning = function() {
        return isRunning;
    };

    this.hasTasks = function() {
        return queue.length > 0;
    };

    function Task(schedulable) {

        this.execute = function() {
            schedulable(function(userCallback) {
                //complete callback

                if (userCallback) {
                    userCallback();
                }

                if (queue.length > 0) {
                    queue.shift().execute();
                } else {
                    //all finished
                    isRunning = false;
                    finish();
                }


            });
        };
    }

};