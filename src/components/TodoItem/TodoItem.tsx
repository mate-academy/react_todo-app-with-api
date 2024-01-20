import React, { useContext } from 'react';
import cn from 'classnames';
import * as todoService from '../../api/todos';
import { Todo } from '../../types/Todo';
import { DispatchContext, StateContext } from '../../store/store';
import { ActionType } from '../../types/ActionType';
import { ShowError } from '../../types/ShowErrors';

type Props = {
  todo: Todo,
};

export const TodoItem:React.FC<Props> = ({
  todo,
}) => {
  const { loadingIDs } = useContext(StateContext);
  const dispatch = useContext(DispatchContext);

  const deleteTodo = (todoID: number) => {
    // dispatch({ type: ActionType.SetIsLoading });
    dispatch({ type: ActionType.SetLoadingIDs, payload: [todoID] });

    todoService.deleteTodo(todoID)
      .then(() => dispatch({ type: ActionType.Delete, payload: todoID }))
      .catch(() => dispatch({
        type: ActionType.SetError,
        payload: ShowError.deleteTodo,
      }))
      .finally(() => {
        dispatch({ type: ActionType.ClearLoadingIDs });
        // dispatch({ type: ActionType.ClearIsLoading });
      });
  };

  return (
    <div
      data-cy="Todo"
      className={cn(
        'todo',
        { completed: todo.completed },
      )}
    >
      <label className="todo__status-label">
        <input
          className="todo__status"
          data-cy="TodoStatus"
          type="checkbox"
          aria-label="todo-status"
          checked={todo.completed}
        />
      </label>

      <span data-cy="TodoTitle" className="todo__title">
        {todo.title}
      </span>

      <button
        type="button"
        className="todo__remove"
        data-cy="TodoDelete"
        onClick={() => deleteTodo(todo.id)}
      >
        ×
      </button>

      <div
        data-cy="TodoLoader"
        className={cn('modal overlay', {
          'is-active': loadingIDs && loadingIDs.includes(todo.id),
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
