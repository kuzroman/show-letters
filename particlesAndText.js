$(function () {
    var aim = new engravingText.LoaderLetters();
    aim.addText();
    aim.showText();
});

engravingText = {};
engravingText.isLetterDrew = false;
engravingText.currentX = 0;
engravingText.currentY = 0;
engravingText.letters = [];


engravingText.LoaderLetters = function () {
    this.speed = 10;

    var self = this;
    var typingCenter = $('#typingCenter');
    var box = typingCenter.find('div');

    var description = 'Hello, my name is Roman Kuznetsov.|' +
        'I am a web Front-End Engineer, Back-End Developer and UX enthusiast.|' +
        'Check out my latest web components and brackets.io extensions at my lab page .|' +
        'Feel free to take a look at my most recent projects on my work page.|' +
        'Also you can stop and say hello at kuzroman@list.ru';

    this.addText = function () {
        var el, len = description.length;
        box.html('');
        for (var i = 0; i < len; i++) {
            if (description[i] == '|') el = $('<br>');
            else el = $('<i>').text(description[i]);
            box.append(el);
            if (len-1 <= i) {
                engravingText.letters = this.createAims();
            }
        }
    };

    this.showText = function () {
        var i = 0, isInt
            ,letters = engravingText.letters
            ,len = letters.length
            ;

        isInt = setInterval(function () {
            // draw letters
            if (i <= len-1) {
                letters[i]['el'].css({opacity:1});
                engravingText.currentX = letters[i].x1;
                engravingText.currentY = letters[i].y2;
            }
            else {
                engravingText.isLetterDrew = true;
            }

            // bits falling
            if (!engravingText.isBitsFell) {
                engravingText.clearCanvas();
                engravingText.updateBit();
            }
            else {
                clearInterval(isInt);
            }

            i++;
        }, this.speed);
    };

    this.createAims = function () {
        var objList = [];
        typingCenter.find('i').each(function (n) {
            var s = $(this); // s = symbol

            objList[n] = {
                el: s,
                killed: false,
                x1: ~~s.offset().left,
                x2: ~~( s.offset().left + s.width() ),
                y1: ~~s.offset().top,
                y2: ~~( s.offset().top + s.height() )
            };
        });
        return objList;
    };
};


var W = window.innerWidth
    ,H = window.innerHeight
    ,bits = []
    ,canvas = document.getElementById('loader')
    ,ctx = canvas.getContext("2d")
    ;

canvas.width = W;
canvas.height = H;


engravingText.Bit = function () {

    this.x = engravingText.currentX;
    this.y = engravingText.currentY;

    this.g = -Math.round( Math.random() * 50) / 10;

    this.draw = function () {
        ctx.fillStyle = '#fff';
        var size = Math.random() * 3 + 1; // 1 - 3
        ctx.fillRect(this.x, this.y, size, size);
        //console.log(this.x, this.y);
    }
};

engravingText.clearCanvas = function () {
    ctx.fillStyle = "#272822"; // bg for canvas
    ctx.fillRect(0, 0, W, H);
};

engravingText.updateBit = function () {

    if (!engravingText.isLetterDrew)
        for (var i = 0; i < 3; i++) {
            var bit = new engravingText.Bit();
            bits.push(bit);
        }

    for (var j = 0; j < bits.length; j++) {
        var b = bits[j];
        //console.log(b.y, b.g);
        b.y -= b.g;
        b.g -= 0.1;

        if (H < b.y) bits.splice(j,1);
        b.draw();
    }

    if (!bits.length) {
        engravingText.isBitsFell = true;
    }
};


engravingText.isBitsFell = false;
window.onclick = function() {
    engravingText.isBitsFell = !engravingText.isBitsFell;
};