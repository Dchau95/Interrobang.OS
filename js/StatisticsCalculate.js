function getMin(statInfo) {
    var minimum = 999;
    for (var i = 0; i < statInfo.length; i++){
        if(statInfo[i] <= minimum){
            minimum = statInfo[i];
        }
    }
}

function getMean(statInfo) {
    var mean = 0;
    for (var i = 0; i < statInfo.length; i++){
        mean += statInfo[i];
    }
    mean /= statInfo.length + 1;
}

function getMode(statInfo) {
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
function getMedian(statInfo) {
    var median = statInfo[statInfo.length/2]
}

function getMax(statInfo) {
    var maximum = 0;
    for (var i = 0; i < statInfo.length; i++){
        if(statInfo[i] > maximum){
            maximum = statInfo[i];
        }
    }
}

function calculateStatistics(statInfoCsv) {
    var statInfo = statInfoCsv.split(", ").map(Number);
    
    getMax(statInfo);
    getMedian(statInfo);
    getMode(statInfo);
    getMean(statInfo);
    getMin(statInfo);
} 