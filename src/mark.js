const MW = 5;
const MH = 5;
const CS = 3; // 矩形上8个小圆圈的半径
// 矩形上的八个小圆圈绘制顺序
// 判断按下恰好相反，为逆序
const circles = ["lt", "t", "rt", "r", "rb", "b", "lb", "l"];

class Mark {
  constructor(game, x, y, w = 0, h = 0) {
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
    this.isMouseDown = false;
  }

  // 跟新8个小圆点的圆心位置
  updateCircles() {
    this.circles.lt = [this.l + CS, this.t + CS];
    this.circles.t = [(this.l + this.r) >> 1, this.t + CS];
    this.circles.rt = [this.r - CS, this.r + CS];
    this.circles.r = [this.r - CS, (this.t + this.b) >> 1];
    this.circles.rb = [this.r - CS, this.t - CS];
    this.circles.b = [(this.l + this.r) >> 1, this.b - CS];
    this.circles.lb = [this.l + CS, this.b - CS];
    this.circles.l = [this.l + CS, (this.t + this.b) >> 1];
  }

  mousedown(cX, cY) {
    const isOn =
      cX > this.x &&
      cX < this.x + this.w &&
      cY > this.y &&
      cY < this.y + this.h;
    if (!isOn) return false;

    this.isMouseDown = "o";
    for (let i = circles.length - 1; 0 <= i; i -= 1) {
      const [x, y] = this.circles[circles[i]];
      const dx = Math.abs(cX - x);
      const dy = Math.abs(cY - y);

      if (dx * dx + dy * dy <= CS * CS) {
        this.isMouseDown = circles[i];
        break;
      }
    }

    this.mousedownX = cX;
    this.mousedownX = cY;

    return true;
  }

  mousemove({ clientX, clientY }) {
    this.clientX = clientX;
    this.clientY = clientY;
  }

  mouseup() {
    this.isMouseDown = false;
    // 不能宽高分别不能小于某一个值，否则视为删除
    if (this.w < MW || this.h < MH) {
      this.actors.delete(this);
    }
    this.building = false;
  }

  update() {
    if (!this.isMouseDown) return;
    // 移动状态
    const dx = this.clientX - this.mousedownX;
    const dy = this.clientY - this.mousedownY;
    if (this.isMouseDown === "O") {
      this.x += dx;
      this.y += dy;
      this.l += dx;
      this.r += dx;
      this.t += dy;
      this.b += dy;
    } else {
      for (const x of this.isMouseDown) {
        this[x] += x === "l" || x === "r" ? dx : dy;
      }
      if (this.r < this.l) {
        const t = this.r;
        this.r = this.l;
        this.l = t;
      }
      if (this.b < this.t) {
        const t = this.b;
        this.b = this.t;
        this.t = t;
      }
      this.x = this.l;
      this.y = this.t;
      this.w = this.r - this.l;
      this.h = this.b - this.t;
    }

    this.updateCircles();
  }

  render() {
    if (!this.w || !this.h) return;
    const { ctx } = this.game;
    ctx.strokeStyle = "#ff0000";
    ctx.lineWidth = 1;
    ctx.strokeRect(this.x + CS, this.y + CS, this.w - CS * 2, this.h - CS * 2);
    for (const c of circles) {
      const [x, y] = this.circles[c];
      ctx.beginPath();
      ctx.arc(x, y, CS, 0, 2 * Math.PI, true);
      if (c === this.isMouseDown) {
        ctx.fillStyle = "#eeeeee";
      } else {
        ctx.fillStyle = "#ffffff";
      }
      ctx.fill();
      ctx.closePath();
    }
  }
}

/**
 * config 结构
 * {
 *   container: element, // 容器 dom 节点
 *   src: url, // 图片访问路径
 *   width: number, // 图片宽度
 * }
 */
// 利用canvas
class SelectMark {
  constructor(el, width, src) {
    this.el = el;
    this.canvas = document.createElement("canvas");
    this.ctx = this.canvas.getContext("2d");
    // 绑定到this上，后续反复
    this.draw = this.draw.bind(this);

    this.loadImage(src, width);
    this.addListener();
    this.curr = null; // 当前正在编辑的标记区域角色
  }

  /** 鼠标按下事件 */
  mousedown(event) {
    const { clientX, clientY } = event;
    // 是否点击在空白区域,
    // 一次来判断是要操作某一个mark还是要新建一个mark
    for (const actor of this.actors) {
      if (actor.mouseDown(clientX, clientY)) {
        this.curr = actor;
        break;
      }
    }
    if (!this.curr) {
      this.curr = new Mark(this, clientX, clientY);
      this.actors.add(this.curr);
    }
    this.canvas.onmousemove = this.curr.mousemove;
  }

  /** 鼠标左键松开事件 */
  mouseup(event) {
    // 清除移动事件
    this.canvas.onmousemove = null;
    this.curr.mouseup(event);
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
    this.drawImage(this.img, 0, 0, this.w, this.h);

    // 更新和渲染每一个角色
    for (const actor of this.actors) actor.render();
  }

  /** 标记开始 */
  start(w) {
    const { width, height } = this.img;
    // 图片原始宽度
    this.ow = width;
    // 图片原始高度
    this.oh = height;
    // 图片缩放后的高度
    this.h = (this.w * height) / width;
    // 图片缩放后的宽度
    this.w = w;

    // 清空角色列表
    this.actors = new Set();

    // 因为图片可能大小不一致
    // 因此每次都要设置画布和图片最终显示大小一致
    // 设置画布宽度
    this.canvas.width = this.w;

    // 设置画布高度
    this.canvas.height = this.h;

    this.draw();
  }

  /** 加载图片，触发主循环定时器 */
  loadImage(src, width) {
    this.img = new Image(src);
    this.onload = this.start.bind(this, width);
  }
}

module.exports = SelectMark;
