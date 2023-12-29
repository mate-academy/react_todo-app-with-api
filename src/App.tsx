/* eslint-disable no-lone-blocks */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, {
  useEffect, useMemo, useState, useRef,
} from 'react';
import cn from 'classnames';

import { UserWarning } from './UserWarning';
import * as fetchCl from './api/todos';
import { Header } from './components/header/Header';
import { Todoapp } from './components/Todoapp/Todoapp';
import { Todo } from './types/Todo';

const USER_ID = 11999;

enum Status {
  all = 'all',
  active = 'active',
  completed = 'completed',
}

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [todoNameInput, setTodoNameInput] = useState('');
  const [status, setStatus] = useState<Status>(Status.all);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [unActive, setUnActive] = useState<number[]>([]);

  const todoInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchCl.getTodos(USER_ID)
      .then(res => {
        setTodos(res);
      })
      .catch(() => setError('Unable to load todos'));
  }, []);

  useEffect(() => {
    if (!loading) {
      todoInputRef.current?.focus();
    }
  }, [loading]);

  const visibleTodos = useMemo(() => {
    return todos.filter(todo => {
      if (status === Status.active) {
        return !todo.completed;
      }

      if (status === Status.completed) {
        return todo.completed;
      }

      return true;
    });
  }, [todos, status]);

  if (!USER_ID) {
    return <UserWarning />;
  }

  const addTodo = (event: React.FormEvent) => {
    event.preventDefault();

    if (todoNameInput.trim()) {
      setLoading(true);

      const tempTodo = {
        id: 0,
        userId: USER_ID,
        title: todoNameInput.trim(),
        completed: false,
      };

      const arrTodosWithTemp = [...todos, tempTodo];

      setTodos(arrTodosWithTemp);
      setUnActive([0]);

      fetchCl.createTodo(tempTodo)
        .then(res => {
          setTodos([...todos, res]);
          setTodoNameInput('');
        }).catch(() => {
          setTodos([...todos]);
          setError('Unable to add todo');
          setTimeout(() => setError(''), 3000);
        }).finally(() => {
          setLoading(false);
        });
    } else {
      setError('Title should not be empty');
      setTimeout(() => setError(''), 3000);
    }
  };

  const deleteTodo = (todoId: number) => {
    setLoading(true);
    setUnActive([todoId]);

    fetchCl.deleteTodo(todoId)
      .then(() => {
        setTodos(todos.filter(todo => todo.id !== todoId));
      })
      .catch(() => {
        setError('Unable to delete todo');
        setTimeout(() => setError(''), 3000);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const countRemainingTodo = () => {
    let count = 0;

    todos.filter(todo => todo.id !== 0).forEach(todo => {
      if (!todo.completed) {
        count += 1;
      }
    });

    return count;
  };

  const handleChangeCheckbox = (todoId: number) => {
    const changedArr = todos.map(todo => {
      if (todo.id === todoId) {
        setUnActive([todoId]);

        const updatedTodo = {
          ...todo,
          completed: !todo.completed,
        };

        fetchCl.updateTodo(todoId, updatedTodo)
          .catch(() => {
            setError('Unable to update Todo');
            setTimeout(() => setError(''), 3000);
          })
          .finally(() => setUnActive([]));

        return updatedTodo;
      }

      return todo;
    });

    setTodos(changedArr);
  };

  const clearCompletedTodos = () => {
    const completedId = todos.map(todo => {
      if (todo.completed) {
        return todo.id;
      }

      return 0;
    })
      .filter(todo => todo);

    const withActiveTodo = todos.filter(todo => {
      if (todo.completed) {
        if (completedId) {
          setUnActive(completedId);
        }

        fetchCl.deleteTodo(todo.id)
          .then(() => setTodos(withActiveTodo))
          .catch(() => {
            setError('Unable to delete todo');
            setTimeout(() => setError(''), 3000);
          })
          .finally(() => {
            setUnActive([]);
          });
      }

      return !todo.completed;
    });
  };

  const updateTodoTitle = (id: number, newTitle: string) => {
    todos
      .filter(todo => todo.id === id)
      .map(todo => fetchCl.updateTodo(id, {
        ...todo,
        title: newTitle,
      }).then(res => {
        const trueArr = todos.map(currTodo => {
          if (currTodo.id === id) {
            return res;
          }

          return currTodo;
        });

        setTodos(trueArr);
      })
        .catch(() => {
          setError('Unable to update todo');
          setTimeout(() => setError(''), 3000);
        })
        .finally(() => setUnActive([])));
  };

  const countActiveTodo = countRemainingTodo();
  const hasCompletedTodo = visibleTodos.some(todo => todo.completed);
  const hasAllTodosCompleted = todos.every(todo => todo.completed);

  const handleToggleAll = () => {
    if (!hasAllTodosCompleted) {
      todos
        .filter(todo => !todo.completed)
        .forEach(todo => {
          setUnActive(currUnActive => [...currUnActive, todo.id]);
          fetchCl.updateTodo(todo.id, {
            ...todo,
            completed: true,
          }).finally(() => setUnActive([]));
        });

      const allCompletedArr = todos.map(todo => ({
        ...todo,
        completed: true,
      }));

      setTodos(allCompletedArr);
    }

    if (hasAllTodosCompleted) {
      todos
        .filter(todo => todo.completed)
        .forEach(todo => {
          setUnActive(currUnActive => [...currUnActive, todo.id]);
          fetchCl.updateTodo(todo.id, {
            ...todo,
            completed: false,
          }).finally(() => setUnActive([]));
        });

      const allActiveArr = todos.map(todo => ({
        ...todo,
        completed: false,
      }));

      setTodos(allActiveArr);
    }
  };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          onSubmit={addTodo}
          todos={todos}
          inputValue={todoNameInput}
          changeInputValue={setTodoNameInput}
          isLoading={loading}
          todoInputRef={todoInputRef}
          toggleAllAction={handleToggleAll}
          hasAllTodosCompleted={hasAllTodosCompleted}
        />

        {todos
          && (
            <Todoapp
              todos={visibleTodos}
              deleteTodoAction={deleteTodo}
              unActive={unActive}
              setUnActive={setUnActive}
              changeCheckbox={handleChangeCheckbox}
              onUpdate={updateTodoTitle}
            />
          )}

        {todos.length > 0 && (
          <footer className="todoapp__footer" data-cy="Footer">
            <span className="todo-count" data-cy="TodosCounter">
              {`${countActiveTodo} items left`}
            </span>

            <nav className="filter" data-cy="Filter">
              <a
                href="#/"
                className={cn('filter__link', {
                  selected: status === Status.all,
                })}
                data-cy="FilterLinkAll"
                onClick={() => setStatus(Status.all)}
              >
                All
              </a>

              <a
                href="#/active"
                className={cn('filter__link', {
                  selected: status === Status.active,
                })}
                data-cy="FilterLinkActive"
                onClick={() => setStatus(Status.active)}
              >
                Active
              </a>

              <a
                href="#/completed"
                className={cn('filter__link', {
                  selected: status === Status.completed,
                })}
                data-cy="FilterLinkCompleted"
                onClick={() => setStatus(Status.completed)}
              >
                Completed
              </a>
            </nav>

            <button
              type="button"
              className={cn(
                'todoapp__clear-completed',
                { disabled: !hasCompletedTodo },
              )}
              data-cy="ClearCompletedButton"
              onClick={() => clearCompletedTodos()}
            >
              Clear completed
            </button>
          </footer>
        )}
      </div>
      {error && (
        <div
          data-cy="ErrorNotification"
          className={cn(
            'notification',
            'is-danger',
            'is-light',
            'has-text-weight-normal',
            { hidden: !error },
          )}
        >
          <button
            data-cy="HideErrorButton"
            type="button"
            className="delete"
            onClick={() => setError('')}
          />
          {error}
        </div>
      )}
    </div>
  );
};
