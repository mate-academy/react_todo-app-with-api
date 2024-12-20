/* eslint-disable jsx-a11y/label-has-associated-control */
import React, {
  Dispatch,
  SetStateAction,
  useEffect,
  useRef,
  useState,
} from 'react';
import cn from 'classnames';

import { Todo } from '../../types/Todo';

type Props = {
  todo: Todo;
  onDeleteTodo: (id: number) => Promise<void>;
  onUpdateTodo: (newTodo: Todo) => Promise<void>;
  isDataLoading: boolean;
  isTodoLoading: boolean;
  editingTodoId: number | null;
  setEditingTodoId: Dispatch<SetStateAction<number | null>>;
};

export const TodoComponent: React.FC<Props> = props => {
  const {
    todo,
    onDeleteTodo,
    onUpdateTodo,
    isDataLoading,
    isTodoLoading,
    editingTodoId,
    setEditingTodoId,
  } = props;

  const [newTitle, setNewTitle] = useState(todo.title);

  const inputNameRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (inputNameRef.current) {
      inputNameRef.current.focus();
    }
  }, [editingTodoId]);

  const handleDelete = async (todoId: number) => {
    try {
      onDeleteTodo(todoId);
    } catch (error) {}
  };

  const handleToggle = async (newTodo: Todo) => {
    try {
      await onUpdateTodo({ ...newTodo, completed: !newTodo.completed });
    } catch (error) {}
  };

  const handleEdit = async (newTodo: Todo) => {
    try {
      if (newTitle === newTodo.title) {
        setEditingTodoId(null);

        return;
      }

      if (newTitle.trim() === '') {
        await onDeleteTodo(newTodo.id);
        setEditingTodoId(null);

        return;
      }

      await onUpdateTodo({
        ...newTodo,
        title: newTitle.trim(),
      });
      setEditingTodoId(null);
    } catch (error) {}
  };

  const handleEscape = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Escape') {
      setEditingTodoId(null);
      setNewTitle(todo.title);
    }
  };

  return (
    <div data-cy="Todo" className={cn('todo', { completed: todo.completed })}>
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          onChange={() => {
            handleToggle(todo);
          }}
        />
      </label>

      {editingTodoId === todo.id ? (
        <form
          onSubmit={event => {
            event.preventDefault();
            handleEdit(todo);
          }}
          onBlur={() => handleEdit(todo)}
        >
          <input
            type="text"
            data-cy="TodoTitleField"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            ref={inputNameRef}
            value={newTitle}
            onChange={event => {
              setNewTitle(event.target.value);
            }}
            onKeyUp={handleEscape}
          />
        </form>
      ) : (
        <>
          <span
            data-cy="TodoTitle"
            className="todo__title"
            onDoubleClick={() => setEditingTodoId(todo.id)}
          >
            {todo.title}
          </span>
          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
            onClick={() => handleDelete(todo.id)}
          >
            ×
          </button>
        </>
      )}

      <div
        data-cy="TodoLoader"
        className={cn('modal overlay', {
          'is-active': isDataLoading || isTodoLoading,
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
