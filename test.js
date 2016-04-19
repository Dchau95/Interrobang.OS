var db;


//Opens the database and populates it with our basic files and their contents.
//Inputs:
//Outputs: Various messages depending on the situation, all sent to the console.
//Returns:
function openDb() {
    console.log("Opening DB...");
    //Opens DB with name of hashDirectory and version 1
    var request = indexedDB.open("hashDirectory", 1);
    
    //If DB already exists with same version then set db to that indexedDB
    //Also calls test function
    request.onsuccess = function (event) {
        db = this.result;
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
        var store = event.currentTarget.result.createObjectStore("files", {autoIncrement: true});
        store.createIndex("by_filename", "filename", {unique: true});
        store.createIndex("by_content", "content");
    
        //add an entry to the "files" store
        store.put({filename: "Contact.CSV", content: "David: Secretary, Tony: Gangster, Jason: Dancer, Benson: Duke, Andrew: Gangster, Thomas: Traitor, Matt: Lame"});
        store.put({filename: "Bank.CSV", content: "100, -50, 200, 300, -1000, 2000, 100, -50, 200, 300, -1000, 2000, 100, -50, 200, 300, -1000, 2000, 100, -50, 200, 300, -1000, 2000, 100, -50, 200, 300, -1000, 2000, 100, -50, 200, 300, -1000, 2000, 100, -50, 200, 300, -1000, 2000"});
        store.put({filename: "password.CSV", content: "popchiek:hi,gamrgod88:l337420,slides:mcgee,taeyona:taeyona,thommy:commie"});
        store.put({filename: "read.CSV", content: "1, 2, 4, 6, 7, 11, 3, 2, 7, 9, 10, 3, 4, 11, 5, 7, 8, 10, 1, 5, 7, 4, 7, 10, 11, 12, 13, 5, 7, 8, 100, 11, 12, 32, 200"});
        store.put({filename: "vector.CSV", content: "<15.6,7.5,-15.3>, <-16.7,-3.8,6.8>, <-8.6,2.8,-11>, <-0.9,16.8,-9.7>, <-3.7,6,6.7>, <13.5,7.4,17.1>, <-18,-18.2,16.6>, <-0.6,9.1,17.4>, <12.8,-19.3,14.6>, <4.6,-4.3,-1.5>, <6,-13.5,-13.9>, <10.7,-10.2,2.3>, <-2.4,-3.6,-14.9>, <1.8,10.8,17.1>, <12.1,-12.9,-1.6>, <-1.2,-19.3,-19>, <-8.9,-17.3,-17.1>, <-12.3,2.2,12>, <-19.6,-9.8,8>, <15,14.8,18.9>"});
        store.put({filename: "stats.CSV", content: "3, 4, 11, 5, 7, 8, 10, 1, 5, 7, 4, 7, 10, 11, 12, 13, 5, 7, 8, 100, 11, 12, 32, 200"});
        store.put({filename: "more.file", content: "Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec quam felis, ultricies nec, pellentesque eu, pretium quis, sem. Nulla consequat massa quis enim. Donec pede justo, fringilla vel, aliquet nec, vulputate eget, arcu. In enim justo, rhoncus ut, imperdiet a, venenatis vitae, justo. Nullam dictum felis eu pede mollis pretium. Integer tincidunt. Cras dapibus. Vivamus elementum semper nisi. Aenean vulputate eleifend tellus. Aenean leo ligula, porttitor eu, consequat vitae, eleifend ac, enim. Aliquam lorem ante, dapibus in, viverra quis, feugiat a, tellus. Phasellus viverra nulla ut metus varius laoreet. Quisque rutrum. Aenean imperdiet. Etiam ultricies nisi vel augue. Curabitur ullamcorper ultricies nisi. Nam eget dui. Etiam rhoncus. Maecenas tempus, tellus eget condimentum rhoncus, sem quam semper libero, sit amet adipiscing sem neque sed ipsum. Nam quam nunc, blandit vel, luctus pulvinar, hendrerit id, lorem. Maecenas nec odio et ante tincidunt tempus. Donec vitae sapien ut libero venenatis faucibus. Nullam quis ante. Etiam sit amet orci eget eros faucibus tincidunt. Duis leo. Sed fringilla mauris sit amet nibh. Donec sodales sagittis magna. Sed consequat, leo eget bibendum sodales, augue velit cursus nunc, quis gravida magna mi a libero. Fusce vulputate eleifend sapien. Vestibulum purus quam, scelerisque ut, mollis sed, nonummy id, metus. Nullam accumsan lorem in dui. Cras ultricies mi eu turpis hendrerit fringilla. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; In ac dui quis mi consectetuer lacinia. Nam pretium turpis et arcu. Duis arcu tortor, suscipit eget, imperdiet nec, imperdiet iaculis, ipsum. Sed aliquam ultrices mauris. Integer ante arcu, accumsan a, consectetuer eget, posuere ut, mauris. Praesent adipiscing. Phasellus ullamcorper ipsum rutrum nunc. Nunc nonummy metus. Vestibulum volutpat pretium libero. Cras id dui. Aenean ut eros et nisl sagittis vestibulum. Nullam nulla eros, ultricies sit amet, nonummy id, imperdiet feugiat, pede. Sed lectus. Donec mollis hendrerit risus. Phasellus nec sem in justo pellentesque facilisis. Etiam imperdiet imperdiet orci. Nunc nec neque. Phasellus leo dolor, tempus non, auctor et, hendrerit quis, nisi. Curabitur ligula sapien, tincidunt non, euismod vitae, posuere imperdiet, leo. Maecenas malesuada. Praesent congue erat at massa. Sed cursus turpis vitae tortor. Donec posuere vulputate arcu. Phasellus accumsan cursus velit. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Sed aliquam, nisi quis porttitor congue, elit erat euismod orci, ac placerat dolor lectus quis orci. Phasellus consectetuer vestibulum elit. Aenean tellus metus, bibendum sed, posuere ac, mattis non, nunc. Vestibulum fringilla pede sit amet augue. In turpis. Pellentesque posuere. Praesent turpis. Aenean posuere, tortor sed cursus feugiat, nunc augue blandit nunc, eu sollicitudin urna dolor sagittis lacus. Donec elit libero, sodales nec, volutpat a, suscipit non, turpis. Nullam sagittis. Suspendisse pulvinar, augue ac venenatis condimentum, sem libero volutpat nibh, nec pellentesque velit pede quis nunc. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Fusce id purus. Ut varius tincidunt libero. Phasellus dolor. Maecenas vestibulum mollis diam. Pellentesque ut neque. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. In dui magna, posuere eget, vestibulum et, tempor auctor, justo. In ac felis quis tortor malesuada pretium. Pellentesque auctor neque nec urna. Proin sapien ipsum, porta a, auctor quis, euismod ut, mi. Aenean viverra rhoncus pede. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Ut non enim eleifend felis pretium feugiat. Vivamus quis mi. Phasellus a est. Phasellus magna. In hac habitasse platea dictumst. Curabitur at lacus ac velit ornare lobortis. Curabitur a felis in nunc fringilla tristique. Morbi mattis ullamcorper velit. Phasellus gravida semper nisi. Nullam vel sem. Pellentesque libero tortor, tincidunt et, tincidunt eget, semper nec, quam. Sed hendrerit. Morbi ac felis. Nunc egestas, augue at pellentesque laoreet, felis eros vehicula leo, at malesuada velit leo quis pede. Donec interdum, metus et hendrerit aliquet, dolor diam sagittis ligula, eget egestas libero turpis vel mi. Nunc nulla. Fusce risus nisl, viverra et, tempor et, pretium in, sapien. Donec venenatis vulputate lorem. Morbi nec metus. Phasellus blandit leo ut odio. Maecenas ullamcorper, dui et placerat feugiat, eros pede varius nisi, condimentum viverra felis nunc et lorem. Sed magna purus, fermentum eu, tincidunt eu, varius ut, felis. In auctor lobortis lacus. Quisque libero metus, condimentum nec, tempor a, commodo mollis, magna."}); 
    };
}

//Gets the content of a file.
//Inputs: A file name (usualy as a string).
//Outputs: The file's name along with contents to the console.
//Returns: The file's contents as a string.
function readFile(requestedFileName) {
    var transact = db.transaction(["files"]);
    var store = transact.objectStore("files");
    var index = store.index("by_filename");
    
    var request = index.get(requestedFileName);
    request.onsuccess = function() {
        console.log("Reading File: " + requestedFileName + " Contents: " + request.result.content);
        return request.result.content;
    }
    request.onerror = function(event) {
        console.log("File: " + requestedFileName + " could not be read.");
        console.log(event.target.errorCode);
    }
};

//Adds a file to the database.
//Inputs: File name (string) and contents (string).
//Outputs: Success or error depending on the situation.
//Returns:
function addFile(addedFileName, addedContents) {
    //add a file
    var transact = db.transaction(["files"], "readwrite");
    var objectStore = transact.objectStore("files");
    var request = objectStore.put({filename: addedFileName, content: addedContents});
    request.onsuccess = function(event) {
        console.log("File Added: " + addedFileName);
    }
    request.onerror = function(event) {
        console.log("File: " + addedFileName + " could not be added.");
        console.log(event.target.errorCode);
    }    
}

//Displays all file names to the console, mainly for diagnostic purposes.
//Inputs:
//Outputs: Displays all file names in alphabetical order (capital letters first) to the console.
//Returns:
function displayFileNamesToConsole() {
    var transact = db.transaction(["files"]);
    var store = transact.objectStore("files");
    var index = store.index("by_filename");
    index.openCursor().onsuccess = function(event) {
        var cursor = event.target.result;
        if(cursor) {
            console.log(cursor.value.filename);
            cursor.continue();
        } else {
            console.log("All Entries Displayed.");
        }
    }
    index.openCursor().onerror = function(event) {
        console.log("An error has occured.");
        console.log(event.target.errorCode);
    }
}

//Deletes a file from the database.
//Inputs: The file's name.
//Outputs: Success or failure messages.
//Returns:
function deleteFile(deletedFileName){
    var transact = db.transaction(["files"], "readwrite");
    var store = transact.objectStore("files");
    var index = store.index("by_filename");
    index.openCursor().onsuccess = function(event) {
        var cursor = event.target.result;
        if(cursor) {
            if (cursor.value.filename === deletedFileName){
                var request = store.delete(cursor.primaryKey);
                request.onsuccess = function() {
                    console.log("File Deleted: " + deletedFileName);
                }
                request.onerror = function(event){
                    console.log("File: " + deletedFileName + " could not be deleted.");
                    console.log(event.target.errorCode);
                }
            }
            cursor.continue();
        }
    }  
}

//Updates a file in the database.
//Inputs: A file's name (string), and its contents (string).
//Outputs: Success or failure messages.
//Returns:
function updateFile(updatedFileName, updatedContents){
    var transact = db.transaction(["files"], "readwrite");
    var store = transact.objectStore("files");
    var index = store.index("by_filename");
    index.openCursor().onsuccess = function(event) {
        var cursor = event.target.result;
        if(cursor) {
            if (cursor.value.filename === updatedFileName){
                var hold = cursor.value;
                hold.content = updatedContents;
                var request = cursor.update(hold);
                request.onsuccess = function() {
                    console.log("File Updated: " + updatedFileName);
                }
                request.onerror = function(event){
                    console.log("File: " + updatedFileName + " could not be updated.");
                    console.log(event.target.errorCode);
                }
            }
            cursor.continue();
        }
    }  
}

openDb();