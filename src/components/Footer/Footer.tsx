import React, { useContext } from 'react';

import './Footer.scss';
import { TodosContext } from '../TodosContext';
import { TodosFilter } from '../TodosFilter';
import { removeTodo } from '../../api/todos';

export const Footer: React.FC = () => {
  const {
    todos,
    dispatch,
    tempTodo,
    setErrorMessage,
    setLoadingTodosIds,
  } = useContext(TodosContext);

  const completedTodos = todos.filter(todo => todo.completed);
  const completedTodosIds = completedTodos.map(completed => completed.id);
  const completedLength = completedTodos.length;
  let notCompletedLength = todos.length - completedLength;

  if (tempTodo) {
    notCompletedLength -= 1;
  }

  const handleClearClick = () => {
    setLoadingTodosIds(completedTodosIds);

    completedTodos.map(completedTodo => {
      return removeTodo(completedTodo.id)
        .then(() => dispatch({
          type: 'remove',
          payload: completedTodo.id,
        }))
        .catch(() => {
          setErrorMessage('Unable to delete a todo');
        })
        .finally(() => setLoadingTodosIds([]));
    });
  };

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span data-cy="TodosCounter">
        {`${notCompletedLength} items left`}
      </span>

      <TodosFilter />

      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        onClick={handleClearClick}
        disabled={!completedLength}
      >
        Clear completed
      </button>
    </footer>
  );
};
