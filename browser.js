(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.SelectMark = f()}})(function(){var define,module,exports;return (function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

/**
 * config 结构
 * {
 *   container: element, // 容器 dom 节点
 *   src: url, // 图片访问路径
 *   width: number, // 图片宽度
 *   success: function, // 成功回调函数
 *   marks: [[number, number, number, number]], // 初始化的标记
 *   faild: function, // 失败回调函数
 * }
 */
// 利用canvas
var SelectMark = function SelectMark(_ref) {
  var container = _ref.container,
      width = _ref.width,
      src = _ref.src,
      marks = _ref.marks,
      success = _ref.success,
      faild = _ref.faild;

  if (!container || !container.appendChild) throw Error("\u6307\u5B9A\u5BB9\u5668\u4E0D\u5B58\u5728");

  var img = new Image();
  var canvas = document.createElement("canvas");
  var tools = document.createElement("div");
  var okBtn = document.createElement("button");
  var resetBtn = document.createElement("button");
  okBtn.innerHTML = "确认";
  resetBtn.innerHTML = "重置";
  tools.appendChild(okBtn);
  tools.appendChild(resetBtn);

  var ctx = canvas.getContext("2d");
  var _marks = marks.slice();

  var containerInit = function containerInit() {
    if (!width) width = img.width;
    var h = img.height * width / img.width;
    canvas.height = h;
    canvas.width = width;
    container.appendChild(canvas);
    container.appendChild(tools);
    img.width = width;
    img.height = h;

    ctx.drawImage(img, 0, 0);
  };

  var draw = function draw() {
    _marks.forEach(function (r) {
      ctx.fillStyle = "#ff0000";
      ctx.strokeRect.apply(ctx, _toConsumableArray(r));
      ctx.fill();
      setTimeout(function () {
        ctx.drawImage(img, 0, 0);
      }, 5 * 1000);
    });
  };

  var onload = function onload() {
    // 容器初始化
    containerInit();

    draw();
  };

  var init = function init() {
    // 加载图片，为了计算合适的区域宽高, 同时也证明图片确实存在
    img.onload = onload;
    img.src = src;
  };

  init();
};

module.exports = SelectMark;
},{}]},{},[1])(1)
});
