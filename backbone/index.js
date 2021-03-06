"use strict";

(function ($) {
    let o = $({});
    $.subscribe = function () {
        o.bind.apply(o, arguments);
    };
    $.unsubscribe = function () {
        o.unbind.apply(o, arguments);
    };
    $.publish = function () {
        o.trigger.apply(o, arguments);
    };
})(jQuery);

//////////////////////////////////////////////////////////

$(function () {
    engravingText.init();
});

window.engravingText = {};

engravingText.p = { // params
    W: window.innerWidth,
    H: window.innerHeight,
    bits: [],
    isBitsFell: false,
    letters: [],
    bitsSpeed: 15,
    letterSpeed: 10
};
engravingText.p.canvas = document.getElementById('loader');
engravingText.p.ctx = engravingText.p.canvas.getContext("2d");


engravingText.init = function () {
    this.events();

    this.p.canvas.width = this.p.W;
    this.p.canvas.height = this.p.H;

    let aim = new this.LoaderLetters();
    aim.addText();
    aim.showText();

};

engravingText.events = function () {
    let isAnimStarted = false;

    $.subscribe('letterShowed', (ev, positions) => {
        this.addBits(positions);
        if (!isAnimStarted) {
            isAnimStarted = true;
            this.animationBits();
        }
    });
};

engravingText.LoaderLetters = class {
    constructor() {
        this.speed = engravingText.p.letterSpeed || 0;
        this.x = 0;
        this.y = 0;

        this.typingCenter = $('#typingCenter');
        this.box = this.typingCenter.find('div');
        this.description = $('#represent').text();
    }

    addText() {
        let el, len = this.description.length;
        this.box.html('');
        for (let i = 0; i < len; i++) {
            if (this.description[i] == '|') el = $('<br>');
            else el = $('<i>').text(this.description[i]);
            this.box.append(el);
            if (len - 1 <= i) {
                engravingText.p.letters = this.createAims();
            }
        }
    }

    showText() {
        let i = 0, isInt
            , letters = engravingText.p.letters
            , len = letters.length
            ;

        isInt = setInterval(() => {
            // draw letters
            if (i <= len - 1) {
                letters[i]['el'].css({opacity: 1});
                this.x = letters[i].x1;
                this.y = letters[i].y2;

                $.publish('letterShowed', {x: this.x, y: this.y});
            }

            if (engravingText.p.isBitsFell) clearInterval(isInt);

            i++;
        }, this.speed);

    }

    createAims() {
        let objList = [];
        this.typingCenter.find('i').each(function (n) {
            let s = $(this); // s = symbol

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
    }
};


/////////////////////////////////////////////////////////////


engravingText.addBits = function (positions) {
    for (let i = 0, bit; i < 3; i++) {
        bit = new this.Bit(positions.x, positions.y);
        this.p.bits.push(bit);
    }
};
engravingText.animationBits = function () {
    setInterval(() => {
        //if (isPaused) return;
        engravingText.clearCanvas();
        engravingText.updateBit();
    }, this.p.bitsSpeed)
};


engravingText.Bit = class {
    constructor(currentX, currentY) {
        this.x = currentX || 0;
        this.y = currentY || 0;
        this.g = -Math.round(Math.random() * 50) / 10; // gravity
    }

    draw() {
        let p = engravingText.p;
        p.ctx.fillStyle = '#fff';
        let size = Math.random() * 3 + 1;
        p.ctx.fillRect(this.x, this.y, size, size);
    }
};

engravingText.clearCanvas = function () {
    this.p.ctx.fillStyle = "#272822";
    this.p.ctx.fillRect(0, 0, this.p.W, this.p.H);
};

engravingText.updateBit = function () {
    let bits = this.p.bits;

    for (let j = 0, b; j < bits.length; j++) {
        b = bits[j];
        b.y -= b.g;
        b.g -= 0.1;

        if (this.p.H < b.y) bits.splice(j, 1);
        b.draw();
    }

    if (!bits.length) {
        this.p.isBitsFell = true;
    }
};