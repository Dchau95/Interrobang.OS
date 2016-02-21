function OperatingSystemMessage(event) {
    test =  new OperatingSystem();
    test.message = event.data;
}

function OperatingSystem() {
    "use strict";

    this.message = null;
    
    //Mode: read or write
    //Flags
    //return error code or nothing
    this.open = function (fileName, mode) {
        var task = { 
            sysCall : "Open File", 
            fileName : fileName,
            mode : mode,
        };
        postMessage(task);	
        if (fileName in arrDirectory) {
            return 1;
        } else {
            return -1;
        }
    };
    
    //Flags, returns an error code
    this.close = function (fileName, filePointer) {
        var task = { 
            sysCall : "Close File", 
            filePointer : filePointer,
        };
			postMessage(task);
        if (fileName in arrOpenFiles) {
            return 1;
        } else {
            return -1;
        }
    };
    
    this.create = function (fileName, contents, mode) {
        //arrDirectory[fileName] = contents.match(/.{1,100}/g);
        var task = { 
            sysCall : "Create File", 
            name : fileName,
            mode : mode,
        };
        postMessage(task);	
        return 1;
    };
    //returns an error code
    this.delet = function (fileName) {
        var task = { 
            sysCall : "Delete File", 
            name : fileName,
        };
        postMessage(task);
        if (fileName in arrDirectory) {
            delete arrDirectory[fileName];
            return 1;
        } else {
            return -1;
        }
    };
    
    //return num of Bytes / length of string
    this.read = function (fileName, position) {
        var task = { 
            sysCall : "Read File", 
            filePointer : position,
            len : arrDirectory[fileName].join("").length(),
        };
        postMessage(task);
        return arrDirectory[fileName][position].length();
    };
    
    //return num of bytes / length of string
    this.write = function (fileName, filePointer, contents) {
        var task = { 
            sysCall : "Write File", 
            filePointer : filePointer,
            data : contents,
        };
        postMessage(task);
        arrDirectory[fileName] = contents.match(/.{1,100}/g);
        return contents.length();
    };
    
    this.length = function (fileName, filePointer) {
        var task = { 
            sysCall : "Length of File", 
            filePointer : filePointer,  
        };
        postMessage(task);
        return arrDirectory[fileName].join("").length();
    };
    
    this.seek = function (fileName, position, filePointer) {
        var task = { 
            sysCall : "Seek Position", 
            filePointer : filePointer,
            position : position,
        };
        postMessage(task);
        return arrDirectory[fileName][position];
    };
    
    this.position = function (filePointer) {
        var task = { 
            sysCall : "Position of File", 
            filePointer : fp,  
        };
        postMessage(task);
        
    };
    
    this.endOfFile = function (filePointer) {
        //Do if statement, if pointer is at the end of array
        var task = { 
            sysCall : "End of File", 
            filePointer : filePointer,
        };
        postMessage(task);
    } 
}