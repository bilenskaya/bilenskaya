var iPageController = ['$scope',   '$timeout', '$http', '$routeParams', 'Global', 'Historybooks', 'Historyarticles', function($scope,   $timeout, $http, $routeParams, Global, Historybooks, Historyarticles) {



    $scope.Read = function ()
    {


        $('.para-container').css('font-size' , setFontSize +'px');

        $scope.daynight = 'Day';
        $scope.radioModel = 'Mouse';
        var nPara = $scope.firstpara;
        $scope.firstParaPage = nPara; //единый первый парагр
        var margTstart = $scope.mTop;
        $scope.hFrame =$scope.Frame;
        $scope.margBprev = $scope.mBprev;   /// УБИТЬ????

        //console.log( $scope.firstpara, "first para ipage")

        //определение шрифта - ДЖИКВЕРИ???
        var abc = document.getElementsByClassName("para")[0];
        var abcStyle = document.defaultView.getComputedStyle(abc, "");
        var fsize = abcStyle.getPropertyValue("font-size");   //FSIZE - размер шрифта в пикселях
        //console.log (fsize, 'font-size');


        //задание начальных параметров
        //scope.content приходит с буук контроллера

        var a =   $scope.content.para; //параграфы книжки с сервера

       $scope.allparas = a.length;

        //фактическая высота строки LINEHR
        var linehr =  parseInt(fsize)*1.5;

        //начальный размер фрейма без учета шрифта
        var hF = $scope.hFrame + margTstart;

        //фактическое кол-во строк по данному шрифту
        var hfr = Math.round (hF/linehr);
        //подгонка высоты фрейма
        $scope.hFrame = hfr* linehr;

        //console.log($scope.hFrame, 'new frame hight presise')

        $scope.paragraphs  = [ ]; //массив с параграфами страницы

        //console.log (a);

        //номер параграфа с сервера
        var nFirstPara = nPara; // номер первого параграфа на странице
        $scope.hFirst=0; //высота первого параграфа
        $scope.hl=0; // высота последнего параграфа
        $scope.hp=0; // высота всех параграфов
        var nLastPara=nPara; // номер последнего параграфа на странице

        var h; //высота элемента
        var hF = $scope.hFrame; // текущая высота фрейма - точная
        var i=nPara; // текущий индекс перебора параграфов начинаем с первого

        for ( i; i < a.length; i++)
        {
            $scope.$apply();
            h = $('.para-container').height();

            if (h<hF) {

                $scope.hp=h; // записываем высоту парагрофов

                $scope.paragraphs.push( a [i]);
                $scope.$apply();
                h = $('.para-container').height();

                nLastPara=i; //запись последнего номера параграфа

                //получение высоты последнего вставленного параграфа
                $scope.hl= h - $scope.hp;

                //получение высоты первого параграфа
                var g =  $scope.paragraphs;
                var e = g.length;
                if (e===1) {$scope.hFirst = h}

            }
        };
        //определение номера для NEXT
        $scope.nNext = nLastPara;
        //определение номера для PREV
        $scope.nPrev = nFirstPara - 1;

        //обрезку полей ставим внутрь Read функции с задержкой - timeout
        var margins = function()
        {
            if (margTstart !=0) {
                //верхнее поле для NEXT из NEXT, Para, Prev
                $('.para-container').css('margin-top' , -margTstart);
                $scope.nPrev = nFirstPara
            }



            //console.log (fsize);
            var f= parseInt(fsize );

            var scale = 1.5;
            var line = f * scale;
            var rF = $scope.hFrame/ line;
            rF = parseInt(rF);
            var h = $('.para-container').height();
            var rP = parseInt(h/ line);
            var rLeft = rP - rF;

            $scope.margBpara = rLeft*line;
            $('.para-container').css('margin-bottom' , -$scope.margBpara);

            //расчет верхних полей для NEXT
            var hlp = $scope.hl;
            var rLast = parseInt(hlp/ line);
            var leftT= rLast-rLeft;

            //УСЛОВИЯ для ИНДЕКСА NEXT и верхнего поля

            if ($scope.margBpara<=0) {leftT=0;
                $scope.nNext = $scope.nNext +1;
            } // для NEXT

            //!!!верхнее поле для первой NEXT раскладки
            $scope.margTnext = leftT*line;


            //console.log($scope.margTnext, "margins") ;


            //параметры для ридера хистори или ластбук
            $scope.firstpara = nPara;
            $scope.lastpara = nLastPara;
            $scope.mTop=0;
            $scope.mBprev =0;

        };

        $timeout(margins, 100);





    };




    var loadingbook = $scope.loadingbook;
    var loadingart = $scope.loadingart;
   var isStop = false;

    var countDown = 100;

   var runCounter = function(){

       if (isStop) return;

       countDown -=1;
       if(countDown > 0) {

           loadingbook = $scope.loadingbook;
           loadingart = $scope.loadingart;
           $timeout(runCounter,100);
           //console.log($scope.artTracker.active())
           //console.log(loadingart)

           if(loadingbook && !$scope.bookTracker.active()) {
               loadingbook = $scope.loadingbook;

               $scope.Read();
               isStop = true;

           }

           if(loadingart && !$scope.artTracker.active()) {
               loadingart = $scope.loadingart;
               //console.log($scope.artTracker.active())
               //console.log(loadingart)
               $scope.Read();
               isStop = true;
           }





       }


   }

    runCounter();









    $scope.nextPara = function ()
    {

        $scope.controlChange();


        $('.para').css('color' , $scope.fontcolor);
        var a =   $scope.content.para;
        //ПРОВЕРКА----------------------------------
        if ($scope.nNext < a.length) { //Если есть куда листать!!!

            //Установка---------------------------------
            $scope.paragraphs  = [ ];

            //установка верхних полей для данной страницы из NEXT, Para, Prev
            var margTstart = $scope.margTnext;

            var hF = $scope.hFrame + margTstart;
            var h;

            //номер первого параграфа
            $scope.nFirstNext=$scope.nNext;
            //номер последнего параграфа
            $scope.nLastNext =$scope.nNext;

            $scope.firstParaPage = $scope.nFirstNext; //первый единый


            //Погнали=))---------------------------------
            var i=$scope.nNext;
            for ( i; i < a.length; i++)
            {
                $scope.$apply();
                h = $('.para-container').height();
                if (h<hF) {
                    $scope.hp=h;
                    $scope.paragraphs.push( a [i]);
                    $scope.$apply();
                    h = $('.para-container').height();

                    //получение высоты первого параграфа
                    var g =  $scope.paragraphs;
                    var e = g.length;
                    if (e===1) {$scope.hFirst = h}

                    //номер последнего параграфа
                    $scope.nLastNext = i;

                    //получение высоты последнего параграфа
                    $scope.hl= h - $scope.hp;
                }
            };

            //ПОЛЯ-расчет-----------------------------------------------
            //верхнее поле для NEXT из NEXT, Para, Prev
            $('.para-container').css('margin-top' , -margTstart);

            //определяем размер строки по шрифту




            var abc = document.getElementsByClassName("para")[0];
            var abcStyle = document.defaultView.getComputedStyle(abc, "");
            var fsize = abcStyle.getPropertyValue("font-size");
            //console.log (fsize);
            var f= parseInt(fsize );


            var scale = 1.5;
            var line = f * scale;

            //строк не влезло в первый параграф
            $scope.rFirst = margTstart/line;

            var rF1 = hF/ line;
            var rF = parseInt(rF1);

            var rP = parseInt(h/ line);
            var rLeft = rP - rF;

            //нижние поля для ЭТОЙ страницы
            $scope.margBnext = rLeft*line;
            $('.para-container').css('margin-bottom' , -$scope.margBnext);

            //расчет верхних полей для NEXT
            var hlp = $scope.hl;
            var rLast = parseInt(hlp/ line);
            var leftT= rLast-rLeft;

            //для нижних полей PREV

            var rPrevLeft=0;

            rPrevLeft = ($scope.hFirst/line - $scope.rFirst);



            //console.log($scope.rFirst, "строк скрыто в верхнем параграфе NEXT");
            //console.log(rPrevLeft, "строк показано в верхнем параграфе NEXT");
            //console.log(rF, "строк всего во фрейме NEXT");
            //console.log(rP, "строк всего в параграфе NEXT");
            //console.log(rLast, "строк в последнем параграфе NEXT");
            //console.log(rLeft, "строк не влезло в последний параграф NEXT");



            //ИНДЕКСЫ-------------------------------------------------------
            //определение номера для NEXT
            $scope.nNext = $scope.nLastNext;
            //определение номера для PREV
            $scope.nPrev = $scope.nFirstNext;


            //Условия
            if ($scope.margBnext<=0) {leftT=0;
                $scope.nNext = $scope.nNext+1
            } // NEXT

            if (margTstart===0) {rPrevLeft=0;
                $scope.nPrev = $scope.nPrev-1;
            } // для PREV

            //console.log($scope.margTstart, "margTstart");
            // console.log($scope.nPrev, "nPrev");

            //ПОЛЯ определение-----------------------------------------------
            //!!!верхнее поле для NEXT
            $scope.margTnext = leftT*line;

            //нижние поля для PREV
            $scope.margBprev = rPrevLeft*line;
        }





        //LASTBOOK

        $scope.firstpara =$scope.nFirstNext;
        $scope.mTop=margTstart;
        $scope.mBprev =$scope.margBprev;

    };


    $scope.prevPara = function ()

    {

        $scope.controlChange();


        $('.para').css('color' , $scope.fontcolor);
        //console.log($scope.nPrev, "nPrev2");
        //ПРОВЕРКА---------------------------------------------------
        if ($scope.nPrev >= 0) { //Если есть куда листать!!!

            //Установка--------------------------------------------------
            $scope.paragraphs  = [ ];
            var a =   $scope.content.para;
            var h;
            //высота фрейма = высота страницы + поля от предыдущего абзаца
            var hF = $scope.hFrame + $scope.margBprev;

            //номер первого параграфа
            $scope.nFirstPrev=$scope.nPrev;
            //номер последнего параграфа
            $scope.nLastPrev =$scope.nPrev;

            $scope.firstParaPage= $scope.nFirstPrev //первый единый

            //установка нижних полей для данной страницы
            $scope.margBstart = $scope.margBprev;

            //Погнали=))---------------------------------
            var i=$scope.nPrev;

            //прямая раскладка (убывание)----
            for ( i; i >= 0; i=i-1)
            {
                $scope.$apply();

                h = $('.para-container').height();
                if (h<hF) {
                    $scope.hp=h; //высота страницы
                    $scope.paragraphs.push( a [i]);
                    $scope.$apply();
                    h = $('.para-container').height();

                    //получение высоты нижнего параграфа
                    var g =  $scope.paragraphs;
                    var e = g.length;
                    if (e===1) {$scope.hLast = h}

                    $scope.nFirstPrev=i; //записываем номер верхнего параграфа
                    $scope.hFirst= h - $scope.hp; // высота верхнего параграфа
                    $scope.hl= h - $scope.hp;
                }
            };

            //обратная раскладка (ПОДГОТОВКА)----

            //записываем параграфы во временный массив
            var b = $scope.paragraphs;

            //обнуляем массив с параграфами
            $scope.paragraphs  = [ ];

            $scope.$apply();

            //начинаем с номера верхнего параграфа
            i=$scope.nFirstPrev;
            //до нижнего параграфа +1
            j=$scope.nLastPrev;
            j=j+1;

            //обратная раскладка ---------------

            for (i; i < j; i++)
            {
                $scope.$apply();
                h = $('.para-container').height();
                $scope.hp=h;
                $scope.paragraphs.push( a [i]);
                $scope.$apply();
                h = $('.para-container').height();
            };


            //ПОЛЯ-расчет-----------------------------------------------
            //нижние поля для ЭТОЙ страницы из NEXT, Para, Prev
            $('.para-container').css('margin-bottom' , -$scope.margBstart);

            var f = $('.para-container').css('font-size');
            var f= parseInt(f);
            var scale = 1.5;
            var line = f * scale;
            var rF = hF/ line;
            var rF = parseInt(rF);
            var rP = parseInt(h/ line);
            var rLeft = rP - rF;

            //верхние поля для ЭТОЙ страницы
            $scope.margTprev = rLeft*line;
            $('.para-container').css('margin-top' , -$scope.margTprev);


            //расчет нижних полей для  PREV
            var hlp = $scope.hl;
            var rLast = parseInt(hlp/ line);
            var leftT= rLast-rLeft;

            //расчет верхних полей для  NEXT
            //количество строк в последнем параграфе
            var rLastPrev = $scope.hLast/line;
            //количество показанных строк в последнем параграфе
            var rShowPrev = rLastPrev - $scope.margBstart/line;


            //console.log(rF, "строк всего во фрейме PREV");
            //console.log(rP, "строк всего в параграфе prev");
            //console.log(leftT, "строк влезло параграф prev");
            //console.log(rLeft, "строк показано в верхнем параграфе");

            //ИНДЕКСЫ-------------------------------------------------------
            //определение номера для NEXT
            $scope.nNext = $scope.nLastPrev;
            //определение номера для PREV
            $scope.nPrev = $scope.nFirstPrev;

            //Условия
            if ($scope.margBstart<=0) {rShowPrev=0;
                $scope.nNext = $scope.nNext+1
            } // NEXT

            if ($scope.margTprev===0) {leftT=0;
                $scope.nPrev = $scope.nPrev-1;
            } // для PREV

            //console.log($scope.margTprev, "margTprev");
            //console.log($scope.nPrev, "nPrev");

            //ПОЛЯ определение-----------------------------------------------

            //нижнее поле для PREV страницы
            $scope.margBprev = leftT*line;

            //верхние поля для NEXT страницы
            $scope.margTnext = rShowPrev*line;

            //Если верхний параграф нулевой и заканчивается на странице-----------------------------------------------

            if ($scope.margTprev<0  ) {
                $scope.paragraphs  = [ ];


                $scope.$apply();

                $scope.margT = 0;
                $('.para-container').css('margin-top' , -$scope.margT);

                var nPara=0;
                var nFirstPara = nPara;
                $scope.hFirst=0; //высота первого параграфа
                $scope.hl=0; // высота последнего параграфа
                $scope.hp=0; // высота всех параграфов
                var nLastPara=nPara; // номер последнего параграфа на странице

                var h; //высота элемента
                var hF = $scope.hFrame; // текущая высота фрейма
                var i=nPara; // текущий индекс перебора параграфов начинаем с первого

                for ( i; i < a.length; i++)
                {
                    $scope.$apply();
                    h = $('.para-container').height();

                    if (h<hF) {

                        $scope.hp=h; // записываем высоту парагрофов

                        $scope.paragraphs.push( a [i]);
                        $scope.$apply();
                        h = $('.para-container').height();

                        nLastPara=i; //запись последнего номера параграфа

                        //получение высоты последнего вставленного параграфа
                        $scope.hl= h - $scope.hp;

                        //получение высоты первого параграфа
                        var g =  $scope.paragraphs;
                        var e = g.length;
                        if (e===1) {$scope.hFirst = h}

                    }
                };
                //определение номера для NEXT
                $scope.nNext =nLastPara;
                //определение номера для PREV
                $scope.nPrev = nFirstPara - 1;

                //ПОЛЯ-расчет-----------------------------------------------

                var f = $('.para-container').css('font-size');
                var f= parseInt(f);
                var scale = 1.5;
                var line = f * scale;
                var rF = $scope.hFrame/ line;
                rF = parseInt(rF);
                var h = $('.para-container').height();
                var rP = parseInt(h/ line);
                var rLeft = rP - rF;

                $scope.margBpara = rLeft*line;
                $('.para-container').css('margin-bottom' , -$scope.margBpara);

                //расчет верхних полей для NEXT
                var hlp = $scope.hl;
                var rLast = parseInt(hlp/ line);
                var leftT= rLast-rLeft;

                //УСЛОВИЯ для ИНДЕКСА NEXT и верхнего поля

                if ($scope.margBpara<=0) {leftT=0;
                    $scope.nNext = $scope.nNext +1;
                } // для NEXT

                //!!!верхнее поле для первой NEXT раскладки
                $scope.margTnext = leftT*line;

            }
        }




        //LASTBOOK
        $scope.firstpara =$scope.nFirstPrev;
        $scope.mTop=$scope.margTprev;
        $scope.mBprev =$scope.margBprev;







    };




    //-----------word select---START-------------- //

    var lastTranslateRange = "";
    var gotTranslate = 0;
    var enWord = "";
    var scroll = 1;

    $scope.saveword = function () {

        $scope.wordsets = [];

        var word = {id: '', term: $scope.key , definition: $scope.wordtranslate};

        $scope.wordsets.push(word);


        var set = { id: $scope.articleSetId, wordsets: $scope.wordsets };

        $http.post( '/updatewordset', set ).success(function(data)
        {
            //console.log('1234------------------------')
            //console.log(data)

        });




    }


    var enWordBack = function() {
        if (gotTranslate ==1){
            if (typeof lastTranslateRange != 'undefined') {

                var currentRange = lastTranslateRange;
                var el = $scope.el
                //удаляем английский контент
                currentRange.deleteContents();
                //создаем новый узел для вставки русского перевода
                el.style.color = $('.para').css('color');
                currentRange.insertNode(document.createTextNode(enWord));

                enWord = '';
                $scope.key = '';
                $scope.phonetic = '';
            }
        }
    }

    $scope.replaceWord = function () {


        enWordBack();
    }

    $scope.wordtranslate = '';

    $scope.controlChange = function() {
        enWordBack();
        if ( $scope.radioModel == "Pad") {
            scroll = 0;
        } else{ scroll = 1;}
        lastTranslateRange = "";
        gotTranslate = 0;
        enWord = "";
    }

    $scope.getWord = function ($event) {

        var getTryes = function() {



            $http.get('/users/me').success(function(data) {

                $scope.tryes = data.trynumber.tryes

                paystatus();
                nextday();

            });

        }

        $timeout(getTryes, 60);


        $event.stopPropagation();
        // проверка если в рэнж храниться прошлый перевод
        if (gotTranslate ==1){
            enWordBack();
        }

        var  word = "";
        //опции для выделения слов через дефис
            rangy.getSelection().expand("word", {
                wordOptions: {
                    wordRegex: /[a-z0-9]+(['\-][a-z0-9]+)*/gi
                }
            });
            var range = rangy.getSelection().getRangeAt(0);

            word = range.toString();

        if (!word.match(/[a-zA-Z]+/)) {

            //console.log("0")
        } else {

        //console.log (word);

            enWord = word;

            var lowword = word;


            $http({method: 'GET', url: 'dictpublics/' + lowword}).
                success(function(response)


            {
                var dictresponse = response;

                if (response == 'null' || typeof response.fullRussTrans[0] == null || response.fullRussTrans[0] == '*FAKE*' || response == 'out') {
                    lastTranslateRange = "";
                    gotTranslate = 0;
                    enWord = "";
                    gotTranslate =0;

                }

                if (response!= 'null' && typeof response.fullRussTrans[0] != null && response.fullRussTrans[0] != '*FAKE*') {

                    gotTranslate =1;
                    //console.log(response.fullRussTrans);

                    var idx = 0;
                    var wordTrans = response.fullRussTrans[idx] ;
                    $scope.wordtranslate = wordTrans;

                    var numTrans = response.fullRussTrans.length;
                    //console.log(numTrans);

                    //удаляем английский контент
                    range.deleteContents();

                    //создаем новый узел для вставки русского перевода
                    var el = document.createElement("trans");
                    $scope.el = el;
                    el.style.color = "#dc322f";
                    el.appendChild(document.createTextNode(wordTrans));
                    range.insertNode(el);

                    range.selectNodeContents(el);
                    //выделяем то что вставили
                    var newsel = rangy.getSelection();
                    newsel.setSingleRange(range);
                    currentRange = rangy.getSelection().getRangeAt(0);
                    lastTranslateRange = currentRange;


                    var wordup = function () {

                        if (gotTranslate !=0) {


                            if (idx < numTrans-1) {
                                idx = idx +1;
                                wordTrans = response.fullRussTrans[idx]
                                $scope.wordtranslate = wordTrans;
                                if (wordTrans != null){

                                    //удаляем английский контент
                                    range.deleteContents();

                                    //создаем новый узел для вставки русского перевода
                                    var el = $scope.el

                                    el.style.color = "blue";
                                    range.insertNode(document.createTextNode(wordTrans));
                                    range.selectNodeContents(el);

                                    //выделяем то что вставили
                                    var newsel = rangy.getSelection();
                                    newsel.setSingleRange(range);
                                    currentRange = rangy.getSelection().getRangeAt(0);
                                    lastTranslateRange = currentRange;

                                }



                            }
                        }

                    };
                    var wordown = function(){

                        if (gotTranslate !=0) {

                            if (idx > 0){
                                idx = idx-1;

                                wordTrans = response.fullRussTrans[idx]
                                $scope.wordtranslate = wordTrans;
                                //удаляем английский контент
                                range.deleteContents();
                                var el = $scope.el

                                //создаем новый узел для вставки русского перевода
                                //цвет шрифта
                                el.style.color = "blue";

                                range.insertNode(document.createTextNode(wordTrans));

                                range.selectNodeContents(el);

                                //выделяем то что вставили
                                var newsel = rangy.getSelection();
                                newsel.setSingleRange(range);
                                currentRange = rangy.getSelection().getRangeAt(0);
                                lastTranslateRange = currentRange;
                            }
                        }

                    }

                    if ($scope.radioModel == 'Mouse')  {
                        $scope.rollTranslate =  function(event, delta, deltaX, deltaY){

                            //console.log(wordTrans);

                            if (scroll == 1) {
                                if  (delta > 0) {
                                    wordup();
                                }

                                if (delta < 0) {
                                    wordown()
                                }
                                event.stopPropagation();
                                event.preventDefault();

                            }

                        };


                    }

                    if ($scope.radioModel == 'Pad')  {

                        document.onkeydown = function() {

                            if (scroll == 0) {
                                switch (window.event.keyCode) {

                                    case 40:
                                        if (gotTranslate !=0) {
                                            wordup();


                                        }


                                        break;

                                    case 38:


                                        if (gotTranslate !=0) {
                                            wordown()

                                        }



                                        break;
                                }
                            }
                            event.stopPropagation();
                            event.preventDefault();
                        };
                    }

                    $scope.key = dictresponse.key;
                    //console.log(dictresponse)
                    $scope.phonetic = dictresponse.phonetic[0]

                }

            }).
                error(function(response, status, headers, config) {
                    gotTranslate = 0;
                    //console.log(status);
                });

           //// Restore selection
           //sel.removeAllRanges();
           //sel.addRange(selectedRange);
        }

        }






    //alert(word);


    //MOUSEWHEEL-support




}]
