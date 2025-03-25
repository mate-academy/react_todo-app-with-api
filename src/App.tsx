import React, { useCallback, useEffect, useRef, useState } from 'react';

import { getTodos, USER_ID } from './api/todos';
import { Todo } from './types/Todo';

import { UserWarning } from './UserWarning';
import { TodoList } from './components/TodoList';
import { TodoForm } from './components/TodoForm';
import { ErrorNotification } from './components/ErrorNotification';

export const App: React.FC = () => {
  const [todoList, setTodoList] = useState<Todo[]>([]);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [loadingTodos, setLoadingTodos] = useState<Set<number>>(new Set());

  const errorTimerId = useRef(0);

  const addNewTodo = (newTodo: Todo) => {
    setTodoList(currentList => [...currentList, newTodo]);
  };

  const removeTodo = (id: number) => {
    setTodoList(currentList => currentList.filter(todo => todo.id !== id));
  };

  const showErrorMessage = (message: string, delay = 3000) => {
    clearInterval(errorTimerId.current);
    setErrorMessage(message);
    errorTimerId.current = window.setTimeout(() => setErrorMessage(''), delay);
  };

  const handleErrorRemove = () => {
    setErrorMessage('');
  };

  const toggleTodoStatus = useCallback((id: number) => {
    setTodoList(currentList =>
      currentList.map(todo =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo,
      ),
    );
  }, []);

  const updateTodoTitle = useCallback((id: number, updatedTitle: string) => {
    setTodoList(currentList =>
      currentList.map(todo =>
        todo.id === id ? { ...todo, title: updatedTitle } : todo,
      ),
    );
  }, []);

  useEffect(() => {
    getTodos()
      .then(setTodoList)
      .catch(() => showErrorMessage('Unable to load todos'));
  }, []);

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <TodoForm
          todoList={todoList}
          setLoadingTodos={setLoadingTodos}
          addNewTodo={addNewTodo}
          setTempTodo={setTempTodo}
          showErrorMessage={showErrorMessage}
          toggleTodoStatus={toggleTodoStatus}
        />
        {todoList && (
          <TodoList
            todoList={todoList}
            tempTodo={tempTodo}
            loadingTodos={loadingTodos}
            removeTodo={removeTodo}
            updateTodoTitle={updateTodoTitle}
            showErrorMessage={showErrorMessage}
            toggleTodoStatus={toggleTodoStatus}
            setLoadingTodos={setLoadingTodos}
          />
        )}
      </div>

      <ErrorNotification
        errorMessage={errorMessage}
        handleErrorRemove={handleErrorRemove}
      />
    </div>
  );
};
