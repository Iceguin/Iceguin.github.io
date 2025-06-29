var cors_api_url = 'https://cors-anywhere.herokuapp.com/';

var comics = [ // from https://www.gocomics.com/
    'andycapp',
    'animalcrackers',
    'theargylesweater',
    'babyblues',
    'calvinandhobbes',
    'overthehedge',
    'garfield',
    'shoe',
    'fminus',
    'freerange',
    'theargylesweater',
    'frazz',
    'looseparts',
    'herman',
    'foxtrot',
    'foxtrotclassics',
    'thegrizzwells',
    'doonesbury',
    'peanuts',
    'pearlsbeforeswine',
    'getfuzzy',
    'the-born-loser',
    'lockhorns',
    'offthemark',
    'wizardofid',
    'ziggy',
    'closetohome',
    'zits',
    'nonsequitur',
    'forbetterorforworse',
    'bloomcounty',
    'broomhilda',
    'cathy',
    'momma',
    'nestheads',
    'pickles',
    'speedbump',
    'stonesoup',
    'stone-soup-classics',
    'phoebe-and-her-unicorn'
];

var comicsKing = [
    'prince-valiant',
    'blondie',
    'mutts',
    'beetle-bailey-1'
]

function doCORSRequest(id, options, printResult) {
    doCORSRequest(options, printResult, 0)
}

function doCORSRequest(id, options, printResult, count) {
    var x = new XMLHttpRequest();
    x.open(options.method, options.url);
    x.onload = function () {
        printResult(id, x.responseText);
    };
    if (count < 3) {
        x.onerror = doCORSRequest(options, printResult, count + 1)
        if (count > 0) { console.log('Load attempt number ' + count + ' for ' + options.url) }
    } else {
        x.onerror = x.onload;
    }
    if (/^POST/i.test(options.method)) {
        x.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    }
    x.send(options.data);
}

function getComicPath(comicid, daysback) {
    var today = new Date();
    today.setDate(today.getDate() - daysback);
    var thisYear = today.getFullYear();
    var thisMonth = String(today.getMonth() + 1);
    var thisDay = String(today.getDate());
    if (thisMonth.length < 2) { thisMonth = '0' + thisMonth };
    if (thisDay.length < 2) { thisDay = '0' + thisDay };

    if ($.inArray(comicid, comics) !== -1) {
        return 'https://www.gocomics.com/' + comicid + '/' + thisYear + '/' + thisMonth + '/' + thisDay;
    } else if ($.inArray(comicid, comicsKing) !== -1) {
        return 'https://comicskingdom.com/' + comicid + '/' + thisYear + '-' + thisMonth + '-' + thisDay;
    //} else if (comicid == 'dilbert') {
    //    return 'https://dilbert.com/strip/' + thisYear + '-' + thisMonth + '-' + thisDay;
    } else if (comicid == 'bc') {
        return 'https://johnhartstudios.com/bc/' + thisYear + '/' + thisMonth + '/' + thisDay;
    }
    return '';
}

function getImgURL(comicid, result) {
    if ($.inArray(comicid, comics) !== -1) {
        img = $("meta[property='og:image']", $.parseHTML("<div>" + result + "</div>"))
        return img.attr("content")
    } else if ($.inArray(comicid, comicsKing) !== -1) {
        return $('img.buy-print-image', $.parseHTML(result)).attr('src').replace("&amp;", "&");
    //} else if (comicid == 'dilbert') {
    //    return 'https:' + $('.img-comic', $.parseHTML(result)).attr('src');
    } else if (comicid == 'bc') {
        return 'https://johnhartstudios.com' + $('.entry-content p img', $.parseHTML(result)).attr('src');
    }
    return '';
}

function replaceImg(id, imgsrc) {
    $('table[data-comic="' + id + '"] td > img').attr("src", imgsrc);
}

function appendComic(comictitle, imgsrc, comicid) {
    $("#bottom").append('<table style="display: inline-block; margin: 10px;" data-comic="' + comicid + '" data-daysbefore="0"><tr><td style="text-align:left;"><b>' + comictitle + '</b><span class="after" onclick="goForward(this)">Forward ></span><span class="before" onclick="goBack(this)">< Back</span></td></tr><tr><td><img src="' + imgsrc + '"></td></tr></table>')
}
function goBack(e) {
    var daysback = parseInt($(e).parents("table").attr("data-daysbefore"));
    var comicid = $(e).parents("table").attr("data-comic");

    var daymodifier = (comicid == 'prince-valiant') ? 7 : 1;

    $(e).parents("table").attr("data-daysbefore", daysback + daymodifier)

    var comicpath = getComicPath(comicid, daysback + daymodifier);

    doCORSRequest(comicid, {
        method: 'GET',
        url: comicpath
    }, function replaceComic(id, result) {
        var imgsrc = getImgURL(id, result);
        if (imgsrc) {
            replaceImg(id, imgsrc);
        }
    }
    );
}
function goForward(e) {
    var daysback = parseInt($(e).parents("table").attr("data-daysbefore"));
    var comicid = $(e).parents("table").attr("data-comic");

    var daymodifier = (comicid == 'prince-valiant') ? 7 : 1;

    $(e).parents("table").attr("data-daysbefore", daysback - daymodifier)

    var comicpath = getComicPath(comicid, daysback - daymodifier);

    doCORSRequest(comicid, {
        method: 'GET',
        url: comicpath
    }, function replaceComic(id, result) {
        var imgsrc = getImgURL(id, result);
        if (imgsrc) {
            replaceImg(id, imgsrc);
        }
    }
    );
}

$(document).ready(function () {
    var today = new Date();
    var thisYear = today.getFullYear();
    var thisMonth = String(today.getMonth() + 1);
    var thisDay = String(today.getDate());
    if (thisMonth.length < 2) { thisMonth = '0' + thisMonth };
    if (thisDay.length < 2) { thisDay = '0' + thisDay };

    /* get all comics available on gocomics */
    for (var n = 0; n < comics.length; n++) { 
        var comicpath = getComicPath(comics[n], 0);
        doCORSRequest(comics[n], {
            method: 'GET',
            url: comicpath
        }, function printGoComics(id, result) {
            testresult = result
            var imgsrc = getImgURL(id, result);
            if (imgsrc) {
                var comictitle = $('h1[class^="Typography_typography"]', $.parseHTML(result)).text();
                appendComic(comictitle, imgsrc, id);
            } else { console.log("Failed to load " + id + " from " + result) }
        }
        );
    }

    /* get all Comic Kingdom */
    /*for (var n = 0; n < comicsKing.length; n++) {

        var pv_comicpath = getComicPath(comicsKing[n], 0);
        doCORSRequest(comicsKing[n], {
            method: 'GET',
            url: pv_comicpath
        }, function printKingdomComics(id, king_result) {
            var pv_imgsrc = getImgURL(id, king_result);
            var comictitle = $('div.comic-title', $.parseHTML(king_result)).html();
            if (pv_imgsrc) {
                appendComic(comictitle, pv_imgsrc, id);
            } else { console.log("Failed to load " + id) }
        }
        );
    }*/

    /* get Dilbert -- retired, payed option only*/
    /* var dil_comicpath = getComicPath('dilbert', 0);
    doCORSRequest('dilbert', {
        method: 'GET',
        url: dil_comicpath
    }, function printDilComics(id, dil_result) {
        var dil_imgsrc = $('.img-comic', $.parseHTML(dil_result)).attr('src');
        appendComic('Dilbert', dil_imgsrc, id);
    }
    ); */
    /* get B.C. */
    var bc_comicpath = getComicPath('bc', 0);
    doCORSRequest('bc', {
        method: 'GET',
        url: bc_comicpath
    }, function printBCComics(id, bc_result) {
        var bc_imgsrc = $('.entry-content p img', $.parseHTML(bc_result)).attr('src');
        appendComic('B.C.', 'https://johnhartstudios.com' + bc_imgsrc, id);
    }
    );

});