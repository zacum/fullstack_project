require('rootpath')();
const express = require('express');
const app = express();
const cors = require('cors');
const path = require('path');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const compression = require('compression');
const routes = require('src/routes');
const errorHandler = require('src/_middleware/error-handler');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(cors());
app.use(compression());
app.use(express.static(path.join(__dirname, 'public')));

app.use(routes);

app.use((req, res, next) => {
  next({ status: 404, message: `${req.method} ${req.originalUrl} not found` });
});
app.use(errorHandler);

const port =
  process.env.NODE_ENV === 'production' ? process.env.PORT || 80 : 3333;

app.listen(port, () => {
  console.log(`Server is running on ${port} port`);
});
