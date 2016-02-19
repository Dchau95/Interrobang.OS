function OperatingSystem() {
    "use strict";
    //var qJobQueue = 
    //llIOQueue =
    this.arrDirectory = {};
    
    //Mode: read or write
    //Flags
    //return error code or nothing
    this.open = function (fileName, mode) {
        if (fileName in this.arrDirectory) {
            return 1;
        } else {
            return -1;
        }
    };
    //Flags, returns an error code
    this.close = function (fileName) {
        
    };
    this.create = function (fileName, contents) {
        this.arrDirectory[fileName] = contents.match(/.{1,100}/g);
        console.log("Did it");
    };
    //returns an error code
    this.delet = function (fileName) {
        if (fileName in this.arrDirectory) {
            delete this.arrDirectory[fileName];
            return 1;
        } else {
            return -1;
        }
    };
    //return num of Bytes / length of string
    this.read = function (fileName, position) {
        return this.arrDirectory[fileName][position].length();
    };
    //return num of bytes / length of string
    this.write = function (fileName, contents) {
        this.arrDirectory[fileName].push(contents);
        return contents.length();
    };
    this.length = function (fileName) {
        return this.arrDirectory[fileName].join("").length();
    };
    this.seek = function (fileName, position) {
        return this.arrDirectory[fileName][position];
    };
    this.position = function () {
        
    };
    
    this.main = function () {
        this.create("test.CSV", "Hello");
    };
    
}
