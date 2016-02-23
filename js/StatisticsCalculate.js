function getMin(statInfo) {
    var minimum = 999;
    for (var i = 0; i < statInfo.length; i++){
        if(statInfo[i] <= minimum){
            minimum = statInfo[i];
        }
    }
    return minimum;
}

function getMean(statInfo) {
    var mean = 0;
    for (var i = 0; i < statInfo.length; i++){
        mean += statInfo[i];
    }
    mean /= statInfo.length + 1;
    return mean;
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
    return mode;
}
function getMedian(statInfo) {
    return statInfo[statInfo.length/2];
}

function getMax(statInfo) {
    var maximum = 0;
    for (var i = 0; i < statInfo.length; i++){
        if(statInfo[i] > maximum){
            maximum = statInfo[i];
        }
    }
    return maximum;
}

function calculateStatistics(statInfoCsv) {
    console.log("Starting stats process");
    var statInfo = statInfoCsv.split(", ").map(Number);
    
    var max = getMax(statInfo);
    var median = getMedian(statInfo);
    var mode = getMode(statInfo);
    var mean = getMean(statInfo);
    var min = getMin(statInfo);
    console.log("Ending stats process");
    
    return "Maximum = "+max+" Medium = "+median+" Mode = "+mode+" Mean = "+mean+" Minimum = "min;
} 