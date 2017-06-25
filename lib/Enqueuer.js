module.exports = function(finish){

	var queue = [];

	this.enqueue = function(schedulable){
		queue.push( new Task( schedulable ) );
	};

	this.start = function(){
		if(queue.length > 0){
			queue.shift().execute();
		}
		else{
			finish();
		}
	};
	
	this.hasTasks = function(){
		return queue.length > 0;
	};

	function Task(schedulable){

		this.execute = function(){
			schedulable( function(userCallback){
				//complete callback

				if(userCallback){
					userCallback();
				}

				if(queue.length > 0){
					queue.shift().execute();
				}
				else{
					//all finished
					finish();
				}


			} );
		};
	}

};
