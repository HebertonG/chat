//tra  para a rota o express
const express = require('express');
//padrao do node
const path = require('path');

const app = express();
//define o protocolo http para ser acessada
const server = require('http').createServer(app);
//configuraçao do protocolo web socket
const io = require('socket.io')(server);

//defini a pasta onde fica os arguivos do front-end "publicos"
app.use(express.static(path.join(__dirname, 'public')));
//para entender a views como html
app.set('views', path.join(__dirname, 'public'));
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

// para renderizar o index quando iniciar
app.use('/', (req, res) => {
    res.render('index.html')
});

//array para guardar mensagem, pois não tem mongodb
let messages = [];

//toda vez que um novo conecar ele funciona
io.on('connection', socket => {
    //passa `Socket conectado` com o id
    console.log(`Socket conectado: ${socket.id}`);

    socket.emit('previousMessages', messages);

    //recebe e trata a mensagem
    socket.on('sendMessage', data => {
        messages.push(data);
        //"socket.broadcast.emit" emvia par todos conectado na conversa
        socket.broadcast.emit('receivedMessage', data);
    });
});

//abri na porta 3000
server.listen(3000);