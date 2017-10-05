const defines = require("./defines");

exports.ConfigNewTicket = {
    options: {
        method: 'POST',
        uri: `${defines.OTRS_URL}/nph-genericinterface.pl/Webservice/${defines.REST_NAME}/Ticket?UserLogin=${defines.USER}&Password=${defines.PASS}`,
        headers: {
            'Content-Type': 'application/json'
        }
    }
}
exports.ConfigGetTicket = {
    options: {
        method: 'GET',
        uri: `${defines.OTRS_URL}/nph-genericinterface.pl/Webservice/${defines.REST_NAME}/Ticket`,        
    }
}
exports.defines = defines;