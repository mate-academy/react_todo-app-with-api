/* eslint-disable jsx-a11y/label-has-associated-control */
import cn from 'classnames';
import { Todo } from '../types/Todo';
import { deleteTodo, modifyTodo } from '../api/todos';
import { useRef, useState } from 'react';
import { useTodosMethods } from '../store/reducer';

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

  // this state is needed to make task show proper title while loading after edit
  const [title, setTitle] = useState(todo.title);

  const formInputRef = useRef<HTMLInputElement>(null);

  const onDelete = (todoId: number) => {
    setLoading(true);

    // tries to delete on server, if success - removes locally
    deleteTodo(todoId)
      .then(() => {
        deleteTodoLocal(todo.id);
      })
      .catch(() => {
        setTimeoutErrorMessage('Unable to delete a todo');
      });

    // focuses on input field
    inputRef.current?.focus();
  };

  const onTodoStatusToggle = (modifiedTodo: Todo) => {
    setLoading(true);

    const todoProps: Partial<Todo> = modifiedTodo.completed
      ? { completed: false }
      : { completed: true };

    modifyTodo(modifiedTodo.id, todoProps)
      .then(() => {
        modifyTodoLocal(modifiedTodo.id, todoProps);
      })
      .catch(() => setTimeoutErrorMessage('Unable to update a todo'))
      .finally(() => {
        setLoading(false);
      });
  };

  const onTitleDoubleClick = (modifiedTodo: Todo) => {
    setBeingEdited(true);
    setEditedValue(modifiedTodo.title);

    // had to make this task async for correct focus
    setTimeout(() => formInputRef.current?.focus(), 0);

    // event listener for pressing escape button
    addEventListener('keyup', event => {
      if (event.key === 'Escape') {
        setBeingEdited(false);
      }
    });
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
    <div
      data-cy="Todo"
      className={cn('todo', { completed: todo.completed })}
      key={todo.id}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          onChange={() => onTodoStatusToggle(todo)}
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
        className={`modal overlay ${(isTemp || loading) && 'is-active'}`}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
