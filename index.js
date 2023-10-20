const express = require('express');
const app = express();

const { products } = require('./database/products')
const { comments } = require('./database/comments')

const PORT = process.env.PORT || 3000;
const readyMessage = () => console.log('Server on http://localhost:' + PORT);

app.use(express.json())

app.get('/', (req, res) => {
  res.send({ data: "The server works successfully!" });
})

app.get('/products', (req, res) => {
  res.send({ data: products });
})

app.get('/comments', (req, res) => {
  res.send({ data: comments });
})

app.listen(PORT, readyMessage);