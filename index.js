'use strict'

const Telegram    = require('telegram-node-bot')
const nodemailer  = require('nodemailer');
const sendEmail   = require('./sendEmail')
const forms       = require('./forms');
const menus       = require('./menus');
const TelegramBaseController = Telegram.TelegramBaseController
const TextCommand = Telegram.TextCommand
const TOKEN = `445113487:AAG6rCYhk2HGcbvqG1KQIXKlmtyI4vR-5Os`
const chatbot = new Telegram.Telegram(TOKEN,{
  workers: 2
})
const ticket = {
  user: "",
  type: "",
  priority: "",
  problem: "",
};
class MainController extends TelegramBaseController {

    checkConfirmation($){
    }

    selectType($){
      let menu = [
            {
              text: 'Suporte', 
                callback: (callbackQuery, message) => {
                    ticket.type = "Suporte"
                }
            },
            {
              text: 'Desenvolvimento', 
                callback: (callbackQuery, message) => {
                  ticket.type = "Desenvolvimento"
                }
            },
            {
              text: 'Cancelamento de Nota', 
                callback: (callbackQuery, message) => {
                  ticket.type = "Cancelamento de nota"
                  // Cod pedido
                    // ou
                  // Cod nota
                  // Data
                  // Motivo - Denegada ou Outro
                }
            }
      ]
      return $.runInlineMenu({
        layout: 2,
        method: 'sendMessage',
        params: ['text'],
        menu: menu
      })
    }

    newTicket($){
      this.selectType($);
    }

    helpList($){
      $.sendMessage("Não entendi o que você quis dizer. Mas tudo bem, podemos começar de novo. \n\n /start - para iniciar um novo chamado ")
    }

    mainAction($){
      $.sendMessage("Nos ajude a entender o problema. Escreva de forma clara mas não evite detalhes, eles serão importantíssimos para a resolução do problema. Vamos começar? Digite Sim/sim ou Não/não");
        $.runMenu({
          message: 'Selecione:',
          layout: [1,1,1,1],
          'Sim': () => {
            this.helpList($)
          },
          'Não': () => {}, 
      })
    }

    handle($){
      this.helpList($);
    }

  get routes() {
    return {
      'startCommand': 'mainAction',
      'helpCommand': 'helpList'
    }
  }
}

class StopController extends TelegramBaseController{

  mainAction($){
    ticket.user = "";
    $.sendMessage("Tudo bem! Esse chamado foi cancelado... Nada será enviado. Deseja começar um novo? Sim/sim ou Não/não")
    $.waitForRequest.then($ => {
      if($.message.text == "Sim" || $.message.text == "sim"){
          $.sendMessage("Chamado aberto novamente. /start")
      }else{
          $.sendMessage("Até mais.")
      }    
    })

  }
  get routes() {
    return {
      'stopCommand': 'mainAction',
      'helpCommand': 'helpList'
    }
  }
}

chatbot.router
.when(
  new TextCommand('/start', 'startCommand'), new MainController()
)
.when(
  new TextCommand('/stop', 'stopCommand'), new StopController()
)
.otherwise(new MainController())

