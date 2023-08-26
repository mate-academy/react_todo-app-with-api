import React, { useEffect, useRef, useState } from 'react';
import { Todo } from '../../types/Todo';
import { deleteTodo, updateTodo } from '../../api/todos';

type Props = {
  todos: Todo[],
  removeTodo: (todoId: number) => void,
  setErrorMassege: (error: string) => void,
  hideError: () => void,
  spinner: boolean,
  spinnerStatus: (value: boolean) => void,
  cuurentId: number,
  changeCurrentId: (id: number) => void,
  setDate: (newData: Date) => void,
  userId: number,
  spinnerForTodos: boolean,
};

export const Main: React.FC<Props> = ({
  todos,
  removeTodo,
  setErrorMassege,
  hideError,
  spinner,
  spinnerStatus,
  cuurentId,
  changeCurrentId,
  setDate,
  userId,
  spinnerForTodos,
}) => {
  const [todoIdEdit, setTodoIdEdit] = useState<number | null>(null);

  const handleClickDeleteTodo = (todoId: number) => {
    spinnerStatus(true);
    changeCurrentId(todoId);
    deleteTodo(todoId)
      .then(response => {
        if (response) {
          removeTodo(todoId);
        }
      })
      .catch(() => {
        setErrorMassege('Unable to delete a todo');
        hideError();
      })
      .finally(() => spinnerStatus(false));
  };

  const handleChangeCompletedTodo = (
    event: React.ChangeEvent<HTMLInputElement>,
    id: number,
    title: string,
  ) => {
    if (event.target.checked) {
      setErrorMassege('');
      spinnerStatus(true);
      changeCurrentId(id);
      updateTodo({
        id, userId, title, completed: true,
      })
        .then(() => setDate(new Date()))
        .catch(() => {
          setErrorMassege('Unable to update a todo');
          hideError();
        })
        .finally(() => spinnerStatus(false));
    }

    if (!event.target.checked) {
      setErrorMassege('');
      spinnerStatus(true);
      changeCurrentId(id);
      updateTodo({
        id, userId, title, completed: false,
      })
        .then(() => setDate(new Date()))
        .catch(() => {
          setErrorMassege('Unable to update a todo');
          hideError();
        })
        .finally(() => spinnerStatus(false));
    }
  };

  const inputFocus = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputFocus.current?.focus();
  }, [todoIdEdit]);

  const handleKeyUpChangeTitleTodo = (
    event: React.KeyboardEvent<HTMLInputElement>,
    id: number,
    completed: boolean,
    title: string,
  ) => {
    if (event.key === 'Enter') {
      const newTitle = event.target.value;

      if (title === newTitle) {
        setTodoIdEdit(null);

        return;
      }

      if (!newTitle.trim()) {
        handleClickDeleteTodo(id);

        return;
      }

      setErrorMassege('');
      spinnerStatus(true);
      changeCurrentId(id);

      updateTodo({
        id, userId, title: newTitle, completed,
      })
        .then(() => {
          setDate(new Date());
          setTodoIdEdit(null);
        })
        .catch(() => {
          setErrorMassege('Unable to update a todo');
          hideError();
        })
        .finally(() => spinnerStatus(false));
    }

    if (event.key === 'Escape') {
      setTodoIdEdit(null);
    }
  };

  const handleBlurChangeTitleTodo = (
    event: React.FocusEvent<HTMLInputElement>,
    id: number,
    completed: boolean,
    title: string,
  ) => {
    const newTitle = event.target.value;

    if (title === newTitle) {
      setTodoIdEdit(null);

      return;
    }

    setErrorMassege('');
    spinnerStatus(true);
    changeCurrentId(id);

    updateTodo({
      id, userId, title: newTitle, completed,
    })
      .then(() => {
        setDate(new Date());
        setTodoIdEdit(null);
      })
      .catch(() => {
        setErrorMassege('Unable to update a todo');
        hideError();
      })
      .finally(() => spinnerStatus(false));
  };

  return (
    <section className="todoapp__main">
      {todos.map(({ title, id, completed }) => (
        <div key={id} className={`todo ${completed && 'completed'}`}>
          <label className="todo__status-label">
            <input
              type="checkbox"
              className="todo__status"
              onChange={(event) => handleChangeCompletedTodo(event, id, title)}
              checked={completed}
            />
          </label>

          <>
            {todoIdEdit !== id ? (
              <>
                <span
                  className="todo__title"
                  onDoubleClick={() => setTodoIdEdit(id)}
                >
                  {title}
                </span>
                <button
                  onClick={() => handleClickDeleteTodo(id)}
                  type="button"
                  className="todo__remove"
                >
                  ×
                </button>
              </>
            ) : (
              <form onSubmit={(event) => event.preventDefault()}>
                <input
                  ref={inputFocus}
                  type="text"
                  className="todo__title-field"
                  placeholder="Empty todo will be deleted"
                  defaultValue={title}
                  onKeyUp={(event) => {
                    handleKeyUpChangeTitleTodo(event, id, completed, title);
                  }}
                  onBlur={(event) => {
                    handleBlurChangeTitleTodo(event, id, completed, title);
                  }}
                />
              </form>
            )}
          </>

          <div className={`modal overlay ${(cuurentId === id || spinnerForTodos || !!completed)
            && spinner && 'is-active'
          }`}
          >
            <div className="modal-background has-background-white-ter" />
            <div className="loader" />
          </div>
        </div>
      ))}
    </section>
  );
};
