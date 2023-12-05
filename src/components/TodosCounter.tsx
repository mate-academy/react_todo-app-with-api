import { useContext } from 'react';
import { TodoContext } from '../providers/TodoProvider';

export const TodosCounter = () => {
  const {
    todos,
  } = useContext(TodoContext);

  const todosRemaining = todos.filter(todo => !todo.completed).length;

  return (
    <span className="todo-count" data-cy="TodosCounter">
      {`${todosRemaining} items left`}
    </span>
  );
};
