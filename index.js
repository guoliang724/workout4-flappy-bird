var bird = {
  skeyPosition: 0,
  skyStep: 2,
  birdTop: 220,
  startColor: "blue",
  startFlag: false,
  birdStepY: 0,
  minTop: 0,
  maxTop: 570,
  pipeLength: 7,
  pipeArr: [],
  pipeLastIndex: 6,
  score: 0,

  init() {
    this.initData();
    this.animate();
    this.handle();
  },
  initData() {
    this.el = document.getElementById("game");
    this.oBird = this.el.getElementsByClassName("bird")[0];
    this.oStart = this.el.getElementsByClassName("start")[0];
    this.oScore = this.el.getElementsByClassName("score")[0];
    this.oMask = this.el.getElementsByClassName("mask")[0];
    this.oEnd = this.el.getElementsByClassName("end")[0];
    this.oFinalScore = this.el.getElementsByClassName("final-score")[0];
    this.scoreArr = this.getScore();
    this.oRestart = this.oEnd.getElementsByClassName("restart")[0];
    this.oRankList = this.oEnd.getElementsByClassName("rank-list")[0];
  },
  getScore() {
    var scoreArr = getLocal("score");
    return scoreArr ? scoreArr : [];
  },
  animate() {
    var count = 0;
    this.timer = setInterval(() => {
      this.skyMove();
      if (this.startFlag) {
        this.birdDrop();
        this.pipeMove();
      }
      if (++count % 10 === 0) {
        if (!this.startFlag) {
          this.startBound();
          this.birdJump();
        }
        this.birdFly(count);
      }
    }, 30);
  },
  birdJump() {
    this.birdTop = this.birdTop === 220 ? 260 : 220;
    this.oBird.style.top = this.birdTop + "px";
  },
  birdFly(count) {
    this.oBird.style.backgroundPositionX = (count % 3) * -30 + "px";
  },
  birdDrop() {
    this.birdTop += ++this.birdStepY;
    this.oBird.style.top = this.birdTop + "px";
    this.judgeKnock();
    this.addScore();
  },
  judgeKnock() {
    this.judgeBoundary();
    this.judgePipe();
  },
  judgeBoundary() {
    if (this.birdTop < this.minTop || this.birdTop > this.maxTop) {
      this.failGame();
    }
  },
  judgePipe() {
    var index = this.score % this.pipeLength;
    var pipeX = this.pipeArr[index].up.offsetLeft;
    var pipeY = this.pipeArr[index].y;
    var birdY = this.birdTop;

    if (
      pipeX <= 95 &&
      pipeX >= 13 &&
      (birdY <= pipeY[0] || birdY >= pipeY[1])
    ) {
      this.failGame();
    }
  },

  addScore() {
    var index = this.score % this.pipeLength;
    var pipeX = this.pipeArr[index].up.offsetLeft;
    if (pipeX < 13) {
      this.oScore.innerText = ++this.score;
    }
  },
  skyMove() {
    this.skeyPosition -= this.skyStep;
    this.el.style.backgroundPositionX = this.skeyPosition + "px";
  },
  startBound() {
    var preColor = this.startColor;
    this.startColor = preColor === "blue" ? "white" : "blue";
    this.oStart.classList.remove("start-" + preColor);
    this.oStart.classList.add("start-" + this.startColor);
  },
  handle() {
    this.handleStart();
    this.handleClick();
    this.handleRestart();
  },
  handleStart() {
    this.oStart.onclick = () => {
      this.startFlag = true;
      this.oBird.style.left = "80px";
      this.oBird.style.transition = "none";
      this.oStart.style.display = "none";
      this.oScore.style.display = "block";
      this.skyStep = 5;
      for (var i = 0; i < this.pipeLength; i++) {
        this.createPipe(300 * (i + 1));
      }
    };
  },
  handleClick() {
    this.el.onclick = (e) => {
      if (!e.target.classList.contains("start")) {
        this.birdStepY = -10;
      }
    };
  },
  handleRestart() {
    this.oRestart.onclick = () => {
      window.location.reload();
    };
  },
  createPipe(x) {
    var upHeight = 50 + Math.floor(Math.random() * 175);
    var donwHeight = 600 - 150 - upHeight;
    var oUpPipe = createEle("div", ["pipe", "pipe-up"], {
      height: upHeight + "px",
      left: x + "px",
    });
    var oDownPipe = createEle("div", ["pipe", "pipe-down"], {
      height: donwHeight + "px",
      left: x + "px",
    });
    this.el.appendChild(oUpPipe);
    this.el.appendChild(oDownPipe);
    this.pipeArr.push({
      up: oUpPipe,
      down: oDownPipe,
      y: [upHeight, upHeight + 150],
    });
  },
  pipeMove() {
    for (var i = 0; i < this.pipeLength; i++) {
      var oUpPipe = this.pipeArr[i].up;
      var oDownPipe = this.pipeArr[i].down;
      var x = oUpPipe.offsetLeft - this.skyStep;
      if (x < -52) {
        var lastPipeLeft = this.pipeArr[this.pipeLastIndex].up.offsetLeft;
        oUpPipe.style.left = lastPipeLeft + 300 + "px";
        oDownPipe.style.left = lastPipeLeft + 300 + "px";
        this.pipeLastIndex = ++this.pipeLastIndex % this.pipeLength;

        // oUpPipe.style.height = upHeight + "px";
        // oDownPipe.style.height = donwHeight + "px";
        continue;
      }
      oUpPipe.style.left = x + "px";
      oDownPipe.style.left = x + "px";
    }
  },
  getPipeHeight() {
    var upHeight = 50 + Math.floor(Math.random() * 175);
    var donwHeight = 600 - 150 - upHeight;
    return {
      up: upHeight,
      down: donwHeight,
    };
  },
  setScore() {
    this.scoreArr.push({
      score: this.score,
      time: this.getDate(),
    });
    setLocal("score", this.scoreArr);
  },
  getDate() {
    var d = new Date();
    var year = d.getFullYear();
    var month = formatNum(d.getMonth() + 1);
    var date = formatNum(d.getDate());
    var hour = formatNum(d.getHours());
    var minute = formatNum(d.getMinutes());
    var second = formatNum(d.getSeconds());
    return `${year}.${month}.${date} ${hour}:${minute}:${second}`;
  },
  failGame() {
    clearInterval(this.timer);
    this.setScore();
    this.oMask.style.display = "block";
    this.oEnd.style.display = "block";
    this.oBird.style.display = "none";
    this.oScore.style.display = "none";
    this.oFinalScore.innerText = this.score;
    this.randerRankList();
  },
  randerRankList() {
    var template = "";
    for (var i = 0; i < this.scoreArr.length; i++) {
      var degreeClass = "";
      switch (i) {
        case 0:
          degreeClass = "first";
          break;
        case 1:
          degreeClass = "second";
          break;
        case 2:
          degreeClass = "third";
          break;
      }

      template += `
      <li class="rank-item">
      <span class="rank-degree ${degreeClass}">${i + 1}</span>
      <span class="rank-score">${this.scoreArr[i].score}</span>
      <span class="rank-time">${this.scoreArr[i].time}</span>
    </li>
      `;
    }
    this.oRankList.innerHTML = template;
  },
};
