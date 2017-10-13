const { ConfigNewTicket, ConfigGetTicket, defines } = require("./config");
const request           = require("request");

/**
 * @param {object} ticket The Object Ticket
 */

module.exports = (id) => {
    return new Promise((resolve,reject) => {
        
        let opts = ConfigGetTicket(id);

        request.get(`${opts.uri}`, {qs:{UserLogin: `${defines.USER}`,Password: `${defines.PASS}`}},
            (err,res,body) => {
            body = JSON.parse(body);
            (body.Ticket) ?
                resolve(body.Ticket[0])
            :
                reject(body)
        })
        
    })
}

