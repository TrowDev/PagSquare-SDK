
    
/**
 * Retorna a Data do instante informado no parametro.
 * @param ts TimeStamp para ser convertido em Data.
 */
function getDateByTimeStamp(ts: number, ajustarTimeStampZone?: boolean){
    if(ajustarTimeStampZone) {
        ts -= (60 * 60 * 3);
    }
    return new Date(ts * 1000);
}

function getTime() {
    return new Date().getTime();
}

export {
    getTime,
    getDateByTimeStamp
}