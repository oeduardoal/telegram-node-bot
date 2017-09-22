module.exports = () => {
  let menuEscolher = $.runMenu({
    layout: 2,
    message: 'Escolha o tipo de chamado:',
    oneTimeKeyboard: true,
    options: {
      parse_mode: 'Markdown'
    },
    'Chamado de suporte': {
      oneTimeKeyboard: true,
      layout: 2,
      message: 'Defina a prioridade do chamado:',
      
      'Normal': () => {
        verifyCalled($)
        newCalled.type = "Suporte"
        newCalled.priority = "Normal"
      },
      'Urgente': () => {
        verifyCalled($)
        newCalled.type = "Suporte"
        newCalled.priority = "Urgente"
      },
    },
    'Chamado de desenvolvimento': {
      oneTimeKeyboard: true,
      layout: 2,
      message: 'Defina a prioridade do chamado:',

      'Normal': () => {
        verifyCalled($)
        newCalled.type = "Desenvolvimento"
        newCalled.priority = "Normal"
      },
      'Urgente': () => {
        verifyCalled($)
        newCalled.type = "Desenvolvimento"
        newCalled.priority = "Urgente"
      },
    }
  })
}