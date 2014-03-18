/*!
 * nodejs-express-mongoose-demo
 * Copyright(c) 2013 Madhusudhan Srinivasa <madhums8@gmail.com>
 * MIT Licensed
 */

/**
 * Module dependencies.
 */

var express = require('express')
    , fs = require('fs')
    , passport = require('passport')
    , logger = require('mean-logger')
    , request = require('request')
    ,cheerio = require('cheerio')


// Load configurations
// if test env, load example file
var env = process.env.NODE_ENV || 'development'
    , config = require('./config/config')[env]
    , auth = require('./config/middlewares/authorization')
    , mongoose = require('mongoose')

// Bootstrap db connection
var db = mongoose.connect(config.db)

// Bootstrap models
var models_path = __dirname + '/app/models'
fs.readdirSync(models_path).forEach(function (file) {
    require(models_path+'/'+file)
})


//*******************************************************//
//  обработка, анализ и сохранение книжки и статистики  //
//******************************************************//

/**
 * Module dependencies.
 */

var   rfile = require('rfile')
    , Extrator = require("html-extractor")
    , natural = require('natural')
    , sys = require("util")
    , semantics = require("semantics")
    , async = require('async')
    , Book = mongoose.model('Article')
    , _ = require('underscore')

    , redis = require("redis")
    , client = redis.createClient()
    , book_list =   require('./readtoday_books/books_texts/book_list.js');


/**
 * Extractor for Book START-------------------------
 */

 //Вынимаем текст из ХТМЛ *** серим в Джейсон *** получаем статистику *** отправляем все в МОНГО


for (var nbook = 0; nbook < book_list.length; nbook++) {


      var index  = nbook +1;
      var htm2read = './readtoday_books/books_texts/'+ index +'.html'
      var booktitle = book_list[nbook].title;
      var booktitlerus = book_list[nbook].titlerus;
      var bookimg = index + '.jpg';
      var bookauthor = book_list[nbook].author;
      var bookwiki = book_list[nbook].wiki;
      var booktag = book_list[nbook].tag;

    myExtrator = new Extrator()
    var html = rfile(htm2read )


    $ = cheerio.load(html);
    //вынимаем первую картинку

    //остальные удаляем
    $('.pagenum').remove();
    $('.smcap').remove();


    html = $.html();



//боди вынимаем по этому тгу и складываем все в массив из отдельных предложений
    reduceTo = {
        tag: "ul",
        attr: "id",
        val: "menu1"}

    myExtrator.extract(html, reduceTo, function(err, data){

        //тут удаляем пустые строки между из массива боди

        console.log(booktitle, 'TITLE')

        origin = data.body

        var result = []

        for (var i = 0; i < origin.length; i++) {

            if ( origin[i] !== "" ) {

                var text = origin[i].replace(/\n/g,' ');
                result.push(text);

            }

        }

        //console.log(result)

        data.body = result




        //серим объект книжки в джейсон для отправки куда угодно - ML например:))
        //var doil =  JSON.stringify(data)


        /**
         * Book saving------------------------------------------
         */

        var title = booktitle
        var titlerus = booktitlerus

        var author = bookauthor;
        var wiki = bookwiki;
        var img = bookimg;
        var tag = booktag;

        var para =data.body

        /**
         * Create a book
         */

        var book = new Book()
        book.title = title
        book.author = author
        book.titlerus = titlerus

        book.img = img


        book.para = para
        book.save()

        var bookId = book.id


        //создание списка авторов
        client.sadd("book:authors", author )
        client.sadd("book:tags", tag )

        //создание списка тэгов
        //client.sadd("book:tags", tag )

        /**
         * Statistica------------------------------------------
         */


        //теперь собираем текст в один кусок для анализа статистики
        var bodySolid = result.join(" ").replace(/\s\s+("|')/g, "")

        //NATURAL----------------------------------------

        //body preparing---------------------------------
        tokenizer = new natural.WordTokenizer();

        //тут токенайзим Боди в массив отдельных ВСЕХ!!! слов

        var bodyTokenized =  tokenizer.tokenize (bodySolid)

        //make case lower for every word

        var bodyTokenizedLower = []

        var Case = require ('case')

        for (var i = 0; i < bodyTokenized.length; i++) {

            if (isNaN(bodyTokenized[i]))  {
                bodyTokenizedLower.push(Case.lower(bodyTokenized[i]));

            }
        }

        //words frequency---------------------------------

        TfIdf = natural.TfIdf,
            tfidf = new TfIdf();

        tfidf.addDocument(bodyTokenizedLower);

        var listTermsUniq = {}

        //А ЗДЕСЬ  хэш УНИКАЛЬНЫХ СЛОВ с весом  в этом документе
        tfidf.listTerms(0/*document index*/).forEach(function(item) {

            var word =  item.term
            var freq =  item.tfidf

            listTermsUniq [word]   =   freq
        });

        /* запись словаря книги в РЕДИС и подсчет общего кол-ва слов
         */

        var wordsUniqTotal = 0
        for (var k in listTermsUniq)
        {
            wordsUniqTotal++
            //client.zadd("bv:" + bookId, listTermsUniq[k], k);
        }

        //console.log(sys.inspect(semantics.analysis.analyse(bodySolid)));

        var statSemantic = semantics.analysis.analyse(bodySolid)

        var wordsTotal =  statSemantic.counters.words_total
        var wordsInSentenceMid  = statSemantic.counters.words_in_sentence_mid

        console.log (wordsTotal)
        console.log (wordsUniqTotal)
        console.log (wordsInSentenceMid)

        var levelTotal =  (wordsUniqTotal/ wordsTotal)* wordsInSentenceMid

        console.log (levelTotal)

        /**
         * Create a bookstatistic
         */

        var bookstatistic = new Bookstatistic()
        bookstatistic.wordsTotal = wordsTotal
        bookstatistic.wordsUniqTotal = wordsUniqTotal
        bookstatistic.levelTotal = levelTotal
        bookstatistic.wordsInSentenceMid =wordsInSentenceMid
        bookstatistic.book = bookId
        bookstatistic.save()

        console.log (bookstatistic.id)


        book.bookstatistic = bookstatistic.id
        book.wordsTotal = wordsTotal
        book.levelTotal = levelTotal
        book.save()


    });





}

