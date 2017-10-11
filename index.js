var Enqueuer = require('./lib/Enqueuer');
var Schedulable = require('./lib/Schedulable');

module.exports = function() {

    var queues = {};
    var cleaning = false;
    var that = this;

    this.createQueue = function(name, complete) {
        queues[name] = new Enqueuer(complete);
    };

    this.cancelAll = function(){
        cleaning = true;
        const promises = [];
        
        for (var property in queues) {
            if (queues.hasOwnProperty(property)) {
                promises.push( queues[property].cancelPromise() );
            }
        }
        Promise.all(promises).then(()=>{
            cleaning = false;
        });

    };

    this.hasTasks = function(name) {
        return queues[name].hasTasks();
    };

    function hasNewTasks(name) {
        if (!queues[name].isRunning() && queues[name].hasTasks()) {
            return true;
        }
        return false;
    }

    this.enqueuePriority = function(name, func, args) {
        if(cleaning){
            return;
        }
        that.enqueue(name, func, args, true);
    };

    this.enqueue = function(name, func, args, priority) {
        if(cleaning){
            return;
        }
        var schedulable;

        if (queues[name] !== undefined) {

            var self = null;
            if (args.self) {
                self = args.self;
            }

            if (!args.callback) {
                args.callback = function() {};
            }

            schedulable = new Schedulable(func, args, self);

            if (priority) {
                queues[name].enqueuePriority(schedulable);
            } else {
                queues[name].enqueue(schedulable);
            }


            if (hasNewTasks(name)) {
                that.trigger(name);
            }

        } else {
            throw { err: "The queue named " + name + " doesn't exist!" };
        }

    };


    this.trigger = function(name) {

        if (queues[name] !== undefined) {
            queues[name].start();
        } else {
            throw { err: "The queue named " + name + " doesn't exist!" };
        }

    };

    this.cancel = function(name) {
        if (queues[name] !== undefined) {
            queues[name].cancel();
        } else {
            throw { err: "The queue named " + name + " doesn't exist!" };
        }
    };


};