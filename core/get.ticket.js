const { ConfigNewTicket, ConfigGetTicket, defines } = require("./config");
const request           = require("request");

/**
 * @param {object} ticket The Object Ticket
 */

module.exports = (data) => {
    return new Promise((resolve,reject) => {

        let id = data.TicketID;
        
        ConfigGetTicket.options.uri = `${ConfigGetTicket.options.uri}/${id}?UserLogin=${defines.USER}&Password=${defines.PASS}`;

        request(ConfigGetTicket,(err,res,body) =>{
            body = JSON.parse(body);
            (body.Ticket) ?
                resolve(body)
            :
                reject(body)
        })
        
    })
}