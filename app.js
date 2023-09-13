const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const { errors } = require('celebrate');

const handelError = require('./middlewares/handelError');
const router = require('./routes/index');

const { PORT = 3000 } = process.env;
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

mongoose.connect('mongodb://127.0.0.1:27017/mestodb', {
  useNewUrlParser: true,
})
  .then(() => {
    console.log('Connected to DB');
  });

app.use(cookieParser());
app.use(router);
app.use(errors());
app.use(handelError);

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});
