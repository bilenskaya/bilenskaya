'use strict';



/**
 * Module dependencies.
 */
var mongoose = require('mongoose')
    , Schema = mongoose.Schema;

/**
 * Book Schema
 */



var BookSchema = new Schema({
    created: {type : Date, default : Date.now},
    wordsTotal: { type: Number},
    levelTotal: { type: Number},
    title: {type: String, default: '', trim : true},
    titlerus: {type: String, default: '', trim : true},
    author: {type: String, default: '', trim : true},
    tag: {},
    img: {},
    wiki: {},
    para: [{type: String, default: '', trim : true}],

    user: {type : Schema.ObjectId, ref : 'User'}
});


/**
 * Statics
 */



BookSchema.statics.load = function(id, cb) {
    this.findOne({
        _id: id
    }).exec(cb);
};


mongoose.model('Book', BookSchema);