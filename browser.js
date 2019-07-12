(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.SelectMark = f()}})(function(){var define,module,exports;return (function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Rect = require("./rect");

/**
 * config 结构
 * {
 *   container: element, // 容器 dom 节点
 *   src: url, // 图片访问路径
 *   width: number, // 图片宽度
 *   marks: [], // 初始标记集合
 * }
 */
// 利用canvas

var SelectMark = function () {
  function SelectMark(el, width, src) {
    var marks = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : [];

    _classCallCheck(this, SelectMark);

    this.el = el;
    this.canvas = document.createElement("canvas");
    this.el.appendChild(this.canvas);
    this.ctx = this.canvas.getContext("2d");
    // 绑定到this上，后续反复
    this.draw = this.draw.bind(this);
    this.mousedown = this.mousedown.bind(this);
    this.mouseup = this.mouseup.bind(this);

    this.marks = marks;

    this.init(src, width, marks);
    this.addListener();
    this.curr = null; // 当前正在编辑的标记区域角色
  }

  /** 缩放坐标 */


  _createClass(SelectMark, [{
    key: "scale",
    value: function scale(item) {
      var _this = this;

      if (this.scaleRate === 1) return item;
      return item.map(function (x) {
        return x / _this.scaleRate;
      });
    }

    /** 获取标记 */

  }, {
    key: "getMarks",
    value: function getMarks() {
      var rate = this.scaleRate;
      return Array.from(this.actors).map(function (_ref) {
        var x = _ref.x,
            y = _ref.y,
            w = _ref.w,
            h = _ref.h;
        return [x * rate, y * rate, w * rate, h * rate];
      });
    }

    /** 重置 */

  }, {
    key: "reset",
    value: function reset() {
      this.actors = new Set();
      // 初始标记
      if (Array.isArray(this.marks) && this.marks.length) {
        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
          for (var _iterator = this.marks[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var x = _step.value;

            this.actors.add(new (Function.prototype.bind.apply(Rect, [null].concat([this], _toConsumableArray(this.scale(x)))))());
          }
        } catch (err) {
          _didIteratorError = true;
          _iteratorError = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion && _iterator.return) {
              _iterator.return();
            }
          } finally {
            if (_didIteratorError) {
              throw _iteratorError;
            }
          }
        }
      }
    }

    /** 鼠标按下事件 */

  }, {
    key: "mousedown",
    value: function mousedown(event) {
      var _this2 = this;

      var clientX = event.clientX,
          clientY = event.clientY;
      // 是否点击在空白区域,
      // 一次来判断是要操作某一个mark还是要新建一个mark

      var _iteratorNormalCompletion2 = true;
      var _didIteratorError2 = false;
      var _iteratorError2 = undefined;

      try {
        for (var _iterator2 = this.actors[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
          var actor = _step2.value;

          if (actor.mousedown(clientX, clientY)) {
            this.curr = actor;
            break;
          }
        }
      } catch (err) {
        _didIteratorError2 = true;
        _iteratorError2 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion2 && _iterator2.return) {
            _iterator2.return();
          }
        } finally {
          if (_didIteratorError2) {
            throw _iteratorError2;
          }
        }
      }

      if (!this.curr) {
        this.curr = new Rect(this, clientX, clientY);
        this.actors.add(this.curr);
      }
      this.canvas.onmousemove = function (evt) {
        _this2.curr.mousemove(evt);
      };
    }

    /** 鼠标左键松开事件 */

  }, {
    key: "mouseup",
    value: function mouseup(event) {
      // 清除移动事件
      this.canvas.onmousemove = null;
      if (!this.curr) return;
      this.curr.mouseup(event);
      this.curr = null;
    }

    /** 添加事件监听 */

  }, {
    key: "addListener",
    value: function addListener() {
      this.canvas.onmousedown = this.mousedown;

      this.canvas.onmouseup = this.mouseup;
    }

    /** 画布绘制 */

  }, {
    key: "draw",
    value: function draw() {
      // 游戏主循环启动
      requestAnimationFrame(this.draw);

      // 清空画布
      this.ctx.clearRect(0, 0, this.w, this.h);
      // 显示背景主图
      this.ctx.drawImage(this.img, 0, 0, this.w, this.h);

      // console.log("this.actors.size: %d", this.actors.size);
      // 更新和渲染每一个角色
      var _iteratorNormalCompletion3 = true;
      var _didIteratorError3 = false;
      var _iteratorError3 = undefined;

      try {
        for (var _iterator3 = this.actors[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
          var actor = _step3.value;

          actor.update();
          actor.render();
        }
      } catch (err) {
        _didIteratorError3 = true;
        _iteratorError3 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion3 && _iterator3.return) {
            _iterator3.return();
          }
        } finally {
          if (_didIteratorError3) {
            throw _iteratorError3;
          }
        }
      }
    }

    /** 标记开始 */

  }, {
    key: "start",
    value: function start(w) {
      var _img = this.img,
          width = _img.width,
          height = _img.height;
      // 图片原始宽度

      this.ow = width;
      // 图片原始高度
      this.oh = height;
      if (w) {
        this.scaleRate = width / w;
        // 图片缩放后的宽度
        this.w = w;
        // 图片缩放后的高度
        this.h = this.w * height / width;
      } else {
        this.scaleRate = 1;
        this.w = width;
        this.h = height;
      }

      // 清空角色列表
      this.actors = new Set();

      // 因为图片可能大小不一致
      // 因此每次都要设置画布和图片最终显示大小一致
      // 设置画布宽度
      this.canvas.width = this.w;

      // 设置画布高度
      this.canvas.height = this.h;

      // 重置初始标记
      this.reset();

      this.draw();
    }

    /** 加载图片，触发主循环定时器 */

  }, {
    key: "init",
    value: function init(src, width) {
      var img = new Image();
      img.onload = this.start.bind(this, width);
      img.src = src;
      this.img = img;
    }
  }]);

  return SelectMark;
}();

module.exports = SelectMark;
},{"./rect":2}],2:[function(require,module,exports){
"use strict";

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var MW = 5;
var MH = 5;
var CS = 3; // 矩形上8个小圆圈的半径
// 矩形上的八个小圆圈绘制顺序
// 判断按下恰好相反，为逆序
var circles = ["lt", "t", "rt", "r", "rb", "b", "lb", "l"];

var Rect = function () {
  function Rect(game, x, y) {
    var w = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 0;
    var h = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : 0;

    _classCallCheck(this, Rect);

    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.t = y;
    this.b = y + this.h;
    this.l = x;
    this.r = x + this.w;
    this.game = game;
    this.building = true;
    this.circles = {};
    this.updateCircles();
    // 鼠标按下的位置编号
    // lt: 左上角
    // t: 上边
    // rt: 右上角
    // r: 右边
    // rb: 右下角
    // b: 下边
    // lb: 左下角
    // l: 左边
    // o: 非以上点，但是在矩形上
    // false 不在矩形上
    this.mousemove = this.mousemove.bind(this);
    this.mousemoved = false;
    this.isMouseDown = false;
  }

  // 跟新8个小圆点的圆心位置


  _createClass(Rect, [{
    key: "updateCircles",
    value: function updateCircles() {
      this.circles.lt = [this.l + CS, this.t + CS];
      this.circles.t = [this.l + this.r >> 1, this.t + CS];
      this.circles.rt = [this.r - CS, this.t + CS];
      this.circles.r = [this.r - CS, this.t + this.b >> 1];
      this.circles.rb = [this.r - CS, this.b - CS];
      this.circles.b = [this.l + this.r >> 1, this.b - CS];
      this.circles.lb = [this.l + CS, this.b - CS];
      this.circles.l = [this.l + CS, this.t + this.b >> 1];
    }
  }, {
    key: "mousedown",
    value: function mousedown(cX, cY) {
      var isOn = cX > this.x && cX < this.x + this.w && cY > this.y && cY < this.y + this.h;
      if (!isOn) return false;

      this.isMouseDown = "o";
      for (var i = circles.length - 1; 0 <= i; i -= 1) {
        var _circles$circles$i = _slicedToArray(this.circles[circles[i]], 2),
            x = _circles$circles$i[0],
            y = _circles$circles$i[1];

        var dx = Math.abs(cX - x);
        var dy = Math.abs(cY - y);

        if (dx * dx + dy * dy <= CS * CS) {
          this.isMouseDown = circles[i];
          break;
        }
      }

      this.mousedownX = cX;
      this.mousedownY = cY;

      console.log("MouseDown: StartPos [%d, %d], type: %s", cX, cY, this.isMouseDown);
      return true;
    }
  }, {
    key: "mousemove",
    value: function mousemove(_ref) {
      var clientX = _ref.clientX,
          clientY = _ref.clientY;

      this.mousemoved = true;
      this.clientX = clientX;
      this.clientY = clientY;

      console.log("mousemove: [%d, %d]", clientX, clientY);
    }
  }, {
    key: "mouseup",
    value: function mouseup(_ref2) {
      var clientX = _ref2.clientX,
          clientY = _ref2.clientY;

      console.log("mouseup: [%d, %d]", clientX, clientY);
      this.isMouseDown = false;
      // 不能宽高分别不能小于某一个值，否则视为删除
      if (this.w < MW || this.h < MH) {
        // this.game.actors.delete(this);
      }
      this.building = false;
    }
  }, {
    key: "update",
    value: function update() {
      if (!this.isMouseDown || !this.mousemoved) return;
      this.mousemoved = false;
      // 移动状态
      var dx = this.clientX - this.mousedownX;
      var dy = this.clientY - this.mousedownY;
      this.mousedownX = this.clientX;
      this.mousedownY = this.clientY;
      console.log("update: %d, %d", dx, dy);
      if (this.isMouseDown === "o") {
        this.x += dx;
        this.y += dy;
        this.l += dx;
        this.r += dx;
        this.t += dy;
        this.b += dy;
      } else {
        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
          for (var _iterator = this.isMouseDown[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var x = _step.value;

            this[x] += x === "l" || x === "r" ? dx : dy;
          }
        } catch (err) {
          _didIteratorError = true;
          _iteratorError = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion && _iterator.return) {
              _iterator.return();
            }
          } finally {
            if (_didIteratorError) {
              throw _iteratorError;
            }
          }
        }

        if (this.r < this.l) {
          var t = this.r;
          this.r = this.l;
          this.l = t;
        }
        if (this.b < this.t) {
          var _t = this.b;
          this.b = this.t;
          this.t = _t;
        }
        this.x = this.l;
        this.y = this.t;
        this.w = this.r - this.l;
        this.h = this.b - this.t;
      }

      // 边界判断
      if (this.x < 0) this.x = 0;
      if (this.l < 0) this.l = 0;
      if (this.y < 0) this.y = 0;
      if (this.t < 0) this.t = 0;
      if (this.game.w < this.r) this.r = this.game.w;
      if (this.game.h < this.b) this.b = this.game.h;

      this.w = this.r - this.l;
      this.h = this.b - this.t;

      this.updateCircles();
      console.log(this);
    }
  }, {
    key: "render",
    value: function render() {
      var ctx = this.game.ctx;

      ctx.strokeStyle = "#ff0000";
      ctx.lineWidth = 2;
      ctx.strokeRect(this.x + CS, this.y + CS, this.w - CS * 2, this.h - CS * 2);
      var _iteratorNormalCompletion2 = true;
      var _didIteratorError2 = false;
      var _iteratorError2 = undefined;

      try {
        for (var _iterator2 = circles[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
          var c = _step2.value;

          var _circles$c = _slicedToArray(this.circles[c], 2),
              x = _circles$c[0],
              y = _circles$c[1];

          ctx.beginPath();
          if (c === this.isMouseDown) {
            ctx.fillStyle = "#eeeeee";
          } else {
            ctx.fillStyle = "#ffffff";
          }
          ctx.arc(x, y, CS, 0, 2 * Math.PI, true);
          // console.log(x, y, CS, 0, 2 * Math.PI, true);
          ctx.stroke();
          ctx.fill();
          ctx.closePath();
        }
      } catch (err) {
        _didIteratorError2 = true;
        _iteratorError2 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion2 && _iterator2.return) {
            _iterator2.return();
          }
        } finally {
          if (_didIteratorError2) {
            throw _iteratorError2;
          }
        }
      }

      ctx.fillStyle = "rgba(0, 0, 0, 0.3)";
      ctx.fillRect(this.x + 5, this.y + 5, 60, 28);
      ctx.font = "宋体 20px";
      ctx.fillStyle = "rgba(255, 255, 255, 1)";
      ctx.fillText(this.x + ", " + this.y, this.x + 8, this.y + 16);
      ctx.fillText(this.w + " x " + this.h, this.x + 8, this.y + 28);
    }
  }]);

  return Rect;
}();

module.exports = Rect;
},{}]},{},[1])(1)
});
