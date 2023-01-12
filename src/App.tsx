/* eslint-disable jsx-a11y/control-has-associated-label */
import React, {
  useContext, useEffect, useRef, useState,
} from 'react';
import classNames from 'classnames';
import { AuthContext } from './components/Auth/AuthContext';
import {
  deleteTodo, getTodos, patchTodo, postTodo,
} from './api/todos';
import { Todo } from './types/Todo';
import { TodoItem } from './components/TodoItem/TodoItem';
import { Notification } from
  './components/ErrorNotification/Notification';

export const App: React.FC = () => {
  const user = useContext(AuthContext);
  const newTodoField = useRef<HTMLInputElement>(null);

  const [inputValue, setInputValue] = useState('');
  const [todos, setTodos] = useState<Todo[]>([]);
  const [errorMessages, setErrorMessages] = useState<string[]>([]);
  const [filteredBy, setFilteredBy] = useState('All');
  const [filteredTodos, setFilteredTodos] = useState<Todo[]>([]);

  useEffect(() => {
    if (newTodoField.current) {
      newTodoField.current.focus();
    }

    if (user) {
      getTodos(user.id)
        .then(res => {
          setTodos(res);
          setFilteredTodos(res);
        });
    }
  }, []);

  const updateTodos = (
    setIsLoading?: React.Dispatch<React.SetStateAction<boolean>>,
  ) => {
    if (user) {
      getTodos(user.id)
        .then(res => {
          setTodos(res);
          switch (filteredBy) {
            case 'Active':
              setFilteredTodos(res.filter(item => !item.completed));
              break;
            case 'Completed':
              setFilteredTodos(res.filter(item => item.completed));
              break;
            default:
              setFilteredTodos(res);
          }
        })
        .finally(() => {
          if (setIsLoading) {
            setIsLoading(false);
          }
        });
    }
  };

  const filterByAll = () => {
    if (filteredBy !== 'All') {
      setFilteredTodos(todos);
      setFilteredBy('All');
    }
  };

  const filterByActive = () => {
    if (filteredBy !== 'Active') {
      setFilteredTodos(todos.filter(todo => !todo.completed));
      setFilteredBy('Active');
    }
  };

  const filterByCompleted = () => {
    if (filteredBy !== 'Completed') {
      setFilteredTodos(todos.filter(todo => todo.completed));
      setFilteredBy('Completed');
    }
  };

  const handleDelete = (todoId: number) => {
    if (user) {
      deleteTodo(todoId)
        .then(() => updateTodos())
        .catch(() => {
          setErrorMessages([...errorMessages, 'Unable to delete a todo']);
        });
    }
  };

  const handleClearCompleted = () => {
    filteredTodos.forEach(todo => {
      if (todo.completed) {
        handleDelete(todo.id);
      }
    });
  };

  const toggleStatus = (
    todoId: number,
    todo: Todo,
    setIsLoading?: React.Dispatch<React.SetStateAction<boolean>>,
  ) => {
    const updatedTodo = {
      id: todo.id,
      title: todo.title,
      completed: !todo.completed,
      userId: todo.userId,
    };

    patchTodo(todoId, updatedTodo)
      .then(() => {
        updateTodos(setIsLoading);
      })
      .catch(() => {
        setErrorMessages([...errorMessages, 'Unable to update a todo']);
        if (setIsLoading) {
          setIsLoading(false);
        }
      });
  };

  const handleToggleAll = () => {
    filteredTodos.forEach(todo => {
      toggleStatus(todo.id, todo);
    });
  };

  const handleSubmitAdd = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (user) {
      postTodo({
        title: inputValue,
        completed: false,
        userId: user.id,
      })
        .then(() => updateTodos())
        .catch(() => {
          setErrorMessages([...errorMessages, 'Unable to add a todo']);
        })
        .finally(() => setInputValue(''));
    }
  };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>
      <div className="todoapp__content">
        <header className="todoapp__header">
          <button
            className={classNames(
              'todoapp__toggle-all',
              {
                active: filteredTodos.every(todo => todo.completed),
              },
            )}
            data-cy="ToggleAllButton"
            type="button"
            onClick={handleToggleAll}
          />

          <form onSubmit={event => handleSubmitAdd(event)}>
            <input
              type="text"
              className="todoapp__new-todo"
              data-cy="NewTodoField"
              ref={newTodoField}
              placeholder="What needs to be done?"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
            />
          </form>
        </header>
        <section className="todoapp__main" data-cy="TodoList">
          {filteredTodos.map(todo => (
            <TodoItem
              todo={todo}
              key={todo.id}
              deleteItem={handleDelete}
              toggleStatus={toggleStatus}
              updateTodos={updateTodos}
              errorMessages={errorMessages}
              setErrorMessages={setErrorMessages}
            />
          ))}
        </section>

        {todos.length > 0 && (
          <footer className="todoapp__footer" data-cy="Footer">
            <span className="todo-count" data-cy="todosCounter">
              {`${todos.filter(todo => !todo.completed).length} items left`}
            </span>

            <nav className="filter" data-cy="Filter">
              <a
                data-cy="FilterLinkAll"
                href="#/"
                className={classNames(
                  'filter__link',
                  {
                    selected: filteredBy === 'All',
                  },
                )}
                onClick={filterByAll}
              >
                All
              </a>

              <a
                data-cy="FilterLinkActive"
                href="#/active"
                className={classNames(
                  'filter__link',
                  {
                    selected: filteredBy === 'Active',
                  },
                )}
                onClick={filterByActive}
              >
                Active
              </a>
              <a
                data-cy="FilterLinkCompleted"
                href="#/completed"
                className={classNames(
                  'filter__link',
                  {
                    selected: filteredBy === 'Completed',
                  },
                )}
                onClick={filterByCompleted}
              >
                Completed
              </a>
            </nav>

            <button
              data-cy="ClearCompletedButton"
              type="button"
              className="todoapp__clear-completed"
              onClick={handleClearCompleted}
            >
              Clear completed
            </button>
          </footer>
        )}
      </div>
      {
        errorMessages.length > 0 && (
          <Notification
            errorMessages={errorMessages}
            setErrorMessages={setErrorMessages}
          />
        )
      }

    </div>
  );
};
