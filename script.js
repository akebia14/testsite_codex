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

const resultEl = document.getElementById('result');
const subResultEl = document.getElementById('subResult');
const spinButton = document.getElementById('spinButton');
const dishListEl = document.getElementById('dishList');
const dishForm = document.getElementById('dishForm');
const dishInput = document.getElementById('dishInput');
const resetButton = document.getElementById('resetButton');

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

function spin() {
  if (dishes.length === 0 || spinButton.disabled) {
    return;
  }

  spinButton.disabled = true;
  resultEl.classList.add('is-spinning');
  subResultEl.textContent = '運命演算中…';

  let tick = 0;
  const maxTick = 16;

  const timer = setInterval(() => {
    resultEl.textContent = chooseRandomDish();
    tick += 1;

    if (tick >= maxTick) {
      clearInterval(timer);
      const finalDish = chooseRandomDish();
      resultEl.textContent = `🍽 ${finalDish}`;
      resultEl.classList.remove('is-spinning');
      subResultEl.textContent = `${finalDish}で決定。最高の一皿にしよう。`;
      spinButton.disabled = false;
    }
  }, 85);
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
