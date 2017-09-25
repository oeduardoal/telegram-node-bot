'use strict'

const Telegram    = require('telegram-node-bot')
const nodemailer  = require('nodemailer');
const sendEmail   = require('./sendEmail')
const forms       = require('./forms');
const menus       = require('./menus');
const TelegramBaseController = Telegram.TelegramBaseController
const TextCommand = Telegram.TextCommand
const TOKEN = `445113487:AAE8FET984QpOTsLIqEMZTMpRH2NUkAO6v4`
const chatbot = new Telegram.Telegram(TOKEN,{
  workers: 2
})
const ticket = {
  user: "",
  chatId: "",
  type: "",
  priority: "",
  problem: "",
};
class MainController extends TelegramBaseController {

    checkConfirmation($){
      $.sendMessage(`Você criou um chamado do tipo ${ticket.type} sobre o seguinte problema\n\n"${ticket.problem}"\n\n`);
      $.sendMessage(`Deseja enviar o chamado? Sim/sim ou Não/não`);
      $.waitForRequest
      .then(($) => {
        if($.message.text == "Sim" ||$.message.text == "sim"){
          sendEmail(nodemailer,ticket)
          $.sendMessage("Enviado!")
        }else{
          this.mainAction($);
          $.sendMessage("Cancelado!")
        }
      })
    }

    getProblem($){
        $.sendMessage("Descreva o problema: ");
        $.waitForRequest
        .then($ => {
            ticket.problem = $.message.text;
            this.checkConfirmation($);
        })
    }

    selectType($){
      let menu = [
            {
              text: 'Suporte', 
                callback: (callbackQuery, message) => {
                    ticket.type = "Suporte"
                    this.getProblem($)
                }
            },
            {
              text: 'Desenvolvimento', 
                callback: (callbackQuery, message) => {
                  ticket.type = "Desenvolvimento"
                  this.getProblem($)
                }
            },
            {
              text: 'Cancelamento de Nota', 
                callback: (callbackQuery, message) => {
                  ticket.type = "Cancelamento de nota"
                  this.getProblem($)
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

      $.sendMessage("Olá, esse BOT ajudará você a criar um novo chamado para o Suporte da TI.")
      setTimeout(function(){
        $.sendMessage("Nos ajude a entender o problema. Escreva de forma clara mas não evite detalhes, eles serão importantíssimos para a resolução do problema. Vamos começar? Digite Sim/sim ou Não/não");
      },3000)
      $.waitForRequest
      .then($ => {
          if($.message.text == "Sim" ||$.message.text == "sim"){
            this.newTicket($)
          }else{
            this.helpList($);
          }
      })

    }

    handle($){
      this.helpList($);
    }

  get routes() {
    return {
      'startCommand': 'mainAction',
    }
  }
}

chatbot.router
.when(
  new TextCommand('/start', 'startCommand'), new MainController()
)
.otherwise(new MainController())

