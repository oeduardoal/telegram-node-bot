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
      setTimeout(function() {
        $.sendMessage(`Deseja enviar o chamado? Sim/sim ou Não/não`);
      }, 1500);
      $.waitForRequest
      .then(($) => {
        if($.message.text == "Sim" ||$.message.text == "sim"){
          sendEmail(nodemailer,ticket)
          $.sendMessage("Enviado! \n\n/novochamado - para iniciar um novo chamado")
        }else{
          $.sendMessage("Cancelado! \n\n/novochamado - para iniciar um novo chamado")
        }
      })
    }

    getProblem($){
      $.sendMessage("Tudo bem, agora descreva o problema: ");
      $.waitForRequest
      .then($ => {
          ticket.problem = $.message.text;
          this.checkConfirmation($);
      })
    }

    selectType($){
      const menuType = [
            {
                text: 'Suporte',
                callback: (callbackQuery, message) => {
                  ticket.type = "Suporte"
                  let data = { chat_id: $.chatId, message_id: message.messageId };
                  $.api.editMessageText(` Um novo chamado de ${ticket.user} para ${ticket.type}`, data);
                  this.getProblem($);
                }
            },
            {
              text: 'Desenvolvimento',
                callback: (callbackQuery, message) => {
                  ticket.type = "Desenvolvimento"
                  let data = { chat_id: $.chatId, message_id: message.messageId };
                  $.api.editMessageText(` Um novo chamado de ${ticket.user} para ${ticket.type}`, data);
                  this.getProblem($);
                }
            },
            {
              text: 'Cancelamento de Nota',
              callback: (callbackQuery, message) => {
                ticket.type = "Cancelamento de Nota";
                let data = { chat_id: $.chatId, message_id: message.messageId };
                $.api.editMessageText(` Um novo chamado de ${ticket.user} para ${ticket.type}`, data);
                $.sendMessage("Ainda em construção!")
                this.getProblem($);
              }
              // menu:
              // [
              //   {
              //         text: 'Sim!',
              //         callback: (callbackQuery, message) => {
              //           ticket.type = "Suporte";
              //           let data = { chat_id: $.chatId, message_id: message.messageId };
              //           $.api.editMessageText(` Um novo chamado de ${ticket.user} para ${ticket.type}`, data);
              //           this.getProblem($);
              //         }
              //     },
              //     {
              //         text: 'Voltar',
              //         callback: () => {
              //           this.selectType($);
              //         }
              //     }
              // ] 
            }
      ]
      return $.runInlineMenu({
        layout: 2,
        oneTimeKeyboard: true,
        method: 'sendMessage',
        params: ['Selecione um tipo de chamado: '],
        menu: menuType
      })
    }

    newTicket($){
      this.selectType($);
    }

    listCommands($){
      $.sendMessage("TIJUCA ALIMENTOS\n\nEsse BOT foi criado para dar agilidade a abertura de chamados junto a equipe de suporte. Use com cuidado! 😁 \n\n/novochamado - Pra iniciar um novo chamado!")
    }

    helpList($){
      $.sendMessage("Não entendi o que você quis dizer. Mas tudo bem, podemos começar de novo. \n\n /novochamado - para iniciar um novo chamado ")
    }

    mainAction($){
      
      ticket.user = `${$.message.from.firstName} ${$.message.from.lastName}`;
      ticket.chatId = $.message.chat.id;
      setTimeout(function(){
        $.sendMessage("Nos ajude a entender o problema. Escreva de forma clara mas não evite detalhes, eles serão importantíssimos para a resolução do problema. Vamos começar? Digite Sim/sim ou Não/não");
      },1500)

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
      'startCommand': 'listCommands',
      'newTicketCommand' : 'mainAction',
      'problemCommand' : 'getProblem',
    }
  }
}

chatbot.router
.when(
  new TextCommand('/start', 'startCommand'), new MainController()
)
.when(
  new TextCommand('/novochamado', 'newTicketCommand'), new MainController()
)
.when(
  new TextCommand('/getProblem', 'problemCommand'), new MainController()
)
.otherwise(new MainController())

