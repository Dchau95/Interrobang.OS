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
                    case "dir":
                        break;
                    case "delete":
                    	deleteCMD(pointerOne);
                        break;
                    case "copy":
                    	copyCMD(pointerOne, pointerTwo);
                        break;
                    case "ps":
                        break;
                    case "kill":
                        break;
                    case "more":
                        break;
                    case "cat":
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