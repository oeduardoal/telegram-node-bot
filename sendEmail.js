module.exports = (nodemailer, bodyEmail) => {
  let transporter = nodemailer.createTransport({
      host: 'server.server235.net',
      port: 465,
      secure: true,
      auth: {
          user: 'erp@tijucaalimentos.com.br',
          pass: 'erp_tijuca741852'
      }
  });

  let mailOptions = {
      from: '"Telegram Bot" <erp@tijucaalimentos.com.br>', 
      to: 'bibiano@tijucaalimentos.com', 
      subject: 'Chamado OTRS',
      html: `${bodyEmail.user}<br>${bodyEmail.problem}`
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