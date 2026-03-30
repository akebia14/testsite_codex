const DEFAULT_DISHES = [
  { name: 'ドリップ コーヒー', size: 'Short', price: 380 },
  { name: 'ドリップ コーヒー', size: 'Tall', price: 420 },
  { name: 'スターバックス ラテ', size: 'Tall', price: 495 },
  { name: 'スターバックス ラテ', size: 'Grande', price: 540 },
  { name: 'キャラメル マキアート', size: 'Tall', price: 550 },
  { name: '抹茶 ティー ラテ', size: 'Grande', price: 590 },
  { name: 'ダーク モカ チップ フラペチーノ', size: 'Grande', price: 640 },
  { name: '抹茶 クリーム フラペチーノ', size: 'Venti', price: 680 },
  { name: 'マンゴー パッション ティー フラペチーノ', size: 'Tall', price: 590 },
  { name: 'コールドブリュー コーヒー', size: 'Venti', price: 620 }
];

const RANKS = [
  {
    key: 'blue',
    orbClass: 'orb--blue',
    title: 'BLUE RANK',
    message: '静かな立ち上がり。ウォームアップは上質に。'
  },
  {
    key: 'silver',
    orbClass: 'orb--silver',
    title: 'SILVER RANK',
    message: '銀の残光。テンションが一段、跳ね上がる。'
  },
  {
    key: 'gold',
    orbClass: 'orb--gold',
    title: 'GOLD RANK',
    message: '金の閃光。ここから先は主役ムード。'
  },
  {
    key: 'rainbow',
    orbClass: 'orb--rainbow',
    title: 'RAINBOW RANK',
    message: '虹演出炸裂。Venti級のオーラで一日を制圧。'
  }
];

const resultEl = document.getElementById('result');
const subResultEl = document.getElementById('subResult');
const spinButton = document.getElementById('spinButton');
const dishListEl = document.getElementById('dishList');
const resetButton = document.getElementById('resetButton');
const stageEl = document.getElementById('stage');
const orbEl = document.getElementById('orb');
const whiteoutEl = document.getElementById('whiteout');
const resultPopupEl = document.getElementById('resultPopup');
const popupCloseEl = document.getElementById('popupClose');
const popupRankEl = document.getElementById('popupRank');
const popupDishEl = document.getElementById('popupDish');
const popupSizePriceEl = document.getElementById('popupSizePrice');
const popupCommentEl = document.getElementById('popupComment');
const popupImageEl = document.getElementById('popupImage');

let dishes = [...DEFAULT_DISHES];

function renderDishes() {
  dishListEl.innerHTML = '';
  dishes.forEach((dish) => {
    const li = document.createElement('li');
    li.className = 'dish-item';
    li.innerHTML = `
      <span class="dish-item__name">${dish.name}</span>
      <span class="dish-item__meta">${dish.size} / ¥${dish.price.toLocaleString()}</span>
    `;
    dishListEl.appendChild(li);
  });
}

function chooseRandomDish() {
  const index = Math.floor(Math.random() * dishes.length);
  return dishes[index];
}

function chooseRankBySize(size) {
  const sizeRankMap = {
    Short: 'blue',
    Tall: 'silver',
    Grande: 'gold',
    Venti: 'rainbow'
  };

  const rankKey = sizeRankMap[size] ?? 'blue';
  return RANKS.find((rank) => rank.key === rankKey) ?? RANKS[0];
}

function resetResultStyles() {
  resultEl.classList.remove('rank-blue', 'rank-silver', 'rank-gold', 'rank-rainbow', 'is-spinning');
}

function resetEffects() {
  stageEl.classList.remove('is-active');
  orbEl.classList.remove('is-active', 'is-power', 'is-chaos', 'orb--blue', 'orb--silver', 'orb--gold', 'orb--rainbow');
  whiteoutEl.classList.remove('is-flash');
}

function closePopup() {
  resultPopupEl.classList.remove('is-open');
  resultPopupEl.setAttribute('aria-hidden', 'true');
}

function openPopup(rank, dish) {
  popupRankEl.textContent = rank.title;
  popupDishEl.textContent = dish.name;
  popupSizePriceEl.textContent = `${dish.size} / ¥${dish.price.toLocaleString()}`;
  popupCommentEl.textContent = rank.message;
  popupImageEl.className = `result-popup__image ${rank.key}`;
  resultPopupEl.classList.add('is-open');
  resultPopupEl.setAttribute('aria-hidden', 'false');
}

function spin() {
  if (dishes.length === 0 || spinButton.disabled) {
    return;
  }

  spinButton.disabled = true;
  resetResultStyles();
  resetEffects();

  const finalDish = chooseRandomDish();
  const rank = chooseRankBySize(finalDish.size);

  resultEl.classList.add('is-spinning');
  resultEl.textContent = '演出スタンバイ…';
  subResultEl.textContent = `${rank.title}を判定中…`;

  setTimeout(() => {
    stageEl.classList.add('is-active');
    orbEl.classList.add(rank.orbClass, 'is-active');
  }, 240);

  setTimeout(() => {
    orbEl.classList.add('is-power');

    if (rank.key === 'gold' || rank.key === 'rainbow') {
      orbEl.classList.add('is-chaos');
    }
  }, 1080);

  setTimeout(() => {
    whiteoutEl.classList.add('is-flash');
  }, 2450);

  setTimeout(() => {
    resetResultStyles();
    resultEl.classList.add(`rank-${rank.key}`);
    resultEl.textContent = `${rank.title} - ☕ ${finalDish.name}`;
    subResultEl.textContent = `${rank.message}（サイズ連動演出）`;
    openPopup(rank, finalDish);
    spinButton.disabled = false;
    resetEffects();
  }, 3400);
}

spinButton.addEventListener('click', spin);

resetButton.addEventListener('click', () => {
  dishes = [...DEFAULT_DISHES];
  renderDishes();
  subResultEl.textContent = '候補商品を初期状態に戻しました。';
});

popupCloseEl.addEventListener('click', closePopup);

resultPopupEl.addEventListener('click', (event) => {
  if (event.target === resultPopupEl || event.target.classList.contains('result-popup__backdrop')) {
    closePopup();
  }
});

renderDishes();
