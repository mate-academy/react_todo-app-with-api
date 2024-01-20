import React, {
  useContext, useEffect, useRef, useState,
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

  const deleteTodo = (id: number) => {
    dispatch({ type: ActionType.SetLoadingIDs, payload: [id] });

    todoService.deleteTodo(id)
      .then(() => dispatch({ type: ActionType.Delete, payload: id }))
      .catch(() => dispatch({
        type: ActionType.SetError,
        payload: ShowError.deleteTodo,
      }))
      .finally(() => {
        dispatch({ type: ActionType.ClearLoadingIDs });
      });
  };

  const toggleTodo = (newTodo: Todo) => {
    const updatedTodo = { ...newTodo, complited: !newTodo.completed };

    dispatch({ type: ActionType.SetLoadingIDs, payload: [newTodo.id] });

    todoService.updateTodo(todo.id, updatedTodo)
      .then(() => dispatch({ type: ActionType.Toggle, payload: newTodo.id }))
      .catch(() => dispatch({
        type: ActionType.SetError,
        payload: ShowError.updateTodo,
      }))
      .finally(() => {
        dispatch({ type: ActionType.ClearLoadingIDs });
      });
  };

  const updateTodo = (newTodo: Todo) => {
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
        setEditingTodo(null);
      });
  };

  const handleSubmit = (event: React.FormEvent) => {
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
      deleteTodo(editingTodo.id);

      return;
    }

    updateTodo(editingTodo);
  };

  const handleKeyUp = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Escape') {
      setEditingTodo(null);
    }
  };

  const doubleClick = () => {
    setEditingTodo(todo);
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newTitle = event.currentTarget.value;

    setEditingTodo({ ...todo, title: newTitle });
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
          onChange={() => toggleTodo(todo)}
        />
      </label>

      {editingTodo
        ? (
          <form onSubmit={handleSubmit}>
            <input
              data-cy="TodoTitleField"
              type="text"
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
              onDoubleClick={doubleClick}
            >
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
          </>
        )}

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
