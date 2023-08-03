/* eslint-disable max-len */
/* eslint-disable jsx-a11y/no-autofocus */
import classNames from 'classnames';
import React, { Dispatch, SetStateAction } from 'react';
import { Todo } from '../types/Todo';
import { USER_ID } from '../utils/userId';
import { client } from '../utils/fetchClient';
import { getMax } from '../utils/getMax';

type Props = {
  todo: Todo;
  setTodos: Dispatch<SetStateAction<Todo[]>>;
  selectedTodo: Todo | null;
  updatedTitle: string;
  setSelectedTodo: (todo: Todo | null) => void;
  setErrorMessage: (err: string) => void;
  setUpdatedTitle: (title: string) => void;
  loadTodos: () => Promise<void>;
  wasError: boolean;
  setWasError: (wasErr: boolean) => void;
  todos: Todo[];
};

export const TodoItem:React.FC<Props> = ({
  todo,
  setTodos,
  selectedTodo,
  updatedTitle,
  setSelectedTodo,
  setErrorMessage,
  setUpdatedTitle,
  loadTodos,
  wasError,
  setWasError,
  todos,
}) => {
  const inputClickHandler = () => {
    setTodos(someTodos => someTodos.map(t => (t.id === todo.id
      ? { ...t, isLoading: true }
      : t)));

    client.patch(`/todos/${todo.id}?userId=${USER_ID}`, { completed: !todo.completed })
      .then(loadTodos)
      .catch((err) => setErrorMessage(err));
  };

  const buttonClickHandler = () => {
    setTodos(someTodos => {
      const index = someTodos.findIndex(t => t.id === todo.id);
      const deletedTodo = { ...todo, completed: true, isLoading: true };

      const newTodos = [...someTodos];

      newTodos.splice(index, 1, deletedTodo);

      return newTodos;
    });

    client.delete(`/todos/${todo.id}?userId=${USER_ID}`)
      .then(() => {
        setTodos(someTodos => someTodos.filter(t => t.id !== todo.id));
      })
      .catch(() => {
        setErrorMessage('Can\'t delete todo');
        setWasError(true);
        setTodos(someTodos => {
          const index = someTodos.findIndex(t => t.id === todo.id);

          const newTodos = [...someTodos];

          newTodos.splice(index, 1, todo);

          return newTodos;
        });

        return Promise.reject();
      });
  };

  const formSubmitHandler = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorMessage('');

    if (updatedTitle.trim() === '') {
      buttonClickHandler();
    } else {
      setTodos(someTodos => {
        const newTodos = [...someTodos];
        // eslint-disable-next-line max-len
        const index = someTodos.findIndex(t => t.id === todo.id);
        const newTodo = {
          ...todo,
          title: updatedTitle,
          id: getMax(todos),
          completed: true,
          isLoading: true,
        };

        newTodos.splice(index, 1, newTodo);

        return newTodos;
      });

      client.patch(`/todos/${todo.id}?userId=${USER_ID}`, { title: updatedTitle })
        .catch(() => {
          setErrorMessage('Can\'t update a todo');
          setWasError(true);
          setTodos(someTodos => {
            const newTodos = [...someTodos];
            // eslint-disable-next-line max-len
            const index = someTodos.findIndex(t => t.title === 'some');
            const someTodo = someTodos.find(t => t.title === 'some') || todo;
            const newTodo = {
              ...someTodo, title: 'new',
            };

            newTodos.splice(index, 1, newTodo);

            return newTodos;
          });
        })
        .then(loadTodos)
        .catch(() => {
          setErrorMessage('Can\'t delete todos');
          setWasError(true);
        });

      setSelectedTodo(null);
    }
  };

  const inputChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    event.preventDefault();
    setUpdatedTitle(event.target.value);
  };

  const inputBlurHandler = (event: React.FocusEvent<HTMLInputElement, Element>) => {
    event.preventDefault();
    setErrorMessage('');

    if (updatedTitle.trim() === '') {
      client.delete(`/todos/${todo.id}?userId=${USER_ID}`);
      setTodos(someTodos => {
        const filteredTodos = [...someTodos].filter(t => t.id !== todo.id);

        return filteredTodos;
      });
    } else {
      setTodos(someTodos => {
        const newTodos = [...someTodos];
        // eslint-disable-next-line max-len
        const index = someTodos.findIndex(t => t.id === todo.id);
        const newTodo = {
          ...todo,
          updatedTitle,
          id: getMax(todos),
          completed: true,
          isLoading: true,
        };

        newTodos.splice(index, 1, newTodo);

        return newTodos;
      });

      client.patch(`/todos/${todo.id}?userId=${USER_ID}`, { title: updatedTitle })
        .then(loadTodos)
        .catch(() => {
          setErrorMessage('Can\'t update a todo');
          setWasError(true);
        });

      setSelectedTodo(null);
    }
  };

  const divDblClickHandler = () => {
    setSelectedTodo(todo);
    setUpdatedTitle(todo.title);
  };

  return (
    <>
      {!todo.isLoading && (
        <div
          className={classNames('todo',
            { completed: todo.completed })}
          key={todo.id}
        >
          <label className="todo__status-label">
            <input
              type="checkbox"
              className="todo__status"
              checked={todo.completed}
              onClick={inputClickHandler}
            />
          </label>
          {selectedTodo === todo
            ? (
              <form onSubmit={formSubmitHandler}>
                <input
                  type="text"
                  className="todo__title-field"
                  placeholder="Todo title can't be empty"
                  value={updatedTitle}
                  onChange={inputChangeHandler}
                  onBlur={inputBlurHandler}
                  autoFocus
                />
              </form>
            ) : (
              <div
                className="todo__title"
                onDoubleClick={divDblClickHandler}
              >
                {todo.title}
              </div>
            )}
          {/* Remove button appears only on hover */}
          <button
            type="button"
            className="todo__remove"
            onClick={buttonClickHandler}
          >
            ×
          </button>
        </div>
      ) }
      {todo.isLoading && !wasError && (
        <div
          className="todo"
        >
          <label className="todo__status-label">
            <input
              type="checkbox"
              className="todo__status"
            />
          </label>

          <div
            className="todo__title"
          >
            <span className="loader" />
          </div>
        </div>
      )}
    </>
  );
};
