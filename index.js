const Telegram    = require('telegram-node-bot')
const TelegramBaseController = Telegram.TelegramBaseController
const TextCommand = Telegram.TextCommand
const request     = require("request");

const OTRS        = require("./core");
const { ticket }  = require("./core");

const TOKEN = `445113487:AAE8FET984QpOTsLIqEMZTMpRH2NUkAO6v4`


//const TOKEN = `457248917:AAHTK6Ec5gLbuTj5lvFKyL6hlGZEPGhpozQ`

const chatbot = new Telegram.Telegram(TOKEN,{
  workers: 8
})


class MainController extends TelegramBaseController {

    checkConfirmation($){

      let mess;
      (ticket.type == "Cancelamento de Nota")
      ?
      mess = `Você criou um chamado para ${ticket.type}\n${ticket.cancel.by}: ${ticket.cancel.cod}\nMotivo: ${ticket.cancel.reason}\nData de entrega: ${ticket.cancel.date}`
      :  
      mess = `Você criou um chamado para ${ticket.type}\nProblema: ${ticket.problem}`

      $.sendMessage(mess);

      setTimeout(function() {
        $.sendMessage(`Deseja enviar o chamado? Sim/sim ou Não/não`);
      }, 1500);
      $.waitForRequest
      .then(($) => {
        if($.message.text == "Sim" || $.message.text == "sim"){
          OTRS.newTicket(ticket)
          .then((data) => {
            console.log(data);
            $.sendMessage(`Seu chamado foi criado!\n\n[TICKET#${data.TicketNumber}|${data.TicketID}] - ${ticket.type} (TELEGRAM)`);
            OTRS.getTicket(data.TicketID)
            .then((dat) => {
              console.log(dat);
              $.sendMessage(`Sua mensagem foi anexada ao chamado! \n\n${dat.Article[0].Body}`);
            })
            .catch((er) => {
              console.log("Reject",er);
            })
          })
          .catch((err) => {
            console.log("Reject",err);
          })

        }else{
          $.sendMessage("Cancelado! \n\n/novochamado - para iniciar um novo chamado")
        }
      })
    }

    getThedate($){
      $.sendMessage("Entre com a data de entrega\nNeste formato dd/mm/yyyy");
      $.waitForRequest
      .then($ => {
          let regExp = /^(0[1-9]|[1-2]\d|3[0-1])\/(0[1-9]|1[0-2])\/\d{4}$/;
          if(!regExp.test($.message.text)){
            this.getThedate($);
          }
          else{
            ticket.cancel.date = $.message.text;
            this.getReasonCancellation($);
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

    getReasonCancellation($){
      let menu = [
        {
          text: 'Nota Denegada',
          callback: (callbackQuery, message) =>{
              ticket.cancel.reason = "Nota denegada";
              this.checkConfirmation($)
          }
        },
        {
          text: 'Outra',
          callback: (callbackQuery, message) =>{
            let data = { chat_id: $.chatId, message_id: message.messageId };
      
            $.api.editMessageText("Digite o motivo especifico: ", data);
            $.waitForRequest
            .then($ =>{
              ticket.cancel.reason = $.message.text;
              this.checkConfirmation($)
            })
          }
        }
      ];
      return $.runInlineMenu({
        layout: 2,
        oneTimeKeyboard: true,
        method: 'sendMessage',
        params: ['Especifique o motivo do cancelamento: '],
        menu: menu
      })
    }

    getCode($,message,str){

      let data = { chat_id: $.chatId, message_id: message.messageId };
      
      $.api.editMessageText(str, data);
      $.waitForRequest
      .then($ => {
          ticket.cancel.cod = $.message.text;
          this.getThedate($);
          
      })
    }

    selectType($){
      const menuType = [
            {
                text: 'Suporte',
                callback: (callbackQuery, message) => {
                  ticket.type = "Suporte"
                  let data = { chat_id: $.chatId, message_id: message.messageId };
                  $.api.editMessageText(`Um novo chamado de ${ticket.user} para ${ticket.type}`, data);
                  this.getProblem($);
                }
            },
            {
              text: 'Desenvolvimento',
                callback: (callbackQuery, message) => {
                  ticket.type = "Desenvolvimento"
                  let data = { chat_id: $.chatId, message_id: message.messageId };
                  $.api.editMessageText(`Um novo chamado de ${ticket.user} para ${ticket.type}`, data);
                  this.getProblem($);
                }
            },
            {
              text: 'Cancelamento de Nota',
              message: 'Enviar Código para cancelamento: ',
              layout: 2,
              menu: [
                  {
                      text: 'do pedido',
                      callback: (callbackQuery, message) => {
                        ticket.cancel.by = "Pedido";
                        ticket.type = "Cancelamento de Nota";
                        
                        this.getCode($,message,"Digite o codigo do pedido: ");
                      }
                  },
                  {
                      text: 'da nota',
                      callback: (callbackQuery, message) => {
                        ticket.cancel.by = "Nota";
                        ticket.type = "Cancelamento de Nota";
                        
                        this.getCode($,message,"Digite o codigo da nota: ");
                      }
                  }
              ]
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

      ticket.user = `${$.message.from.firstName} ${$.message.from.lastName}`;
      ticket.chatId = $.message.chat.id;

      if($.message.replyToMessage != null){

        let note = {};

        let teste = "";
        let p1 = $.message.replyToMessage.text.split("|");
        let TicketID = p1[1].split("]")[0];
        
        note.ID = TicketID;
        note.text = $.message.text;
        
        (TicketID) ? 
          OTRS.newNote(note,ticket)
          .then((data) => {
            $.sendMessage("Sua mensagem foi enviada!");
          })
          .catch((err) => {
            console.log(err);
          })
        :
          $.sendMessage("Sua mensagem foi enviada!");
        


        // console.log($.message.replyToMessage.text)
        // console.log($.message.text)
        // $.sendMessage("Mensagem enviada");
      }else{
        this.helpList($);
      }
      // console.log($.message.replyToMessage.text)
      // console.log($.message.text)
      // $.sendMessage("Não entendi o que você disse...",{reply_markup: JSON.stringify({force_reply: true})});
      
    }

    teste($){
      ticket.user = `${$.message.from.firstName} ${$.message.from.lastName}`;
      ticket.chatId = $.message.chat.id;
      
      OTRS.newTicket(ticket)
      .then((data) => {
        console.log(data);
        $.sendMessage(`Seu chamado foi criado!\n\n[TICKET#${data.TicketNumber}|${data.TicketID}] - ${ticket.type} (TELEGRAM)`);
        OTRS.getTicket(data.TicketID)
        .then((dat) => {
          console.log(dat);
          $.sendMessage(`Sua mensagem foi anexada ao chamado! \n\n${dat.Article[0].Body}`);
        })
        .catch((er) => {
          console.log("Reject",er);
        })
      })
      .catch((err) => {
        console.log("Reject",err);
      })
    }

  get routes() {
    return {
      'startCommand': 'listCommands',
      'newTicketCommand' : 'mainAction',
      'problemCommand' : 'getProblem',
      'testCommand'     : 'teste'
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
.when(
  new TextCommand('/teste', 'testCommand'), new MainController()
)

.otherwise(new MainController())

