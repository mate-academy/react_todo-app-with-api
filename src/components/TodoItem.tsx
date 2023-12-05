import {
  Dispatch,
  SetStateAction,
  useEffect, useRef, useState,
} from 'react';
import classNames from 'classnames';
import { Todo } from '../types/Todo';
import {
  deleteTodo, updateTodo as updateTodoAPI,
} from '../api/todos';

type Props = {
  todo: Todo,
  todos: Todo[],
  setTodos: Dispatch<SetStateAction<Todo[]>>,
  setErrorMessage: Dispatch<SetStateAction<string>>,
};

export const TodoItem: React.FC<Props> = ({
  todo, todos, setTodos, setErrorMessage,
}) => {
  const [isEdit, setIsEdit] = useState(false);
  const [todoValue, setTodoValue] = useState(todo.title);
  const [shouldHandleBlur, setShouldHandleBlur] = useState(true);

  const inputRef = useRef<HTMLInputElement | null>(null);

  const handleCheckbox = () => {
    updateTodoAPI(todo.id, { completed: !todo.completed })
      .then(() => {
        const reverseStatus = (prevTodos: Todo[]) => {
          return prevTodos.map((prevTodo) => {
            if (prevTodo.id === todo.id) {
              return { ...prevTodo, completed: !prevTodo.completed };
            }

            return prevTodo;
          });
        };

        setTodos(reverseStatus(todos));
      })
      .catch(() => {
        setErrorMessage('Unable to update a todo status');
      });
  };

  const removeTodo = (id: number) => {
    deleteTodo(id)
      .then(() => {
        setTodos((prevTodos) => prevTodos.filter(t => t.id !== id));
      })
      .catch(() => {
        setErrorMessage('Unable to delete a todo');
      });
  };

  useEffect(() => {
    if (isEdit && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEdit]);

  const handleDoubleClick = () => {
    setShouldHandleBlur(true);
    setIsEdit(true);
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const handleLabelChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTodoValue(event.target.value.trim() === '' ? '' : event.target.value);
  };

  function updateTodo() {
    updateTodoAPI(todo.id, { title: todoValue })
      .then(() => {
        const updatedTodos = todos.map((prevTodo) => {
          if (prevTodo.id === todo.id) {
            return { ...prevTodo, title: todoValue };
          }

          return prevTodo;
        });

        setTodos(updatedTodos);
      })
      .catch(() => setErrorMessage('Unable to update title'))
      .finally(() => setIsEdit(false));
  }

  const handleLabelKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (!todoValue.length && event.key === 'Enter') {
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
        className="modal overlay"
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>

    </div>
  );
};
