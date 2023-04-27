/* eslint-disable jsx-a11y/control-has-associated-label */
import React, {
  useEffect, useMemo, useState,
} from 'react';
import { UserWarning } from './components/UserWarning';
import { TodoInput } from './components/TodoInput';
import { TodosList } from './components/TodosList';
import { Todo } from './types/Todo';
import { TodosFilter } from './components/TodosFilter';
import { NotificationError } from './components/NotificationError';
import { Filter } from './types/Filter';
import {
  createTempTodo, createUpdatedTodosSet, filterTodos,
} from './utils/helpers';
import {
  deleteTodo, getTodos, addTodo, updateTodo,
} from './api/todos';
import { ErrorAction } from './types/ErrorAction';
import { TodoItem } from './components/TodoItem';

const USER_ID = 7017;

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [currentFilter, setCurrentFilter] = useState(Filter.ALL);
  const [error, setError] = useState<ErrorAction | null>(null);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [isInProgress, setIsInProgress] = useState<boolean>(false);
  const [processedTodoIds, setProcessedTodoIds] = useState<number[]>([]);
  const activeTodos = filterTodos(todos, Filter.ACTIVE);
  const completedTodos = filterTodos(todos, Filter.COMPLETED);
  const isToggleOnActive = todos.length === completedTodos.length;

  const handleLoadTodos = async () => {
    try {
      const todosFromServer = await getTodos(USER_ID);

      setTodos(todosFromServer);
    } catch {
      setError(ErrorAction.LOAD);
    }
  };

  const handleAddTodo = async (title: string) => {
    try {
      setIsInProgress(true);
      setTempTodo(createTempTodo(title));
      setProcessedTodoIds([0]);
      const data = { userId: USER_ID, title, completed: false };
      const newTodo = await addTodo(data);

      setTodos(stateTodos => [...stateTodos, newTodo]);
    } catch {
      setError(ErrorAction.ADD);
    } finally {
      setTempTodo(null);
      setIsInProgress(false);
      setProcessedTodoIds([]);
    }
  };

  const handleRemoveTodo = async (todoId: number) => {
    try {
      setProcessedTodoIds([todoId]);
      await deleteTodo(todoId);

      const todosWithoutRemoved = todos.filter(todo => todo.id !== todoId);

      setTodos(todosWithoutRemoved);
    } catch {
      setError(ErrorAction.DELETE);
    } finally {
      setProcessedTodoIds([]);
    }
  };

  const handleClearCompleted = async () => {
    try {
      setProcessedTodoIds(completedTodos.map(todo => todo.id));
      const todosToRemove = completedTodos.map(todo => deleteTodo(todo.id));

      await Promise.all(todosToRemove);

      setTodos(activeTodos);
    } catch {
      setError(ErrorAction.DELETE);
    } finally {
      setProcessedTodoIds([]);
    }
  };

  const handleTodoUpdate = async (todoId: number, data: Partial<Todo>) => {
    try {
      setProcessedTodoIds([todoId]);

      const updatedTodo = await updateTodo(todoId, data);

      setTodos(prevTodos => (
        prevTodos.map(todo => (
          todoId === todo.id ? updatedTodo : todo
        ))
      ));
    } catch {
      setError(ErrorAction.UPDATE);
    } finally {
      setProcessedTodoIds([]);
    }
  };

  const handleToggleAll = async () => {
    try {
      const idsToToggle = todos
        .filter(todo => (todo.completed === isToggleOnActive))
        .map(todo => todo.id);

      setProcessedTodoIds(idsToToggle);

      const toggledTodos = await Promise.all(
        idsToToggle.map(id => updateTodo(id, { completed: !isToggleOnActive })),
      );

      setTodos(createUpdatedTodosSet(todos, toggledTodos));
    } catch {
      setError(ErrorAction.UPDATE);
    } finally {
      setProcessedTodoIds([]);
    }
  };

  const visibleTodos = useMemo(
    () => filterTodos(todos, currentFilter),
    [currentFilter, todos],
  );

  useEffect(() => {
    handleLoadTodos();
  }, []);

  const resetError = () => {
    setTimeout(() => {
      setError(null);
    }, 500);
  };

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <TodoInput
          todosCount={todos.length}
          isToggleOnActive={isToggleOnActive}
          isInputDisabled={isInProgress}
          setError={setError}
          addTodo={handleAddTodo}
          onToggleAll={handleToggleAll}
        />

        <section className="todoapp__main">
          <TodosList
            todos={visibleTodos}
            removeTodo={handleRemoveTodo}
            processedTodoIds={processedTodoIds}
            updateTodo={handleTodoUpdate}
          />
          {tempTodo && (
            <TodoItem
              todo={tempTodo}
              procesedTodoIds={processedTodoIds}
            />
          )}
        </section>

        {todos.length > 0 && (
          <TodosFilter
            itemsLeft={activeTodos.length}
            completedLeft={completedTodos.length}
            currentFilter={currentFilter}
            setCurrentFilter={setCurrentFilter}
            onClearCompleted={handleClearCompleted}
          />
        )}
      </div>

      {error && (
        <NotificationError
          action={error}
          resetError={resetError}
        />
      )}
    </div>
  );
};
