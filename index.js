'use strict'
console.log(this)
const Telegram = require('telegram-node-bot')
const nodemailer = require('nodemailer');
const sendEmail = require('./sendEmail')

const TelegramBaseController = Telegram.TelegramBaseController
const TextCommand = Telegram.TextCommand

const TOKEN = `302440081:AAHAVDIXPSM_qqjk-viS3XLwd2owSScmCZs`
const chatbot = new Telegram.Telegram(TOKEN)

const newCalled = {
  user: "",
  type: "",
  priority: "",
  problem: ""
};

const verifyCalled = ($) => {
  $.sendMessage('Descreva seu problema:')
  $.waitForRequest.then($ => {
    $.sendMessage(`"${$.message.text}"\n`)
    newCalled.problem = $.message.text
    newCalled.user = `${$.message.chat.firstName} ${$.message.chat.lastName}`
    checkConfirmation($)
  })
}

const checkConfirmation = ($) => {
  $.runForm(form, (result) => {
    if(result.confim == 'Sim' || result.confim == 'sim'){
      sendEmail(nodemailer, newCalled)
      $.sendMessage('Chamado confimado! Em breve, entraremos em contato com você.')
      newCalled.user = ""
      newCalled.type = ""
      newCalled.priority = ""
      newCalled.problem = ""
    }else{
      $.sendMessage('Chamado cancelado!\nPara abrir um novo chamado digite /start')
    }
  })
}

const form = {
  confim: {
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
}

class MainController extends TelegramBaseController {
  mainAction($) {
    $.runMenu({
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
  get routes() {
    return {
      'novoChamado': 'mainAction',
    }
  }
}

chatbot.router.when(
  new TextCommand('/start', 'novoChamado'), new MainController()
)