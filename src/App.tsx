import React, { useEffect, useRef, useState } from 'react';
import { UserWarning } from './UserWarning';
import { deleteTodo, getTodos, updateTodoStatus, USER_ID } from './api/todos';

import { Todo } from './types/Todo';
import { TodoList } from './components/TodoList';
import { TodoState } from './types/TodoState';

import { Header } from './components/Header';
import { Footer } from './components/Footer';

import { ErrorField } from './components/ErrorNotification';
import { getPreparedTodos } from './utils/getPreparedTodos';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [activeFilter, setActiveFilter] = useState<TodoState>(TodoState.ALL);

  const activeTodos = todos.filter(todo => !todo.completed).length;
  const completedTodos = todos.filter(todo => todo.completed).length;
  const preparedTodos = getPreparedTodos(todos, activeFilter);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    getTodos()
      .then(setTodos)
      .catch(() => setErrorMessage('Unable to load todos'));
  }, []);

  const handleClearCompleted = async () => {
    const completedTodosToDelete = todos.filter(todo => todo.completed);

    const deletionPromises = completedTodosToDelete.map(todo =>
      deleteTodo(todo.id)
        .then(() => {
          setTodos(currentTodos => currentTodos.filter(t => t.id !== todo.id));
        })
        .catch(() => {
          setErrorMessage(`Unable to delete a todo`);
        }),
    );

    await Promise.all(deletionPromises);

    inputRef.current?.focus();
  };

  const handleToggleAll = async () => {
    const allCompleted = completedTodos === todos.length;
    const newStatus = !allCompleted;

    const updatePromises = todos
      .filter(todo => todo.completed !== newStatus)
      .map(todo =>
        updateTodoStatus(todo.id, newStatus)
          .then(updatedTodo => {
            setTodos(currentTodos =>
              currentTodos.map(item =>
                item.id === updatedTodo.id ? updatedTodo : item,
              ),
            );
          })
          .catch(() => {
            setErrorMessage('Unable to update todos');
          }),
      );

    await Promise.all(updatePromises);
  };

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          setErrorMessage={setErrorMessage}
          setTodos={setTodos}
          setTempTodo={setTempTodo}
          inputRef={inputRef}
          onToggleAll={handleToggleAll}
          someTodosExist={!!todos.length}
          allTodosCompleted={!!todos.length && completedTodos === todos.length}
        />

        <TodoList
          todos={preparedTodos}
          tempTodo={tempTodo}
          setTodos={setTodos}
          setErrorMessage={setErrorMessage}
          inputRef={inputRef}
        />

        {todos.length !== 0 && (
          <Footer
            activeTodos={activeTodos}
            completedTodos={completedTodos}
            activeFilter={activeFilter}
            setActiveFilter={setActiveFilter}
            onClearCompleted={handleClearCompleted}
          />
        )}
      </div>

      <ErrorField
        errorMessage={errorMessage}
        setErrorMessage={setErrorMessage}
      />
    </div>
  );
};
