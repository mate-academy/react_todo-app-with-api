/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useRef } from 'react';
import { useSignal, useSignals } from '@preact/signals-react/runtime';
import classNames from 'classnames';
import { UserWarning } from './UserWarning';
import { TodoList } from './components/TodoList/TodoList';
import {
  allTodosCompleted, isError, tempTodo, todos, todosToLoad,
} from './signals';
import { Error } from './components/Error/Error';
import { ErrorValues } from './types/ErrorValues';
import { postTodo, updateTodo } from './api/todos';

const USER_ID = 132;

export const App: React.FC = () => {
  useSignals();

  const inputValue = useSignal<string>('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  });

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    inputValue.value = e.target.value;
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!inputValue.value.trim()) {
      isError.value = ErrorValues.emptyTitle;
    } else {
      tempTodo.value = {
        id: 0,
        title: inputValue.value.trim(),
        completed: false,
        userId: USER_ID,
      };
      todosToLoad.value = [...todosToLoad.value, tempTodo.value.id];
      postTodo(tempTodo.value)
        .then((todo) => {
          todos.value = [...todos.value, todo];
          inputValue.value = '';
        })
        .catch(() => {
          isError.value = ErrorValues.add;
        })
        .finally(() => {
          todosToLoad.value = todosToLoad.value
            .filter((t) => t !== tempTodo.value?.id);
          tempTodo.value = null;
          inputRef.current?.focus();
        });
    }
  };

  const handleToggleAll = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    todos.value.forEach(todo => {
      if (todo.completed === allTodosCompleted.value) {
        todosToLoad.value = [...todosToLoad.value, todo.id];
        updateTodo({
          id: todo.id,
          title: todo.title,
          completed: !allTodosCompleted.value,
        })
          .then((updatedTodo) => {
            todos.value = todos.value
              .map((t) => (t.id === todo.id ? updatedTodo : t));
          })
          .catch(() => {
            isError.value = ErrorValues.update;
          })
          .finally(() => {
            todosToLoad.value = todosToLoad.value
              .filter((t) => t !== todo.id);
          });
      }
    });
  };

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">

          {!!todos.value.length && (
            <button
              type="button"
              className={classNames('todoapp__toggle-all',
                { active: allTodosCompleted.value })}
              data-cy="ToggleAllButton"
              onClick={handleToggleAll}
            />
          )}

          <form onSubmit={handleSubmit}>
            <input
              data-cy="NewTodoField"
              type="text"
              className="todoapp__new-todo"
              placeholder="What needs to be done?"
              ref={inputRef}
              value={inputValue.value}
              onInput={handleInput}
              disabled={!!tempTodo.value}
            />
          </form>
        </header>
        {!!todos.value.length && (
          <TodoList />
        )}
      </div>
      <Error />

    </div>
  );
};
