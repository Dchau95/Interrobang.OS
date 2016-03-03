var test = 
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
    
}

function lsCMD()
{
    var keys = Object.keys(hashDirectory);
    console.log(keys);
}

function deleteCMD(fileName)
{
    if (hashDirectory[fileName] != null)
        delete hashDirectory[fileName];
    else
        console.log("File does not exist");
};

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
};