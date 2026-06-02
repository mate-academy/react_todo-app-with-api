enum FILTERS {
  all = 'all',
  completed = 'completed',
  active = 'active',
}

export function getFilterTodos(todo, selected) {
  return todo.filter(todos => {
    if (selected === FILTERS.active) {
      return !todos.completed;
    }

    if (selected === FILTERS.completed) {
      return todos.completed;
    }

    return true;
  });
}
