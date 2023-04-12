import React, { useCallback, useEffect, useState } from 'react';

import { Todo } from './types/Todo';
import { FilterType } from './enums/FilterType';

import { getVisibleTodos } from './utils/getVisibleTodos';

import {
  addTodo, deleteTodo, getTodos, updateTodo,
} from './api/todos';

import { ListFilter } from './components/ListFilter';
import { TodoList } from './components/TodosList';
import { Header } from './components/Header';
import { TodoListItem } from './components/TodoListItem';
import { ErrorModal } from './components/ErrorModal';

import { USER_ID } from './constants';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [filterType, setFilterType] = useState(FilterType.ALL);
  const [errorMessage, setErrorMessage] = useState('');
  const [isTodoAdding, setIsTodoAdding] = useState(false);
  const [loadingTodosIds, setloadingTodosIds] = useState<number[]>([]);

  const clearErrorMessage = useCallback(
    () => setTimeout(() => setErrorMessage(''), 3000),
    [],
  );

  useEffect(() => {
    const getTodosFromServer = async () => {
      try {
        const todosFromServer = await getTodos(USER_ID);

        setTodos(todosFromServer);
      } catch {
        setErrorMessage('Error occured when data loaded.');
        clearErrorMessage();
      }
    };

    getTodosFromServer();
  }, []);

  const handleTodoAdd = async (title: string) => {
    const trimmedTitle = title.trim();

    if (!trimmedTitle) {
      setErrorMessage('Title can\'t be empty');
      clearErrorMessage();

      return;
    }

    setIsTodoAdding(true);
    const newTodoId = Math.max(...todos.map(todo => todo.id)) + 1;
    let newTodo: Todo = {
      id: 0,
      userId: USER_ID,
      title: trimmedTitle,
      completed: false,
    };

    try {
      setTempTodo(newTodo);

      newTodo = {
        ...newTodo,
        id: newTodoId,
      };

      await addTodo(USER_ID, newTodo);

      setTodos(prevTodos => [
        ...prevTodos,
        newTodo,
      ]);
    } catch {
      setErrorMessage('Unable to add todo');
      clearErrorMessage();
    } finally {
      setIsTodoAdding(false);
      setTempTodo(null);
    }
  };

  const handleTodoDelete = async (todoId: number) => {
    try {
      await deleteTodo(todoId);

      setTodos(() => todos.filter(todo => todo.id !== todoId));
    } catch {
      setErrorMessage('Unable to delete a todo');
      clearErrorMessage();
    }
  };

  const getCompletedTodos = useCallback(() => {
    return todos.filter(todo => todo.completed);
  }, [todos]);

  const handleDeleteCompleted = useCallback(() => {
    getCompletedTodos().forEach(({ id }) => {
      setloadingTodosIds((prevCompleted) => [
        ...prevCompleted,
        id,
      ]);

      handleTodoDelete(id)
        .then(() => {
          setTodos(
            (prevTodos) => prevTodos.filter(todo => !todo.completed),
          );
        })
        .finally(() => setloadingTodosIds([]));
    });
  }, [todos]);

  const handleUpdateTodo = async (todoId: number, data: Partial<Todo>) => {
    try {
      setloadingTodosIds((prevToggledTodosIds) => [
        ...prevToggledTodosIds,
        todoId,
      ]);

      const updatedTodo = await updateTodo(todoId, data);

      setTodos((prevTodos) => prevTodos.map((prevTodo) => {
        if (prevTodo.id === todoId) {
          return {
            ...prevTodo,
            ...updatedTodo,
          };
        }

        return prevTodo;
      }));
    } catch {
      setErrorMessage('Unable to update a todo');
      clearErrorMessage();
    } finally {
      setloadingTodosIds([]);
    }
  };

  const handleToggleAll = () => {
    const areAllCompleted = todos.every(({ completed }) => completed);

    if (areAllCompleted) {
      todos.forEach(({ id }) => {
        handleUpdateTodo(id, { completed: false });
      });
    } else {
      todos.filter(todo => !todo.completed).forEach(({ id }) => {
        handleUpdateTodo(id, { completed: true });
      });
    }
  };

  const activeTodos = todos.filter(todo => !todo.completed);
  const hasActiveTodos = activeTodos.length !== 0;
  const hasCompletedTodos = getCompletedTodos().length !== 0;

  const visibleTodos = getVisibleTodos(todos, filterType);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          hasActiveTodos={hasActiveTodos}
          onTodoAdd={handleTodoAdd}
          isTodoAdding={isTodoAdding}
          onToggleAll={handleToggleAll}
        />

        <TodoList
          todos={visibleTodos}
          onTodoDelete={handleTodoDelete}
          loadingTodosIds={loadingTodosIds}
          onUpdateTodo={handleUpdateTodo}
        />

        {tempTodo && (
          <TodoListItem todo={tempTodo} />
        )}

        {todos.length > 0 && (
          <ListFilter
            hasCompletedTodos={hasCompletedTodos}
            activeTodosCount={activeTodos.length}
            filterType={filterType}
            onFilterTypeChange={setFilterType}
            onCompletedDelete={handleDeleteCompleted}
          />
        )}
      </div>

      <ErrorModal
        errorMessage={errorMessage}
        onClearErrorMessage={setErrorMessage}
      />
    </div>
  );
};
