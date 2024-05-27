/* eslint-disable jsx-a11y/label-has-associated-control */
import cn from 'classnames';
import { Todo } from '../types/Todo';
import { deleteTodo, modifyTodo } from '../api/todos';
import { useRef, useState, useEffect } from 'react';
import { useTodosMethods } from '../context/Store';

interface Props {
  todo: Todo;
  isTemp?: boolean;
  inputRef: React.RefObject<HTMLInputElement>;
}

export const TodoComponent: React.FC<Props> = ({
  todo,
  isTemp = false,
  inputRef,
}) => {
  const { deleteTodoLocal, modifyTodoLocal, setTimeoutErrorMessage } =
    useTodosMethods();

  const [loading, setLoading] = useState(false);
  const [beingEdited, setBeingEdited] = useState(false);
  const [editedValue, setEditedValue] = useState('');
  const [title, setTitle] = useState(todo.title);

  const formInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (beingEdited) {
      formInputRef.current?.focus();
      const handleKeyUp = (event: KeyboardEvent) => {
        if (event.key === 'Escape') {
          setBeingEdited(false);
        }
      };

      document.addEventListener('keyup', handleKeyUp);

      return () => {
        document.removeEventListener('keyup', handleKeyUp);
      };
    }

    // eslint-disable-next-line prettier/prettier
    return () => { };
  }, [beingEdited]);

  const onDelete = (todoId: number) => {
    setLoading(true);
    deleteTodo(todoId)
      .then(() => {
        deleteTodoLocal(todo.id);
      })
      .catch(() => {
        setTimeoutErrorMessage('Unable to delete a todo');
      });
    inputRef.current?.focus();
  };

  const onTodoStatusToggle = () => {
    setLoading(true);
    const updatedTodo = { ...todo, completed: !todo.completed };

    modifyTodo(updatedTodo.id, { completed: updatedTodo.completed })
      .then(() => {
        modifyTodoLocal(updatedTodo.id, { completed: updatedTodo.completed });
      })
      .catch(() => setTimeoutErrorMessage('Unable to update a todo'))
      .finally(() => {
        setLoading(false);
      });
  };

  const onTitleDoubleClick = (modifiedTodo: Todo) => {
    setBeingEdited(true);
    setEditedValue(modifiedTodo.title);
  };

  const onSubmit = (event?: React.FormEvent<HTMLFormElement>) => {
    if (event) {
      event.preventDefault();
    }

    const normalizedEditedValue = editedValue.trim();

    if (normalizedEditedValue === todo.title) {
      setBeingEdited(false);

      return;
    }

    setLoading(true);
    setTitle(normalizedEditedValue);
    if (!normalizedEditedValue) {
      deleteTodo(todo.id)
        .then(() => {
          deleteTodoLocal(todo.id);
          setBeingEdited(false);
          inputRef.current?.focus();
        })
        .catch(() => {
          setTimeoutErrorMessage('Unable to delete a todo');
          formInputRef.current?.focus();
        })
        .finally(() => {
          setLoading(false);
        });

      return;
    }

    const todoProps = { title: normalizedEditedValue };

    modifyTodo(todo.id, todoProps)
      .then(() => {
        modifyTodoLocal(todo.id, todoProps);
        setBeingEdited(false);
      })
      .catch(() => {
        setTimeoutErrorMessage('Unable to update a todo');
        formInputRef.current?.focus();
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const onBlur = () => {
    if (editedValue.trim() === todo.title) {
      setBeingEdited(false);
    } else {
      onSubmit();
    }
  };

  return (
    <div data-cy="Todo" className={cn('todo', { completed: todo.completed })}>
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          onChange={onTodoStatusToggle}
          checked={todo.completed}
        />
      </label>

      {beingEdited && (
        <form onSubmit={onSubmit}>
          <input
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-field"
            value={editedValue}
            ref={formInputRef}
            onChange={event => setEditedValue(event.target.value)}
            onBlur={onBlur}
          />
        </form>
      )}

      {!beingEdited && (
        <span
          data-cy="TodoTitle"
          className="todo__title"
          onDoubleClick={() => onTitleDoubleClick(todo)}
        >
          {title}
        </span>
      )}

      {!beingEdited && (
        <button
          type="button"
          className="todo__remove"
          data-cy="TodoDelete"
          onClick={() => onDelete(todo.id)}
        >
          ×
        </button>
      )}

      <div
        data-cy="TodoLoader"
        className={cn('modal overlay', { 'is-active': isTemp || loading })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
