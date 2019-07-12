const Rect = require("./rect");

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
class SelectMark {
  constructor(el, width, src, marks = []) {
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
  scale(item) {
    if (this.scaleRate === 1) return item;
    return item.map(x => x / this.scaleRate);
  }

  /** 重置 */
  reset() {
    this.actors = new Set();
    // 初始标记
    if (Array.isArray(this.marks) && this.marks.length) {
      for (const x of this.marks) {
        this.actors.add(new Rect(this, ...this.scale(x)));
      }
    }
  }

  /** 鼠标按下事件 */
  mousedown(event) {
    const { clientX, clientY } = event;
    // 是否点击在空白区域,
    // 一次来判断是要操作某一个mark还是要新建一个mark
    for (const actor of this.actors) {
      if (actor.mousedown(clientX, clientY)) {
        this.curr = actor;
        break;
      }
    }
    if (!this.curr) {
      this.curr = new Rect(this, clientX, clientY);
      this.actors.add(this.curr);
    }
    this.canvas.onmousemove = evt => {
      this.curr.mousemove(evt);
    };
  }

  /** 鼠标左键松开事件 */
  mouseup(event) {
    // 清除移动事件
    this.canvas.onmousemove = null;
    if (!this.curr) return;
    this.curr.mouseup(event);
    this.curr = null;
  }

  /** 添加事件监听 */
  addListener() {
    this.canvas.onmousedown = this.mousedown;

    this.canvas.onmouseup = this.mouseup;
  }

  /** 画布绘制 */
  draw() {
    // 游戏主循环启动
    requestAnimationFrame(this.draw);

    // 清空画布
    this.ctx.clearRect(0, 0, this.w, this.h);
    // 显示背景主图
    this.ctx.drawImage(this.img, 0, 0, this.w, this.h);

    // console.log("this.actors.size: %d", this.actors.size);
    // 更新和渲染每一个角色
    for (const actor of this.actors) {
      actor.update();
      actor.render();
    }
  }

  /** 标记开始 */
  start(w) {
    const { width, height } = this.img;
    // 图片原始宽度
    this.ow = width;
    // 图片原始高度
    this.oh = height;
    if (w) {
      this.scaleRate = width / w;
      // 图片缩放后的宽度
      this.w = w;
      // 图片缩放后的高度
      this.h = (this.w * height) / width;
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
  init(src, width) {
    const img = new Image();
    img.onload = this.start.bind(this, width);
    img.src = src;
    this.img = img;
  }
}

module.exports = SelectMark;
