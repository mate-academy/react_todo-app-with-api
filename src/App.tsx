import cn from 'classnames';
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { UserWarning } from './UserWarning';

import { Todo } from './types/Todo';
import { Status } from './types/Status';
import { ErrorType } from './types/ErrorType';

import { TodoList } from './components/TodoList/TodoList';
import { TodosFilter } from './components/TodosFilter';
import { ErrorMessages } from './components/ErrorMessages';

import { preperedTodos } from './helpers';
import * as todoService from './api/todos';

const USER_ID = 12013;

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [todoTitle, setTodoTitle] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<Status>(Status.ALL);
  const [errorMessage, setErrorMessage] = useState<ErrorType | null>(null);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const titleRef = useRef<HTMLInputElement>(null);

  const hasCompletedTodos = todos.some(todo => todo.completed);
  const uncompletedTodos = todos.filter(todo => !todo.completed).length;
  let areAllTodosCompleted = todos.every(todo => todo.completed);

  const showError = useCallback((error: ErrorType) => {
    setErrorMessage(error);
    setTimeout(() => setErrorMessage(null), 3000);
  }, []);

  useEffect(() => {
    todoService.getTodos(USER_ID)
      .then(setTodos)
      .catch(() => showError(ErrorType.NOT_LOADED_TODO));
  }, [showError]);

  useEffect(() => {
    titleRef.current?.focus();
  }, [isLoading]);

  const visibleTodos = useMemo(() => {
    return preperedTodos(todos, selectedFilter);
  }, [selectedFilter, todos]);

  const createTodo = useCallback((title: string): Promise<void> => {
    const newTodo = {
      userId: USER_ID,
      title,
      completed: false,
      id: 0,
    };

    setTempTodo({ ...newTodo });

    return todoService.addTodo(newTodo)
      .then((response) => setTodos(
        currentTodos => [...currentTodos, response],
      ))
      .catch(() => {
        showError(ErrorType.NOT_ADD_TODO);
        throw new Error(ErrorType.NOT_ADD_TODO);
      })
      .finally(() => setTempTodo(null));
  }, [showError]);

  const addTodo = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setErrorMessage(null);

    if (!todoTitle.trim().length) {
      showError(ErrorType.EMPTY_TITLE);

      return;
    }

    setIsLoading(true);

    createTodo(todoTitle.trim())
      .then(() => setTodoTitle(''))
      .finally(() => {
        setIsLoading(false);
      });
  };

  const removeTodo = useCallback((id: number): Promise<void> => {
    return todoService.deleteTodo(id)
      .then(() => setTodos(
        currentTodos => currentTodos.filter(todo => todo.id !== id),
      ))
      .catch(() => showError(ErrorType.NOT_DELETE_TODO));
  }, [showError]);

  const updateTodo = useCallback((todo: Todo): Promise<void> => {
    return todoService.updateTodo(todo)
      .then((updatedTodo) => {
        setTodos(currentTodos => {
          return currentTodos.map(currentTodo => {
            if (currentTodo.id === updatedTodo.id) {
              return { ...currentTodo, ...updatedTodo };
            }

            return currentTodo;
          });
        });
      })
      .catch(() => {
        showError(ErrorType.Not_UPDATE_TODO);

        throw new Error(ErrorType.Not_UPDATE_TODO);
      });
  }, [showError]);

  const handleSelectFilter = (status: Status) => {
    setSelectedFilter(status);
  };

  const handleClearCompleted = () => {
    const completedTodo = todos.filter(todo => todo.completed);

    completedTodo.forEach(todo => {
      removeTodo(todo.id);
    });
  };

  const handleToggleAll = () => {
    areAllTodosCompleted = !areAllTodosCompleted;

    todos.forEach(todo => {
      if (todo.completed !== areAllTodosCompleted) {
        updateTodo({ ...todo, completed: areAllTodosCompleted });
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
          <button
            type="button"
            className={cn(
              'todoapp__toggle-all',
              { active: areAllTodosCompleted },
            )}
            data-cy="ToggleAllButton"
            aria-label="add-all"
            onClick={handleToggleAll}
          />

          <form onSubmit={event => addTodo(event)}>
            <input
              value={todoTitle}
              onChange={event => setTodoTitle(event.target.value)}
              data-cy="NewTodoField"
              type="text"
              className="todoapp__new-todo"
              placeholder="What needs to be done?"
              ref={titleRef}
              disabled={isLoading}
            />
          </form>
        </header>

        <TodoList
          todos={visibleTodos}
          removeTodo={removeTodo}
          tempTodo={tempTodo}
          isLoading={isLoading}
          updateTodo={updateTodo}
          titleRef={titleRef}
        />

        {todos.length > 0 && (
          <footer className="todoapp__footer" data-cy="Footer">
            <span className="todo-count" data-cy="TodosCounter">
              {`${uncompletedTodos} items left`}
            </span>

            <TodosFilter
              selectedFilter={selectedFilter}
              handleSelectFilter={handleSelectFilter}
            />

            <button
              type="button"
              className="todoapp__clear-completed"
              data-cy="ClearCompletedButton"
              disabled={!hasCompletedTodos}
              onClick={handleClearCompleted}
            >
              Clear completed
            </button>
          </footer>
        )}
      </div>

      <ErrorMessages
        errorMessage={errorMessage}
        setErrorMessage={setErrorMessage}
      />
    </div>
  );
};
