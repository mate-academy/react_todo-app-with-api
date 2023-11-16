import React, {
  useContext, useState, useEffect, useRef,
} from 'react';
import classNames from 'classnames';
import { Todo } from '../types/Todo';
import { Key, TodosContext } from '../TodoContext';
import { renameTodo } from '../api/todos';

type Props = {
  todo: Todo;
};

export const TodoItem: React.FC<Props> = ({ todo }) => {
  const {
    onCompleteChange,
    onDelete,
    isBlured,
    allTodos,
    setAllTodos,
    allBlured,
    setIsBlured,
    setError,
  } = useContext(TodosContext);

  const [tempTitle, setTempTitle]
  = useState<Omit<Todo, 'completed' | 'userId'> | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(todo.title);

  const handleDoubleClick = () => {
    setIsEditing(true);
  };

  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditing]);

  const handleBlur = (todoId: number) => {
    if (editedTitle.trim() === '') {
      onDelete(todoId);

      return;
    }

    setIsBlured(todoId);

    setTempTitle({ title: editedTitle, id: todoId });

    renameTodo({ id: todoId, title: editedTitle })
      .then(() => {
        const updatedTodos = allTodos.map((t) => {
          if (t.id === todoId) {
            return { ...t, title: editedTitle };
          }

          return t;
        });

        setAllTodos(updatedTodos);
      })
      .catch(() => {
        setError('Unable to update todo');

        setInterval(() => {
          setError('');
        }, 3000);
      })
      .finally(() => {
        setIsBlured(null);
        setTempTitle(null);
      });

    setIsEditing(false);
  };

  const handleKeyUp = (
    event: React.KeyboardEvent<HTMLInputElement>, todoId: number,
  ) => {
    if (event.key === Key.Enter) {
      handleBlur(todoId);
    } else if (event.key === Key.Escape) {
      setEditedTitle(todo.title);
      setIsEditing(false);
    }
  };

  return (
    <div
      key={todo.id}
      data-cy="Todo"
      className={classNames('todo', {
        completed: todo.completed,
        editing: isEditing,
      })}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          onChange={(e) => onCompleteChange(e, todo.id)}
        />
      </label>

      {!isEditing && (
        <label
          data-cy="TodoTitle"
          className="todo__title"
          onDoubleClick={handleDoubleClick}
        >
          {isBlured && tempTitle?.id === todo.id
            ? tempTitle?.title
            : todo.title}
        </label>
      )}
      <button
        type="button"
        className="todo__remove"
        data-cy="TodoDelete"
        onClick={() => onDelete(todo.id)}
      >
        ×
      </button>
      {isEditing && (
        <input
          type="text"
          className="todo__title-field"
          value={editedTitle}
          onChange={(event) => {
            setEditedTitle(event.target.value);
          }}
          onKeyUp={(event) => handleKeyUp(event, todo.id)}
          onBlur={() => handleBlur(todo.id)}
          ref={inputRef}
        />
      )}

      <div
        data-cy="TodoLoader"
        className={classNames('modal overlay',
          {
            'is-active': (isBlured === todo.id)
          || (todo.completed ? allBlured : false),
          })}
      >
        <div className="modal-background
                    has-background-white-ter"
        />
        <div className="loader" />
      </div>
    </div>
  );
};
