importScripts('Directory.js');

//An array of hashes, the array signifies which files are currently open. Inside the elements are need
//to know data of the open files.
var arrOpenFiles = {
    "Dummy.CSV" : {
        szMode: "",
        nPosition: 0,
        nLength: 0,
        contents: []
    },
};
//The function where the IODevice received its messages from the OS
function onMessage(event) {
    console.log("Got the message")
    var task = event.data;
    
    switch (task.sysCall) {
        case "Open File": {
            console.log("Opening File");
            arrOpenFiles[task.fileName] = {
                szMode: task.Mode,
                nPosition: 0,
                nLength: (hashDirectory[task.fileName].match(/.{1,100}/g)).length,
                contents: hashDirectory[task.fileName].match(/.{1,100}/g)
            };
            console.log(arrOpenFiles[task.fileName]);
            postMessage(task);
        } break;
        case "Close File": {
            console.log("Closing File");
            console.log(task.fileName);
            console.log(arrOpenFiles[task.fileName]);
            delete arrOpenFiles[task.fileName];
            //arrOpenFiles.splice(task.filePointer-1, 1); 
            postMessage(task);
        } break;
        case "Create File": {
            console.log("Creating File");
            hashDirectory[task.fileName] = "";
            arrOpenFiles[task.fileName] = {
                szMode: task.mode,
                nPosition: 0,
                nLength: 0,
                contents: []
            };
            console.log(arrOpenFiles[task.fileName]);
            postMessage(task);
        } break;
        case "Delete File": {
            delete hashDirectory[task.fileName];
            postMessage(task);
        } break;
        case "Read File": {
            console.log("Reading File");
            console.log(task.filePointer);
            console.log((arrOpenFiles[task.fileName].nPosition));
            task.data = arrOpenFiles[task.fileName].contents[(arrOpenFiles[task.fileName].nPosition)];
            task.position = arrOpenFiles[task.fileName].nPosition + 1;
            arrOpenFiles[task.fileName].nPosition += 1;
            console.log("This is the data being read " + task.data);
            console.log(arrOpenFiles[task.fileName]);
            postMessage(task);
        } break;
        case "Write File": {
            console.log("Writing File");
            console.log(task.data);
            if(task.data === parseInt(task.data, 10)){
                hashDirectory[task.fileName] += ((task.data.toString()).match(/.{1,100}/g)).toString();
                arrOpenFiles[task.fileName].contents[arrOpenFiles[task.fileName].nPosition] = ((task.data.toString()).match(/.{1,100}/g)).toString();
            }else {
                hashDirectory[task.fileName] += ((task.data).match(/.{1,100}/g)).toString();
                arrOpenFiles[task.fileName].contents[arrOpenFiles[task.fileName].nPosition] = ((task.data).match(/.{1,100}/g)).toString();
            }
            console.log("Success, wrote to file");
            task.length = task.data.length;
            task.position = (arrOpenFiles[task.fileName].nPosition)+ 1;
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
            console.log(task.filePointer);
            if(arrOpenFiles[task.fileName].nPosition >= arrOpenFiles[task.fileName].nLength-1)
            {
                console.log("This is the end of the file, says the IO Device");
                console.log("This is the position" + arrOpenFiles[task.fileName].nPosition);
               task.checkEOF = true; 
            }
                postMessage(task);
        } break;
    }
}

self.addEventListener('message', onMessage, false);