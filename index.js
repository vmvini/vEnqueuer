var Enqueuer = require('./lib/Enqueuer');
var Schedulable = require('./lib/Schedulable');

module.exports = function(){

	var queues = {};
	var that = this;

	this.createQueue = function(name, complete){
		queues[name] = new Enqueuer(complete);
	};

	this.hasTasks = function(name){
		return queues[name].hasTasks();
	};	
	
	function hasNewTasks(name){
		if(!queues[name].isRunning() && queues[name].hasTasks()){
			return true;
		}
		return false;
	}

	this.enqueue = function(name, func, args){

		var schedulable;

		if(queues[name] !== undefined){
			
			var self = null;
			if(args.self){
				self = args.self;
			}

			if(!args.callback){
				args.callback = function(){};
			}

			schedulable = new Schedulable(func, args, self );
			
			queues[name].enqueue( schedulable );

			if(hasNewTasks(name)){
				that.trigger(name);
			}

		}
		else{
			throw {err:"The queue named " + name + " doesn't exist!"};
		}

	};


	this.trigger = function(name){

		if(queues[name] !== undefined){
			queues[name].start();
		}
		else{
			throw {err:"The queue named " + name + " doesn't exist!"};
		}

	};


};