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
      from: '"SUPORTE TI - MESSEJANA" <suporte@appstijuca.com.br>', 
      to: 'suporte@appstijuca.com.br', 
      subject: `Novo Chamado OTRS - ${bodyEmail.user}`,
      html: `
		Nome do Usuário: ${bodyEmail.user}<br>
		Problema: ${bodyEmail.problem}<br>
		Email: ${bodyEmail.email}
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
