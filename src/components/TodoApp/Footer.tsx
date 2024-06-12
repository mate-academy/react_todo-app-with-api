import React, { useContext } from 'react';

import { deleteTodo } from '../../api/todos';
import { Notification } from '../../types/Notification';
import { DispatchContext, StateContext } from '../Context/StateContext';
import { TodoFilter } from './TodoFilter';

export const Footer: React.FC = () => {
  const { todos } = useContext(StateContext);
  const dispatch = useContext(DispatchContext);

  const activeTodos = todos.filter(todo => !todo.completed).length;
  const completedTodos = todos.filter(todo => todo.completed);
  const completedTodosIds = completedTodos.map(todo => todo.id);

  const removeTodos = () => {
    dispatch({
      type: 'showLoader',
      todosIds: completedTodosIds,
    });

    completedTodos.forEach(todo => {
      deleteTodo(todo.id)
        .then(() => dispatch({
          type: 'removeTodo',
          iD: todo.id,
        }))
        .catch(() => dispatch({
          type: 'showNotification',
          notification: Notification.DELETE_TODO,
        }))
        .finally(() => dispatch({
          type: 'showLoader',
          todosIds: [0],
        }));
    });
  };

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {`${activeTodos} items left`}
      </span>

      <TodoFilter />

      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        onClick={removeTodos}
        disabled={!completedTodos.length}
      >
        Clear completed
      </button>
    </footer>
  );
};
