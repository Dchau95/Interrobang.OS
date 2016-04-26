function SemaphoreObject(resource) {
    this.S = 0;
    this.resource = resource;
    //Semaphore acquire and do its function, pass in a function here?
    this.P = function() {
        if (this.S >= 0) {
            this.S--;
        }
        //Else the thread/process has to wait until resource is released
    }
    //Semaphore release, pass in a function here?
    this.V = function() {
        this.S++;
    }
}