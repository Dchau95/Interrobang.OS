function OperatingSystem() {
    "use strict";

    //Mode: read or write
    //Flags
    //return error code or nothing
    this.open = function (fileName, mode) {
        if (fileName in arrDirectory) {
            return 1;
        } else {
            return -1;
        }
    };
    
    //Flags, returns an error code
    this.close = function (fileName) {
        if (fileName in arrOpenFiles) {
            return 1;
        } else {
            return -1;
        }
    };
    
    this.create = function (fileName, contents) {
        //arrDirectory[fileName] = contents.match(/.{1,100}/g);
        return 1;
    };
    //returns an error code
    this.delet = function (fileName) {
        if (fileName in arrDirectory) {
            delete arrDirectory[fileName];
            return 1;
        } else {
            return -1;
        }
    };
    
    //return num of Bytes / length of string
    this.read = function (fileName, position) {
        return arrDirectory[fileName][position].length();
    };
    
    //return num of bytes / length of string
    this.write = function (fileName, contents) {
        arrDirectory[fileName] = contents.match(/.{1,100}/g);
        return contents.length();
    };
    
    this.length = function (fileName) {
        return arrDirectory[fileName].join("").length();
    };
    
    this.seek = function (fileName, position) {
        return arrDirectory[fileName][position];
    };
    
    this.position = function () {
        
    };
    
    this.endOfFile = function () {
        //Do if statement, if pointer is at the end of array
    } 
}