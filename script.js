const DEFAULT_DISHES = [
  '焼肉',
  'お寿司',
  'ラーメン',
  'カレー',
  '唐揚げ定食',
  '鍋',
  'ハンバーグ',
  'ガパオライス',
  'お好み焼き',
  'パスタ'
];

const RANKS = [
  {
    key: 'blue',
    orbClass: 'orb--blue',
    title: 'BLUE RANK',
    message: '通常演出。まずはここから。'
  },
  {
    key: 'silver',
    orbClass: 'orb--silver',
    title: 'SILVER RANK',
    message: '銀の輝き。ちょっと期待感アップ。'
  },
  {
    key: 'gold',
    orbClass: 'orb--gold',
    title: 'GOLD RANK',
    message: '金の閃光。熱い展開が来た。'
  },
  {
    key: 'rainbow',
    orbClass: 'orb--rainbow',
    title: 'RAINBOW RANK',
    message: '虹演出炸裂！今日は主役級。'
  }
];

const resultEl = document.getElementById('result');
const subResultEl = document.getElementById('subResult');
const spinButton = document.getElementById('spinButton');
const dishListEl = document.getElementById('dishList');
const dishForm = document.getElementById('dishForm');
const dishInput = document.getElementById('dishInput');
const resetButton = document.getElementById('resetButton');
const stageEl = document.getElementById('stage');
const orbEl = document.getElementById('orb');
const whiteoutEl = document.getElementById('whiteout');

let dishes = [...DEFAULT_DISHES];

function renderDishes() {
  dishListEl.innerHTML = '';
  dishes.forEach((dish) => {
    const li = document.createElement('li');
    li.className = 'dish-item';
    li.textContent = dish;
    dishListEl.appendChild(li);
  });
}

function chooseRandomDish() {
  const index = Math.floor(Math.random() * dishes.length);
  return dishes[index];
}

function chooseRank() {
  const index = Math.floor(Math.random() * RANKS.length);
  return RANKS[index];
}

function resetResultStyles() {
  resultEl.classList.remove('rank-blue', 'rank-silver', 'rank-gold', 'rank-rainbow', 'is-spinning');
}

function resetEffects() {
  stageEl.classList.remove('is-active', 'is-shaking');
  orbEl.classList.remove('is-active', 'is-power', 'orb--blue', 'orb--silver', 'orb--gold', 'orb--rainbow');
  whiteoutEl.classList.remove('is-flash');
}

function spin() {
  if (dishes.length === 0 || spinButton.disabled) {
    return;
  }

  spinButton.disabled = true;
  resetResultStyles();
  resetEffects();

  const rank = chooseRank();
  const finalDish = chooseRandomDish();

  resultEl.classList.add('is-spinning');
  resultEl.textContent = '演出スタンバイ…';
  subResultEl.textContent = `${rank.title}を判定中…`;

  setTimeout(() => {
    stageEl.classList.add('is-active');
    orbEl.classList.add(rank.orbClass, 'is-active');
  }, 240);

  setTimeout(() => {
    orbEl.classList.add('is-power');

    if (rank.key !== 'blue') {
      stageEl.classList.add('is-shaking');
    }
  }, 1080);

  setTimeout(() => {
    whiteoutEl.classList.add('is-flash');
  }, 2450);

  setTimeout(() => {
    resetResultStyles();
    resultEl.classList.add(`rank-${rank.key}`);
    resultEl.textContent = `${rank.title} - 🍽 ${finalDish}`;
    subResultEl.textContent = `${rank.message}（演出確率は4種すべて1/4）`;
    spinButton.disabled = false;
    resetEffects();
  }, 3400);
}

function addDish(rawValue) {
  const value = rawValue.trim();

  if (!value) {
    return;
  }

  if (dishes.includes(value)) {
    subResultEl.textContent = `${value} はすでに候補に入っています。`;
    return;
  }

  dishes.push(value);
  renderDishes();
  subResultEl.textContent = `「${value}」を候補に追加しました。`;
}

spinButton.addEventListener('click', spin);

dishForm.addEventListener('submit', (event) => {
  event.preventDefault();
  addDish(dishInput.value);
  dishInput.value = '';
  dishInput.focus();
});

resetButton.addEventListener('click', () => {
  dishes = [...DEFAULT_DISHES];
  renderDishes();
  subResultEl.textContent = '候補を初期状態に戻しました。';
});

renderDishes();
