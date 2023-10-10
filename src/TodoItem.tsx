import {
  Dispatch,
  SetStateAction,
  useEffect, useRef, useState,
} from 'react';
import classNames from 'classnames';
import { Todo } from './types/Todo';
import { changeTodo, deleteTodos } from './api/todos';

type Props = {
  todo: Todo,
  todos: Todo[],
  setTodos: Dispatch<SetStateAction<Todo[]>>,
  setErrorMessage: Dispatch<SetStateAction<string>>,
  changedTodos: number[],
  setIsEditing: Dispatch<SetStateAction<boolean>>,
};

export const TodoItem: React.FC<Props> = ({
  todo, todos, setTodos, setErrorMessage, changedTodos, setIsEditing,
}) => {
  const [isEdit, setIsEdit] = useState(false);
  const [todoValue, setTodoValue] = useState(todo.title);
  const [shouldHandleBlur, setShouldHandleBlur] = useState(true);
  const [loading, setLoading] = useState(false);

  const inputRef = useRef<HTMLInputElement | null>(null);

  const handleCheckbox = () => {
    setLoading(true);

    changeTodo({
      id: todo.id,
      userId: todo.userId,
      title: todo.title,
      completed: todos.some((prevTodo) => (
        prevTodo.id === todo.id && !prevTodo.completed
      )),
    })
      .then((newTodo) => {
        setTodos(currentTodos => {
          const newTodos = [...currentTodos];
          const index = newTodos.findIndex(item => item.id === newTodo.id);

          newTodos.splice(index, 1, newTodo);

          return newTodos;
        });
      })
      .catch(() => {
        setErrorMessage('Unable to update a todo');
      })
      .finally(() => setLoading(false));
  };

  const removeTodo = (id: number) => {
    setLoading(true);

    deleteTodos(id)
      .then(() => {
        const index = todos.findIndex(elem => elem.id === id);

        if (index !== -1) {
          const newTodos = [...todos];

          newTodos.splice(index, 1);
          setTodos(newTodos);
        }

        setIsEditing(false);
      })
      .catch(() => {
        setErrorMessage('Unable to delete a todo');
        inputRef.current?.focus();
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    if (isEdit && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEdit]);

  const handleDoubleClick = () => {
    setShouldHandleBlur(true);
    setIsEdit(true);
    setIsEditing(true);

    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const handleLabelChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value.trim();

    setTodoValue(newValue === '' ? '' : event.target.value);
  };

  function updateTodo() {
    setLoading(true);

    changeTodo({
      id: todo.id,
      userId: todo.userId,
      title: todoValue.trim(),
      completed: todo.completed,
    })
      .then((newTodo) => {
        setTodos(currentTodos => {
          const newTodos = [...currentTodos];
          const index = newTodos.findIndex(item => item.id === newTodo.id);

          newTodos.splice(index, 1, newTodo);

          return newTodos;
        });

        setIsEdit(false);
        setIsEditing(false);
      })
      .catch(() => {
        setErrorMessage('Unable to update a todo');
        inputRef.current?.focus();
      })
      .finally(() => setLoading(false));
  }

  const handleLabelKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (todoValue.trim() === todo.title && event.key === 'Enter') {
      setIsEdit(false);

      return;
    }

    if (!todoValue.length && event.key === 'Enter') {
      event.preventDefault();
      removeTodo(todo.id);
    }

    if (todoValue.length && event.key === 'Enter') {
      event.preventDefault();
      updateTodo();
    }
  };

  const handleLabelKeyUp = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Escape') {
      setTodoValue(todo.title);
      setIsEdit(false);
      setShouldHandleBlur(false);
    }
  };

  const handleLabelBlur = () => {
    if (shouldHandleBlur) {
      if (todoValue === todo.title) {
        setIsEdit(false);

        return;
      }

      if (!todoValue.length) {
        removeTodo(todo.id);
      } else {
        updateTodo();
      }
    }
  };

  return (
    <div
      data-cy="Todo"
      className={classNames('todo', {
        completed: todo.completed,
      })}
    >
      <label
        className="todo__status-label"
      >
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          onChange={handleCheckbox}
        />
      </label>

      {!isEdit && (
        <span
          data-cy="TodoTitle"
          className="todo__title"
          onDoubleClick={handleDoubleClick}
        >
          {todo.title}
        </span>
      )}

      {!isEdit && (
        <button
          type="button"
          className="todo__remove"
          data-cy="TodoDelete"
          onClick={() => removeTodo(todo.id)}
          aria-label="Delete"
        >
          ×
        </button>
      )}

      {isEdit && (
        <form>
          <input
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            value={todoValue}
            onChange={handleLabelChange}
            onKeyDown={handleLabelKeyDown}
            onKeyUp={handleLabelKeyUp}
            onBlur={handleLabelBlur}
            ref={inputRef}
          />
        </form>
      )}

      <div
        data-cy="TodoLoader"
        className={classNames('modal overlay', {
          'is-active': loading || changedTodos.includes(todo.id),
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>

    </div>
  );
};
