/*jslint white: true */

//A hash where each CSV maps to its respective content
var hashDirectory = {
    "Contact.CSV": "David: Secretary, Tony: Gangster, Jason: Dancer, Benson: Duke, Andrew: Gangster, Thomas: Traitor, Matt: Lame",
    "Bank.CSV": "100, -50, 200, 300, -1000, 2000, 100, -50, 200, 300, -1000, 2000, 100, -50, 200, 300, -1000, 2000, 100, -50, 200, 300, -1000, 2000, 100, -50, 200, 300, -1000, 2000, 100, -50, 200, 300, -1000, 2000, 100, -50, 200, 300, -1000, 2000",
    "password.CSV": "popchiek:hi,gamrgod88:l337420,slides:mcgee,taeyona:taeyona,thommy:commie",
    "read.CSV": "1, 2, 4, 6, 7, 11, 3, 2, 7, 9, 10, 3, 4, 11, 5, 7, 8, 10, 1 ,5, 7, 4, 7, 10 ,11, 12, 13, 5, 7, 8, 100, 11, 12, 32, 200",
    "stats.CSV": "3, 4, 11, 5, 7, 8, 10, 1 ,5, 7, 4, 7, 10 ,11, 12, 13, 5, 7, 8, 100, 11, 12, 32, 200",
    "vector.CSV": "<15.6,7.5,-15.3>, <-16.7,-3.8,6.8>,<-8.6,2.8,-11>, <-0.9,16.8,-9.7>, <-3.7,6,6.7>, <13.5,7.4,17.1>, <-18,-18.2,16.6>, <-0.6,9.1,17.4>, <12.8,-19.3,14.6>, <4.6,-4.3,-1.5>, <6,-13.5,-13.9>, <10.7,-10.2,2.3>, <-2.4,-3.6,-14.9>, <1.8,10.8,17.1>, <12.1,-12.9,-1.6>, <-1.2,-19.3,-19>, <-8.9,-17.3,-17.1>, <-12.3,2.2,12>, <-19.6,-9.8,8>, <15,14.8,18.9>"
};

//An array of hashes, the array signifies which files are currently open. Inside the elements are need
//to know data of the open files.
var arrOpenFiles = [
    {
        szFileName: "",
        szMode: "",
        nPosition: 0,
        nLength: 0,
        contents: []
    }
];

//The function where the IODevice received its messages from the OS
function onMessage(event) {
    var task = event.data;
    
    switch (task.sysCall) {
        case "Open File": {
            console.log("Opening File");
            arrOpenFiles.push({
                szFileName: task.fileName,
                szMode: task.Mode,
                nPosition: 0,
                nLength: (hashDirectory[task.fileName].match(/.{1,100}/g)).length,
                contents: hashDirectory[task.fileName].match(/.{1,100}/g)
            });
            console.log(arrOpenFiles[task.nProcessID]);
            postMessage(task);
        } break;
        case "Close File": {
            console.log("Closing File");
            console.log(task.filePointer);
            console.log(arrOpenFiles[task.filePointer]);
            arrOpenFiles.splice(task.filePointer-1, 1); 
            console.log(arrOpenFiles[task.filePointer-1]);
            postMessage(task);
        } break;
        case "Create File": {
            console.log("Creating File");
            hashDirectory[task.fileName] = "";
            arrOpenFiles.push({
                szFileName: task.fileName,
                szMode: task.mode,
                nPosition: 0,
                nLength: 0,
                contents: []
            });
            console.log(arrOpenFiles[arrOpenFiles.length-1]);
            postMessage(task);
        } break;
        case "Delete File": {
            delete hashDirectory[task.fileName];
            postMessage(task);
        } break;
        case "Read File": {
            console.log("Reading File");
            task.data = arrOpenFiles[task.filePointer].contents[(arrOpenFiles[task.filePointer].nPosition)];
            task.position = arrOpenFiles[task.filePointer].nPosition + 1;
            arrOpenFiles[task.filePointer].nPosition += 1;
            console.log("This is the data being read " + task.data);
            console.log(arrOpenFiles[1]);
            postMessage(task);
        } break;
        case "Write File": {
            console.log("Writing File");
            console.log(task.data);
            if(task.data === parseInt(task.data, 10)){
                hashDirectory[task.fileName] += ((task.data.toString()).match(/.{1,100}/g)).toString();
            }else {
                hashDirectory[task.fileName] += ((task.data).match(/.{1,100}/g)).toString();
            }
            console.log("Success, wrote to file");
            task.length = task.data.length;
            task.position = (arrOpenFiles[task.filePointer].nPosition)+ 1;
            postMessage(task);
        } break;
        case "Length of File": {        
            task.length = hashDirectory[task.fileName].length;
            postMessage (task);
        } break;
        case "Seek": {
            arrOpenFiles [task.filePointer].nPosition = task.position;
            postMessage(task);
        } break;
        case "Position of File": {
            //Call Position function
            postMessage(task);
        } break;
        case "End of File": {
            console.log(arrOpenFiles[arrOpenFiles.length-1]);
            if(arrOpenFiles[task.filePointer].nPosition === arrOpenFiles[task.filePointer].nLength-1)
            {
                console.log("This is the end of the file, says the IO Device");
                console.log("This is the position" + arrOpenFiles[task.filePointer].nPosition);
               task.checkEOF = true; 
            }
                postMessage(task);
        } break;
    }
}

this.addEventListener('message', onMessage, false);