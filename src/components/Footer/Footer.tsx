import { useContext } from 'react';
import { FilterTodos } from '../FilterTodos';
import { TodoUpdateContext, TodosContext } from '../../context/TodosContext';

export const Footer = () => {
  const {
    todos,
  } = useContext(TodosContext);
  const { deleteTodo } = useContext(TodoUpdateContext);

  const isCompleted = todos.some(todo => todo.completed);
  const countOfNotCompletedItems = todos.filter(todo => !todo.completed).length;

  const handleClear = () => {
    const completedTodos = todos.filter(todo => todo.completed);

    completedTodos.forEach(todo => deleteTodo(todo.id));
  };

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {`${countOfNotCompletedItems} items left`}
      </span>

      <FilterTodos />

      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        onClick={handleClear}
        disabled={!isCompleted}
      >
        Clear completed
      </button>
    </footer>
  );
};
