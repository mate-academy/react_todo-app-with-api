/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useState, useRef } from 'react';
import { UserWarning } from './UserWarning';
import { USER_ID, getTodos, addTodo, removeTodo } from './api/todos';
import { Todo } from './types/Todo';

// components

import TodoApp from './components/TodoApp';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const [err, setErr] = useState('');
  const [inputValue, setInputValue] = useState('');
  const [isCheck, setIsCheck] = useState(false);
  const [isEdit, setIsEdit] = useState<number | null>(null);
  const [filterActive, setFilterActive] = useState('all');
  const [allCompleted, setAllCompleted] = useState(false);
  const clickOut = useRef<HTMLDivElement>(null);
  const [isLoader, setIsLoader] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        setIsLoader(true);
        const data = await getTodos();

        setTodos(data);
      } catch (error) {
        /* eslint-disable-next-line no-console */
        console.error(error);
        setErr('Unable to load todos');
      } finally {
        setIsLoader(false);
      }
    };

    load();
  }, []);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    const check = todos.some(todo => todo.completed === true);

    if (check) {
      setIsCheck(true);
    }

    // verifica se todos estão completed

    let allComplet = true;

    for (let i = 0; i < todos.length; i++) {
      if (!todos[i].completed) {
        allComplet = false;
        break;
      }
    }

    if (allComplet && todos.length > 0) {
      setAllCompleted(true);
    } else {
      setAllCompleted(false);
    }
  }, [todos]);

  useEffect(() => {
    setTimeout(() => {
      setErr('');
    }, 3000);
  }, [err]);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (!clickOut.current?.contains(e.target as Node)) {
        setIsEdit(null);
      }
    };

    document.addEventListener('click', handleClick);

    return () => {
      document.removeEventListener('click', handleClick);
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (inputValue === '') {
      setErr('Title should not be empty');
    } else {
      setErr('');
      try {
        const newTodo = {
          id: 0,
          userId: USER_ID,
          title: inputValue,
          completed: false,
        };

        await addTodo(newTodo);

        const data = await getTodos();

        setTodos(data);

        setInputValue('');
      } catch (error) {
        /* eslint-disable-next-line no-console */
        console.error(error);
        setErr('Unable to update a todo');
      }
    }
  };

  const getItemsLeft = () => {
    const itemsLeft = todos.filter(todo => {
      return todo.completed === false;
    });

    return itemsLeft.length;
  };

  // filtros
  const filterLink = async (filter: string) => {
    setFilterActive(filter);
    try {
      setIsLoader(true);
      const data = await getTodos();

      if (filter === 'active') {
        setTodos(data.filter(todo => !todo.completed));
      } else if (filter === 'completed') {
        setTodos(data.filter(todo => todo.completed));
      } else {
        setTodos(data);
      }
    } catch (error) {
      /* eslint-disable-next-line no-console */
      console.error(error);
      setErr('Unable to load todos');
    } finally {
      setIsLoader(false);
    }
  };

  // limpeza

  const clearCompleted = async () => {
    const completedTodos = todos.filter(todo => todo.completed);

    await Promise.all(completedTodos.map(todo => removeTodo(todo.id)));
    setTodos(todos.filter(todo => !todo.completed));
  };

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          {/* this button should have `active` class only if all todos are completed */}
          <button
            type="button"
            className={`todoapp__toggle-all ${allCompleted ? 'active' : ''}`}
            data-cy="ToggleAllButton"
          />

          {/* Add a todo on form submit */}
          <form onSubmit={handleSubmit}>
            <input
              data-cy="NewTodoField"
              type="text"
              className="todoapp__new-todo"
              placeholder="What needs to be done?"
              ref={inputRef}
              onChange={e => {
                setInputValue(e.target.value);
              }}
              value={inputValue}
            />
          </form>
        </header>

        {/* TodoApp */}

        {todos.length !== 0 && (
          <TodoApp
            isEdit={isEdit}
            todos={todos}
            isLoader={isLoader}
            setIsLoader={setIsLoader}
            setTodos={setTodos}
            setErr={setErr}
            setIsEdit={setIsEdit}
            clickOut={clickOut}
          />
        )}

        {/* Hide the footer if there are no todos */}
        {todos.length !== 0 && (
          <footer className="todoapp__footer" data-cy="Footer">
            <span className="todo-count" data-cy="TodosCounter">
              {getItemsLeft()} items left
            </span>

            {/* Active link should have the 'selected' class */}
            <nav className="filter" data-cy="Filter">
              <a
                href="#/"
                className={`filter__link ${filterActive === 'all' ? 'selected' : ''}`}
                data-cy="FilterLinkAll"
                onClick={() => {
                  filterLink('all');
                }}
              >
                All
              </a>

              <a
                href="#/active"
                className={`filter__link ${filterActive === 'active' ? 'selected' : ''}`}
                data-cy="FilterLinkActive"
                onClick={() => {
                  filterLink('active');
                }}
              >
                Active
              </a>

              <a
                href="#/completed"
                className={`filter__link ${filterActive === 'completed' ? 'selected' : ''}`}
                data-cy="FilterLinkCompleted"
                onClick={() => {
                  filterLink('completed');
                }}
              >
                Completed
              </a>
            </nav>

            {/* this button should be disabled if there are no completed todos */}
            <button
              type="button"
              className={`todoapp__clear-completed ${!isCheck ? 'is-hidden' : ''}`}
              data-cy="ClearCompletedButton"
              onClick={clearCompleted}
            >
              Clear completed
            </button>
          </footer>
        )}
      </div>

      {/* DON'T use conditional rendering to hide the notification */}
      {/* Add the 'hidden' class to hide the message smoothly */}
      <div
        data-cy="ErrorNotification"
        className={`notification is-danger is-light has-text-weight-normal ${err.length === 0 ? 'hidden' : ''}`}
      >
        <button
          data-cy="HideErrorButton"
          type="button"
          className="delete"
          onClick={() => {
            setErr('');
          }}
        />
        {/* show only one message at a time */}
        {err.length > 0 && <span>{err}</span>}
        {/*
        <br />
        Unable to add a todo
        <br />
        Unable to update a todo
        */}
      </div>
    </div>
  );
};
