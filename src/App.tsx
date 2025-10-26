/* eslint-disable max-len */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useCallback, useEffect, useState } from 'react';

// API & Constants
import {
  deleteTodo,
  updateTodoStatus,
  updateTodoTitle,
  USER_ID,
} from './api/todos';
import { addTodo } from './services/addTodo';
import { fetchTodos } from './services/fetchTodos';
import { changeTodoStatus } from './services/changeTodoStatus';
import { dissmissErrorTimer } from './services/dismissErrorTimer';

// Types
import { Todo } from './Types/Todo';
import { SetTodoTitle } from './Types/State';
import { ErrorMessages } from './Types/ErrorMessages';

// Components
import { UserWarning } from './UserWarning';
import { Header } from './components/Header';
import { TodoItem } from './components/TodoItem';
import { Footer } from './components/Footer';
import { ErrorNotification } from './components/ErrorNotification';

export const App: React.FC = () => {
  const [todosList, setTodosList] = useState<Todo[]>([]);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');

  const activeTaskCount = todosList.filter(todo => !todo.completed).length;

  useEffect(() => {
    fetchTodos(setTodosList, setError);
  }, []);

  useEffect(() => {
    dissmissErrorTimer(error, setError);
  }, [error]);

  const refreshTodos = useCallback(async () => {
    try {
      await fetchTodos(setTodosList, setError);
    } catch {
      setError(ErrorMessages.UNABLE_TO_LOAD_TODOS);
    }
  }, [setTodosList, setError]);

  const addToList = async (todoTitle: string, setTodoTitle: SetTodoTitle) => {
    try {
      await addTodo(USER_ID, todoTitle, setError, setTempTodo, setTodoTitle);
      await refreshTodos();
    } catch {
      setError(ErrorMessages.UNABLE_TO_ADD_TODO);
    }
  };

  const handleDeleteTodo = async (id: number, isTemp: boolean) => {
    if (isTemp) {
      return;
    }

    try {
      await deleteTodo(id);
      await refreshTodos();
    } catch {
      setError(ErrorMessages.UNABLE_TO_DELETE_TODO);
    }
  };

  const handleStatusChange = (id: number, completed: boolean) =>
    changeTodoStatus(id, completed, setTodosList, setError);

  const handleDismissError = async () => {
    setError(null);
    await refreshTodos();
  };

  const changeStatusForAll = async () => {
    try {
      await Promise.all(todosList.map(todo => updateTodoStatus(todo.id, true)));
      setTodosList(prev =>
        prev.map(todo => ({
          ...todo,
          completed: true,
        })),
      );
    } catch {
      setError(ErrorMessages.UNABLE_TO_UPDATE_TODO);
    }
  };

  const changeTitle = async (id: number, newTitle: string) => {
    try {
      if (newTitle.trim() === '') {
        await deleteTodo(id);
      } else {
        await updateTodoTitle(id, newTitle);
      }
    } catch {
      setError(ErrorMessages.UNABLE_TO_UPDATE_TODO);
    } finally {
      await refreshTodos();
    }
  };

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          todos={todosList}
          addToList={addToList}
          onToggleAll={changeStatusForAll}
        />

        <section className="todoapp__main" data-cy="TodoList">
          {todosList.map(todo => (
            <TodoItem
              key={todo.id}
              todo={todo}
              filter={filter}
              onStatusChange={handleStatusChange}
              onDeleteTodo={handleDeleteTodo}
              onChangeTitle={changeTitle}
              isTemp={false}
            />
          ))}

          {tempTodo && (
            <TodoItem
              key="temp"
              todo={tempTodo}
              onStatusChange={handleStatusChange}
              isTemp
            />
          )}
        </section>

        {todosList.length !== 0 && (
          <Footer
            filter={filter}
            activeTaskCount={activeTaskCount}
            setFilter={setFilter}
          />
        )}
      </div>

      <ErrorNotification error={error} dismissError={handleDismissError} />
    </div>
  );
};
