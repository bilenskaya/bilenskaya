'use strict';

// Books routes use books controller
var books = require('../controllers/books');

module.exports = function(app) {

    app.get('/books', books.all);
   // app.post('/books', authorization.requiresLogin, books.create);
    app.get('/books/:bookId', books.show);
   // app.put('/books/:articleId', authorization.requiresLogin, hasAuthorization, books.update);
   // app.del('/books/:articleId', authorization.requiresLogin, hasAuthorization, books.destroy);

    // Finish with setting up the bookId param
    app.param('bookId', books.book);


};

