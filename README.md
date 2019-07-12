# image-slider-push

<pre>
npm install image-slider-push --save
<pre>

```js
const Slider = require('image-slider-push');

Slider({
  width: 400,
  sleep: 20, // 每次push后暂停多久单位毫秒
  dy: 2, // 每次向上移动的距离，单位像素
  max: 3, // 容易内最多容纳的图片数量
  container: document.getElementById('container'),// 图片展示所在的容器
  queue: [], // 图片路径队列, 外部不断的push
});
```
