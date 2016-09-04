var vEnqueuer = require('../index');


function helloTimeout(count, callback){
	setTimeout(function(){

		if(!count){
			callback(null, {error:"error"});
		}
		else{
			callback(count*2);
		}
		
		
	}, 2000);
}



var venqueuer = new vEnqueuer();


venqueuer.createQueue("test2", function(){
	console.log("test2 over");
});

venqueuer.createQueue("test1", function(){
	
	console.log("test1 over");
	console.log("starting test2");

	venqueuer.trigger("test2");

});

venqueuer.enqueue("test1", setTimeout, {

	callback: function(){
		console.log("hello");
	},
	time:3000

});

venqueuer.enqueue("test1", setTimeout, {

	callback: function(){
		console.log("hi");
	},
	time:10000

});





venqueuer.trigger("test1");

/*
var i;
for (i = 1; i < 10; i++){
	venqueuer.enqueue("test1", helloTimeout, {

		count:i, 
		callback: function(count, err){
			if(err){
				console.log(err.error);
			}
			else{
				console.log("hello " + count);

				venqueuer.enqueue("test2", helloTimeout, {

					count:count, 
					callback: function(count, err){
						if(err){
							console.log(err.error);
						}
						else{
							console.log("hello teste2 " + count );
						}
					}

				});

			}
		}

	});
}*/

