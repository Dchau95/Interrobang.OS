function MutexObject() {
    this.isLocked = false;
    this.waiting = [];
    
    this.lock = function(functionCode) {
        if(this.isLocked) {
            this.waiting.push(functionCode);
        } else {
            this.locked = true;
            functionCode.call(this);
        }
    }
    
    this.unlock = function() {
        if(!this.isLocked) {
            commandOutput("Mutex is not locked");
            return;
        }
        var wait = this.waiting.shift();
        if(wait) {
            wait.call(this);
        }
        else {
            this.isLocked = false;
        }
    }
}