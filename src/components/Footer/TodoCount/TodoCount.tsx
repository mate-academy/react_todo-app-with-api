import { useTodo } from '../../../context/TodoContext';

export const TodoCount = () => {
  const { todos } = useTodo();
  const todosLeft = todos.filter(todo => !todo.completed);

  return (
    <span data-cy="TodosCounter" className="todo-count">
      {todosLeft.length}
      {' '}
      items left
    </span>

  );
};
