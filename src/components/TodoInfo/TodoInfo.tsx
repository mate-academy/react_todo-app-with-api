import classNames from 'classnames';
import { useEffect, useRef, useState } from 'react';
import { Todo } from '../../types/Todo';
import { TodoError } from '../../types/TodoFilter';
import { client } from '../../utils/fetchClient';

type OneTodo = {
  todo: Todo
  todosUpdate: () => void
  errorHandler: (errorType: TodoError) => void
};

export const TodoInfo: React.FC<OneTodo> = ({
  todo,
  todosUpdate,
  errorHandler,
}) => {
  const [todoTitle, setTodoTitle] = useState(todo.title);
  const [todoLoader, setTodoLoader] = useState(false);
  const [todoEditField, setTodoEditField] = useState(false);

  const editTodoField = useRef<HTMLInputElement>(null);
  const editFieldOnChangeHandler = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => setTodoTitle(event.target.value);
  const editFieldOpenner = () => setTodoEditField(true);

  const checkboxHandler = async () => {
    setTodoLoader(true);
    errorHandler(TodoError.noerror);
    const date = {
      completed: !todo.completed,
    };

    try {
      await client.patch(`/todos/${todo.id}`, date);
      todosUpdate();
    } catch {
      errorHandler(TodoError.update);
    } finally {
      setTodoLoader(false);
    }
  };

  const buttonHandler = async () => {
    setTodoLoader(true);
    errorHandler(TodoError.noerror);
    try {
      await client.delete(`/todos/${todo.id}`);
      todosUpdate();
    } catch {
      errorHandler(TodoError.delete);
    } finally {
      setTodoLoader(false);
    }
  };

  const todoEditFieldHandler = async (
    event: React.KeyboardEvent<HTMLFormElement>,
  ) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      const data = {
        title: todoTitle,
      };

      if (todoTitle === '') {
        setTodoEditField(false);
        setTodoLoader(true);
        try {
          await client.delete(`/todos/${todo.id}`);
          todosUpdate();
        } catch {
          errorHandler(TodoError.delete);
        }

        setTodoLoader(false);

        return;
      }

      if (todoTitle !== todo.title) {
        setTodoEditField(false);
        setTodoLoader(true);
        try {
          await client.patch(`/todos/${todo.id}`, data);
        } catch {
          errorHandler(TodoError.update);
        } finally {
          setTodoLoader(false);
          todosUpdate();
        }
      }

      setTodoEditField(false);
    }
  };

  const todoEditFieldOnBlurHandler = async () => {
    const data = {
      title: todoTitle,
    };

    if (todoTitle === '') {
      setTodoEditField(false);
      setTodoLoader(true);
      try {
        await client.delete(`/todos/${todo.id}`);
        todosUpdate();
      } catch {
        errorHandler(TodoError.delete);
      }

      setTodoLoader(false);

      return;
    }

    if (todoTitle !== todo.title) {
      setTodoEditField(false);
      setTodoLoader(true);
      try {
        await client.patch(`/todos/${todo.id}`, data);
      } catch {
        errorHandler(TodoError.update);
      } finally {
        setTodoLoader(false);
        todosUpdate();
      }
    }

    setTodoEditField(false);
  };

  const todoEditFieldOnEscHandler = (
    event: React.KeyboardEvent<HTMLFormElement>,
  ) => {
    if (event.key === 'Escape') {
      setTodoEditField(false);
    }
  };

  useEffect(() => {
    if (editTodoField.current) {
      editTodoField.current.focus();
    }
  }, [todoEditField]);

  return (
    <div
      data-cy="Todo"
      className={classNames('todo', {
        completed: todo.completed,
      })}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          onChange={checkboxHandler}
        />
      </label>

      {todoEditField ? (
        // eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions
        <form
          onKeyPress={todoEditFieldHandler}
          onBlur={todoEditFieldOnBlurHandler}
          onKeyDown={todoEditFieldOnEscHandler}
        >
          <input
            className="todoapp__edit-todo"
            ref={editTodoField}
            type="text"
            value={todoTitle}
            onChange={editFieldOnChangeHandler}
          />
        </form>
      ) : (
        <>
          <span
            data-cy="TodoTitle"
            className="todo__title"
            onDoubleClick={editFieldOpenner}
          >
            {todo.title}
          </span>
          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDeleteButton"
            onClick={buttonHandler}
          >
            ×
          </button>
        </>
      )}

      <div
        data-cy="TodoLoader"
        className={classNames('modal', 'overlay', {
          'is-active': todoLoader,
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
