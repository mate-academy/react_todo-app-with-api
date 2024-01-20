import React, {
  useCallback,
  useContext, useEffect, useMemo, useRef, useState,
} from 'react';
import cn from 'classnames';
import * as todoService from '../../api/todos';
import { Todo } from '../../types/Todo';
import { DispatchContext, StateContext } from '../../store/store';
import { ActionType } from '../../types/ActionType';
import { ShowError } from '../../types/ShowErrors';
import { USER_ID } from '../../types/constants';

type Props = {
  todo: Todo,
};

export const TodoItem:React.FC<Props> = ({ todo }) => {
  const [editingTodo, setEditingTodo] = useState<Todo | null>(null);
  const { loadingIDs } = useContext(StateContext);
  const dispatch = useContext(DispatchContext);

  const inputEditRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (inputEditRef.current && editingTodo) {
      inputEditRef.current.focus();
    }
  }, [editingTodo]);

  const deleteTodo = useCallback(() => {
    dispatch({ type: ActionType.SetLoadingIDs, payload: [todo.id] });

    todoService.deleteTodo(todo.id)
      .then(() => dispatch({ type: ActionType.Delete, payload: todo.id }))
      .catch(() => dispatch({
        type: ActionType.SetError,
        payload: ShowError.deleteTodo,
      }))
      .finally(() => {
        dispatch({ type: ActionType.ClearLoadingIDs });
      });
  }, [dispatch, todo.id]);

  const toggleTodo = useCallback(() => {
    const updatedTodo = { ...todo, complited: !todo.completed };

    dispatch({ type: ActionType.SetLoadingIDs, payload: [todo.id] });

    todoService.updateTodo(todo.id, updatedTodo)
      .then(() => dispatch({ type: ActionType.Toggle, payload: todo.id }))
      .catch(() => dispatch({
        type: ActionType.SetError,
        payload: ShowError.updateTodo,
      }))
      .finally(() => {
        dispatch({ type: ActionType.ClearLoadingIDs });
      });
  }, [dispatch, todo]);

  const updateTodo = useCallback((newTodo: Todo) => {
    dispatch({ type: ActionType.SetLoadingIDs, payload: [newTodo.id] });

    dispatch({
      type: ActionType.SetTempTodo,
      payload: {
        id: 0,
        title: newTodo.title.trim(),
        userId: USER_ID,
        completed: false,
      },
    });

    todoService.updateTodo(newTodo.id, newTodo)
      .then(() => {
        dispatch({
          type: ActionType.Update,
          payload: { ...newTodo, title: newTodo.title.trim() },
        });
        setEditingTodo(null);
      })
      .catch(() => {
        dispatch({
          type: ActionType.SetError,
          payload: ShowError.updateTodo,
        });
        setEditingTodo(newTodo);
      })
      .finally(() => {
        dispatch({ type: ActionType.ClearTempTodo });
        dispatch({ type: ActionType.ClearLoadingIDs });
      });
  }, [dispatch]);

  const handleSubmit = useCallback((event: React.FormEvent) => {
    event.preventDefault();

    if (!editingTodo) {
      return;
    }

    const trimedTitle = editingTodo.title.trim();

    const equalTitles = (trimedTitle === todo.title);
    const emptyTitle = (trimedTitle === '');

    if (equalTitles) {
      setEditingTodo(null);

      return;
    }

    if (emptyTitle) {
      deleteTodo();

      return;
    }

    updateTodo(editingTodo);
  }, [deleteTodo, editingTodo, todo.title, updateTodo]);

  const handleKeyUp = useCallback(
    (event: React.KeyboardEvent<HTMLInputElement>) => {
      if (event.key === 'Escape') {
        setEditingTodo(null);
      }
    }, [],
  );

  const doubleClick = useCallback(() => {
    setEditingTodo(todo);
  }, [todo]);

  const handleChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const newTitle = event.currentTarget.value;

      setEditingTodo({ ...todo, title: newTitle });
    }, [todo],
  );

  const id = useMemo(
    () => todo.id.toString(10),
    [todo.id],
  );

  const isActive = useMemo(
    () => loadingIDs && loadingIDs.includes(todo.id),
    [loadingIDs, todo.id],
  );

  return (
    <div
      data-cy="Todo"
      className={cn(
        'todo',
        { completed: todo.completed },
      )}
      id={id}
    >
      <label className="todo__status-label" id={id}>
        <input
          data-cy="TodoStatus"
          className="todo__status"
          id={id}
          type="checkbox"
          aria-label="todo-status"
          checked={todo.completed}
          onChange={toggleTodo}
        />
      </label>

      {editingTodo
        ? (
          <form onSubmit={handleSubmit} id={id}>
            <input
              data-cy="TodoTitleField"
              type="text"
              id={id}
              className="todo__title-field"
              placeholder="Empty todo will be deleted"
              ref={inputEditRef}
              value={editingTodo.title}
              onChange={handleChange}
              onKeyUp={handleKeyUp}
              onBlur={handleSubmit}
            />
          </form>
        )
        : (
          <>
            <span
              data-cy="TodoTitle"
              className="todo__title"
              id={id}
              onDoubleClick={doubleClick}
            >
              {todo.title}
            </span>

            <button
              type="button"
              className="todo__remove"
              id={id}
              data-cy="TodoDelete"
              onClick={deleteTodo}
            >
              ×
            </button>
          </>
        )}

      <div
        data-cy="TodoLoader"
        id={id}
        className={cn('modal overlay', {
          'is-active': isActive,
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
