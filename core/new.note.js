const {ConfigNewNote} = require("./config");
const request           = require("request");
/**
 * @param {object} ticket The Object Ticket
 */

module.exports = (note,ticket) => {
    return new Promise((resolve,reject) => {

        console.log(ticket);


        let _ticket = {
            "TicketID": note.ID,
            "ArticleTypeID": "1",
            "SenderType": "agent",            
            "From": "Telegram BOT",
            "Charset": 'iso-8859-15',
            "MimeType": 'text/plain',
            "Article": {
                "Subject":`NOTA: <${ticket.user}>`,
                "Body":`${note.text}`,
                "ContentType":"text/html; charset=utf8"
            },
            "UserID": "8",
        }
        
        let opts = ConfigNewNote(note.ID);
        
        opts.body = JSON.stringify(_ticket);

        
        request(opts, (err,res,body) => {
            console.log(body);
            body = JSON.parse(body);
            (body.ArticleID) ?
                resolve(body.ArticleID)
            :
                reject(body)
        })
    })
}