# vEnqueuer
An javascript asynchronous code enqueuer. Perfect for queue up repetitive i/o tasks that should be executed in order, in a way that the end of one task calls the next in the queue, all this asynchronously, of course. You just need to register the function which you want queue up and call vEnqueuer's methods like enqueue or trigger.

**Install vEnqueuer**

`npm install venqueuer --save`

**How to use**

        var vEnqueuer = require('venqueuer');
        var venqueuer = new vEnqueuer();
      
**Creating a queue**

With vEnqueuer, it's possible to create multiple queues, each one responsible for managing specific tasks. For instance, we can create a 'download' queue, and a 'unzip' queue. In the download's queue we want to queue up just download tasks, and we'd like to call unzip tasks just after all downloads have been completed.
The code below does just that:

        venqueuer.createQueue("unzip", function(){
      		console.log("all files unzipped!");
      	});
      	
      	venqueuer.createQueue("download", function(){
		        console.log("all downloads have been completed!");
            vEnqueuer.trigger("unzip");
        });	
        
By now, we have just created queues and set callback functions to them. These callback functions tells the queue what to do when all its tasks are completed. 
Let's say we want to download 3 files in a predefined order:

        downloadLinks.forEach(function(l){
            venqueuer.enqueue("download", downloadFn, { //downloadFn is a reference to download's function
                
                url: l,  //url is an argument required by the downloadFn
                dest: './folder', //dest is an argument required by the downloadFn
                
                //callback is the callback which will be used by downloadFn when download completes
                callback: function(err){  //an error argument is passed in case of error during download
                  if(err){
                    console.log("an error occurred", err);
                    return;
                  }
                  console.log("successful download");
                  
                  //some code to enqueue unzip task...
                  
                }
                
            });
            
            if( isLastIteration() ){
                //initiate queued tasks when the list has been traversed
                venqueuer.trigger("download");
                
            }
            
        });
        
From now, you may understand vEnqueuer and is fully capable of complete the `//some code to enqueue unzip task`.

**This binding**

Bind a 'this' object to the task function its really simple, you just need to pass the 'this' object as an extra attribute called `self` in your literal object: 

        venqueuer.enqueue("download", downloadFn, { 
              self:someObject, 
              url: l, 
              dest: './folder', 
              callback: function(err){...}
        });

