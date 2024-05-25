import React, { useContext, useEffect, useState } from 'react';
import { updateTodo } from '../../api/todos';
import { DispatchContext, StateContext } from '../../store/TodoContext';
import { ActionTypes } from '../../store/types';
import { TodoForm } from '../TodoForm/TodoForm';

export const Header: React.FC = () => {
  const { todos } = useContext(StateContext);
  const dispatch = useContext(DispatchContext);
  const [allCompleted, setAllCompleted] = useState(
    todos.every(todo => todo.completed),
  );

  useEffect(() => {
    setAllCompleted(todos.every(todo => todo.completed));
  }, [todos]);

  const toggleAll = () => {
    const newCompletedStatus = !allCompleted;

    dispatch({ type: ActionTypes.SET_LOADING_ALL, payload: true });

    const updates = todos.map(todo => {
      if (todo.completed !== newCompletedStatus) {
        return updateTodo(todo.id, { completed: newCompletedStatus })
          .then(updatedTodo => {
            dispatch({ type: ActionTypes.TOGGLE_TODO, payload: updatedTodo });
          })
          .catch(() => {
            dispatch({
              type: ActionTypes.SET_ERROR,
              payload: 'Unable to update todo',
            });
          });
      }

      return Promise.resolve();
    });

    Promise.all(updates).finally(() => {
      dispatch({ type: ActionTypes.SET_LOADING_ALL, payload: false });
    });
  };

  return (
    <header className="todoapp__header">
      {todos.length > 0 && (
        <button
          onClick={toggleAll}
          type="button"
          className={`todoapp__toggle-all ${allCompleted ? 'active' : ''}`}
          data-cy="ToggleAllButton"
        />
      )}

      <TodoForm />
    </header>
  );
};
