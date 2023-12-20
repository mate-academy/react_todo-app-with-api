import React, { useContext } from 'react';
import { TodoContext } from './TodoContex';
import TodoFilter from './TodoFilter';
import { deleteTodo } from '../api/todos';

const TodoFooter: React.FC = () => {
  const {
    todos,
    setTodos,
  } = useContext(TodoContext);

  const handleDeleteCompleted = async () => {
    const completedTodos = todos.filter(todo => todo.completed);

    const deletePromises = completedTodos.map(todo => deleteTodo(todo.id));

    await Promise.all(deletePromises);

    const newTodos = todos.filter(todo => !todo.completed);

    setTodos(newTodos);
  };

  const currentTodosLength = todos.filter(todo => !todo.completed).length;

  const currentTodosMessage = currentTodosLength === 1
    ? ('1 item left')
    : (`${currentTodosLength} items left`);

  return (
    <footer data-cy="Footer" className="todoapp__footer">
      <span
        className="todo-count"
        data-cy="TodosCounter"
      >
        {currentTodosMessage}
      </span>

      <TodoFilter />

      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        onClick={handleDeleteCompleted}
      >
        Clear completed
      </button>
    </footer>
  );
};

export default TodoFooter;
