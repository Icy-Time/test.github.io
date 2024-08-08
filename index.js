window.addEventListener("resize", resizeCanvas, false);
window.addEventListener("DOMContentLoaded", onLoad, false);
window.requestAnimationFrame =
  window.requestAnimationFrame ||
  window.webkitRequestAnimationFrame ||
  window.mozRequestAnimationFrame ||
  window.oRequestAnimationFrame ||
  window.msRequestAnimationFrame ||
  function (callback) {
    window.setTimeout(callback, 1000 / 60);
  };
var canvas, ctx, w, h, particles = [], probability = 0.04,
  xPoint, yPoint;


// 获取时间文本元素
const timeText = document.getElementById("time");
// 获取聊天文本元素
const chatText = document.getElementById("chat-text");
// 获取祝福语文本元素
const contentText = document.querySelector("#content")
const ltText = document.querySelector(".lt")
const birthText = document.querySelector("#content .birth")

// 初始化目标时间
let targetTime = '2025/7/19 00:00:00'
let targetTimeDate = new Date(targetTime)

// 上线时间
const loginTime = {
  day: '',
  time: '' //暂时无用
}
// 上线日志-精度到天
let logTime = []


// 获取当前倒计时
/**
 * 返回一个截止指定日期的倒数时间
 * @param {date} futureTime 指定时间的日期"
 * @returns {{
 * hour: string,
 * minute: string,
 * second: string,
 * time: string,
 * state: boolean,
 * }}
 */
const countdown = (futureTime) => {
  const timeObj = {
    hour: "0",
    minute: "00",
    second: "00",
    time: '0时00分00秒',
    state: false,
  }

  const currentTime = new Date().getTime();
  const futureTimeStamp = futureTime.getTime();
  const differTime = futureTimeStamp - currentTime;

  const hour = Math.floor(differTime / (1000 * 60 * 60))
  const minute = Math.floor(differTime / (1000 * 60)) % 60;
  const second = Math.floor(differTime / 1000) % 60;

  if (hour <= 0 && minute <= 0 && second <= 0) {
    timeObj.state = true
    return timeObj
  }
  timeObj.hour = String(hour);
  // 补零
  timeObj.minute = minute < 10 ? '0' + '' + minute : String(minute)
  timeObj.second = second < 10 ? '0' + '' + second : String(second)
  timeObj.time = timeObj.hour + '时' + timeObj.minute + '分' + timeObj.second + '秒'
  return timeObj
}
// 执行倒计时
/**
 * 
 * @param {date} time 
 * @returns 
 */
const setCountdown = (time) => {
  // 封装函数判断何时展示祝福语
  /**
   * 
   * @param {boolean} show 
   */
  const showBirth = (show) => {
    if (show) {
      // 先出现烟花
      let timer = setTimeout(() => {
        timeText.innerHTML = ""
        window.requestAnimationFrame(updateWorld);

        // // 然后出现名字
        // let timer1 = setTimeout(() => {
        //   ltText.style.transform = "scale(1)"

        //   // 接着出现祝福
        //   let timer2 = setTimeout(() => {
        //     birthText.style.transform = "scale(1)"

        //     // 最后清除所有定时器
        //     clearTimeout(timer)
        //     clearTimeout(timer1)
        //     clearTimeout(timer2)
        //     timer = null
        //     timer1 = null
        //     timer2 = null
        //   }, 1000);
        // }, 1000)
        clearTimeout(timer)
        timer = null
      }, 1000)

    }
  }
  // 封装函数判断何时倒计时移动到中间
  /**
   * 
   * @param {{
   * hour:string,
   * minute: string,
   * second: string
   * }} time 
   * @returns boolean
   */
  const moveTimeElement = (time) => {
    const hour = Number(time.hour)
    const minute = Number(time.minute)
    const second = Number(time.second)
    if (hour > 0 || minute > 0 || second > 5 || second < 3) {
      return false
    }

    timeText.style.fontSize = "10vw"
    timeText.style.bottom = "50vh"
    timeText.style.right = `calc(50% - ${30}vw)`
    return true
  }


  let timer = null
  // 首次执行时间函数先运行一次获取倒计时
  const timeObj = countdown(time)
  timeText.innerHTML = timeObj.time
  // showBirth(timeObj.state)
  showBirth(true)
  let isTimeMove = moveTimeElement(timeObj)
  // 如果首次倒计时小于等于零，则不执行定时器
  if (timeObj.state) return

  timer = setInterval(() => {
    const realTime = countdown(time)
    timeText.innerHTML = realTime.time
    showBirth(realTime.state)

    if (!isTimeMove) {
      isTimeMove = moveTimeElement(realTime)
    }

    if (realTime.state) {
      clearInterval(timer)
      timer = null
    }
  }, 1000)
}

// 获取上线日志，并记录当前上线时间
const setLogTime = () => {
  logTime = JSON.parse(localStorage.getItem("logTime")) || []
  const date = new Date()
  loginTime.time = date.getTime()
  loginTime.day = date.getFullYear() + '/' + (date.getMonth() + 1) + '/' + date.getDate()

  // 如果是当天再次上线，则不录入上线日志
  if (logTime.length > 0 && logTime[0].day == loginTime.day) return
  logTime.unshift(loginTime)
  localStorage.setItem('logTime', JSON.stringify(logTime))

}

function onLoad() {
  canvas = document.getElementById("canvas");
  ctx = canvas.getContext("2d");
  resizeCanvas();
  // window.requestAnimationFrame(updateWorld);

  // 上线
  setLogTime()

  // 倒计时
  setCountdown(targetTimeDate)
}

// 窗口变化时执行
function resizeCanvas() {
  if (!!canvas) {
    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight;
  }
}

function updateWorld() {
  update();
  paint();
  window.requestAnimationFrame(updateWorld);
}

function update() {
  if (particles.length < 500 && Math.random() < probability) {
    createFirework();
  }
  var alive = [];
  for (var i = 0; i < particles.length; i++) {
    if (particles[i].move()) {
      alive.push(particles[i]);
    }
  }
  particles = alive;
}

function paint() {
  ctx.globalCompositeOperation = 'source-over';
  ctx.fillStyle = "rgba(0,0,0,0.2)";
  ctx.fillRect(0, 0, w, h);
  ctx.globalCompositeOperation = 'lighter';
  for (var i = 0; i < particles.length; i++) {
    particles[i].draw(ctx);
  }
}

function createFirework() {
  xPoint = Math.random() * (w - 200) + 100;
  yPoint = Math.random() * (h - 200) + 100;
  var nFire = Math.random() * 50 + 100;
  var c = "rgb(" + (~~(Math.random() * 200 + 55)) + ","
    + (~~(Math.random() * 200 + 55)) + "," + (~~(Math.random() * 200 + 55)) + ")";
  for (var i = 0; i < nFire; i++) {
    var particle = new Particle();
    particle.color = c;
    var vy = Math.sqrt(25 - particle.vx * particle.vx);
    if (Math.abs(particle.vy) > vy) {
      particle.vy = particle.vy > 0 ? vy : -vy;
    }
    particles.push(particle);
  }
}

function Particle() {
  this.w = this.h = Math.random() * 4 + 1;
  this.x = xPoint - this.w / 2;
  this.y = yPoint - this.h / 2;
  this.vx = (Math.random() - 0.5) * 10;
  this.vy = (Math.random() - 0.5) * 10;
  this.alpha = Math.random() * .5 + .5;
  this.color;
}

Particle.prototype = {
  gravity: 0.05,
  move: function () {
    this.x += this.vx;
    this.vy += this.gravity;
    this.y += this.vy;
    this.alpha -= 0.01;
    if (this.x <= -this.w || this.x >= screen.width ||
      this.y >= screen.height ||
      this.alpha <= 0) {
      return false;
    }
    return true;
  },
  draw: function (c) {
    c.save();
    c.beginPath();
    c.translate(this.x + this.w / 2, this.y + this.h / 2);
    c.arc(0, 0, this.w, 0, Math.PI * 2);
    c.fillStyle = this.color;
    c.globalAlpha = this.alpha;
    c.closePath();
    c.fill();
    c.restore();
  }
} 
