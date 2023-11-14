import React, { useCallback, useContext } from 'react';

import * as todoService from '../../../api/todos';

import { DispatchContext, StateContext } from '../../../TodoStore';
import { actionCreator } from '../../../reducer';
import { FilterTodo } from './FilterTodo';
import { TodoError } from '../../../types/TodoError';

export const TodoFooter: React.FC = () => {
  const { initialTodos } = useContext(StateContext);
  const dispatch = useContext(DispatchContext);

  const TotalUncompletedTodos = initialTodos.filter(todo => !todo.completed);
  const isCompletedTodos = initialTodos.some(todo => todo.completed);

  const deleteCompletedTodos = useCallback(() => {
    const completedTodos = initialTodos.filter(todo => todo.completed);
    const deletePromises = completedTodos
      .map(todo => {
        dispatch(actionCreator.addLoadingItemId(todo.id));

        return todoService.deleteTodo(todo.id)
          .then(() => {
            dispatch(actionCreator.updateTodos({ delete: todo.id }));
          });
      });

    dispatch(actionCreator.clearError());
    dispatch(actionCreator.toggleDeleting());
    Promise.all(deletePromises)
      .catch(() => dispatch(actionCreator.addError(TodoError.ErrorDelete)))
      .finally(() => {
        dispatch(actionCreator.clearLoadingItemsId());
        dispatch(actionCreator.toggleDeleting());
      });
  }, [dispatch, initialTodos]);

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {`${TotalUncompletedTodos.length} ${TotalUncompletedTodos.length === 1 ? 'items' : 'items'} left`}
      </span>

      <FilterTodo />

      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        disabled={!isCompletedTodos}
        onClick={deleteCompletedTodos}
      >
        Clear completed
      </button>
    </footer>
  );
};
