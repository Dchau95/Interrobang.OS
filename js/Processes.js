var hashProcesses = {
    "BankProcess": function () {
        var arr = [];
        var balance = 0;
            
        for (var i=0, t=99; i<t;i++)
        {
            var num = Math.floor(Math.random()*200) + 1; // this will get a number between 1 and 200
            num *= Math.floor(Math.random()*2) == 1 ? 1 : -1; // this will add minus sign in 50% of cases
            arr.push(num)
        }
            
        for (var i=0;i<arr.length;i++)
        {
            balance += arr[i];
        }
    },
    "VectorCalculate" : function (vectorList)
    {
        var finalVector = [0, 0, 0];
        var components = [0, 0, 0];
        for (var i = 0; i < vectorList.length; i++)
        {
            var currentVector = vectorList[i].split(",");        
            for (var j = 0; j < 3; j++)
                components[j] = currentVector[j].match(/[-]|[.]|\d/g).join("");        
            for (var k = 0; k < 3; k++)
                finalVector[k] += parseFloat(components[k]);
        }
        return "<" + finalVector + ">";
    },
    "Statistics": function () {
        function getMin(){
            var minimum = 999;
            for (var i = 0; i < statInfo.length; i++){
                if(statInfo[i] <= minimum){
                    minimum = statInfo[i];
                }
            }
        }
            
        function getMean(){
            var mean = 0;
            for (var i = 0; i < statInfo.length; i++){
                mean += statInfo[i];
            }
            mean /= statInfo.length + 1;
        }
        
        function getMode(){
            var counter = {};
            var mode = [];
            var max = 0;
            for (var i in statInfo) {
                if (!(statInfo[i] in counter))
                    counter[statInfo[i]] = 0;
                counter[statInfo[i]]++;

                if (counter[statInfo[i]] == max) 
                    mode.push(statInfo[i]);
                else if (counter[statInfo[i]] > max) {
                    max = counter[statInfo[i]];
                    mode = [statInfo[i]];
                }
            }
        }
        function getMedian(){
            median = statInfo[statInfo.length/2]
        }
        
        function getMax(){
            var maximum = 0;
            for (var i = 0; i < statInfo.length; i++){
                if(statInfo[i] > maximum){
                    maximum = statInfo[i];
                }
            }
        }
    },
    
    "ContactManager": function (aryContactCsv){
        "use strict";
        var szContact = "Matt Wischoff";
        var nIndex;
        for (nIndex = 0; nIndex < aryContactCsv.length; nIndex++) {
            if (szContact === aryContactCsv[nIndex]) {
                return szContact;
            }
        }
    },
    
    "PasswordChanger": function passwordChanger(usrpwdlist, username, password){
	   var delimiters = /[,/:]/;
	   var usrpwdsplit = usrpwdlist.split(delimiters);
	   var returnstr = "";
	   for (i = 0; i < usrpwdsplit.length; i+= 2 ){
           if (usrpwdsplit[i] == username){
               usrpwdsplit[i+1] = password;
           }
           returnstr = returnstr + usrpwdsplit[i] + ":" + usrpwdsplit[i+1] + ",";
	   }
	   return returnstr;
    },
    
    "ShortestPath": function () {
        function shortestPath(aryEdges, iNumVertices, startVertex) {
            var aryDone = new Array(iNumVertices);
            aryDone[startVertex] = true;
            var aryPathLengths = new Array(iNumVertices);
            var aryPredecessors = new Array(iNumVertices);
            for (var i = 0; i < iNumVertices; i++) {
                aryPathLengths[i] = aryEdges[startVertex][i];
                if (aryEdges[startVertex][i] != Infinity) {
                    aryPredecessors[i] = startVertex;
                }
            }
            aryPathLengths[startVertex] = 0;
            for (var i = 0; i < iNumVertices - 1; i++) {
            var closest = -1;
            var closestDistance = Infinity;
            for (var j = 0; j < iNumVertices; j++) {
                if (!aryDone[j] && aryPathLengths[j] < closestDistance) {
                    closestDistance = aryPathLengths[j];
                    closest = j;
                }
            }
            aryDone[closest] = true;
            for (var j = 0; j < iNumVertices; j++) {
                if (!aryDone[j]) {
                    var possiblyCloserDistance = aryPathLengths[closest] + aryEdges[closest][j];
                    if (possiblyCloserDistance < aryPathLengths[j]) {
                        aryPathLengths[j] = possiblyCloserDistance;
                        aryPredecessors[j] = closest;
                    }
                }
            }
        }
        return { "startVertex": startVertex,
            "aryPathLengths": aryPathLengths,
            "predecessors": aryPredecessors };
        }

        function constructPath(shortestPathInfo, endVertex) {
            var path = [];
            while (endVertex != shortestPathInfo.startVertex) {
                path.unshift(endVertex);
                endVertex = shortestPathInfo.aryPredecessors[endVertex];
            }
            return path;
        }
    },
    
    "ReadFile" : function (arrNum) {
        arrNum.sort(
            function () {
                if (first == second)
                    return 0;
                if (first < second)
                    return -2;
                else
                return 2; 
            })
    }
}