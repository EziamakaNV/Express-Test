var express = require('express');
var app = express();


// import dotenv module to load values from .env file into node process.env object
require('dotenv').config();



//******************mongodb db*************/
//*****************************************/
// https://obsidian-visitor.glitch.me


var mongoose = require('mongoose');
mongoose.connect(process.env.MONGO_URI);



//Create the framework(Schema) of the document
//Each Schema made as a model, is used to create an instance of a document
//Schema's match to collections
var Schema = mongoose.Schema;
var PersonSchema = new Schema({name: String, age: Number, favoriteFoods: [String]});

//new model
var Person = mongoose.model('Person',PersonSchema);

// Crud Create a person************/////////


var person = new Person({name: 'James', age: 25, favoriteFoods: ['yam','beans']});

// **Note**: GoMix is a real server, and in real servers interactions with
// the db are placed in handler functions, to be called when some event happens
// (e.g. someone hits an endpoint on your API). We'll follow the same approach
// in these exercises. The `done()` function is a callback that tells us that
// we can proceed after completing an asynchronous operation such as inserting,
// searching, updating or deleting. It's following the Node convention and
// should be called as `done(null, data)` on success, or `done(err)` on error.
// **Warning** - When interacting with remote services, **errors may occur** !

// - Example -
// var someFunc = function(done) {
//   ... do something (risky) ...
//   if(error) return done(error);
//   done(null, result);
// };

// Create a `document` instance using the `Person` constructor you build before.
// Pass to the constructor an object having the fields `name`, `age`,
// and `favoriteFoods`. Their types must be conformant to the ones in
// the Person `Schema`. Then call the method `document.save()` on the returned
// document instance, passing to it a callback using the Node convention.
// This is a common pattern, all the **CRUD** methods take a callback 
// function like this as the last argument.

// - Example -
// ...
// person.save(function(err, data) {
//    ...do your stuff here...
// });




//Remember that interactions with db's by a sever are handled by handler functions
//Create a handler funtion, do something risky in it and exit or inform
//node you're done with the function using the
//done function created and passed as an argument to the handler function


/** # [C]RUD part I - CREATE #
/*  ========================== */

function done(error,data){
    if(error) return console.log(error);
    return console.log(data);
  }

function createAndSavePerson(done){

// Node.js asynchronus call backs - argument passed to callbacks; first argument is
//an error object in case it fails, second argument passed is the completed data on
//success

    person.save(function(error,data){
        if (error) return done(error);
        done(null,data);
    });

}



//**********createAndSavePerson(done);


/** 4) Create many People with `Model.create()` */

// Sometimes you need to create many Instances of your Models,
// e.g. when seeding a database with initial data. `Model.create()`
// takes an array of objects like [{name: 'John', ...}, {...}, ...],
// as the 1st argument, and saves them all in the db.
// Create many people using `Model.create()`, using the function argument
// 'arrayOfPeople'.

let arrayOfPeople = [{name:'Mekus',age:21,favoriteFoods: ['hotdog','fried rice', 'small chops']},{name:'Val',age:22,favoriteFoods: ['toasted jumbo','chicken and chips', 'chinese']}];

function createManyPeople(arrayOfpeople,done){

//Model.create takes an array of multiple documents and saves them at once in the database
//Model.create runs mymodel.save() on each document

Person.create(arrayOfpeople,function(error,data){
    if (error) return done(error);
    done(null,data);
});


}

createManyPeople(arrayOfPeople,done);





//************************************************* */
//************************************************88 */






//import body-parser module that can enconde and decode data in different formats.
//gonna use it for post requests;
//gotta place/mount it before all other routes
var bodyParser = require('body-parser');



// var x=0;


// app.get('/', function(req,res){
//     res.send('Hi!');
//     console.log(x);
//     x++;
// });

//Logger middleware logging the request method, path and request ip
app.use(function(req,res,next){
        console.log(`${req.method} ${req.path} - ${req.ip}`);

        //nodejs is a server that works on request and response
        // when it receives a request it has to send a response in order to end that 
        //request line
        //if a response is not sent with a res.sendxx/res.json etc, the 
        //next() function/callback has to be used to passover control to the next 
        //middleware in the stack
        next();
});

//body parser used to decode or encode data. used in this case for post requests
app.use(bodyParser.urlencoded({extended: false}));



app.get('/', function(req,res){
    res.sendFile(__dirname+'/indexform.html');
});
app.use( express.static( __dirname+'/public'));
app.get('/json', function(req,res){
    if(process.env.MESSAGE_STYLE === 'uppercase') {
        res.json({"message":"HELLO JSON"});
    }

    else{
        res.json({"message":"Hello json"});
    }
});

app.get('/now', function(req,res,next){
    req.time = new Date().toString();
    next();
}, function(req,res,next){
    res.json({time: req.time});
});

//API. Getting user input parameters using /:xxxx. 
// e.g route_path: '/user/:userId/book/:bookId'
// actual_request_URL: '/user/546/book/6754' 
// req.params: {userId: '546', bookId: '6754'}
app.get('/:word/echo', function(req,res){
    res.json({echo: req.params.word});
});

// API for Query Parameters
//eg route_path: '/library'
// actual_request_URL: '/library?userId=546&bookId=6754' 
// req.query: {userId: '546', bookId: '6754'}
app.get('/name', function(req,res){
    res.json({name: `${req.query.first} ${req.query.last}`});
});

app.post('/name', function(req,res){
    res.json({name: `${req.body.first} ${req.body.last}`});
});

console.log('Server listening on port 9000');

app.listen(9000);