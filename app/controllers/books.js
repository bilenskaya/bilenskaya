'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Book = mongoose.model('Book'),
    _ = require('lodash');


/**
 * Find book by id
 */
exports.book = function(req, res, next, id){
    var User = mongoose.model('User')



    Book.load(id, function (err, book) {
        if (err) return next(err)
        if (!book) return next(new Error('Failed to load book ' + id))
        req.book = book
        next()
    })
}


/**
 * Create an book
 */
exports.create = function(req, res) {
    var book = new Book(req.body);
    book.user = req.user;

    book.save(function(err) {
        if (err) {
            return res.send('users/signup', {
                errors: err.errors,
                book: book
            });
        } else {
            res.jsonp(book);
        }
    });
};

/**
 * Update an book
 */
exports.update = function(req, res) {
    var book = req.book;

    book = _.extend(book, req.body);

    book.save(function(err) {
        if (err) {
            return res.send('users/signup', {
                errors: err.errors,
                book: book
            });
        } else {
            res.jsonp(book);
        }
    });
};

/**
 * Delete an book
 */
exports.destroy = function(req, res) {
    var book = req.book;

    book.remove(function(err) {
        if (err) {
            return res.send('users/signup', {
                errors: err.errors,
                book: book
            });
        } else {
            res.jsonp(book);
        }
    });
};

/**
 * Show an book
 */
exports.show = function(req, res) {
    res.jsonp(req.book);
};

/**
 * List of Books
 */
exports.all = function(req, res){
    Book.find()
        .select ('-para' )  //убираем содержание из общего списка

        .exec(function(err, book) {
            if (err) {
                res.render('error', {status: 500});
            } else {
                res.jsonp(book);
            }
        });
};

