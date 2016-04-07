var db;

function openDb() {
    console.log("Opening DB...");
    //Opens DB with name of hashDirectory and version 1
    var request = indexedDB.open("hashDirectory", 1);
    
    //If DB already exists with same version then set db to that indexedDB
    //Also calls test function
    request.onsuccess = function (event) {
        db = this.result;
        console.log("Finished opening DB...");
        testDb();
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
        store.createIndex("by_filename", "filename");
        store.createIndex("by_content", "content");
    
        //add an entry to the "files" store
        store.put({filename: "Bank.CSV", content: "100, -50, 200, 300, -1000, 2000, 100, -50, 200, 300, -1000, 2000, 100, -50, 200, 300, -1000, 2000, 100, -50, 200, 300, -1000, 2000, 100, -50, 200, 300, -1000, 2000, 100, -50, 200, 300, -1000, 2000, 100, -50, 200, 300, -1000, 2000"});
    };
}

function testDb() {
    //create a transaction for the "files" store in readonly mode
    var transact = db.transaction(["files"]);
    var store = transact.objectStore("files");
    var index = store.index("by_filename");
    
    //get the content of Bank.CSV
    var request = index.get("Bank.CSV");
    request.onsuccess = function() {
        console.log(request.result.content);
    }
};

openDb();
