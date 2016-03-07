var hashDirectory = {
   "keyboard.CSV":q,w,e,r,t,y,u,i,o,p,a,s,d,f,g,h,j,k,l,z,x,c,v,b,n,m"
};
var resultFiles = [
  "resultKeyboard.CSV"
];

//Array of files for the processes to open
var arrDirectory = [
   "keyboard.CSV"
];

//Counter for which processes to go
var processNumberI = 0;

//Queue/array for the states of the processes
var statesQueue = [
   
    { process : "Starting", processID: 7, EOF: false},
   
];

//Array of workers
var arrWorker = [
    IOKeyboard = new Worker("keyboard.js"),
    
];

arrWorker[7].onmessage = function (e) {
    document.getElementById("output").innerHTML += "<p>Process 7 has responded with data</p>";
    if(e.data.result !== "undefined"){
        resultString[e.data.processNumberI] = e.data.result;
    }
    console.log("Result of worker 1 "+resultString[e.data.processNumberI]);
    os.endOfFile(e.data.processNumberI, arrDirectory[e.data.processNumberI]);
    console.log(statesQueue[e.data.processNumberI].EOF);
    if(e.data.result === "undefined"){
        os.close(arrDirectory[e.data.processNumberI], e.data.processNumberI);
        statesQueue[e.data.processNumberI].process = "Stopping";
    } else if (statesQueue[e.data.processNumberI].EOF ||  e.data.result !== "undefined") {
        document.getElementById("output").innerHTML += "<p>This is the end of the file for process 7</p>";
        console.log("This is the end of the file for process 1");
        statesQueue[e.data.processNumberI].process = "Stopping";
        os.close(arrDirectory[e.data.processNumberI], e.data.processNumberI);
        os.create(resultFiles[e.data.processNumberI], "Write");
        os.write(resultFiles[e.data.processNumberI], e.data.processNumberI, resultString[e.data.processNumberI]);
    }
    whileLoop();
};


**************************************************************************
//Seperate stuff

<!DOCTYPE html>
<html>
<body>

<form id="form1">
Name: <input name="name" type="text" size="25">
</form>
<button onclick="outputname()">Submit</button>
<script>

function outputname() {
var x,y,name,a,b,answer;
x=document.getElementById("form1") ;
y=x.elements["name"].value;
document.getElementById("demo").innerHTML= y


}

</script>


<p id="demo"></p>
</body>
</html>
