/* eslint-disable @typescript-eslint/no-shadow */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, {
  useCallback,
  useEffect, useMemo, useRef, useState,
} from 'react';
import classNames from 'classnames';
import { TodoList } from './components/TodoList/TodoList';
import { FilterOptions } from './types/Filter';
import { Todo } from './types/Todo';
import * as todosServices from './api/todos';
import { ErrorMessages } from './types/ErrorMessages';
import { ErrorMessage } from './components/ErrorMessage/ErrosMessage';
import { getPrepareTodos } from './components/FilterTodo/FilterTodo';

const USER_ID = 11692;

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filterOption, setFilterOption] = useState(FilterOptions.All);
  const [deletingTodoIds, setDeletingTodoIds] = useState<number[]>([]);
  const [updatingTodoIds, setUpdatingTodoIds] = useState<number[]>([]);
  const [isDisabled, setIsDisabled] = useState(false);

  const [tempTodo, setTempTodo] = useState<Todo | null>(null);

  const [hasError, setHasError] = useState(false);
  const [errorMessage, setErrorMessage] = useState(ErrorMessages.None);

  const [todoTitle, setTodoTitle] = useState('');

  const firstRender = useRef<boolean>(true);
  const titleInput = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;

      return;
    }

    titleInput.current?.focus();
  }, [isDisabled]);

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTodoTitle(e.target.value);
  };

  const addTodo = useCallback((title: string) => {
    if (!title) {
      setHasError(true);
      setErrorMessage(ErrorMessages.EmptyTitle);

      return;
    }

    const newTodo: Todo = {
      id: 0,
      title,
      userId: USER_ID,
      completed: false,
    };

    setTempTodo(newTodo);
    setIsDisabled(true);

    todosServices.createTodo(newTodo)
      .then(todo => setTodos(currentTodos => [...currentTodos, todo]))
      .catch(() => {
        setErrorMessage(ErrorMessages.Add);
        setHasError(true);
      })
      .finally(() => {
        setTempTodo(null);
        setIsDisabled(false);
      });
  }, []);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const preparedTitle = todoTitle.trim();

    addTodo(preparedTitle);
    setTodoTitle('');
  };

  const preparedTodos = useMemo(() => {
    return getPrepareTodos(todos, filterOption);
  }, [todos, filterOption]);

  const activeTodos = todos.filter(todo => !todo.completed);

  const completedTodoIds = todos
    .filter(todo => todo.completed)
    .map(todo => todo.id);

  useEffect(() => {
    todosServices.getTodos(USER_ID)
      .then(setTodos)
      .catch(() => {
        setErrorMessage(ErrorMessages.Get);
        setHasError(true);
      });
  }, []);

  const deleteTodo = useCallback((todoId: number) => {
    setDeletingTodoIds(prevIds => [
      ...prevIds,
      todoId,
    ]);

    todosServices.deleteTodo(todoId)
      .then(() => {
        setTodos(currTodos => currTodos.filter(todo => todo.id !== todoId));
      })
      .catch(() => {
        setTodos(currTodos => currTodos);
        setHasError(true);
        setErrorMessage(ErrorMessages.Delete);
      })
      .finally(() => {
        setDeletingTodoIds([]);
      });
  }, []);

  const updateTodos = useCallback((updatedTodo: Todo) => {
    setUpdatingTodoIds(currTodoId => [
      ...currTodoId,
      updatedTodo.id,
    ]);

    todosServices.updateTodos(updatedTodo)
      .then((newTodo) => {
        setTodos(currTodos => {
          const newTodos = [...currTodos];
          const index = newTodos.findIndex(item => item.id === updatedTodo.id);

          newTodos.splice(index, 1, newTodo);

          return newTodos;
        });
      })
      .catch(() => {
        setTodos(currTodos => [...currTodos]);
        setErrorMessage(ErrorMessages.Update);
        setHasError(true);
      })
      .finally(() => {
        setUpdatingTodoIds(currTodoIds => {
          const newTodoIds = [...currTodoIds];
          const index = newTodoIds.findIndex(id => id === updatedTodo.id);

          newTodoIds.splice(index, 1);

          // eslint-disable-next-line no-console
          console.log(newTodoIds, '2', index);

          return newTodoIds;
        });
      });
  }, []);

  const handleDeleteCompleted = () => {
    completedTodoIds.forEach(todoId => {
      deleteTodo(todoId);
    });
  };

  const handleUpdateTitle = (todo: Todo, newTitle: string) => {
    if (newTitle === todo.title) {
      return;
    }

    if (!newTitle) {
      deleteTodo(todo.id);

      return;
    }

    const updatedTodo = {
      ...todo,
    };

    updatedTodo.title = newTitle.trim();
    updateTodos(updatedTodo);
  };

  const handleToggleStatus = (todo: Todo) => {
    const updatedTodo = {
      ...todo,
    };

    updatedTodo.completed = !updatedTodo.completed;
    updateTodos(updatedTodo);
  };

  const handleToggleAllStatus = () => {
    if (activeTodos.length) {
      // eslint-disable-next-line no-console
      console.log(activeTodos.length);
      activeTodos.forEach(todo => {
        handleToggleStatus(todo);
      });

      return;
    }

    todos.forEach(todo => {
      handleToggleStatus(todo);
    });
  };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          <button
            aria-label="button"
            type="button"
            data-cy="ToggleAllButton"
            className={classNames(
              'todoapp__toggle-all',
              { active: !!activeTodos.length },
            )}
            onClick={handleToggleAllStatus}
          />

          <form onSubmit={handleSubmit}>
            <input
              data-cy="NewTodoField"
              type="text"
              className="todoapp__new-todo"
              placeholder="What needs to be done?"
              value={todoTitle}
              onChange={handleTitleChange}
              disabled={isDisabled}
              ref={titleInput}
            />
          </form>
        </header>

        {!!todos.length && (
          <>
            <TodoList
              todos={preparedTodos}
              tempTodo={tempTodo}
              deletingTodoIds={deletingTodoIds}
              updatingTodoIds={updatingTodoIds}
              onDeleteTodo={deleteTodo}
              onToggleStatus={handleToggleStatus}
              onUpdateTitle={handleUpdateTitle}
            />
            <footer className="todoapp__footer">
              <span className="todo-count">
                {`${activeTodos.length} items left`}
              </span>

              <nav className="filter">
                <a
                  href="#/"
                  className={classNames(
                    'filter__link',
                    { selected: filterOption === FilterOptions.All },
                  )}
                  onClick={() => setFilterOption(FilterOptions.All)}
                >
                  All
                </a>

                <a
                  href="#/active"
                  className={classNames(
                    'filter__link',
                    { selected: filterOption === FilterOptions.Active },
                  )}
                  onClick={() => setFilterOption(FilterOptions.Active)}
                >
                  Active
                </a>

                <a
                  href="#/completed"
                  className={classNames(
                    'filter__link',
                    { selected: filterOption === FilterOptions.Completed },
                  )}
                  onClick={() => setFilterOption(FilterOptions.Completed)}
                >
                  Completed
                </a>
              </nav>

              <button
                type="button"
                data-cy="ClearCompletedButton"
                className="todoapp__clear-completed"
                style={{
                  visibility: !completedTodoIds.length
                    ? 'hidden'
                    : 'visible',
                }}
                onClick={handleDeleteCompleted}
              >
                Clear completed
              </button>
            </footer>
          </>
        )}
      </div>

      <ErrorMessage
        errorMessage={errorMessage}
        hasError={hasError}
        setHasError={setHasError}
      />
    </div>
  );
};
