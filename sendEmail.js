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

  let mailOptions = {
      from: '"SUPORTE TI - MESSEJANA" <suporte@appstijuca.com.br>', 
      to: 'suporte@appstijuca.com.br', 
      'chat_id': `${ticket.chat_id}`,
      subject: `Novo Chamado via TELEGRAM - ${ticket.user}`,
      html: `
    <b>Nome do Usuário:</b> ${ticket.user}<br>
		<b>Chat ID:</b> ${ticket.chat_id}<br>
    <b>Tipo de Chamado:</b> ${ticket.type}<br>
    <b>Problema:</b> \n ${ticket.problem} \n<br>
    <b>Date:</b> ${ticket.sended_at}<br>
		`
  };

  // send mail with defined transport object
  transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
          return console.log(error);
      }
      console.log('Message %s sent: %s', info.messageId, info.response);

      return true
  });
}
