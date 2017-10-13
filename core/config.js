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
exports.ConfigGetTicket = ((id) => {
    return {
        method: 'GET',
        uri: `${defines.OTRS_URL}/nph-genericinterface.pl/Webservice/${defines.REST_NAME}/Ticket/${id}`,        
    }
})

exports.ConfigNewNote = ((id) => {
    return {
        method: 'PATCH',
        uri: `${defines.OTRS_URL}/nph-genericinterface.pl/Webservice/${defines.REST_NAME}/Ticket/${id}?UserLogin=telegram.user&Password=1001`,      
    }
})

exports.defines = defines;