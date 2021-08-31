可以把原本 game-board 这个 div 里的内容替换成：

```html
<div class="game-board" style="grid-template-columns: 1fr 1fr;">
  <div class="card css3" data-tech="css3">
    <div class="card__face card__face--front"></div>
    <div class="card__face card__face--back"></div>
  </div>
  <div class="card html5" data-tech="html5">
    <div class="card__face card__face--front"></div>
    <div class="card__face card__face--back"></div>
  </div>
  <div class="card css3" data-tech="css3">
    <div class="card__face card__face--front"></div>
    <div class="card__face card__face--back"></div>
  </div>
  <div class="card html5" data-tech="html5">
    <div class="card__face card__face--front"></div>
    <div class="card__face card__face--back"></div>
  </div>
</div>
```

初期专注于游戏的逻辑，之后再考虑动态加载卡片的功能。

