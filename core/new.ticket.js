const {ConfigNewTicket} = require("./config");
const request           = require("request");
/**
 * @param {object} ticket The Object Ticket
 */

module.exports = (ticket) => {
    return new Promise((resolve,reject) => {

//        ticket.type = "Suporte";
        // ticket.user = "Eduardo";
  //      ticket.problem = "sadsadsadsadsasd";

        let _ticket = {
                "Ticket": {
                    "Title":`${ticket.type} (TELEGRAM)`, 
                    "Type":`${ticket.type}`, 
                    "Queue":"Atendimento",
                    "State":"open",
                    "Priority":"1 Normal",
                    "CustomerUser":"telegram.user",
                },
                "Article":{
                    "Subject":`NOTA: <${ticket.user}> ${ticket.type}`,
                    "Body":"This is only a test",
                    "ContentType":"text/html; charset=utf8"
                },
                "DynamicField": [
                    {
                        "Name": 'CHATID',
                        "Value": `${ticket.chatId}`,
                    }
                ]
        }
        
        if(ticket.type == "Cancelamento de Nota"){
            _ticket.Article.Body = `<b>Nome do Usuário:</b> ${ticket.user}<br>
                                    <b>Chat ID:</b> ${ticket.chatId}<br>
                                    <b>Tipo de Chamado:</b> ${ticket.type}<br>
                                    <b>Motivo:</b> ${ticket.cancel.reason}<br>
                                    <b>Código (${ticket.cancel.by})</b>: ${ticket.cancel.cod}<br>
                                    <b>Data de Entrega: </b> ${ticket.cancel.date}`
        }else{
            _ticket.Article.Body = `<b>Nome do Usuário:</b> ${ticket.user}<br>
                                    <b>Chat ID:</b> ${ticket.chatId}<br>
                                    <b>Tipo de Chamado:</b> ${ticket.type}<br>
                                    <b>Problema:</b> \n ${ticket.problem} \n<br>`
        }

        ConfigNewTicket.options.body = JSON.stringify(_ticket);

            request(ConfigNewTicket.options,(err,res,body)=>{
                body = JSON.parse(body);
                (body.TicketID) ?
                    resolve(body)
                :
                    reject(body)
            });

    })
}
