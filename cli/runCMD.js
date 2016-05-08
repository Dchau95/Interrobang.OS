/**
*   Filename: runCMD.js
*   
*   Contains all the command line functions.
*/

// Hardcoded default folderLocation and currentUser
var folderLocation = "userDirectory";
var prevLocation = "root";

function runCMD(userInput)
{
    var arrArguments = [];
    var command = userInput.split(/\s+/g);
    console.log(userInput);

    for(var i = 1; i < command.length; i++) {
        arrArguments.push(command[i]);
    }
    
    switch(command[0].toLowerCase())
    {
        case "useradd": case "adduser":
            addUser(arrArguments[0]);
            break;
        case "deluser": case "userdel":
            delUser(arrArguments[0]);
            break;
        case "passwd": case "pswd":
            passChange(arrArguments[0], arrArguments[1]);
            break;
        case "checkpriv":
            checkPriv(currentUser, arrArguments[0]);
            break;
        case "su":
            switchUser(arrArguments[0]);
            break;
        case "clear": case "cls":
            clearCMD();
            break;
        case "ls": case "dir":
            lsCMD(arrArguments);
            break;
        case "man": case "help":
            man();
            break;
        case "delete": case "rm":
            deleteCMD(arrArguments[0]);
            break;
        case "copy": case "cp":
            copyCMD(arrArguments[0], arrArguments[1]);
            break;
        case "usermod":
            runAddUserGroup(arrArguments[0], arrArguments[1]);
            break;
        case "delusermod":
            runRemoveUserGroup(arrArguments[0], arrArguments[1]);
            break;
        case "ps":
            ps();
            break;
        case "kill":
            kill(arrArguments[0]);
            break;
        case "more":
            more(arrArguments[0]);
            break;
        case "cat":
            cat(arrArguments, 0);
            break;
        case "script": case "sh": case "bash":
            script(arrArguments[0])
            break;
        case "contactp":
            runContact();
            break;
        case "bankp":
            runBank();
            break;
        case "passwordp":
            runPassword();
            break;
        case "readp":
            runRead();
            break;
        case "statsp":
            runStats();
            break;
        case "vectorp":
            runVector();
            break;
        case "scriptp":
            runScript();
            break;
        case "charwatchp":
            runCharWatch();
            break;
        case "starterp":
            runStarter();
            break;
        case "sleepp":
            runSleep();
            break;
        case "consumep":
            runConsumeProcess(arrArguments[0]);
            break;
        case "philp":
            runPhil();
            break;
        case "reset":
            reset();
            break;
        case "memstats":
            displayMemory();
            break;
        case "cd":
            cdCMD(arrArguments[0]);
            break;
        case "mkdir":
            mkdirCMD(arrArguments[0]);
            break;
        default:
            commandOutput("'"+userInput+"'" + " is not a valid command.\n");
            break;
    }
}


function displayMemory() {
    var task = {
        sysCall : "Memory Stats",
    };
    device.postMessage(task);
}

function addUser(newUser)
{
    var requestOpen = indexedDB.open("hashDirectory");
    requestOpen.onsuccess = function (event) {
        var db = this.result;
        db.onversionchange = function (event) {
            console.log("Closing databse for version change");
            db.close();
        }
        if (currentUser !== "SuperUser") {
            commandOutput("You do not have priviledge to add a user.\n");
            return;
        }

        var parsedUser = newUser.split(":");

        // Open database for transaction.
        var transact = db.transaction(["root"], "readwrite");
        var store = transact.objectStore("root");
        var index = store.index("by_filename");
        var request = index.get(parsedUser[0]);
        request.onsuccess = function(e) {
            // User already exist.
            if (request.result) {
                commandOutput("'"+parsedUser[0]+"'" + " already exists as a user.\n");
            }
            // Create User.
            else { 
                store.put({filepath: "", filename: parsedUser[0], content: "Folder", filesize: 0});
                var transact2 = db.transaction(["users"], "readwrite");
                var store2 = transact2.objectStore("users");
                store2.put({username: parsedUser[0], password: parsedUser[1], groups: ""});
                index.openCursor().onsuccess = function(event) {
                    var cursor = event.target.result;
                    if (cursor) {
                        if (cursor.value.filename === "user.txt"){
                            var hold = cursor.value;
                            hold.content += newUser + ",";
                            var request = cursor.update(hold);
                                request.onsuccess = function() {
                                    commandOutput("User '" + parsedUser[0] + "' has been created\n");
                                    console.log("Updated");
                                    updateMemoryUsage();
                                }
                        }
                        cursor.continue();
                    }
                }

            }
        }
    }
}

function delUser(removedUser)
{
    var requestOpen = indexedDB.open("hashDirectory");
    requestOpen.onsuccess = function (event) {
        var db = this.result;
        db.onversionchange = function (event) {
            console.log("Closing databse for version change");
            db.close();
        }
        if (removedUser === "SuperUser:superuser") {
            commandOutput("You cannot remove the SuperUser.\n");
            return;
        }

        if (removedUser === currentUser) {
            commandOutput("You cannot remove yourself.\n");
            return;
        }

        if (currentUser !== "SuperUser") {
            commandOutput("You do not have priviledge to remove a user.\n");
            return;
        }

        var parsedUser = removedUser.split(":");

        // Open database for transaction.
        var transact = db.transaction(["root"], "readwrite");
        var store = transact.objectStore("root");
        var index = store.index("by_filename");
        var request = index.getKey(parsedUser[0]);

        request.onsuccess = function(e) {
            // Found user, deleting... 
            if (request.result) {
                store.delete(request.result);
                index.openCursor().onsuccess = function(event) {
                var cursor = event.target.result;
                    if (cursor) {
                        if (cursor.value.filename === "user.txt") {
                            var hold = cursor.value;
                            parsedUserList = hold.content.split(",")
                            for (var i = 0; i < parsedUserList.length; i++) {
                                if (parsedUserList[i] === removedUser) {
                                    parsedUserList.splice(i,1);
                                    hold.content = parsedUserList.join(",");
                                    break;
                                }
                            }
                            var request = cursor.update(hold);
                                request.onsuccess = function() {
                                    commandOutput("'"+parsedUser[0]+"'" + " has been removed as a user.")
                                    console.log("Updated");
                                    updateMemoryUsage();
                                }
                        }
                        cursor.continue();
                    }
                }
            }
            // No user found.
            else { 
                commandOutput("'"+parsedUser[0]+"'" + " is not a user.")
            }
        }
    }
}

function passChange(currentCredentials, newPassword)
{
    var requestOpen = indexedDB.open("hashDirectory");
    requestOpen.onsuccess = function (event) {
        var db = this.result;
        db.onversionchange = function (event) {
            console.log("Closing databse for version change");
            db.close();
        }
        var parsedUser = currentCredentials.split(":");
        var flag = 0;

        // Open database for transaction.
        var transact = db.transaction(["root"], "readwrite");
        var store = transact.objectStore("root");
        var index = store.index("by_filename");

        index.openCursor().onsuccess = function(event) {
        var cursor = event.target.result;
            if (cursor) {
                if (cursor.value.filename === "user.txt") {
                    var hold = cursor.value;
                    parsedUserList = hold.content.split(",");
                    // Loop through list of users.
                    for (var i = 0; i < parsedUserList.length; i++) {
                        if (parsedUserList[i] === currentCredentials) {
                            parsedUserList.splice(i,1);
                            hold.content = parsedUserList.join(",");
                            hold.content += parsedUser[0] + ":" + newPassword+ ",";
                            flag = 1;
                            commandOutput("Password successfully updated for " + "'"+parsedUser[0]+"'" )
                            break;
                        }
                    }
                    // message not found
                    if (!flag)
                        commandOutput("Your credentials are not correct.\n")
                    var request = cursor.update(hold);
                        request.onsuccess = function() {
                            console.log("Updated");
                            updateMemoryUsage();
                        }
                }
                cursor.continue();
            }
        }
    }
}

function switchUser(credentials)
{
    var requestOpen = indexedDB.open("hashDirectory");
    requestOpen.onsuccess = function (event) {
        var db = this.result;
        db.onversionchange = function (event) {
            console.log("Closing databse for version change");
            db.close();
        }
        var parsedUser = credentials.split(":");
        var flag = 0;

        // Open database for transaction.
        var transact = db.transaction(["root"], "readwrite");
        var store = transact.objectStore("root");
        var index = store.index("by_filename");

        index.openCursor().onsuccess = function(event) {
        var cursor = event.target.result;
            if (cursor) {
                if (cursor.value.filename === "user.txt") {
                    var hold = cursor.value;
                    parsedUserList = hold.content.split(",");

                    for (var i = 0; i < parsedUserList.length; i++) {
                        if (parsedUserList[i] === credentials) {
                            currentUser = parsedUser[0];
                            flag = 1;
                            document.getElementById("filepath").innerHTML = "C:\\Interrobang\\" + currentUser + ">";
                            folderLocation = "userDirectory";
                            break;
                        }
                    }
                    // message not found
                    if (!flag)
                        commandOutput("Your credentials are not correct.\n")
                    var request = cursor.update(hold);
                        request.onsuccess = function() {
                            console.log("Updated");
                            updateMemoryUsage();
                        }
                }
                cursor.continue();
            }
        }
    }
}

function cdCMD(folder)
{
    var requestOpen = indexedDB.open("hashDirectory");
    requestOpen.onsuccess = function (event) {
        var db = this.result;
        db.onversionchange = function (event) {
            console.log("Closing databse for version change");
            db.close();
        }
        //Make sure it's a folder
        //Make sure it goes back a folder
        var transact = db.transaction([folderLocation]);
        var store = transact.objectStore(folderLocation);
        var index = store.index("by_filename");

        // If currently in userDirectory, move back to root (User List) if SuperUser.
        if (folder === ".." && folderLocation === "userDirectory" && currentUser === "SuperUser") {
            document.getElementById("filepath").innerHTML = "C:\\Interrobang>";
            folderLocation = "root";
            return;
        }

        // If current folder is results, go back to userDirectory.
        if (folder === ".." && folderLocation === "Results") {
            document.getElementById("filepath").innerHTML = "C:\\Interrobang\\" + currentUser + ">";
            prevLocation = folderLocation;
            folderLocation = "userDirectory";
            return;
        }

        // General case, Go back a directory.
        if (folder === "..") {
            transact = db.transaction([prevLocation]);
            store = transact.objectStore(prevLocation);
            index = store.index("by_filename");
            var request = index.get(folderLocation)
            request.onsuccess = function (event) {
                document.getElementById("filepath").innerHTML = request.result.filepath;
                parsePathLocation = request.result.filepath.split("\\");
                if (parsePathLocation[parsePathLocation.length-1].slice(0,-4) === currentUser) {
                    folderLocation = "userDirectory";
                }
                else {
                    if (parsePathLocation[parsePathLocation.length-2] == currentUser) {
                        prevLocation = "userDirectory";
                    }
                    else {
                        prevLocation = parsePathLocation[parsePathLocation.length-2];
                    }
                    folderLocation = parsePathLocation[parsePathLocation.length-1].slice(0,-4);
                }

            }
            return;
        }

        // Find available directories
        index.openCursor().onsuccess = function(event) {
            console.log(folder);
            var cursor = event.target.result;
            if(cursor) {
                if (folder.toLowerCase() === cursor.value.filename.toLowerCase() && cursor.value.content === "Folder") {
                    document.getElementById("filepath").innerHTML = 
                        document.getElementById("filepath").innerHTML.slice(0,-4) + "\\" + cursor.value.filename + ">";

                    // If currently in root, move to user directory
                    if (folderLocation === "root") {
                        prevLocation = folderLocation;
                        folderLocation = "userDirectory"
                        return;
                    }

                    // Else, move to selected folder directory
                    prevLocation = folderLocation;
                    folderLocation = cursor.value.filename;
                    return;
                }
                cursor.continue();
            } else {
                commandOutput("The system cannot find the path specified or you do not have priviledge to view that path.\n")
                return;
            }
        }   
    }
}

function clearCMD()
{
    var errorCode = 0;
    contentout.innerText = ""; 
    return errorCode;
}

function reset(){
    console.log(indexedDB.deleteDatabase("hashDirectory"));
    location.reload();
}

function lsCMD(directories)
{
    var requestOpen = indexedDB.open("hashDirectory");
    requestOpen.onsuccess = function (event) {
        var db = this.result;
        db.onversionchange = function (event) {
            console.log("Closing databse for version change");
            db.close();
        }
        console.log(folderLocation);
        console.log(directories);
        var result = "";
        try {
            //List current directory
            if(directories.length === 0 || directories[0] === "") {
                var transact = db.transaction([folderLocation]);
                var store = transact.objectStore(folderLocation);
                var index = store.index("by_filename");
                index.openCursor().onsuccess = function(event) {
                    var cursor = event.target.result;
                    if(cursor) {
                        result = result.concat(cursor.value.filename + "\n");
                        cursor.continue();
                    } else {
                        console.log("All Entries Displayed.");
                        commandOutput(result);
                        return result;
                    }
                }
                index.openCursor().onerror = function(event) {
                    console.log("An error has occured.");
                    console.log(event.target.errorCode);
                }
            }
            //List one or more directories listed
            else {
                for(var i = 0; i < directories.length; i++) {
                    var transact = db.transaction([directories[i].toLowerCase()]);
                    var store = transact.objectStore(directories[i].toLowerCase());
                    var index = store.index("by_filename");
                    index.openCursor().onsuccess = function(event) {
                        var cursor = event.target.result;
                        if(cursor) {
                            result= result.concat(cursor.value.filename + "\n");
                            cursor.continue();
                        } else {
                            console.log("All Entries Displayed.");
                            commandOutput(result);
                            return result;
                        }
                    }
                    index.openCursor().onerror = function(event) {
                        console.log("An error has occured.");
                        console.log(event.target.errorCode);
                    }
                }
            }
        } 
        catch (error){
            commandOutput("That directory does not exist.\n");
            return;
        }
    }
}

function deleteCMD(fileName)
{
    var requestOpen = indexedDB.open("hashDirectory");
    requestOpen.onsuccess = function (event) {
        var db = this.result;
        db.onversionchange = function (event) {
            console.log("Closing databse for version change");
            db.close();
        }
        var transact = db.transaction([folderLocation], "readwrite");
        var store = transact.objectStore(folderLocation);
        var index = store.index("by_filename");

        index.openCursor().onsuccess = function(event){
            var cursor = event.target.result;
            if(cursor) {
                if (cursor.value.filename === fileName){
                    var request = store.delete(cursor.primaryKey);
                    request.onsuccess = function(){
                        console.log(request.result);
                        console.log("File Deleted: " + fileName)
                        commandOutput("File Removed")
                    }
                }
                cursor.continue();
            }

        }
    }
}

//Maybe todo CopyFilename be directories + filename
function copyCMD(fileName, copyFileName)
{
    var requestOpen = indexedDB.open("hashDirectory");
    requestOpen.onsuccess = function (event) {
        var db = this.result;
        db.onversionchange = function (event) {
            console.log("Closing databse for version change");
            db.close();
        }
        var errorCode = 0;
        var transact = db.transaction([folderLocation], "readwrite");
        var store = transact.objectStore(folderLocation);
        var index = store.index("by_filename");

        var request = index.get(fileName);
        request.onsuccess = function() {
            console.log("Copying File: " + fileName + " to: copyFileName: " + copyFileName);
            var hold = request.result.content;

            os.create(copyFileName, "write", 10);
            os.write(copyFileName, 1, hold, "result");
        }
        request.onerror = function(event){
            console.log("An error has occured.");
        }
        return errorCode;
    }
}

var index = 0;
var stopInterval;
function runConsume(argument){
    commandOutput("You may want to do something else while this runs\n");
    stopInterval = setInterval(function(){
        var output = "outputFile"+index+".file";
        index++;
        commandOutput("We're outputting "+index+"\n");
        copyCMD(argument, output);
    }, 3000);
}

function mkdirCMD(folder) {
    var requestOpen = indexedDB.open("hashDirectory");
    requestOpen.onsuccess = function (event) {
        var db = this.result;
        db.onversionchange = function (event) {
            console.log("Closing databse for version change");
            db.close();
        }
        var requestVersion = indexedDB.open("hashDirectory");
        var fileExist = 0;
        requestVersion.onsuccess = function (event) {
            var currentVersion = parseInt(this.result.version);
            var requestUpdate = indexedDB.open("hashDirectory", currentVersion + 1);

            this.result.onversionchange = function (event) {
                console.log("Closing databse for version change");
                requestVersion.result.close();
            }

            requestUpdate.onblocked = function (event) {
                console.log("BLOCKED");
            }

            requestUpdate.onsuccess = function(event) {
                if (!fileExist) {
                    db = this.result;
                    var transact = db.transaction([folderLocation], "readwrite");
                    var store2 = transact.objectStore(folderLocation);
                    store2.put({filepath: document.getElementById("filepath").innerHTML, filename: folder, content: "Folder", filesize: 0});
                    console.log("Successful!");
                }

                db.onversionchange = function (event) {
                    console.log("Closing databse for version change");
                    db.close();
                }
            }

            requestUpdate.onupgradeneeded = function (event) {
                try {
                    db = this.result;
                    console.log("I GOT HERE");
                    var store = db.createObjectStore(folder, {autoIncrement: true});
                    store.createIndex("by_filepath", "filepath");
                    store.createIndex("by_filename", "filename", {unique: true});
                    store.createIndex("by_content", "content");
                    store.createIndex("by_filesize", "filesize");
                    //Need this to pass to IODevice
                    //From there, add folderAdd.folder to the folderList variable in IODevice
                    //Then when you do memstats, it'll loop through folderList to add up
                    //the memory
                    var folderAdd = {
                        sysCall: "Make Directory",
                        folder: folder
                    }
                }
                catch(error) {
                    commandOutput("That folder already exist.");
                    fileExist = 1;
                    return;
                }
            }
        }
    }
}

/**
Help manual
clear, ls or dir, delete, copy, ps, kill, more, cat, man …
*/
function man()
{
    var errorCode = 0;
    var result = "\nAssignment 2 Processes\n";
    result += "------------------------------------------------------\n";
    result += "clear : Clear terminal screen\n";
    result += "reset : Clear terminal and reset database\n";
    result += "ls or dir : List directory contents, takes in one or more parameters\n";
    result += "delete or rm : Delete file. Requires one (or more) parameter\n";
    result += "copy or cp: Copy file. Requires two parameters\n";
    result += "ps : Print process status\n";
    result += "kill : Ends current process. Requires one parameter\n";
    result += "more : Display file output screen. Requires one parameter\n";
    result += "cat : Display file(s) content. Requires one or more parameters\n";
    result += "man or help : Display help manual\n";
    result += "\nAssignment 1 Processes\n";
    result += "------------------------------------------------------\n";
    result += "contactp : Initiates the contact manager process\n";
    result += "bankp : Initiates the bank calculator process\n";
    result += "passwordp : Initiates the password process\n";
    result += "readp : Initiates the sort a list of numbers process\n";
    result += "vectorp : Initiates the vector calculator process\n";
    result += "statsp : Initiates the statistics calculator process\n";
    result += "\nAssignment 4 Processes\n";
    result += "------------------------------------------------------\n";
    result += "scriptp : Initiates the script process and runs script\n";
    result += "script or sh or bash: Run a script from a file. Requires one parameter\n";
    result += "charwatchp : Initiates the character watch process\n";
    result += "starterp : Starts the starter process, which starts the mather process and statsp process\n";
    result += "sleepp : Starts the sleep process which sleeps after doing some work, starts a new process which starts and finishes work, and then alerts the sleep process to wake up\n";
    result += "philp : Starts the philosopher process\n";
    result += "\nAssignment 5 Processes\n";
    result += "------------------------------------------------------\n";
    result += "memstats: Displays the remaining memory in the Operating System\n";
    result += "cd: Change directory, requires one parameter\n";
    result += "consumep: Copies the specified file over and over. Takes in one parameter\n";
    result += "mkdir: Create new directory, requires one parameter\n";
    result += "\nAssignment 6 Processes\n";
    result += "------------------------------------------------------\n";
    result += "adduser or useradd: Creates a new user; only available for SuperUser, input is user:pass\n";
    result += "deluser or userdel: Removes a user; only available for SuperUser, input is user:pass\n";
    result += "usermod: Takes two arguments, user and group, and adds the user to a group.\n";
    result += "delusermod: Takes two arguments, user and group, and removes the user from a group.\n";
    result += "su: Switches user from one user to another, input is user:pass\n";
    result += "checkpriv:checks what access rights the processes have, takes two arguments i.e. checkpriv bankp\n";
    commandOutput(result);
    return result;
}

/**
Concatenate files and print on the standard output	
*/
/**compare array of "files passed in then print"
file elements matching hastable(array of files)
*/
function cat(arrFiles, rec)
{
    var requestOpen = indexedDB.open("hashDirectory");
    requestOpen.onsuccess = function (event) {
        var db = this.result;
        db.onversionchange = function (event) {
            console.log("Closing databse for version change");
            db.close();
        }
        var transact = db.transaction([folderLocation]);
        var store = transact.objectStore(folderLocation);
        var index = store.index("by_filename");
        var i = rec;
        var errorCode = 0;
        var request = index.get(arrFiles[i]);
        request.onsuccess = function(){
            if(request.result === undefined){
                console.log("File Not Found");
                commandOutput("File not found.\n");
            } else {
            console.log("Reading File: " + arrFiles[i] + " Contents: " + request.result.content);
            if (request.result.content !== "Folder")
                commandOutput(request.result.content + "\n");
            else
                commandOutput(arrFiles[i] +": Is a directory " + "\n");
            }
            i++;
            if(i < arrFiles.length){
                cat(arrFiles, i);
            }
        }
        request.onerror = function(event) {
            console.log("An error occured");
            i++;
            if(i < arrFiles.length){
                cat(arrFiles, i);
            }
        }
        return errorCode;
    }
}

/**
Display output one screen at a time	
-At the moment, even when the more command is active, it allows usage of other linux commands
-When you do = for current line number, it displays it on the console but doesn't go away
-Need to capture the ENTER/return key. For now, just made it e

*/
var moreIncrement = 0;
function more(fileName)
{  
    var requestOpen = indexedDB.open("hashDirectory");
    requestOpen.onsuccess = function (event) {
        var db = this.result;
        db.onversionchange = function (event) {
            console.log("Closing databse for version change");
            db.close();
        }
        var transact = db.transaction([folderLocation], "readwrite");
        var store = transact.objectStore(folderLocation);
        var index = store.index("by_filename");

        moreFlag = 1;
        var request = index.get(fileName);
        request.onsuccess = function(){

            var splitFile = request.result.content.match(/.{1,129}/g);
            document.getElementById("filepath").innerHTML = "--more (" + Math.round(100 * (moreIncrement / splitFile.length)) + "%)--";
            var moreInput = contentin.innerText;
            contentin.innerText = "";
            inputbox.value = "";
            //variable that represents how much to print per screen
            var screenful = 5;

            if(moreIncrement === 0)
            {
            //Show initial amount comparable to screen size
                while((moreIncrement < screenful) && (moreIncrement < splitFile.length))
                {
                    commandOutput(splitFile[moreIncrement]+"\n");
                    moreIncrement = moreIncrement + 1;
                }
            }

            switch(moreInput)
            {
                //If input == space, Display next page/Next amount of text the browser can show/allowed to show
                //z is the same, however, any argument will become the new default. Is not implemented
                case "\u00A0": case "z":
                    var temp = moreIncrement;
                    while(moreIncrement < temp+screenful && moreIncrement < splitFile.length){
                        commandOutput(splitFile[moreIncrement]+"\n");
                        moreIncrement = moreIncrement + 1;
                    }
                    break;
                //Display next line, wrapped around screen, how do capture enter
                case "e":
                    commandOutput(splitFile[moreIncrement]+"\n");
                    moreIncrement = moreIncrement + 1;
                    break;
                //Skip forward k lines and then does SPACEBAR case, where k is defaulted to 1.
                case "s":
                    moreIncrement = moreIncrement + 1;
                    var temp = moreIncrement;
                    commandOutput("... skipping 1 line\n");
                    while(moreIncrement < temp+screenful && moreIncrement < splitFile.length){
                        commandOutput(splitFile[moreIncrement]+"\n");
                        moreIncrement = moreIncrement + 1;
                    }
                    break;
                //display next file? Google says Skip forward k screenfuls of text. Defaults to 1.
                // Made it do basically the same thing with "s", but with the screenful part.
                case "f":
                    var arrCount = 1;
                    moreIncrement = moreIncrement + screenful;
                    var temp = moreIncrement;
                    commandOutput("... skipping 1 screenful of text\n");
                    while(moreIncrement < temp+screenful && moreIncrement < splitFile.length){
                        commandOutput(splitFile[moreIncrement]+"\n");
                        moreIncrement = moreIncrement + 1;
                    }
                    console.log("Display next file");
                    break;
                //quit
                case "q": case "Q":
                    moreInput = "q";
                    break;
                //Shows current file name and current line number
                case ":f":
                    commandOutput("Current file is: "+fileName+" Current line number is: "+moreIncrement+"\n");
                    break;
                //show available commands
                case "?": case "h":
                    commandOutput("-------------------------------------------------\n");
                    commandOutput("? or H - Shows Help page\n");
                    commandOutput("SPACEBAR or z - Display next page. With z, any argument becomes new default\n");
                    commandOutput("ENTER(e for now) - Display next line\n");
                    commandOutput("s - Skips k lines where k is defaulted to 1\n");
                    commandOutput("f - Display next file\n");
                    commandOutput("q or Q - quit more command\n");
                    commandOutput(":f - show current file and line number\n");
                    commandOutput("= - show current line number\n");
                    commandOutput("-------------------------------------------------\n");
                    break;
                //show current line number
                case "=":
                    commandOutput("THE CURRENT LINE NUMBER IS: "+moreIncrement+"\n");
                    break;
            }// ENd "more" switch loop
            if(moreInput === "q" || moreIncrement >= splitFile.length)
            {
                document.getElementById("filepath").innerHTML = "C:\\Interrobang>";
                moreIncrement = 0;
                moreFlag = 0;
            }
            else
            {
                setTimeout(function(){
                    more(fileName);
                }, 10);
            }
        }
    }
}//END more function

/** 
Display the process and the state of each running process
*/
function ps()
{
    var errorCode = 0;
    var result = "";
    try {
        for(var i = 0; i<statesQueue.length; i++)
            result += "Process "+statesQueue[i].processName + " is currently "
                    + statesQueue[i].process+"\n" ;
        result += "Process ps is currently Running";
        commandOutput(result);
    }
    catch(err) {
        errorCode = -1;
    }
    return result;
}

function script(fileName){
    var requestOpen = indexedDB.open("hashDirectory");
    requestOpen.onsuccess = function (event) {
        var db = this.result;
        db.onversionchange = function (event) {
            console.log("Closing databse for version change");
            db.close();
        }
        setTimeout(function() {
            var transact = db.transaction(["Results"]);
            var store = transact.objectStore("Results");
            var index = store.index("by_filename");
            var request = index.get(fileName);
            request.onsuccess = function(event) {
                try {
                    commands = request.result.content.split(",")
                    commandOutput("<>.Script Commands: " + commands +  ".<>\n");

                    // Checking for valid script file from directory.
                    if (commands[0].indexOf("run:") >= 0){
                        for (var i = 0; i < commands.length; i++){
                            command = commands[i].replace(/\s*run:\s*/, '');
                            osCMD(command);
                        }
                    }
                    else{
                        commandOutput("This file contains invalid commands.\n")
                    }
                } 
                catch(err) {
                    script(fileName);
                }
            }
        },1250);
    }
}

/**
Terminate current running process
*/
function kill(processName)
{
    var errorCode = 0;
    try{
        switch(processName){
            case "contactp":
                for(var i = 0; i<statesQueue.length; i++){
                    if (statesQueue[i].processName === "ContactManager") {
                        statesQueue.splice(i, 1);
                        arrWorker[i].terminate();
                        arrWorker.splice(i, 1);
                    }
                }
                commandOutput("Killed the process\n");
                break;
            case "bankp":
                for(var i = 0; i<statesQueue.length; i++){
                    if (statesQueue[i].processName === "BankProcess") {
                        statesQueue.splice(i, 1);
                        arrWorker[i].terminate();
                        arrWorker.splice(i, 1);
                    }
                }
                commandOutput("Killed the process\n");
                break;
            case "passwordp":
                for(var i = 0; i<statesQueue.length; i++){
                    if (statesQueue[i].processName === "PasswordProcess") {
                        statesQueue.splice(i, 1);
                        arrWorker[i].terminate();
                        arrWorker.splice(i, 1);
                    }
                }
                commandOutput("Killed the process\n");
                break;
            case "readp":
                for(var i = 0; i<statesQueue.length; i++){
                    if (statesQueue[i].processName === "ReadProcess") {
                        statesQueue.splice(i, 1);
                        arrWorker[i].terminate();
                        arrWorker.splice(i, 1);
                    }
                }
                commandOutput("Killed the process\n\n");
                break;
            case "vectorp":
                for(var i = 0; i<statesQueue.length; i++){
                    if (statesQueue[i].processName === "VectorProcess") {
                        statesQueue.splice(i, 1);
                        arrWorker[i].terminate();
                        arrWorker[i] = undefined;
                        arrWorker.splice(i, 1);
                    }
                }
                commandOutput("Killed the process\n");
                break;
            case "statsp":
                for(var i = 0; i<statesQueue.length; i++){
                    if (statesQueue[i].processName === "StatsProcess") {
                        statesQueue.splice(i, 1);
                        arrWorker[i].terminate();
                        arrWorker.splice(i, 1);
                    }
                }
                commandOutput("Killed the process\n");
                break;
            case "scriptp":
                for(var i = 0; i<statesQueue.length; i++){
                    if (statesQueue[i].processName === "ScriptCreatorProcess") {
                        statesQueue.splice(i, 1);
                        arrWorker[i].terminate();
                        arrWorker.splice(i, 1);
                    }
                }
                commandOutput("Killed the process\n");
                break;
            case "starterp":
                for(var i = 0; i<statesQueue.length; i++){
                    if (statesQueue[i].processName === ("StarterProcess" || "MathsProcess" || "StatsMatherProcess")) {
                        statesQueue.splice(i, 1);
                        arrWorker[i].terminate();
                        arrWorker.splice(i, 1);
                    }
                }
                commandOutput("Killed the process\n");
                break;
            case "charwatchp":
                for(var i = 0; i<statesQueue.length; i++){
                    if (statesQueue[i].processName === "CharWatchProcess") {
                        statesQueue.splice(i, 1);
                        arrWorker[i].terminate();
                        arrWorker.splice(i, 1);
                        defaultStart -= 1;
                    }
                    charWatchInfo.charWatchFlag = false;
                }
                commandOutput("Killed the process\n");
                break;
            case "sleepp":
                for(var i = 0; i<statesQueue.length; i++){
                    if (statesQueue[i].processName === ("SleepProcess")) {
                        statesQueue.splice(i, 1);
                        arrWorker[i].terminate();
                        arrWorker.splice(i, 1);
                    }

                    if (statesQueue[i].processName === ("SignalProcess")) {
                        statesQueue.splice(i, 1);
                        arrWorker[i].terminate();
                        arrWorker.splice(i, 1);
                    }
                }
                commandOutput("Killed the process\n");
                break;
            case "philp":
                for(var i = 0; i<statesQueue.length; i++){
                    if (statesQueue[i].processName === "PhilosopherProcess") {
                        statesQueue.splice(i, 1);
                        arrWorker[i].terminate();
                        arrWorker.splice(i, 1);
                        defaultStart -= 1;
                    }
                }
                commandOutput("Killed the process\n");
                break;
            case "consumep":
                for(var i = 0; i<statesQueue.length; i++){
                    if (statesQueue[i].processName === "ConsumeProcess") {
                        statesQueue.splice(i, 1);
                        arrWorker[i].terminate();
                        arrWorker.splice(i, 1);
                        defaultStart -= 1;
                    }
                }
                clearInterval(stopInterval);
                commandOutput("Killed the process\n");
                break;
            default:
                commandOutput("There was no process to kill.\n");
        }
    }catch(err){
        errorCode = -1;
    }    
    return errorCode;
}
