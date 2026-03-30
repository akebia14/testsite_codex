const cards = document.querySelectorAll('.card');

cards.forEach((card) => {
  const button = card.querySelector('.card__header');
  const body = card.querySelector('.card__body');

  button.addEventListener('click', () => {
    const isOpen = card.classList.contains('is-open');

    card.classList.toggle('is-open', !isOpen);
    button.setAttribute('aria-expanded', String(!isOpen));

    if (isOpen) {
      body.setAttribute('hidden', '');
    } else {
      body.removeAttribute('hidden');
    }
  });
});
