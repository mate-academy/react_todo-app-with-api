import { useTodo } from '../../../context/TodoContext';

export const FooterButton = () => {
  const {
    deleteCompleted,
    todos,
    allTodosAreActive,
  } = useTodo();

  const completedTodos = todos.filter(t => t.completed);

  return (
    <button
      data-cy="ClearCompletedButton"
      type="button"
      className="todoapp__clear-completed"
      onClick={() => deleteCompleted(completedTodos)}
      disabled={allTodosAreActive}
    >
      Clear completed
    </button>

  );
};
