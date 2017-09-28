module.exports = (nodemailer, ticket) => {
  let transporter = nodemailer.createTransport({
      host: 'email-ssl.com.br',
      port: 465,
      secure: true,
      auth: {
          user: 'suporte@appstijuca.com.br',
          pass: 'tijuca_2016_stp'
      }
  });

  let mailOptions = {};

    if(ticket.type == "Cancelamento de Nota"){
        mailOptions = {
            from: '"SUPORTE TI - MESSEJANA" <suporte@appstijuca.com.br>', 
            to: 'suporte@appstijuca.com.br', 
            'chatId': `${ticket.chatId}`,
            subject: `NOVO TICKET via TELEGRAM - ${ticket.user}`,
            html: `
          <b>Nome do Usuário:</b> ${ticket.user}<br>
          <b>Chat ID:</b> ${ticket.chatId}<br>
          <b>Tipo de Chamado:</b> ${ticket.type}<br>
          <b>Motivo:</b> ${ticket.cancel.reason}<br>
          <b>Código (${ticket.cancel.by})</b>: ${ticket.cancel.cod}<br>
          <b>Data de Entrega: </b> ${ticket.cancel.date}
              `
        };
    }else{
        mailOptions = {
            from: '"SUPORTE TI - MESSEJANA" <suporte@appstijuca.com.br>', 
            to: 'suporte@appstijuca.com.br', 
            'chatId': `${ticket.chatId}`,
            subject: `NOVO TICKET via TELEGRAM - ${ticket.user}`,
            html: `
          <b>Nome do Usuário:</b> ${ticket.user}<br>
          <b>Chat ID:</b> ${ticket.chatId}<br>
          <b>Tipo de Chamado:</b> ${ticket.type}<br>
          <b>Problema:</b> \n ${ticket.problem} \n<br>
              `
        };
    }

    console.log(mailOptions)
  // send mail with defined transport object
  transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
          return console.log(error);
      }

      console.log('Message %s sent: %s', info.messageId, info.response);

      return true
  });
}
