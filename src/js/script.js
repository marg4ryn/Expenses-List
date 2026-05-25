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
  sortAsc: true,
};

const elements = {
  form: document.querySelector('form'),
  list: document.querySelector('ul'),
  filter: document.getElementById('filter'),
  sortBtn: document.getElementById('sortBtn'),
  blankMsg: document.getElementById('blankListMsg'),
  nameInput: document.getElementById('fname'),
  priceInput: document.getElementById('fprice'),
};

elements.filter.addEventListener('input', () => {
  state.filter = elements.filter.value.trim().toLowerCase();
  render();
});

elements.sortBtn.addEventListener('click', () => {
  state.sortAsc = !state.sortAsc;
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
      return state.sortAsc
        ? a.name.localeCompare(b.name)
        : b.name.localeCompare(a.name);
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

function createExpenseElement(expense) {
  const li = document.createElement('li');
  li.textContent = `${expense.name}: ${expense.price}`;
  li.dataset.id = expense.id;
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
