import React, { useEffect, useRef, useState } from 'react';
import { UserWarning } from './components/UserWarning';
import cn from 'classnames';
import { Todo } from './types/Todo';
import * as todoService from './api/todos';
import { getTodoStats } from './utils/todoStats';
import { ErrorMessageType } from './constants/ErrorMessageType';
import { Header } from './components/Header';
import { FilterType } from './constants/FilterType';
import { TodoList } from './components/TodoList';
import { Footer } from './components/Footer';
import { ErrorNotification } from './components/ErrorNotification';
import { focusInputField } from './utils/focus';
import {
  ERROR_TIMEOUT_MS,
  TEMP_TODO_ID,
  USER_ID,
} from './constants/appConstants';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [errorMessage, setErrorMessage] = useState<ErrorMessageType>(
    ErrorMessageType.None,
  );
  const [isLoading, setIsLoading] = useState(false);
  const [filter, setFilter] = useState<FilterType>(FilterType.All);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [activeTodoId, setActiveTodoId] = useState<number | null>(null);
  const [errorVersion, setErrorVersion] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    todoService
      .getTodos()
      .then(setTodos)
      .catch(error => {
        setErrorMessage(ErrorMessageType.Load);

        throw error;
      })
      .finally(() => focusInputField(inputRef));
  }, []);

  useEffect(() => {
    if (!errorMessage) {
      return;
    }

    const currentVersion = errorVersion;

    const timeoutId = setTimeout(() => {
      setErrorMessage(prev =>
        errorVersion === currentVersion ? ErrorMessageType.None : prev,
      );
    }, ERROR_TIMEOUT_MS);

    return () => clearTimeout(timeoutId);
  }, [errorMessage, errorVersion]);

  if (!USER_ID) {
    return <UserWarning />;
  }

  const {
    allTodosCount,
    activeTodosCount,
    completedTodosCount,
    visibleTodos,
    completedTodos,
    isAllTodosCompleted,
  } = getTodoStats(todos, filter);

  const showError = (message: ErrorMessageType) => {
    setErrorMessage(message);
    setErrorVersion(prev => prev + 1);
  };

  const addTodo = (newTodo: Omit<Todo, 'id'>) => {
    setIsLoading(true);
    setActiveTodoId(TEMP_TODO_ID);
    setTempTodo({ ...newTodo, id: TEMP_TODO_ID });

    return todoService
      .addTodo(newTodo)
      .then(todo => {
        setTodos(current => [...current, todo]);
        setTempTodo(null);
      })
      .catch(error => {
        showError(ErrorMessageType.Add);
        throw error;
      })
      .finally(() => {
        setTempTodo(null);
        setActiveTodoId(null);
        setIsLoading(false);
        focusInputField(inputRef);
      });
  };

  const deleteTodo = (todoId: number) => {
    setIsLoading(true);
    setActiveTodoId(todoId);

    return todoService
      .deleteTodo(todoId)
      .then(() => {
        setTodos(current => current.filter(todo => todo.id !== todoId));
        focusInputField(inputRef);
      })
      .catch(error => {
        showError(ErrorMessageType.Delete);
        throw error;
      })
      .finally(() => {
        setActiveTodoId(null);
        setIsLoading(false);
      });
  };

  const updateTodo = (todo: Todo) => {
    setIsLoading(true);
    setActiveTodoId(todo.id);

    return todoService
      .updateTodo(todo)
      .then(updated => {
        setTodos(current =>
          current.map(item => (item.id === updated.id ? updated : item)),
        );
      })
      .catch(error => {
        showError(ErrorMessageType.Update);
        throw error;
      })
      .finally(() => {
        setActiveTodoId(null);
        setIsLoading(false);
      });
  };

  const clearCompletedTodos = async () => {
    setIsLoading(true);

    const results = await Promise.allSettled(
      completedTodos.map(todo =>
        todoService.deleteTodo(todo.id).then(() => todo.id),
      ),
    );

    const deletedIds = results
      .filter(res => res.status === 'fulfilled')
      .map(res => (res as PromiseFulfilledResult<number>).value);

    const hasError = results.some(res => res.status === 'rejected');

    if (hasError) {
      showError(ErrorMessageType.Delete);
    }

    setTodos(current => current.filter(todo => !deletedIds.includes(todo.id)));

    setIsLoading(false);
    focusInputField(inputRef);
  };

  const toggleAllTodos = async () => {
    const newStatus = !isAllTodosCompleted;
    const todosToUpdate = todos.filter(todo => todo.completed !== newStatus);

    if (todosToUpdate.length === 0) {
      return;
    }

    setIsLoading(true);

    const results = await Promise.allSettled(
      todosToUpdate.map(todo =>
        todoService.updateTodo({ ...todo, completed: newStatus }),
      ),
    );

    const updatedTodos = results
      .map((res, index) =>
        res.status === 'fulfilled'
          ? { ...todosToUpdate[index], completed: newStatus }
          : null,
      )
      .filter(Boolean) as Todo[];

    const hasError = results.some(res => res.status === 'rejected');

    if (hasError) {
      showError(ErrorMessageType.Update);
    }

    setTodos(current =>
      current.map(
        todo => updatedTodos.find(updated => updated.id === todo.id) || todo,
      ),
    );

    setIsLoading(false);
  };

  const shouldRenderFooter = allTodosCount > 0 || tempTodo !== null;

  return (
    <div className={cn('todoapp', { 'has-error': errorMessage })}>
      <h1 className="todoapp__title">todos</h1>
      <div className="todoapp__content">
        <Header
          onSubmit={addTodo}
          handleError={showError}
          onToggle={toggleAllTodos}
          inputRef={inputRef}
          isLoading={isLoading}
          isAllCompleted={isAllTodosCompleted}
          todosCount={allTodosCount}
        />

        <TodoList
          todos={visibleTodos}
          tempTodo={tempTodo}
          activeTodoId={activeTodoId}
          onDelete={deleteTodo}
          onUpdate={updateTodo}
        />

        {shouldRenderFooter && (
          <Footer
            activeCount={activeTodosCount}
            completedCount={completedTodosCount}
            filter={filter}
            onClearCompleted={clearCompletedTodos}
            onFilterChange={setFilter}
          />
        )}
      </div>

      <ErrorNotification errorMessage={errorMessage} onClose={showError} />
    </div>
  );
};
