const express = require('express');
const router = express.Router();
var mongoose = require('mongoose');
const util = require('util');

router.use(express.json());       // to support JSON-encoded bodies
router.use(express.urlencoded()); // to support URL-encoded bodies

mongoose.connect('mongodb://localhost:27017/todo_basic');
var db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));

function req_par_val_get(req, name) {
  let val = ( name in req.body ? req.body[name] : "" );
  val = ( name in req.query ? req.query[name] : val );
  return val;
}

db.once('open', function() {
  var todo_item_schema = new mongoose.Schema({
    title: String
  });
  var TodoItem = mongoose.model('todo_item', todo_item_schema);
  console.log("todo_item db");
  router.get('/', async (req, res) => {
    // console.log('req.url: ' + req.url);
    // console.log("req.query: " + util.inspect(req.query, {showHidden: false, depth: null}));
    try {
      items = await TodoItem.find({});
      res.send(items);
    }
    catch (err) {
      return console.error(err);
    }
  } );

  router.get('/:idVal', async (req, res) => {
    try {
      items = await TodoItem.find( { "_id": req.params['idVal'] } );
      if (items.length>0) {
        const item = items[0];
        res.status(200).send(item);
      } else {
        res.status(404).end();
      }
    }
    catch (err) {
      return console.error(err);
    }
  } );

  router.post('/', async (req, res) => {
    let title = req_par_val_get(req, "title");
    let item = new TodoItem({ title });
    try {
      item = await item.save();
      console.log("Saved: " + item.title);
      res.status(201).send(item.id);
    }
    catch (err) {
      return console.error(err);
    }
  } );

  router.put('/:idVal', async (req, res) => {
    let id = req.params['idVal'];
    let title = req_par_val_get(req, "title");
    if (id!="") {
      try {
        raw = await TodoItem.updateOne( { "_id": id }, { title }, {} );
        console.log('updated - The raw response from Mongo was ', raw);
        res.status(200).end();
      }
      catch (err) {
        return console.error(err);
      }
    }// if given id
    res.status(204).end();
  } )

  router.delete('/:idVal', async (req, res) => {
    const idVal = req.params['idVal'];
    if (idVal!="") {
      try {
        const raw = await TodoItem.deleteOne( { _id: idVal } );
        const deletedCount = raw['deletedCount'];
        if (deletedCount>=1) {
          console.log('updated - The raw response from Mongo was ', raw);
          res.status(204).end();
        } else {
          res.status(404).end();
        }
      }
      catch (err) {
        return console.error(err);
      }
    }// if given id
    res.status(404).end();
  } )

});

module.exports = router;
