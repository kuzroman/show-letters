"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

(function ($) {
    var o = $({});
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

    var aim = new this.LoaderLetters();
    aim.addText();
    aim.showText();
};

engravingText.events = function () {
    var _this = this;

    var isAnimStarted = false;

    $.subscribe('letterShowed', function (ev, positions) {
        _this.addBits(positions);
        if (!isAnimStarted) {
            isAnimStarted = true;
            _this.animationBits();
        }
    });
};

engravingText.LoaderLetters = (function () {
    function _class() {
        _classCallCheck(this, _class);

        this.speed = engravingText.p.letterSpeed || 0;
        this.x = 0;
        this.y = 0;

        this.typingCenter = $('#typingCenter');
        this.box = this.typingCenter.find('div');
        this.description = $('#represent').text();
    }

    _createClass(_class, [{
        key: "addText",
        value: function addText() {
            var el = undefined,
                len = this.description.length;
            this.box.html('');
            for (var i = 0; i < len; i++) {
                if (this.description[i] == '|') el = $('<br>');else el = $('<i>').text(this.description[i]);
                this.box.append(el);
                if (len - 1 <= i) {
                    engravingText.p.letters = this.createAims();
                }
            }
        }
    }, {
        key: "showText",
        value: function showText() {
            var _this2 = this;

            var i = 0,
                isInt = undefined,
                letters = engravingText.p.letters,
                len = letters.length;

            isInt = setInterval(function () {
                // draw letters
                if (i <= len - 1) {
                    letters[i]['el'].css({ opacity: 1 });
                    _this2.x = letters[i].x1;
                    _this2.y = letters[i].y2;

                    $.publish('letterShowed', { x: _this2.x, y: _this2.y });
                }

                if (engravingText.p.isBitsFell) clearInterval(isInt);

                i++;
            }, this.speed);
        }
    }, {
        key: "createAims",
        value: function createAims() {
            var objList = [];
            this.typingCenter.find('i').each(function (n) {
                var s = $(this); // s = symbol

                objList[n] = {
                    el: s,
                    killed: false,
                    x1: ~ ~s.offset().left,
                    x2: ~ ~(s.offset().left + s.width()),
                    y1: ~ ~s.offset().top,
                    y2: ~ ~(s.offset().top + s.height())
                };
            });
            return objList;
        }
    }]);

    return _class;
})();

/////////////////////////////////////////////////////////////

engravingText.addBits = function (positions) {
    for (var i = 0, bit = undefined; i < 3; i++) {
        bit = new this.Bit(positions.x, positions.y);
        this.p.bits.push(bit);
    }
};
engravingText.animationBits = function () {
    setInterval(function () {
        //if (isPaused) return;
        engravingText.clearCanvas();
        engravingText.updateBit();
    }, this.p.bitsSpeed);
};

engravingText.Bit = (function () {
    function _class2(currentX, currentY) {
        _classCallCheck(this, _class2);

        this.x = currentX || 0;
        this.y = currentY || 0;
        this.g = -Math.round(Math.random() * 50) / 10; // gravity
    }

    _createClass(_class2, [{
        key: "draw",
        value: function draw() {
            var p = engravingText.p;
            p.ctx.fillStyle = '#fff';
            var size = Math.random() * 3 + 1;
            p.ctx.fillRect(this.x, this.y, size, size);
        }
    }]);

    return _class2;
})();

engravingText.clearCanvas = function () {
    this.p.ctx.fillStyle = "#272822";
    this.p.ctx.fillRect(0, 0, this.p.W, this.p.H);
};

engravingText.updateBit = function () {
    var bits = this.p.bits;

    for (var j = 0, b = undefined; j < bits.length; j++) {
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

//# sourceMappingURL=index-compiled.js.map