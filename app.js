const express = require('express');
const mongoose = require('mongoose');
const router = require('./routes/index');
const { PORT = 3000 } = process.env;
const app = express();

mongoose.connect('mongodb://127.0.0.1:27017/mestodb', {
  useNewUrlParser: true,
})
  .then(() => {
    console.log('Connected to DB');
  });

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
  req.user = {
    _id: '64dfd37ef7d860db7c27a5b5',
  };

  next();
});

app.use(router);

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});
