var operatingSystem = function () {
    "use strict";
    //var qJobQueue = 
    //llIOQueue =
    var arrDirectory = {};

    //Mode: read or write
    //Flags
    //return error code or nothing
    var open = function (fileName, mode) {
        if (fileName in arrDirectory) {
            return 1;
        } else {
            return -1;
        }
    };
    //Flags, returns an error code
    var close = function (fileName) {
        
    };
    var create = function (fileName, contents) {
        arrDirectory[fileName] = contents.match(/.{1,100}/g);
    };
    //returns an error code
    var delet = function (fileName) {
        if (fileName in arrDirectory) {
            delete arrDirectory[fileName];
            return 1;
        } else {
            return -1;
        }
    };
    //return num of Bytes / length of string
    var read = function (fileName, position) {
        return arrDirectory[fileName][position].length();
    };
    //return num of bytes / length of string
    var write = function (filePointer, string) {
        
    };
    var length = function () {
        
    };
    var seek = function (position) {
        
    };
    var position = function () {
        
    };
    
};
