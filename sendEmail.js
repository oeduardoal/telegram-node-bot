module.exports = (nodemailer, bodyEmail) => {
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