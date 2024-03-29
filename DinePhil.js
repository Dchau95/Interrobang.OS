function Phil(me, left, right) {
    var run = function() {
        sequential([
            500, // pause
            function() { console.log(me + ' sits'); },
            left, // channel
            function() { console.log(me + ' picked left fork'); },
            500,
            right,
            function() { console.log(me + ' picked right fork'); },
            500,
            function() { console.log(me + ' eats'); },
            500,
            left,
            function() { console.log(me + ' dropped left fork'); },
            500,
            right,
            function() { console.log(me + ' dropped right fork'); },
            500,
            function() { setTimeout(run, 0); }
        ]);
    };
    setTimeout(run, 0);
}

function Fork(me, left, right) {
    var run = function() {
        rendezvous(
            left, function() {
                rendezvous(left, function() {
                    setTimeout(run, 600);
                });
            },
            right, function() {
                rendezvous(right, function() {
                    setTimeout(run, 600);
                });
            }
        );
    };
    setTimeout(run, 0);
}

function sequential(steps) {
    if (steps.length == 0)
        return;
    
    var first = steps[0];
    var rest  = steps.slice(1);
    if (first instanceof channel) {
        rendezvous(first, function() { sequential(rest); } )
    } else if (first.constructor == Number) {
        setTimeout(function() { sequential(rest); }, first);
    } else {
        first();
        sequential(rest);
    }
}

function rendezvous() {
    var args = arguments;
    var request = [];
    for (var i = 0; i < args.length / 2; i++) {
        request.push( { chan: args[i*2], func: args[i*2+1] } );
    }
    
    for (var i = 0; i < request.length; i++) {
        request[i].chan.add(request);
    }

    for (var i = 0; i < request.length; i++) {
        if (request[i].chan.match())
            break;
    }
}

function channel() {
    var self = this;
    var requests = [];
    
    self.add = function(req) {
        requests.push(req);
    }

    self.remove = function(req) {
        for (var i = 0; i < requests.length; i++) {
            if (requests[i] == req) {
                requests.splice(i, 1);
                break;
            }
        }
    }
    
    self.match = function() {
        if (requests.length != 2)
            return false;

        // copy array since it will be modified by 'remove' method call
        var reqs = requests.slice(0);
        var funcs = [];
        
        for (var i = 0; i < 2; i++) {
            var req = reqs[i];
            for (var j = 0; j < req.length; j++) {
                if (req[j].chan == self) {
                    funcs.push(req[j].func);
                    break;
                }
            }
            
            for (var j = 0; j < req.length; j++) {
                req[j].chan.remove(req);
            }
        }
        
        for (var i = 0; i < funcs.length; i++) {
            funcs[i]();
        }
    }
}

function runPhil(){         //THIS IS THE MAIN METHOD THAT WILL RUN THE ABOVE FUNCTIONS
    var philToLeftFork = [];
    var philToRightFork = [];

    var N = 5;

    for (var i = 0; i < N; i++) {
        philToLeftFork.push(new channel());
        philToRightFork.push(new channel());
    }

    for (var i = 0; i < N; i++) {
        Phil(i, philToRightFork[(i+1)%N], philToLeftFork[i]);
        Fork(i, philToLeftFork[i], philToRightFork[i]);
    }

    console.log('Started');

}

onmessage = function (event) {
    var arrCsv = event.data.data;
    console.log("Hi");
    var errorCon = 0;
    var szResult;
    try{
        runPhil();
    }catch(err){
        szResult = "";
        errorCon = -1;
    }
    var philosopher = {
        result : "No result",
        processNumberI : event.data.nProcessID,
        errorCon : errorCon
    }
    postMessage(philosopher);
};
