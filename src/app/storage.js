export const storage = {
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
