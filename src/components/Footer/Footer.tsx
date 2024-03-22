import React, { useContext } from 'react';
import { Filter } from '../Filter/Filter';
import { TodoContext } from '../Store/TodoContext';
import { deleteTodos } from '../../api/todos';

export const Footer: React.FC = () => {
  const { todos, setTodos, setErrorMessage } = useContext(TodoContext);

  const hasEnoughTodos = todos.length > 0;

  const uncompletedTodos = todos.filter(todo => !todo.completed);

  const hasEnoughCompletedTodo = todos.some(todo => todo.completed);

  const todoInput = document.getElementById('todoInput');

  const handleDelete = (todoId: number) => {
    deleteTodos(todoId)
      .then(() => {
        setTodos(currentTodos =>
          currentTodos.filter(post => post.id !== todoId),
        );
      })
      .catch(() => {
        setErrorMessage('Unable to delete a todo');
      })
      .finally(() => {
        if (todoInput) {
          todoInput.focus();
        }
      });
  };

  const handleTodoCleaning = () => {
    const completedTodos = todos.filter(todo => todo.completed);

    completedTodos.forEach(todo => handleDelete(todo.id));
  };

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      {hasEnoughTodos && (
        <>
          <span className="todo-count" data-cy="TodosCounter">
            {`${uncompletedTodos.length} items left`}
          </span>

          <Filter />

          {/* this button should be disabled if there are no completed todos */}
          <button
            type="button"
            className="todoapp__clear-completed"
            data-cy="ClearCompletedButton"
            onClick={handleTodoCleaning}
            disabled={!hasEnoughCompletedTodo}
          >
            Clear completed
          </button>
        </>
      )}
    </footer>
  );
};
