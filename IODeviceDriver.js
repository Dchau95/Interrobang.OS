var totalMemoryLimit = 100000000;
var totalMemoryUsed = 0;

var folderList = ["root", "userDirectory", "Results"];
//Opens the database and populates it with our basic files and their contents.
//Inputs:
//Outputs: Various messages depending on the situation, all sent to the console.
//Returns:
function openDb() {
    console.log("Opening DB...");
    //Opens DB with name of hashDirectory
    var request = indexedDB.open("hashDirectory");
    
    //If DB already exists with same version then set db to that indexedDB
    //Also calls test function
    request.onsuccess = function (event) {
        var db = this.result;
        db.onversionchange = function (event) {
            console.log("Closing databse for version change");
            db.close();
        }
        updateMemoryUsage();
        console.log("Finished opening DB...");
    };
    
    //If it can't created the DB and it doesn't exist then throw an error
    request.onerror = function (event) {
        console.error("openDB:", event.target.errorCode);
    };
    
    //If the DB doesn't exist or has a different version
    request.onupgradeneeded = function (event) {
        console.log("openDB upgradeneeded");
        
        //Create a store named "files", which contains two indices, "filename" and "content"
        var store = event.currentTarget.result.createObjectStore("root", {autoIncrement: true});
        var userStore = event.currentTarget.result.createObjectStore("users", {autoIncrement: true});
        var groupStore = event.currentTarget.result.createObjectStore("groups", {autoIncrement: true});
        store.createIndex("by_filepath", "filepath");
        store.createIndex("by_filename", "filename", {unique: true});
        store.createIndex("by_content", "content");
        store.createIndex("by_filesize", "filesize");
        store.createIndex("by_permission", "permission");
        
        //Create user directory
        var storeUserDirectory = event.currentTarget.result.createObjectStore("userDirectory", {autoIncrement: true});
        storeUserDirectory.createIndex("by_filepath", "filepath");
        storeUserDirectory.createIndex("by_filename", "filename", {unique: true});
        storeUserDirectory.createIndex("by_content", "content");
        storeUserDirectory.createIndex("by_filesize", "filesize");
        storeUserDirectory.createIndex("by_permission", "permission");
        
        //Create results directory
        var storeResult = event.currentTarget.result.createObjectStore("Results", {autoIncrement: true});
        storeResult.createIndex("by_filepath", "filepath");
        storeResult.createIndex("by_filename", "filename", {unique: true});
        storeResult.createIndex("by_content", "content");
        storeResult.createIndex("by_filesize", "filesize");
        storeResult.createIndex("by_permission", "permission");
        
        userStore.createIndex("by_username", "username", {unique: true});
        userStore.createIndex("by_password", "password");
        userStore.createIndex("by_group", "groups");
        
        groupStore.createIndex("by_Group", "group", {unique: true});
        groupStore.createIndex("by_Clear", "clear");
        groupStore.createIndex("by_Ls", "ls");
        groupStore.createIndex("by_Man", "man");
        groupStore.createIndex("by_Delete", "delete");
        groupStore.createIndex("by_Copy", "copy");
        groupStore.createIndex("by_Ps", "ps");
        groupStore.createIndex("by_Kill", "kill");
        groupStore.createIndex("by_More", "more");
        groupStore.createIndex("by_Cat", "cat");
        groupStore.createIndex("by_Script", "script");
        groupStore.createIndex("by_Contactp", "contactp");
        groupStore.createIndex("by_Bankp", "bankp");
        groupStore.createIndex("by_Passwordp", "passwordp");
        groupStore.createIndex("by_Readp", "readp");
        groupStore.createIndex("by_Statsp", "statsp");
        groupStore.createIndex("by_Vectorp", "vectorp");
        groupStore.createIndex("by_Scriptp", "scriptp");
        groupStore.createIndex("by_Charwatchp", "charwatchp");
        groupStore.createIndex("by_Starterp", "starterp");
        groupStore.createIndex("by_Sleepp", "sleepp");
        groupStore.createIndex("by_Philp", "philp");
        groupStore.createIndex("by_Reset", "reset");
        groupStore.createIndex("by_Memstats", "memstats");
        groupStore.createIndex("by_CD", "cd");
        
        userStore.put({username: "SuperUser", password: "superuser", groups: "1"});
        
        //r = read, w = write, e = execute, 0 = ---, 1 = --e, 2 = -w-, 3 = -we, 4 = r--, 5 = r-e, 6 = rw-, 7 = rwe
        //group 1
        groupStore.put({group: "1", clear: "7", ls: "7", man: "7", delete: "7", copy: "7", ps: "7", kill: "7", more: "7", cat: "7", script: "7", contactp: "1", bankp: "3", passwordp: "5", readp: "7", statsp: "4", vectorp: "3", scriptp: "7", charwatchp: "7", starterp: "7", sleepp: "7", philp: "7", resetp: "7", memstats: "7", cd: "7",})
        //group 2
        groupStore.put({group: "2", clear: "7", ls: "7", man: "7", delete: "7", copy: "7", ps: "7", kill: "7", more: "7", cat: "7", script: "7", contactp: "7", bankp: "7", passwordp: "7", readp: "7", statsp: "7", vectorp: "7", scriptp: "7", charwatchp: "7", starterp: "7", sleepp: "7", philp: "7", resetp: "7", memstats: "7", cd: "7",})
        
        store.put({filepath: "C:\\Interrobang\\" + currentUser + "&gt;", filename: "SuperUser", content: "Folder", filesize: 0, permission: "7"});
        storeUserDirectory.put({filepath: "", filename: "Contact.CSV", content: "David: Secretary, Tony: Gangster, Jason: Dancer, Benson: Duke, Andrew: Gangster, Thomas: Traitor, Matt: Lame", filesize: 0, permission: "7"});
        storeUserDirectory.put({filepath: "C:\\Interrobang\\" + currentUser + "\Results&gt;", filename: "Results", content: "Folder", filesize: 0, permission: "7"});
        storeUserDirectory.put({filepath: "", filename: "Bank.CSV", content: "100, -50, 200, 300, -1000, 2000, 100, -50, 200, 300, -1000, 2000, 100, -50, 200, 300, -1000, 2000, 100, -50, 200, 300, -1000, 2000, 100, -50, 200, 300, -1000, 2000, 100, -50, 200, 300, -1000, 2000, 100, -50, 200, 300, -1000, 2000", filesize: 0, permission: "7"});
        storeUserDirectory.put({filepath: "", filename: "password.CSV", content: "popchiek:hi,gamrgod88:l337420,slides:mcgee,taeyona:taeyona,thommy:commie", filesize: 0, permission: "7"});
        storeUserDirectory.put({filepath: "", filename: "read.CSV", content: "1, 2, 4, 6, 7, 11, 3, 2, 7, 9, 10, 3, 4, 11, 5, 7, 8, 10, 1, 5, 7, 4, 7, 10, 11, 12, 13, 5, 7, 8, 100, 11, 12, 32, 200", filesize: 0, permission: "7"});
        storeUserDirectory.put({filepath: "", filename: "vector.CSV", content: "<15.6,7.5,-15.3>, <-16.7,-3.8,6.8>, <-8.6,2.8,-11>, <-0.9,16.8,-9.7>, <-3.7,6,6.7>, <13.5,7.4,17.1>, <-18,-18.2,16.6>, <-0.6,9.1,17.4>, <12.8,-19.3,14.6>, <4.6,-4.3,-1.5>, <6,-13.5,-13.9>, <10.7,-10.2,2.3>, <-2.4,-3.6,-14.9>, <1.8,10.8,17.1>, <12.1,-12.9,-1.6>, <-1.2,-19.3,-19>, <-8.9,-17.3,-17.1>, <-12.3,2.2,12>, <-19.6,-9.8,8>, <15,14.8,18.9>", filesize: 0, permission: "7"});
        storeUserDirectory.put({filepath: "", filename: "stats.CSV", content: "3, 4, 11, 5, 7, 8, 10, 1, 5, 7, 4, 7, 10, 11, 12, 13, 5, 7, 8, 100, 11, 12, 32, 200", filesize: 0, permission: "7"});
        storeUserDirectory.put({filepath: "", filename: "commands.CSV", content: "ls   ,   cat script.sh,  man,    vectorp", filesize: 0, permission: "7"});
        storeUserDirectory.put({filepath: "", filename: "more.file", content: "Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec quam felis, ultricies nec, pellentesque eu, pretium quis, sem. Nulla consequat massa quis enim. Donec pede justo, fringilla vel, aliquet nec, vulputate eget, arcu. In enim justo, rhoncus ut, imperdiet a, venenatis vitae, justo. Nullam dictum felis eu pede mollis pretium. Integer tincidunt. Cras dapibus. Vivamus elementum semper nisi. Aenean vulputate eleifend tellus. Aenean leo ligula, porttitor eu, consequat vitae, eleifend ac, enim. Aliquam lorem ante, dapibus in, viverra quis, feugiat a, tellus. Phasellus viverra nulla ut metus varius laoreet. Quisque rutrum. Aenean imperdiet. Etiam ultricies nisi vel augue. Curabitur ullamcorper ultricies nisi. Nam eget dui. Etiam rhoncus. Maecenas tempus, tellus eget condimentum rhoncus, sem quam semper libero, sit amet adipiscing sem neque sed ipsum. Nam quam nunc, blandit vel, luctus pulvinar, hendrerit id, lorem. Maecenas nec odio et ante tincidunt tempus. Donec vitae sapien ut libero venenatis faucibus. Nullam quis ante. Etiam sit amet orci eget eros faucibus tincidunt. Duis leo. Sed fringilla mauris sit amet nibh. Donec sodales sagittis magna. Sed consequat, leo eget bibendum sodales, augue velit cursus nunc, quis gravida magna mi a libero. Fusce vulputate eleifend sapien. Vestibulum purus quam, scelerisque ut, mollis sed, nonummy id, metus. Nullam accumsan lorem in dui. Cras ultricies mi eu turpis hendrerit fringilla. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; In ac dui quis mi consectetuer lacinia. Nam pretium turpis et arcu. Duis arcu tortor, suscipit eget, imperdiet nec, imperdiet iaculis, ipsum. Sed aliquam ultrices mauris. Integer ante arcu, accumsan a, consectetuer eget, posuere ut, mauris. Praesent adipiscing. Phasellus ullamcorper ipsum rutrum nunc. Nunc nonummy metus. Vestibulum volutpat pretium libero. Cras id dui. Aenean ut eros et nisl sagittis vestibulum. Nullam nulla eros, ultricies sit amet, nonummy id, imperdiet feugiat, pede. Sed lectus. Donec mollis hendrerit risus. Phasellus nec sem in justo pellentesque facilisis. Etiam imperdiet imperdiet orci. Nunc nec neque. Phasellus leo dolor, tempus non, auctor et, hendrerit quis, nisi. Curabitur ligula sapien, tincidunt non, euismod vitae, posuere imperdiet, leo. Maecenas malesuada. Praesent congue erat at massa. Sed cursus turpis vitae tortor. Donec posuere vulputate arcu. Phasellus accumsan cursus velit. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Sed aliquam, nisi quis porttitor congue, elit erat euismod orci, ac placerat dolor lectus quis orci. Phasellus consectetuer vestibulum elit. Aenean tellus metus, bibendum sed, posuere ac, mattis non, nunc. Vestibulum fringilla pede sit amet augue. In turpis. Pellentesque posuere. Praesent turpis. Aenean posuere, tortor sed cursus feugiat, nunc augue blandit nunc, eu sollicitudin urna dolor sagittis lacus. Donec elit libero, sodales nec, volutpat a, suscipit non, turpis. Nullam sagittis. Suspendisse pulvinar, augue ac venenatis condimentum, sem libero volutpat nibh, nec pellentesque velit pede quis nunc. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Fusce id purus. Ut varius tincidunt libero. Phasellus dolor. Maecenas vestibulum mollis diam. Pellentesque ut neque. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. In dui magna, posuere eget, vestibulum et, tempor auctor, justo. In ac felis quis tortor malesuada pretium. Pellentesque auctor neque nec urna. Proin sapien ipsum, porta a, auctor quis, euismod ut, mi. Aenean viverra rhoncus pede. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Ut non enim eleifend felis pretium feugiat. Vivamus quis mi. Phasellus a est. Phasellus magna. In hac habitasse platea dictumst. Curabitur at lacus ac velit ornare lobortis. Curabitur a felis in nunc fringilla tristique. Morbi mattis ullamcorper velit. Phasellus gravida semper nisi. Nullam vel sem. Pellentesque libero tortor, tincidunt et, tincidunt eget, semper nec, quam. Sed hendrerit. Morbi ac felis. Nunc egestas, augue at pellentesque laoreet, felis eros vehicula leo, at malesuada velit leo quis pede. Donec interdum, metus et hendrerit aliquet, dolor diam sagittis ligula, eget egestas libero turpis vel mi. Nunc nulla. Fusce risus nisl, viverra et, tempor et, pretium in, sapien. Donec venenatis vulputate lorem. Morbi nec metus. Phasellus blandit leo ut odio. Maecenas ullamcorper, dui et placerat feugiat, eros pede varius nisi, condimentum viverra felis nunc et lorem. Sed magna purus, fermentum eu, tincidunt eu, varius ut, felis. In auctor lobortis lacus. Quisque libero metus, condimentum nec, tempor a, commodo mollis, magna. Vestibulum ullamcorper mauris at ligul", filesize: 0, permission: "7"});
        storeUserDirectory.put({filepath: "", filename: "maths.CSV", content: "98, 94, 63, 95, 95, 29, 89, 36, 23, 84, 10, 63, 70, 82, 00, 81, 79, 80, 78, 66", filesize: 0, permission: "7"});
        storeUserDirectory.put({filepath: "", filename: "sleep.CSV", content: "!sleepy", filesize: 0, permission: "7"});
        store.put({filepath: "", filename: "user.txt", content: "SuperUser:superuser,", filesize: 0, permission: "7"});
        store.put({filepath: "", filename: "group.txt", content: "SuperUser: 1", filesize: 0, permission: "7"});
    };
}

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

function updateMemoryUsage(){
    console.log("Updating memory");
    totalMemoryUsed = 0;
    var request = indexedDB.open("hashDirectory");
    
    request.onsuccess = function (event) {
        var db = this.result;
        db.onversionchange = function (event) {
            console.log("Closing databse for version change");
            db.close();
        }
        for(var i = 0; i < folderList.length; i++) {
            console.log(folderList[i]);
            var transact = db.transaction([folderList[i]], "readwrite");
            var store = transact.objectStore(folderList[i]);
            var index = store.index("by_filename");

            index.openCursor().onsuccess = function(event) {
                var cursor = event.target.result;
                if(cursor) {
                    var hold = cursor.value;
                    var memoryUsed = hold.content.length;
                    hold.filesize = memoryUsed;
                    var request = cursor.update(hold);
                    request.onsuccess = function() {
                        totalMemoryUsed += memoryUsed;
                        cursor.continue();
                    }
                    request.onerror = function(event){
                        console.log("File: " + hold.filename + " could not be updated.");
                        console.log(event.target.errorCode);
                        cursor.continue();
                    }
                }
            }
        }
        
    };
    
}

//The function where the IODevice received its messages from the OS
function onMessage(event) {
    var requestDB = indexedDB.open("hashDirectory");
    requestDB.onsuccess = function () {
        var db = this.result;
        db.onversionchange = function (event) {
            console.log("Closing databse for version change I/O");
            db.close();
        }
        var task = event.data;
        var transact = db.transaction(["userDirectory"], "readwrite");
        var store = transact.objectStore("userDirectory");
        var index = store.index("by_filename");
        
        var transactResult = db.transaction(["Results"], "readwrite");
        var storeResult = transactResult.objectStore("Results");
        var indexResult = storeResult.index("by_filename");
        switch (task.sysCall) {
            case "Open File": {
                console.log("Opening File");

                var request = index.get(task.fileName);
                request.onsuccess = function(){
                    var hold = request.result.content;
                    arrOpenFiles[task.fileName] = {
                        szMode: task.Mode,
                        nPosition: 0,
                        nLength: (hold.match(/.{1,100}/g)).length,
                        contents: hold.match(/.{1,100}/g)
                    };
                    console.log(arrOpenFiles[task.fileName]);
                    postMessage(task);
                }
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
                var request = storeResult.put({filepath: "", filename: task.fileName, content: "", filesize: 0, permission: "7"})
                request.onsuccess = function(event) {
                    arrOpenFiles[task.fileName] = {
                        szMode: task.mode,
                        nPosition: 0,
                        nLength: 0,
                        contents: []
                    };
                    console.log()
                    postMessage(task);
                }
            } break;
            case "Delete File": {
                index.openCursor().onsuccess = function(event) {
                    var cursor = event.target.result;
                    if(cursor) {
                        if (cursor.value.filename === task.fileName){
                            var request = store.delete(cursor.primaryKey);
                            request.onsuccess = function() {
                                console.log("File Deleted: " + task.fileName);
                                updateMemoryUsage();
                            }
                        }
                        cursor.continue();
                    }
                }
                postMessage(task);
            } break;
            case "Read File": {
                console.log("Reading File");
                console.log(task.filePointer);
                console.log((arrOpenFiles[task.fileName].nPosition));
                console.log(arrOpenFiles);
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
                var testLimit = task.data.length;
                if(testLimit+totalMemoryUsed >= totalMemoryLimit) {
                    var memoryError = {
                        sysCall: "Memory failure"
                    };
                    postMessage(memoryError);
                }
                else {
                    if(task.location === "result") {
                        indexResult.openCursor().onsuccess = function(event){
                        var cursor = event.target.result;
                            if (cursor) {
                                if (cursor.value.filename === task.fileName){
                                    var hold = cursor.value;
                                    if (task.data === parseInt(task.data, 10)){
                                        hold.content += ((task.data.toString()).match(/.{1,100}/g)).toString();
                                        hold.filesize = (hold.content).length;
                                         arrOpenFiles[task.fileName].contents[arrOpenFiles[task.fileName].nPosition] = ((task.data.toString()).match(/.{1,100}/g)).toString();

                                        var request = cursor.update(hold);
                                        request.onsuccess = function() {
                                            console.log("File Updated: " + task.fileName);
                                            updateMemoryUsage();
                                        }
                                    } else {
                                        hold.content += "\n"+((task.data).match(/.{1,100}/g)).toString();
            //                            hold.content += task.data;
            //                            hold.filesize = (hold.content).length;
                                        arrOpenFiles[task.fileName].contents[arrOpenFiles[task.fileName].nPosition] = ((task.data).match(/.{1,100}/g)).toString();

                                        var request = cursor.update(hold);
                                        request.onsuccess = function() {
                                            console.log("File Updated: " + task.fileName);
                                            updateMemoryUsage();
                                        }
                                    }
                                }
                                cursor.continue();
                            }
                        }
                    }
                    else {
                        index.openCursor().onsuccess = function(event){
                        var cursor = event.target.result;
                            if (cursor) {
                                if (cursor.value.filename === task.fileName){
                                    var hold = cursor.value;
                                    if (task.data === parseInt(task.data, 10)){
                                        hold.content += ((task.data.toString()).match(/.{1,100}/g)).toString();
                                        hold.filesize = (hold.content).length;
                                         arrOpenFiles[task.fileName].contents[arrOpenFiles[task.fileName].nPosition] = ((task.data.toString()).match(/.{1,100}/g)).toString();

                                        var request = cursor.update(hold);
                                        request.onsuccess = function() {
                                            console.log("File Updated: " + task.fileName);
                                            updateMemoryUsage();
                                        }
                                    } else {
                                        hold.content += ((task.data).match(/.{1,100}/g)).toString();
            //                            hold.content += task.data;
            //                            hold.filesize = (hold.content).length;
                                        arrOpenFiles[task.fileName].contents[arrOpenFiles[task.fileName].nPosition] = ((task.data).match(/.{1,100}/g)).toString();

                                        var request = cursor.update(hold);
                                        request.onsuccess = function() {
                                            console.log("File Updated: " + task.fileName);
                                            updateMemoryUsage();
                                        }
                                    }
                                }
                                cursor.continue();
                            }
                        }
                    }

                    task.length = task.data.length;
                    task.position = (arrOpenFiles[task.fileName].nPosition)+ 1;
                    postMessage(task);
                }
                } break;
                case "Length of File": {
                    var request = index.get(task.fileName);
                    request.onsuccess = function(){
                        var hold = request.result.content;
                        task.length = hold.length;
                        postMessage(task);
                    }
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
                case "Memory Stats":
                    var response = {
                        sysCall: "Memory Stats",
                        memoryLimit: totalMemoryLimit,
                        memoryUsed: totalMemoryUsed,
                    }
                    postMessage(response);
                    break;
            }
       
    }
}

self.addEventListener('message', onMessage, false);
openDb();
