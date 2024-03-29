const express = require('express');
const createError = require('http-errors');
const path = require('path');
const cookieParser = require("cookie-parser");
const logger = require('morgan');

const indexRouter = require('./routes');

const app = express();

app.use(logger('dev'));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // render the error page
  res.status(err.status || 500);

  res.json({
    message: err.message,
    stack:
      req.app.get('env') === 'production' ? 'NO_STACK_FOR_PROD_ENV' : err.stack,
  });
});

module.exports = app;
