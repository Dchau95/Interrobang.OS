function runCMD()
            {
                var userInput = document.getElementById("inputbox").value;
                var pointerOne = "";
                var pointerTwo = "";
                //perhaps switch to run case rather than 
                //display cmd input
                console.log(userInput);
                
                // Check if userInput contains space.
                if (userInput.indexOf(' ') >= 0) 
                {
                	var command = userInput.split(' ');
                	userInput = command[0];
                	pointerOne = command[1];
                	if (command.length == 3)
                		pointerTwo = command[2];
                }
                
                switch(userInput)
                {
                    case "clear":
                    	clearCMD();
                        break;
                    case "ls":
                    	lsCMD();
                        break;
                    case "man":
                        man();
                        break;
                    case "delete":
                    	deleteCMD(pointerOne);
                        break;
                    case "copy":
                    	copyCMD(pointerOne, pointerTwo);
                        break;
                    case "ps":
                        ps();
                        break;
                    case "kill":
                        kill(pointerOne);
                        break;
                    case "more":
                        more();
                        break;
                    case "cat":
                        cat(pointerOne);
                        break;
                    default:
                    	commandOutput("That is not a valid command.\n\n");
                    	break;
                }
            }
            
var hashDirectory = 
{
    "Dummy.CSV" : {
        szMode: "",
        nPosition: 0,
        nLength: 0,
        contents: []
    },
    "Dumb.CSV" : {
        szMode: "",
        nPosition: 0,
        nLength: 0,
        contents: []
    },
    "Dum.CSV" : {
        szMode: "",
        nPosition: 0,
        nLength: 0,
        contents: []
    },
};


function clearCMD()
{
    contentout.innerText = "";
}

function lsCMD()
{
    var keys = Object.keys(hashDirectory);
    for(var i = 0; i<keys.length; i++)
        commandOutput(keys[i]+"\n");
    commandOutput("\n");
}

function deleteCMD(fileName)
{
    if (hashDirectory[fileName] != null)
    {
        delete hashDirectory[fileName];
        lsCMD();
    }
    else
        commandOutput("File does not exist.\n");
}

function copyCMD(fileName, copyFileName)
{
    var val = 
    {
        szMode: "",
        nPosition: 0,
        nLength: 0,
        contents: []
    }

    hashDirectory[copyFileName] = val;
    hashDirectory[copyFileName].szMode = hashDirectory[fileName].szMode;
    hashDirectory[copyFileName].nPosition = hashDirectory[fileName].nPosition;
    hashDirectory[copyFileName].nLength = hashDirectory[fileName].nLength;
    hashDirectory[copyFileName].contents = hashDirectory[fileName].contents;
    lsCMD();
}

/**
Help manual
clear, ls or dir, delete, copy, ps, kill,
more, cat, man …
*/
function man()
{
    console.log("clear : Clear terminal screen");
    console.log("ls or dir : List directory contents");
    console.log("delete : Delete file");
    console.log("copy : Copy file");
    console.log("ps : Print process status");
    console.log("kills : Ends current process");
    console.log("more : Display output screen");
    console.log("cat : Display file content");
    console.log("man : Display help manuel");   
}

/**
Concatenate files and print on the standard output	
*/
/**compare array of "files passed in then print"
file elements matching hastable(array of files)
*/
function cat(arrFiles)
{
    for(var i=0; i < arrFiles.length; i++)
    {
        for(var keyName in hashDirectory)
        {
            if(arrFiles[i] == keyName)
                console.log(hashDirectory[keyName])
        }   
    }
}

/**
Display output one screen at a time	
*/
function more(moreInput)
{
        //wait for cmd input after more 
        //** wait for cmd input
    while(moreInput != "q" || moreInput != "Q")
    {
        switch(input)
        {
            //Display next page
            case SPACEBAR:
                break;
                
            //Display next line
            case ENTER:
                //** wait for ENTER cmd input
                while(enterInput)
                {
                    
                }
                break;
            //display next file
            case f:
                var arrCount = 1;
                while(arrDirectory.length != arrCount)
                {
                    //** wait for f cmd input
                    if(fInput == "f")
                    console.log(arrDirectory[i]);
                    arrCOunt++;
                    else if(fInput == "q")
                    break;
                }
                break;
                
            //quit
            case q:
                moreInput = "q";
                break;
                
            //show available commands
            case ?:
                console.log("SPACEBAR : Display next page");
                console.log("ENTER : Display next line");
                console.log("f : Display next file");
                console.log("q : quit more command");
                console.log("= : show line numbers");
                
                break;
                
            //show line numbers
            case =:
                break;

        }// ENd "more" switch loop
        moreInput = "q";
    }//End more input check
}//END more function

/** 
Display the process and the state of each running process
*/
function ps()
{
    for(var i = 1; statesQueue.length; i++)
        {
            console.log(arrDirectory[i] + " is currently "
                        + statesQueue[i].process);
        }
}

/**
Terminate current running process
*/
function kill(processName)
{
    switch(processName){
        case contact:
            statesQueue.splice(1, 1);
            arrWorker[1].terminate();
            arrWorker[1] = undefined;
            break;
        case bank:
            statesQueue.splice(2, 1);
            arrWorker[2].terminate();
            arrWorker[2] = undefined;
            break;
        case password:
            statesQueue.splice(3, 1);
            arrWorker[3].terminate();
            arrWorker[3] = undefined;
            break;
        case read:
            statesQueue.splice(4, 1);
            arrWorker[4].terminate();
            arrWorker[4] = undefined;
            break;
        case vector:
            statesQueue.splice(5, 1);
            arrWorker[5].terminate();
            arrWorker[5] = undefined;
            break;
        case stats:
            statesQueue.splice(6, 1);
            arrWorker[6].terminate();
            arrWorker[6] = undefined;
            break;
    }
}