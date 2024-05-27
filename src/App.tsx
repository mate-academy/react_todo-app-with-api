/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useMemo, useState } from 'react';
import { UserWarning } from './UserWarning';
import {
  USER_ID,
  createTodo,
  deleteTodo,
  getTodos,
  updateTodo,
} from './api/todos';
import { Todo } from './types/Todo';
import { TodoList } from './components/TodoList';
import Header from './components/Header';
import ErrorComp from './components/ErrorComp';

enum SortSelectOptions {
  All = 'all',
  Active = 'active',
  Completed = 'completed',
}

export enum ErrorMessages {
  Empty = '',
  UnableToLoad = 'Unable to load todos',
  TitleNotBeEmpty = 'Title should not be empty',
  UnableAddATodo = 'Unable to add a todo',
  UnableDelete = 'Unable to delete a todo',
  UnableUpdate = 'Unable to update a todo',
}

export function handleThenUpdateCompleted(
  state: Todo[],
  todo: Todo,
  updatedTodo: Todo,
) {
  return state.map(todoRes => {
    if (todoRes.id === todo.id) {
      return { ...todoRes, completed: updatedTodo.completed };
    }

    return todoRes;
  });
}

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [selectSort, setSelectSort] = useState<SortSelectOptions>(
    SortSelectOptions.All,
  );
  const [error, setError] = useState<ErrorMessages>(ErrorMessages.Empty);
  const [inputTodo, setInputTodo] = useState('');
  const [loading, setLoading] = useState(false);

  const todoList = useMemo(() => {
    return todos.filter(todo => {
      return (
        selectSort === SortSelectOptions.All ||
        (selectSort === SortSelectOptions.Active && !todo.completed) ||
        (selectSort === SortSelectOptions.Completed && todo.completed)
      );
    });
  }, [selectSort, todos]);

  const remainingItemsCount = useMemo(() => {
    return todos.reduce((count, todo) => {
      if (todo.id !== 0 && !todo.completed) {
        return count + 1;
      }

      return count;
    }, 0);
  }, [todos]);

  useEffect(() => {
    getTodos()
      .then(todosPromise => {
        setTodos(todosPromise);
      })
      .catch(() => setError(ErrorMessages.UnableToLoad));
  }, []);

  useEffect(() => {
    if (error !== ErrorMessages.Empty) {
      const timer = setTimeout(() => {
        setError(ErrorMessages.Empty);
      }, 3000);

      return () => clearTimeout(timer);
    }

    return;
  }, [error]);

  if (!USER_ID) {
    return <UserWarning />;
  }

  function handleKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    setError(ErrorMessages.Empty);
    if (event.key !== 'Enter') {
      return;
    }

    event.preventDefault();
    if (inputTodo.trim() === '') {
      setError(ErrorMessages.TitleNotBeEmpty);
    } else {
      setLoading(true);
      setTodos(currentTodos => [
        ...currentTodos,
        {
          id: 0,
          title: inputTodo,
          userId: USER_ID,
          completed: false,
        },
      ]);
      createTodo({
        title: inputTodo.trim(),
        userId: USER_ID,
        completed: false,
      })
        .then(newTodo => {
          setTodos(currentTodos => {
            currentTodos.pop();

            return [...currentTodos, newTodo];
          });
        })
        .then(() => setInputTodo(''))
        .catch(() => {
          setTodos(currentTodo => {
            currentTodo.pop();

            return [...currentTodo];
          });
          setError(ErrorMessages.UnableAddATodo);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }

  function handleEveryCompleted(todosSelect: Todo[]) {
    setError(ErrorMessages.Empty);
    setLoading(true);
    const newCompletedState = !todosSelect.every(td => td.completed);

    todosSelect
      .filter(td => td.completed !== newCompletedState)
      .forEach(todo => {
        updateTodo({
          id: todo.id,
          userId: USER_ID,
          title: todo.title,
          completed: newCompletedState,
        })
          .then(updatedTodo => {
            setTodos(state =>
              handleThenUpdateCompleted(state, todo, updatedTodo),
            );
          })
          .catch(() => setError(ErrorMessages.UnableUpdate))
          .finally(() => setLoading(false));
      });
  }

  function handleDeleteCompletedTodos() {
    setError(ErrorMessages.Empty);
    setLoading(true);
    todos
      .filter(el => el.completed)
      .forEach(todoCompleted => {
        deleteTodo(todoCompleted.id)
          .then(() => {
            setTodos(tds => tds.filter(el => el.id !== todoCompleted.id));
          })
          .catch(() => setError(ErrorMessages.UnableDelete))
          .finally(() => setLoading(false));
      });
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          todos={todos}
          inputTodo={inputTodo}
          setInputTodo={setInputTodo}
          loading={loading}
          handleKeyDown={handleKeyDown}
          handleEveryCompleted={handleEveryCompleted}
        />
        <section className="todoapp__main" data-cy="TodoList">
          <TodoList
            todoList={todoList}
            todos={todos}
            setTodos={setTodos}
            setError={setError}
            setLoading={setLoading}
          />
        </section>

        {todos.length !== 0 && (
          <footer className="todoapp__footer" data-cy="Footer">
            <span className="todo-count" data-cy="TodosCounter">
              {remainingItemsCount} items left
            </span>

            <nav className="filter" data-cy="Filter">
              <a
                href="#/"
                className={`filter__link ${selectSort === SortSelectOptions.All ? 'selected' : ''}`}
                data-cy="FilterLinkAll"
                onClick={() => setSelectSort(SortSelectOptions.All)}
              >
                All
              </a>

              <a
                href="#/active"
                className={`filter__link ${selectSort === SortSelectOptions.Active ? 'selected' : ''}`}
                data-cy="FilterLinkActive"
                onClick={() => setSelectSort(SortSelectOptions.Active)}
              >
                Active
              </a>

              <a
                href="#/completed"
                className={`filter__link ${selectSort === SortSelectOptions.Completed ? 'selected' : ''}`}
                data-cy="FilterLinkCompleted"
                onClick={() => setSelectSort(SortSelectOptions.Completed)}
              >
                Completed
              </a>
            </nav>

            <button
              type="button"
              className="todoapp__clear-completed"
              data-cy="ClearCompletedButton"
              disabled={!todos.some(el => el.completed)}
              onClick={handleDeleteCompletedTodos}
            >
              Clear completed
            </button>
          </footer>
        )}
      </div>

      <ErrorComp error={error} setError={setError} />
    </div>
  );
};
