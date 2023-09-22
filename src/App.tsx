/* eslint-disable max-len */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useMemo, useState } from 'react';

import { Todo } from './types/Todo';
import { FilterStatus } from './types/FilterStatus';
import { TodoError } from './types/TodoError';
import * as todoService from './api/todos';
import { UserWarning } from './UserWarning';
import { getFilteredTodos } from './utils/getFilteredTodo';
import {
  Header,
  TodoErrors,
  TodoFooter,
  TodoList,
} from './components';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filter, setFilter] = useState<FilterStatus>(FilterStatus.ALL);
  const [errorMessage, setErrorMessage] = useState(TodoError.none);
  const [isLoadingTodoIds, setIsLoadingTodoIds] = useState<number[]>([]);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);

  const filteredTodos = useMemo(() => {
    return getFilteredTodos(todos, filter);
  }, [todos, filter]);

  const countActiveTodos = useMemo(() => {
    return todos.filter((todo) => !todo.completed).length;
  }, [todos]);

  const hasCompletedTodos = useMemo(() => {
    return todos.some((todo) => todo.completed);
  }, [todos]);

  useEffect(() => {
    setErrorMessage(TodoError.none);

    todoService
      .getTodos(todoService.USER_ID)
      .then(setTodos)
      .catch(() => setErrorMessage(TodoError.load));
  }, []);

  if (!todoService.USER_ID) {
    return <UserWarning />;
  }

  const handleAddTodo = (title: string) => {
    setErrorMessage(TodoError.none);

    const newTodo: Todo = {
      id: 0,
      title: title.trim(),
      completed: false,
      userId: todoService.USER_ID,
    };

    setTempTodo(newTodo);

    return todoService
      .addTodo(newTodo)
      .then((createdTodo) => {
        setTodos((currentTodos) => [...currentTodos, createdTodo]);
      })
      .catch((error) => {
        setErrorMessage(TodoError.add);
        throw error;
      })
      .finally(() => {
        setTempTodo(null);
      });
  };

  const handleDeleteTodo = (todoId: number) => {
    setErrorMessage(TodoError.none);

    setIsLoadingTodoIds((prev) => [...prev, todoId]);

    return todoService
      .deleteTodo(todoId)
      .then(() => {
        setTodos((currentTodos) => (
          currentTodos.filter((todo) => todo.id !== todoId)));
      })
      .catch(() => setErrorMessage(TodoError.delete))
      .finally(() => setIsLoadingTodoIds([]));
  };

  const handleDeleteCompletedTodo = async () => {
    const completedIds = todos.filter((todo) => todo.completed)
      .map((todo) => todo.id);

    await Promise.allSettled(
      completedIds.map((id) => handleDeleteTodo(id)),
    );
  };

  const handleUpdateTodo = (updatedTodo: Todo) => {
    setErrorMessage(TodoError.none);
    setIsLoadingTodoIds((prev) => [...prev, updatedTodo.id]);

    return todoService.updateTodo(updatedTodo)
      .then(() => {
        setTodos((currentTodos) => currentTodos.map(todo => (
          todo.id === updatedTodo.id ? updatedTodo : todo
        )));
      })
      .catch(() => setErrorMessage(TodoError.update))
      .finally(() => setIsLoadingTodoIds([]));
  };

  const handleToggle = (selectedTodo: Todo) => {
    const toggledTodo = { ...selectedTodo, completed: !selectedTodo.completed };

    return handleUpdateTodo(toggledTodo);
  };

  const handleAllToggle = async () => {
    const areAllCompleted = todos.every(todo => todo.completed);
    const todosToToggle = todos.filter((todo) => todo.completed === areAllCompleted);

    await Promise.allSettled(todosToToggle.map(
      todo => handleToggle(todo),
    ));
  };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          length={todos.length}
          countActiveTodos={countActiveTodos}
          tempTodo={tempTodo}
          handleAddTodo={handleAddTodo}
          handleAllToggle={handleAllToggle}
          handleErrorMessage={setErrorMessage}
        />

        <TodoList
          todos={filteredTodos}
          tempTodo={tempTodo}
          isLoadingTodoIds={isLoadingTodoIds}
          handleToggleCompleted={handleToggle}
          handleDeleteTodo={handleDeleteTodo}
          handleUpdateTodo={handleUpdateTodo}
        />

        {todos.length > 0 && (
          <TodoFooter
            filter={filter}
            countActiveTodos={countActiveTodos}
            hasCompletedTodos={hasCompletedTodos}
            handleFilterChange={setFilter}
            handleDeleteCompletedTodo={handleDeleteCompletedTodo}
          />
        )}

        {errorMessage !== TodoError.none && (
          <TodoErrors
            errorMessage={errorMessage}
            handleErrorMessage={setErrorMessage}
          />
        )}
      </div>
    </div>
  );
};
