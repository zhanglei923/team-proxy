//说明，这是离线开发的server
var express = require('express');
var exec = require('child_process');
var app = express();
var fs = require('fs');
var https = require('https');
var http = require('http');
var URL = require('url');
var pathutil = require('path');
var bodyParser = require('body-parser')
var _ = require('lodash')

var privateKey = fs.readFileSync('./sslKey/private.pem','utf8');
var certificate = fs.readFileSync('./sslKey/file.crt','utf8');

var credentials = {key: privateKey, cert: certificate};
var httpServer = http.createServer(app);
var httpsServer = https.createServer(credentials, app);

var PORT = 666;
var SSLPORT = 443;

// app.use(bodyParser.urlencoded({ extended: false }))
// app.use(bodyParser.json())

app.use(bodyParser.json({limit: '100mb'}));
app.use(bodyParser.urlencoded({limit: '100mb', extended: true}));



app.all('*', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    //res.header("Access-Control-Allow-Credentials", true);
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
    //res.header("Content-Type", "application/json;charset=utf-8");
    next();
});
//全局拦截器
app.use(function (req, res, next) {
    res.set('Cache-Control', 'no-cache')
    res.set('About-rk-offlinedev', 'This Is Mocking Data!');
    console.dir(req.path);
    next();
});
//静态资源转接到web
let webPath = pathutil.resolve(__dirname, './website')
app.use('/aaa', express.static(webPath));//注意：必须在全局拦截器之后，否则拦截器无法运行
app.use('/bbb', express.static(pathutil.resolve(__dirname, '../rk-offlinedev')));//注意：必须在全局拦截器之后，否则拦截器无法运行

var server = httpServer.listen(PORT, function() {
    var host = server.address().address;
    var port = server.address().port;
    
    console.log('HTTP http://localhost:%s', port);
    //exec.exec('start http://localhost:'+port);
});
httpsServer.listen(SSLPORT, function() {
    console.log('HTTPS: https://localhost:%s', SSLPORT);
    console.log('----------')
});
//});


