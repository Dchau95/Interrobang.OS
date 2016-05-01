function consume(){
    console.log("Starting Conusme Data");
    
    var errorCon = 0;
    
    var consumeResult = {
        consumeString : "copy_and_consume",
        processNumberI : e.data.nProcessID,
        errorCon : errorCon
    };
    
    postMessage(consumeResult);
    
}