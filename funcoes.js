const express = require('express');

const bodyParser = require('body-parser');

const request = require('request');

const url = require("url");

const app = express();

app.use(bodyParser.json());

app.get('/note/:id',(req, res) => {
	res.writeHead(200);
	let q = url.parse(req.url, true);

	let response = {};

	response.process = "new.note";
	response.id = req.params.id;
	response.data = q.query;

	request.get(`http://192.168.10.2/otrs/nph-genericinterface.pl/Webservice/Test/Ticket/${response.id}?UserLogin=eduardo.almeida&Password=123456&Queue=ATendimento`,(err,res,body) => {
		response.body = body;
		console.log(response);
	})

	res.end();
})
app.get('/new/:id', (req, res) => {
	res.writeHead(200);
	let q = url.parse(req.url, true);
	let response = {};
	response.process = "new.ticket";
	response.id = req.params.id;
	response.data = q.query;
	console.log(response);
	res.end();
})

app.listen(8080);
