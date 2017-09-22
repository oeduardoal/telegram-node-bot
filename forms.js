forms = {
  formConfirmacao: {
    confirm: {
      q: 'Deseja confimar este chamado?\nSim/sim ou Não/não',
      error: 'Algo de errado não está certo.',
      validator: (message, callback) => {
        if(message.text) {
          callback(true, message.text)
          return
        }
        callback(false)
      }
    }
  },
  
  formIntroducao: {
    confirm: {
      q: 'Nos ajude a entender o problema. Escreva de forma clara mas não evite detalhes, eles serão importantíssimos para a resolução do problema. Vamos começar? Digite Sim/sim ou Não/não',
      error: 'Algo de errado não está certo.',
      validator: (message, callback) => {
        if(message.text) {
          callback(true, message.text)
          return
        }
        callback(false)
      }
    }
  }

}
module.exports = forms;