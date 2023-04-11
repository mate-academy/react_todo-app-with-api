import React, { useEffect, useState } from 'react';
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
import { TodoRich } from './types/TodoRich';
import { TodoRichEditable } from './types/TodoRichEditable';

import { filterTodos, getActiveTodosCount } from './common/helpers';

const USER_ID = 6955;

export const App: React.FC = () => {
  const [todos, setTodos] = useState<TodoRich[]>([]);
  const [error, setError] = useState<ErrorType>(ErrorType.None);
  const [selectedFilterOption, setSelectedFilterOption]
    = useState(TodoCompletionType.All);

  const [tempTodo, setTempTodo] = useState<TodoRich | null>(null);

  const addTodo = (newTodo: Todo): void => {
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

  const deleteTodo = (todoId: number): void => {
    setTodos(prevTodos => (
      prevTodos.filter(todo => todo.id !== todoId)
    ));
  };

  const updateTodo = (
    todoId: number,
    updatedData: TodoRichEditable,
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

  const handleTodoAdd = async (todoTitle: string): Promise<void> => {
    if (todoTitle === '') {
      setError(ErrorType.EmptyTitle);

      return;
    }

    const newTodo: TodoRich = {
      id: 0,
      title: todoTitle,
      completed: false,
      userId: USER_ID,
      mode: TodoMode.Loading,
    };

    setTempTodo(newTodo);

    try {
      const newTodoFromServer = await addTodoOnServer(USER_ID, newTodo);

      addTodo(newTodoFromServer);
    } catch {
      setError(ErrorType.AddTodo);
    } finally {
      setTempTodo(null);
    }
  };

  const handleTodoDelete = async (todoId: number): Promise<void> => {
    updateTodo(todoId, { mode: TodoMode.Loading });

    try {
      await deleteTodoOnServer(USER_ID, todoId);
      deleteTodo(todoId);
    } catch {
      setError(ErrorType.DeleteTodo);
      updateTodo(todoId, { mode: TodoMode.None });
    }
  };

  const handleCompletedTodosDelete = async (): Promise<void> => {
    const completedTodos = todos.filter(todo => todo.completed);

    await Promise.all(
      completedTodos.map(todo => handleTodoDelete(todo.id)),
    );
  };

  const handleTodoToggle = async (
    todoId: number,
    isCompleted: boolean,
  ): Promise<void> => {
    updateTodo(todoId, { mode: TodoMode.Loading });

    try {
      await updateTodoOnServer(USER_ID, {
        id: todoId,
        completed: isCompleted,
      });
      updateTodo(todoId, { completed: isCompleted });
    } catch {
      setError(ErrorType.ToggleTodo);
    } finally {
      updateTodo(todoId, { mode: TodoMode.None });
    }
  };

  const handleTodoToggleAll = async (isCompleted: boolean): Promise<void> => {
    await Promise.all(
      todos.map(todo => handleTodoToggle(todo.id, isCompleted)),
    );
  };

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

  const filteredTodos = filterTodos(todos, selectedFilterOption);

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
              onTodoToggle={handleTodoToggle}
              onTodoUpdate={updateTodo}
            />

            <TodoFooter
              selectedFilterOption={selectedFilterOption}
              onFilterSelect={setSelectedFilterOption}
              activeTodosCount={activeTodosCount}
              hasCompletedTodos={hasCompletedTodos}
              onCompletedTodosDelete={handleCompletedTodosDelete}
            />
          </>
        )}
      </div>

      <ErrorNotification
        error={error}
        onClose={() => setError(ErrorType.None)}
      />
    </div>
  );
};
