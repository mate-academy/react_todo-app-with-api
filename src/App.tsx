/* eslint-disable jsx-a11y/control-has-associated-label */
import React, {
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';

import classNames from 'classnames';
import { AuthContext } from './components/Auth/AuthContext';
import { NewTodoField } from './components/Auth/NewTodoField';
import {
  createTodo,
  deleteTodo,
  getTodos,
  changeTodo,
} from './api/todos';

import { Todo } from './types/Todo';
import { TodoList } from './components/Auth/TodoList';
import { Footer } from './components/Auth/Footer';
import { ErrorMessage } from './components/Auth/ErrorMessage';
import { FilterType } from './utils/enums/FilterType';
import { ErrorType } from './utils/enums/ErrorType';

export const App: React.FC = () => {
  const user = useContext(AuthContext);

  const [todos, setTodos] = useState<Todo[]>([]);
  const [visibleTodos, setVisibleTodos] = useState<Todo[]>([]);
  const [filterType, setFilterType] = useState(FilterType.All);
  const [errorType, setErrorType] = useState<ErrorType>(ErrorType.None);
  const [newTodoTitle, setNewTodoTitle] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [loadingTodoIds, setLoadingTodoIds] = useState<number[]>([]);

  const isAllCompleted = todos.every(todo => todo.completed);

  const removeError = () => {
    setTimeout(() => {
      setErrorType(ErrorType.None);
    }, 3000);
  };

  const loadTodos = useCallback(async () => {
    try {
      const userId = user
        ? user.id
        : 0;

      const loadedTodos = await getTodos(userId);

      const filteredTodos = loadedTodos.filter(todo => {
        switch (filterType) {
          case FilterType.Active:
            return !todo.completed;

          case FilterType.Completed:
            return todo.completed;

          default: return true;
        }
      });

      setTodos(loadedTodos);
      setVisibleTodos(filteredTodos);
    } catch {
      setErrorType(ErrorType.Load);

      removeError();
    }
  }, [filterType]);

  const handleTodoAdding = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsAdding(true);

    try {
      if (user && newTodoTitle.trim()) {
        await createTodo({
          title: newTodoTitle,
          userId: user.id,
          completed: false,
        });
        await loadTodos();
      } else {
        throw new Error('Can\'t add todo');
      }
    } catch {
      setErrorType(() => {
        return newTodoTitle.trim()
          ? ErrorType.Add
          : ErrorType.Empty;
      });

      removeError();
    }

    setIsAdding(false);
    setNewTodoTitle('');
  };

  const handleTodoDeleting = async (todoId: number) => {
    setLoadingTodoIds(currentIds => ([
      ...currentIds,
      todoId,
    ]));

    try {
      await deleteTodo(todoId);
      await loadTodos();
    } catch {
      setErrorType(ErrorType.Delete);

      removeError();
    } finally {
      setLoadingTodoIds(currentIds => {
        const newIds = [...currentIds];

        newIds.shift();

        return newIds;
      });
    }
  };

  const handleCompletedDeleting = async () => {
    const completedTodos = todos.filter(todo => todo.completed);

    completedTodos.forEach(todo => handleTodoDeleting(todo.id));
  };

  const toggleStatus = async (todo: Todo) => {
    setLoadingTodoIds(currentIds => ([
      ...currentIds,
      todo.id,
    ]));

    try {
      await changeTodo(todo.id, {
        ...todo,
        completed: !todo.completed,
      });

      await loadTodos();
    } catch {
      setErrorType(ErrorType.Update);

      removeError();
    } finally {
      setLoadingTodoIds(currentIds => {
        const newIds = [...currentIds];

        newIds.shift();

        return newIds;
      });
    }
  };

  const handleTitleChange = async (
    event: React.FormEvent,
    todo: Todo,
    newTitle: string,
  ) => {
    event.preventDefault();

    if (newTitle === todo.title) {
      return;
    }

    setLoadingTodoIds(currentIds => ([
      ...currentIds,
      todo.id,
    ]));

    try {
      if (newTitle.trim()) {
        await changeTodo(todo.id, {
          ...todo,
          title: newTitle,
        });

        await loadTodos();
      } else {
        await handleTodoDeleting(todo.id);
      }
    } catch {
      setErrorType(ErrorType.Update);

      removeError();
    } finally {
      setLoadingTodoIds(currentIds => {
        const newIds = [...currentIds];

        newIds.shift();

        return newIds;
      });
    }
  };

  const toggleAllCompleted = async () => {
    todos.forEach(todo => {
      if (isAllCompleted) {
        toggleStatus(todo);
      } else if (!todo.completed) {
        toggleStatus(todo);
      }
    });
  };

  const onInput = (input: string) => {
    setNewTodoTitle(input);
  };

  const onClose = () => {
    setErrorType(ErrorType.None);
  };

  const onFilter = (type: FilterType) => {
    setFilterType(type);
  };

  useEffect(() => {
    loadTodos();
  }, [filterType]);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          <button
            data-cy="ToggleAllButton"
            type="button"
            className={classNames(
              'todoapp__toggle-all',
              { active: isAllCompleted },
            )}
            onClick={toggleAllCompleted}
          />

          <NewTodoField
            newTodoTitle={newTodoTitle}
            onInput={onInput}
            addTodo={handleTodoAdding}
            isAdding={isAdding}
          />
        </header>

        {(todos.length > 0 || isAdding) && (
          <>
            <TodoList
              todos={visibleTodos}
              isAdding={isAdding}
              tempTodoTitle={newTodoTitle}
              handleTodoDeleting={handleTodoDeleting}
              toggleStatus={toggleStatus}
              loadingTodoIds={loadingTodoIds}
              handleTitleChange={handleTitleChange}
            />
            <Footer
              filterType={filterType}
              todos={todos}
              onFilter={onFilter}
              handleCompletedDeleting={handleCompletedDeleting}
            />
          </>
        )}
      </div>

      <ErrorMessage
        onClose={onClose}
        errorType={errorType}
      />
    </div>
  );
};
