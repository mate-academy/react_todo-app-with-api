import React, { useCallback, useEffect, useState } from 'react';
import { UserWarning } from './components/UserWarning';
import {
  getTodosFromServer,
  addTodoOnServer,
  deleteTodoOnServer,
  updateTodoOnServer,
} from './api/todos';

import { TodoHeader } from './components/TodoHeader';
import { TodoList } from './components/TodoList';
import { TodoFooter } from './components/TodoFooter';
import { ErrorNotification } from './components/ErrorNotification';

import { Todo } from './types/Todo';
import { TodoMode } from './types/TodoMode';
import { TodoCompletionType } from './types/TodoCompletionType';
import { ErrorType } from './types/ErrorType';
import { TodoWithMode } from './types/TodoWithMode';
import { TodoDataToUpdate } from './types/TodoDataToUpdate';

import { filterTodos, getActiveTodosCount } from './common/helpers';
import { USER_ID } from './common/constants';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<TodoWithMode[]>([]);
  const [error, setError] = useState<ErrorType>(ErrorType.None);
  const [filterType, setFilterType] = useState(TodoCompletionType.All);

  const [tempTodo, setTempTodo] = useState<TodoWithMode | null>(null);

  const addTodoLocal = (newTodo: Todo): void => {
    setTodos((prevTodos) => (
      [
        ...prevTodos,
        {
          ...newTodo,
          mode: TodoMode.None,
        },
      ]
    ));
  };

  const deleteTodoLocal = (todoId: number): void => {
    setTodos(prevTodos => (
      prevTodos.filter(todo => todo.id !== todoId)
    ));
  };

  const updateTodoLocal = (
    todoId: number,
    updatedData: TodoDataToUpdate,
  ) => (
    setTodos(prevTodos => (
      prevTodos.map(todo => {
        if (todo.id !== todoId) {
          return todo;
        }

        return {
          ...todo,
          ...updatedData,
        };
      })
    ))
  );

  const handleTodoAdd = async (todoTitle: string) => {
    setError(ErrorType.None);

    if (todoTitle === '') {
      setError(ErrorType.EmptyTitle);

      return;
    }

    const newTodo: TodoWithMode = {
      id: 0,
      title: todoTitle,
      completed: false,
      userId: USER_ID,
      mode: TodoMode.Loading,
    };

    setTempTodo(newTodo);

    try {
      const newTodoFromServer = await addTodoOnServer(USER_ID, newTodo);

      addTodoLocal(newTodoFromServer);
    } catch {
      setError(ErrorType.AddTodo);
    } finally {
      setTempTodo(null);
    }
  };

  const handleTodoDelete = async (todoId: number) => {
    setError(ErrorType.None);
    updateTodoLocal(todoId, { mode: TodoMode.Loading });

    try {
      await deleteTodoOnServer(USER_ID, todoId);
      deleteTodoLocal(todoId);
    } catch {
      setError(ErrorType.DeleteTodo);
      updateTodoLocal(todoId, { mode: TodoMode.None });
    }
  };

  const handleTodoUpdate = async (
    todoId: number,
    updatedData: TodoDataToUpdate,
  ) => {
    setError(ErrorType.None);
    updateTodoLocal(todoId, { mode: TodoMode.Loading });

    try {
      await updateTodoOnServer(USER_ID, {
        id: todoId,
        ...updatedData,
      });
      updateTodoLocal(todoId, updatedData);
    } catch {
      setError(ErrorType.UpdateTodo);
    } finally {
      updateTodoLocal(todoId, { mode: TodoMode.None });
    }
  };

  const handleTodoUpdateMode = (todoId: number, mode: TodoMode) => (
    updateTodoLocal(todoId, { mode })
  );

  const handleCompletedTodosDelete = async () => {
    const completedTodos = todos.filter(todo => todo.completed);

    await Promise.all(
      completedTodos.map(async todo => handleTodoDelete(todo.id)),
    );
  };

  const handleTodoToggleAll = async (completed: boolean) => {
    await Promise.all(
      todos.map(todo => handleTodoUpdate(todo.id, { completed })),
    );
  };

  const handleErrorNotificationClose = useCallback(
    () => setError(ErrorType.None),
    [error],
  );

  useEffect(() => {
    getTodosFromServer(USER_ID)
      .then(todosFromServer => setTodos(
        todosFromServer.map(todo => (
          {
            ...todo,
            mode: TodoMode.None,
          }
        )),
      ))
      .catch(() => setError(ErrorType.LoadTodos));
  }, []);

  const filteredTodos = filterTodos(todos, filterType);

  const activeTodosCount = getActiveTodosCount(todos);
  const hasCompletedTodos = activeTodosCount !== todos.length;
  const hasActiveTodos = activeTodosCount !== 0;

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <TodoHeader
          isToggleVisible={todos.length > 0}
          isToggleActive={!hasActiveTodos}
          onTodoAdd={handleTodoAdd}
          onTodoToggleAll={handleTodoToggleAll}
        />

        {todos.length > 0 && (
          <>
            <TodoList
              todos={filteredTodos}
              tempTodo={tempTodo}
              onTodoDelete={handleTodoDelete}
              onTodoUpdate={handleTodoUpdate}
              onTodoUpdateMode={handleTodoUpdateMode}
            />

            <TodoFooter
              filterType={filterType}
              activeTodosCount={activeTodosCount}
              hasCompletedTodos={hasCompletedTodos}
              onFilterSelect={setFilterType}
              onCompletedTodosDelete={handleCompletedTodosDelete}
            />
          </>
        )}
      </div>

      <ErrorNotification
        error={error}
        onClose={handleErrorNotificationClose}
      />
    </div>
  );
};
