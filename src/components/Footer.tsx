/* eslint-disable max-len */
import classNames from 'classnames';
import React, { Dispatch, SetStateAction, useMemo } from 'react';
import { Todo } from '../types/Todo';
import { Field } from '../types/Field';
import { USER_ID } from '../utils/userId';
import { client } from '../utils/fetchClient';

type Props = {
  preparedTodos: Todo[],
  todos: Todo[],
  setSelectedField: (field: Field) => void,
  selectedField: Field,
  setTodos: Dispatch<SetStateAction<Todo[]>>;
  setErrorMessage: (err: string) => void;
};

export const Footer:React.FC<Props> = ({
  preparedTodos,
  todos,
  setSelectedField,
  selectedField,
  setTodos,
  setErrorMessage,
}) => {
  const itemsLeft = useMemo(() => todos.filter(t => !t.completed).length, [todos]);

  const linkClickHandler = (event:React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
    return (field: Field) => {
      event?.preventDefault();
      setSelectedField(field);
    };
  };

  const buttonClickHandler = () => {
    const completedTodos = todos.filter(todo => todo.completed);

    setTodos(someTodos => someTodos.map(t => (completedTodos.includes(t)
      ? { ...t, isLoading: true }
      : t)));

    const promise = completedTodos.map(todo => {
      return client.delete(`/todos/${todo.id}?userId=${USER_ID}`);
    });

    Promise.all(promise)
      .then(() => {
        setTodos(someTodos => {
          return someTodos.filter(todo => !todo.completed);
        });
      })
      .catch(err => setErrorMessage(err));
  };

  return (
    <>
      {preparedTodos && (
        <footer className="todoapp__footer">
          <span className="todo-count">
            {`${itemsLeft} items left`}
          </span>

          {/* Active filter should have a 'selected' class */}
          <nav className="filter">
            <a
              href="#/"
              className={classNames('filter__link', {
                selected: selectedField === 'all',
              })}
              onClick={event => linkClickHandler(event)(Field.all)}
            >
              All
            </a>

            <a
              href="#/active"
              className={classNames('filter__link', {
                selected: selectedField === 'active',
              })}
              onClick={event => linkClickHandler(event)(Field.active)}
            >
              Active
            </a>

            <a
              href="#/completed"
              className={classNames('filter__link', {
                selected: selectedField === 'completed',
              })}
              onClick={event => linkClickHandler(event)(Field.completed)}
            >
              Completed
            </a>
          </nav>

          {/* don't show this button if there are no completed todos */}
          <button
            type="button"
            className={classNames('todoapp__clear-completed', {
              'is-invisible': todos.filter(t => t.completed).length === 0,
            })}
            onClick={buttonClickHandler}
          >
            Clear completed
          </button>
        </footer>
      )}
    </>
  );
};
