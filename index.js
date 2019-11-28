// console.log("test rest_api_test_01");

const express = require('express');
var cors = require('cors')

const app = express();
const port = 3000;
const todo_item = require('./todo_item.js');

app.use(cors()); // enable cors everywhere
app.listen(port, () => console.log(`App listening on port ${port}!`));
app.use('/api/v1/todo-item', todo_item);       // use todo_item router
