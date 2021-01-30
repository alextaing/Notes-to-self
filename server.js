// requirements // npm install nodemon TO MAKE LIFE EASIER
const express = require('express'); // HAVE TO npm install express
const bodyParser = require('body-parser');
const mysql = require('mysql'); // HAVE TO npm install mysql

// constants
const app = express();
const port = 88;

// middleware
const urlEncodedParser = bodyParser.urlencoded({extended: false});

const jsonParser = app.use(bodyParser.json());

// set static path ()
app.use(express.static("public"));

// get
app.get("/", function(req, res, next) {
  app.sendfile(path.join(__dirname, "assets/index.html"));
});

// post
app.post('/send', function(req, res) {
  database.query('insert into blogentries (title, content, datetime) value(\"'+ req.body.title + '\", \"' + req.body.blogpost + '\", CURRENT_TIMESTAMP);',
  function(error){
    if (error) {throw error};
  });
  res.json("success");
});

app.post('/openingPage', function(req, res){
  database.query('SELECT * FROM blogentries', (error, data) => {
    if (error) {throw error};
    postdata = data;// how to make something the response.
    database.query('SELECT * FROM comments', (error, data) => {
      if (error) {throw error};
      commentdata = data;// how to make something the response.
      completeData = {
        postbody: postdata,
        commentbody: commentdata
      }
      res.json(completeData);
    });
  });
});

app.post('/delete', function(req, res){
  let sql = 'delete from blogentries where postId=' + req.body.identification;
  database.query(sql, (error, data) => {
    if (error) {throw error};
    let sql2 = 'delete from comments where mainPostId=' + req.body.identification;
    database.query(sql, (error, data) => {
      if (error) {throw error};
      res.json('response');
    })
  })
})

app.post('/deleteComment', function(req, res){
  let sql = 'delete from comments where commentId=' + req.body.identification;
  database.query(sql, (error, data) => {
    if (error) {throw error};
    res.json('response');
  })
})

app.post('/comment', function(req, res) {
  let sql = 'insert into comments (mainPostId, content, datetime) value("'+ req.body.mainPostId + '", "' + req.body.comment + '", CURRENT_TIMESTAMP);'
  database.query(sql, function(error){
    if (error) {throw error};
  });
  res.json("success");
})

app.post('/submitEditPost', function(req, res) {
  database.query('update blogentries set title="' + req.body.title +'" where postId="' + req.body.identification +'";',
  function(error, data){
    if (error) {throw error};

    database.query('update blogentries set content="' + req.body.content +'" where postId="' + req.body.identification +'";',
    function(error, data){
      if (error) {throw error};
      res.json(data);
    });
  });
});

app.post('/submitEditComment', function(req, res) {
  database.query('update comments set content="' + req.body.content +'" where commentId="' + req.body.identification +'";',
  function(error, data){
    if (error) {throw error};
    res.json(data);
  });
});

//------------------------------------------------------------------------------

// server start
app.listen(port, function() {
  console.log("Server started...");
});

//------------------------------------------------------------------------------

// mysql
// connection!
var database = mysql.createConnection({
  host: 'localhost', // ip address to the host of the mysql database
  user: 'root', // the thing in ____@_______ (the user to access/edit database)
  password: 'Gerberserver',
  database: 'blog'
});

// commence connection
database.connect(function(error){ // what happens when theres an error????
  if (error) {throw error};
  console.log('Connected!');
  database.query('use blog', function (error, result){ // puts "use blog" in
    if (error) {throw error};                          // the terminal
    console.log("Result: " + result);
  });
});

//------------------------------------------------------------------------------
