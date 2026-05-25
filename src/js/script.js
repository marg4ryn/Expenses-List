const storage = {
  save(expenses) {
    localStorage.setItem('expenses', JSON.stringify(expenses));
  },

  load() {
    try {
      return JSON.parse(localStorage.getItem('expenses')) || [];
    } catch (e) {
      console.error('Error during parsing JSON', e);
      return [];
    }
  },
};

const state = {
  expenses: storage.load(),
  filter: '',
  sortByName: true,
  sortByNameAsc: true,
  sortByPriceAsc: false,
};

const elements = {
  form: document.querySelector('form'),
  list: document.querySelector('ul'),
  filter: document.getElementById('filter'),
  nameInput: document.getElementById('fname'),
  priceInput: document.getElementById('fprice'),
  blankMsg: document.getElementById('blankListMsg'),
  sortByNameBtn: document.getElementById('sortByNameBtn'),
  sortByPriceBtn: document.getElementById('sortByPriceBtn'),
};

elements.filter.addEventListener('input', () => {
  state.filter = elements.filter.value.trim().toLowerCase();
  render();
});

elements.sortByNameBtn.addEventListener('click', () => {
  state.sortByNameAsc = !state.sortByNameAsc;
  state.sortByPriceAsc = true;
  state.sortByName = true;
  render();
});

elements.sortByPriceBtn.addEventListener('click', () => {
  state.sortByPriceAsc = !state.sortByPriceAsc;
  state.sortByNameAsc = false;
  state.sortByName = false;
  render();
});

elements.form.addEventListener('submit', (e) => {
  e.preventDefault();

  const name = elements.nameInput.value.trim();
  const price = Number(elements.priceInput.value);

  if (!name || price <= 0) return;

  addExpense(name, price);
  elements.form.reset();
});

elements.list.addEventListener('click', (e) => {
  const li = e.target.closest('li');
  if (!li) return;
  removeExpense(li.dataset.id);
});

function updateState(updater) {
  state.expenses = updater(state.expenses);
  storage.save(state.expenses);
  render();
}

function getVisibleExpenses() {
  return [...state.expenses]
    .filter((expense) => {
      return expense.name.toLowerCase().includes(state.filter);
    })
    .sort((a, b) => {
      return state.sortByName
        ? state.sortByNameAsc
          ? a.name.localeCompare(b.name)
          : b.name.localeCompare(a.name)
        : state.sortByPriceAsc
          ? a.price - b.price
          : b.price - a.price;
    });
}

function render() {
  const visibleExpenses = getVisibleExpenses();

  elements.list.innerHTML = '';

  elements.blankMsg.style.display =
    visibleExpenses.length > 0 ? 'none' : 'block';

  visibleExpenses.forEach((expense) => {
    elements.list.appendChild(createExpenseElement(expense));
  });
}

function createExpenseElement({ id, name, price }) {
  const li = document.createElement('li');

  li.dataset.id = id;

  const spans = [
    name,
    `${Number(price).toLocaleString('pl-PL', {
      minimumFractionDigits: 2,
    })} zł`,
  ];

  spans.forEach((text) => {
    const span = document.createElement('span');
    span.textContent = text;
    li.appendChild(span);
  });

  return li;
}

function addExpense(name, price) {
  const newExpense = {
    id: crypto.randomUUID(),
    name,
    price,
  };
  updateState((prev) => [...prev, newExpense]);
}

function removeExpense(id) {
  updateState((prev) => [...prev].filter((item) => item.id !== id));
}

render();
