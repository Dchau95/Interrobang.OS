var hashProcessStates = {
    Ready : "Ready",
    Waiting : "Waiting",
    Running : "Running",
    Starting : "Starting",
    Stopping : "Stopping"
};
var szCurrentState = hashProcessStates.Ready;
var nProgramCounter = 0;
var response = null;

