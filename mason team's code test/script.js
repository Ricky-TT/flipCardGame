// css class for different card image
const CARD_TECHS = [
  'html5',
  'css3',
  'js',
  'sass',
  'nodejs',
  'react',
  'linkedin',
  'heroku',
  'github',
  'aws'
];

// only list out some of the properties,
// add more when needed
const game = {
  score: 0,
  level: 1,
  timer: 60,
  timerDisplay: null,
  scoreDisplay: null,
  levelDisplay: null,
  timerInterval: null,
  startButton: null,
  // and much more
  boardDisplay: null, // 游戏主体
  cardActiveDispaly: null, // 上一次点击的卡片元素
  isPunishment: false, // 是否被惩罚
};

setGame();

/*******************************************
/     game process
/******************************************/
function setGame() {
  // register any element in your game object
  
  // 获取开始游戏的元素并赋值
  game.startButton = document.querySelector('.game-stats__button')
  // 获取分数的元素并赋值
  game.scoreDisplay = document.querySelector('.game-stats__score--value')
  // 获取时间进度条的元素并赋值
  game.timerDisplay = document.querySelector('.game-timer__bar')
  // 获取游戏主体的元素并赋值
  game.boardDisplay = document.querySelector('.game-board')
  // 获取游戏等级的元素并赋值
  game.levelDisplay = document.querySelector('.game-stats__level--value')
}
// 开始游戏
function startGame() {
  // es6的解构赋值 参考https://www.runoob.com/w3cnote/deconstruction-assignment.html
  // 获取开始游戏的元素
  let { startButton } = game
  /**
   *  获取元素的innerText
   *  New Game说明是新游戏
   *  Start Game说明已经游戏已经结束，要进行新游戏
   *  End Game说明游戏再进行中，要结束游戏
   */
  let text = startButton.innerText
  if (text == 'New Game') {
    startButton.innerText = 'End Game'
    // 开始计时
    updateTimerDisplay()
    // 渲染卡牌
    handleCardFlip()
  } else if (text == 'Start Game') {
    startButton.innerText = 'End Game'
    // 要进行新游戏，所以将分数重新设为0，这个时候页面没有更新，要重新渲染
    game.score = 0
    // 渲染分数
    updateScore(true)
    // 要进行新游戏，所以将等级重新设为1，这个时候页面没有更新，要重新渲染
    game.level = 1
    // 渲染等级
    updateLevel()
    // 开始计时
    updateTimerDisplay()
    // 渲染卡牌
    handleCardFlip()
  } else if (text == 'End Game') {
    // 结束游戏
    handleGameOver()
  }
}
// 从数组中随机取几个元素
const sampleSize = ([...arr], n = 1) => {
  if (n > arr.length) {
    arr = arr.concat(sampleSize(arr, n - arr.length))
  }
  let m = arr.length;
  while (m) {
    const i = Math.floor(Math.random() * m--);
    [arr[m], arr[i]] = [arr[i], arr[m]];
  }
  return arr.slice(0, n);
};
// 渲染卡牌
function handleCardFlip() {
  // 获取等级、和游戏主体
  let { level, boardDisplay } = game
  // 获取与等级相对应的卡牌数组 1级为2 2级为8 3级为18
  let tempArr = sampleSize(CARD_TECHS, (level * level) * 2)
  // 将数组再合并一次，保证可以两两对应
  tempArr = tempArr.concat(tempArr)
  // 将数组打乱顺序
  tempArr = sampleSize(tempArr, tempArr.length)
  // 生成卡牌代码
  let html = ''
  tempArr.forEach(element => {
    html += `
    <div class="card ${ element }" data-tech="${ element }" onclick="handleCardClick(this)">
      <div class="card__face card__face--front"></div>
      <div class="card__face card__face--back"></div>
    </div>
    `
  });
  // 设置排列方式 参考grid布局
  boardDisplay.style.gridTemplateColumns = `repeat(${ level * 2 }, 1fr)`
  // 渲染卡牌
  boardDisplay.innerHTML = html
}
// 升级
function nextLevel() {
  /**
   * 获取等级
   * 如果等级为3，那么结束游戏，否则升级
   */
  let { level } = game
  if (level == 3) {
    // 定时器的目的是让动画走完
    setTimeout(() => {
      // 结束游戏
      handleGameOver()
    }, 1000)
  } else {
    // 升级
    level++
    // 更新等级
    game.level = level
    // 渲染等级
    updateLevel()
    // 开始计时
    updateTimerDisplay()
    // 定时器的目的是让动画走完
    setTimeout(() => {
      // 渲染卡牌
      handleCardFlip()
    }, 1000)
  }
}
// 结束游戏
function handleGameOver() {
  // 获取分数与开始游戏的按钮
  let { score, startButton } = game
  // 如果倒计时没走完，结束倒计时
  if (game.timerInterval) {
    // 结束倒计时
    clearInterval(game.timerInterval)
  }
  // 更改按钮文字
  startButton.innerText = 'Start Game'
  // 弹出当前分数
  alert(`Congratulations, your score is ${ score }`)
}

/*******************************************
/     UI update
/******************************************/
/**
 * 渲染分数
 * isInitialization 是否初始化，是：说明重新开始游戏，将分数设置为0；否：说明匹配成功，分数 + 当前等级 ^ 2 x 当前倒计时剩余的时间
 */
function updateScore(isInitialization) {
  // 获取分数元素、等级、倒计时、分数
  let { scoreDisplay, level, timer, score } = game
  score = isInitialization ? 0 : (score + (Math.pow(level, 2) * timer))
  game.score = score
  scoreDisplay.innerText = score
}
// 渲染等级
function updateLevel() {
  // 获取等级、等级元素
  let { level, levelDisplay } = game
  // 将等级元素里的文字改为对应等级
  levelDisplay.innerText = level
}
// 渲染倒计时
function updateTimerDisplay() {
  // 将倒计时时间重置为60
  game.timer = 60
  // 如果之前有倒计时定时器，则清除
  if (game.timerInterval) {
    // 清除定时器
    clearInterval(game.timerInterval)
  }
  // 获取倒计时元素、倒计时时间
  let { timerDisplay, timer } = game
  // 将当前的倒计时时间记录下来
  let time = timer
  // 把定时器赋值给game.timerInterval以便随时取消
  game.timerInterval = setInterval(() => {
    // 减少时间
    timer--
    // 给game中的倒计时时间赋值
    game.timer = timer
    /**
     * timer < 0 说明倒计时结束，结束游戏
     * timer >= 0 渲染进度条、渲染倒计时时间
     */
    if (timer < 0) {
      // 结束游戏
      handleGameOver()
    } else {
      // 渲染进度条
      timerDisplay.style.width = `${ (100 / time) * timer }%`
      // 渲染倒计时时间
      timerDisplay.innerText = `${ timer }s`
    }
  }, 1000)
}

/*******************************************
/     bindings
/******************************************/

function bindStartButton() {}

function unBindCardClick(card) {}

function bindCardClick() {}
// 卡牌点击事件
function handleCardClick(el) {
  // 获取上一次点击的卡片元素、是否被惩罚、游戏主体元素
  let { cardActiveDispaly, isPunishment, boardDisplay } = game
  // 如果在惩罚中，那么终止当前事件
  if (isPunishment) return false
  // 翻转卡牌
  el.classList.add('card--flipped')
  // 如果上一次点击的卡片元素存在，那么匹配两者是否配对
  if (cardActiveDispaly) {
    // 获取上一次点击的卡片元素的tech值
    var activeTech = cardActiveDispaly.dataset.tech
  }
  // 获取本次点击的卡片元素的tech值
  let tech = el.dataset.tech
  /**
   * 将上一次点击的卡片元素与本次点击的卡片元素配对
   * activeTech与tech相同说明配对成功
   */
  if (activeTech === tech) {
    // 配对成功，将上一次点击的卡片元素重置为null
    game.cardActiveDispaly = null
    // 渲染分数
    updateScore()
    // 定义hasFlippedNum（含有card--flipped的卡牌数量）
    let hasFlippedNum = 0
    // 获取当前所有的卡牌元素
    let elementAll = boardDisplay.querySelectorAll('.card')
    // 循环当前所有的卡牌元素，判断每个卡牌是否被翻转（含有card--flipped的class）
    elementAll.forEach(row => {
      // 如果被翻转hasFlippedNum加1
      if (row.classList.contains('card--flipped')) {
        hasFlippedNum++
      }
    })
    // 如果被翻转的卡牌数量等于全部的卡牌数量，说明当前全部配对成功
    if (hasFlippedNum == elementAll.length) {
      // 升级
      nextLevel()
    }
  } else {
    if (cardActiveDispaly) {
      // 进入惩罚时间
      game.isPunishment = true
      setTimeout(() => {
        // 再次翻转卡牌
        el.classList.remove('card--flipped')
        cardActiveDispaly.classList.remove('card--flipped')
        // 将上一次点击的卡片元素重置为null
        game.cardActiveDispaly = null
        // 1.5s后结束惩罚
        game.isPunishment = false
      }, 1500)
    } else {
      // 将上一次点击的卡片元素变更为本次点击的卡片元素
      game.cardActiveDispaly = el
    }
  }
}
