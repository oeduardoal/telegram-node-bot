const { ConfigNewTicket, ConfigGetTicket, defines } = require("./config");
const request           = require("request");

/**
 * @param {object} ticket The Object Ticket
 */

module.exports = (data) => {
    return new Promise((resolve,reject) => {

        let id = data.TicketID;
        
        ConfigGetTicket.options.uri = `${ConfigGetTicket.options.uri}/${id}?`;

        request.get(`${ConfigGetTicket.options.uri}`, {qs:{UserLogin: `${defines.USER}`,Password: `${defines.PASS}`}},
            (err,res,body) => {
            body = JSON.parse(body);
            (body.Ticket) ?
                resolve(body.Ticket[0])
            :
                reject(body)
        })
        
    })
}