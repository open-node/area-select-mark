# area-select-mark

[Demo](https://open-node.github.io/area-select-mark/)

<pre>
npm install area-select-mark --save
</pre>

```js
// html
// <div id="container1"></div>
const = require('area-select-mark');

const el = document.getElementById('container1');

const selectMark = new SelectMark(
  el,                       // 事先创建一个容器
  300,                      // 图片宽度限制, 系统会自动等比缩放图片，标记位置也同样会转换
  './assets/demo1.jpg',     // 要标记的图片地址
  [                         // 初始标记
    [100, 100, 200, 150]    // x, y, 宽, 高 (此标记位置坐标以及宽高是针对原图尺寸的)
  ]                         // 可以是多项
);

const marks = selectMark.getMarks(); // 得到当前的标记(系统已做了转换，得到的坐标以及宽高均是针对原图尺寸的)
```
