module.exports = {
    OTRS_URL: "http://192.168.10.2/otrs",
    OTRS_GET_TICKET: "http://192.168.10.2/otrs/nph-genericinterface.pl/Webservice/Rest/Ticket",
    REST_NAME: "Rest",
    USER: 'root@localhost',
    PASS: '1001',
    ticket: {
        user: "",
        chatId: "",
        type: "",
        cancel: {
            by: "",
            cod:"",
            reason:"",
            date:""
        },
        problem: "",
    }
}
