var express = require('express');
var fs = require('fs');
var app = express();

app.use(express.static(__dirname + '/..'));

app.get('/', function(req, res) {
  fs.readFile(__dirname + '/index.html', 'utf8', function(err, text){
    res.send(text);
  });
});

app.get('/api', function(req, res){
  res.json({
    data: {
      title: 'Demo API'
    },
    links: [
      {rel: 'tasks', href: '/api/tasks'}
    ]
  });
});

app.listen(3000);
console.log('Listening on port 3000');
