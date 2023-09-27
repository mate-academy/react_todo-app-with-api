import { useTodo } from '../../../context/TodoContext';

export const ToggleButton = () => {
  const {
    allTodosCompleted,
    todos,
    toggleActiveTodo,
  } = useTodo();

  return (
    <button
      type="button"
      className={allTodosCompleted
        ? 'todoapp__toggle-all active' : 'todoapp__toggle-all'}
      onClick={() => toggleActiveTodo(todos)}
      data-cy="ToggleAllButton"
      aria-label="Toggle all tasks – completed – active"
    />
  );
};
