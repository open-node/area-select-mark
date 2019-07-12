const MW = 8;
const MH = 8;
const CS = 3; // 矩形上8个小圆圈的半径
// 矩形上的八个小圆圈绘制顺序
// 判断按下恰好相反，为逆序
const circles = ["lt", "t", "rt", "r", "rb", "b", "lb", "l"];

class Rect {
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
    this.mousemove = this.mousemove.bind(this);
    this.mousemoved = false;
    this.isMouseDown = false;
  }

  // 跟新8个小圆点的圆心位置
  updateCircles() {
    this.circles.lt = [this.l + CS, this.t + CS];
    this.circles.t = [(this.l + this.r) >> 1, this.t + CS];
    this.circles.rt = [this.r - CS, this.t + CS];
    this.circles.r = [this.r - CS, (this.t + this.b) >> 1];
    this.circles.rb = [this.r - CS, this.b - CS];
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
    this.mousedownY = cY;

    return true;
  }

  mousemove({ offsetX, offsetY }) {
    this.mousemoved = true;
    this.offsetX = offsetX;
    this.offsetY = offsetY;
  }

  mouseup() {
    this.isMouseDown = false;
    // 不能宽高分别不能小于某一个值，否则视为删除
    if (this.w < MW || this.h < MH) {
      this.game.actors.delete(this);
    }
    this.building = false;
  }

  update() {
    if (!this.isMouseDown || !this.mousemoved) return;
    this.mousemoved = false;
    // 移动状态
    const dx = this.offsetX - this.mousedownX;
    const dy = this.offsetY - this.mousedownY;
    this.mousedownX = this.offsetX;
    this.mousedownY = this.offsetY;
    if (this.isMouseDown === "o") {
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
  }

  render() {
    const { ctx } = this.game;
    ctx.strokeStyle = "#ff0000";
    ctx.lineWidth = 2;
    ctx.strokeRect(this.x + CS, this.y + CS, this.w - CS * 2, this.h - CS * 2);
    for (const c of circles) {
      const [x, y] = this.circles[c];
      ctx.beginPath();
      if (c === this.isMouseDown) {
        ctx.fillStyle = "#ffff00";
      } else {
        ctx.fillStyle = "#ffffff";
      }
      ctx.arc(x, y, CS, 0, 2 * Math.PI, true);
      ctx.stroke();
      ctx.fill();
      ctx.closePath();
    }

    ctx.fillStyle = "rgba(0, 0, 0, 0.3)";
    ctx.fillRect(this.x + 5, this.y + 5, 60, 28);
    ctx.font = "宋体 20px";
    ctx.fillStyle = "rgba(255, 255, 255, 1)";
    ctx.fillText(`${this.x}, ${this.y}`, this.x + 8, this.y + 16);
    ctx.fillText(`${this.w} x ${this.h}`, this.x + 8, this.y + 28);
  }
}

module.exports = Rect;
