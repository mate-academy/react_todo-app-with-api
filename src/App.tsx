/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useState, useEffect } from 'react';

import { UserWarning } from './UserWarning';
import { USER_ID } from './api/todos';
import { Header } from './components/Header/Header';
import { TodoList } from './components/TodoList/TodoList';
import { TempTodo } from './components/TempTodo/TempTodo';
import { Footer } from './components/Footer/Fotter';
import { Error } from './components/Error/Erros';
import { getTodos } from './api/todos';
import { filterTodos } from './components/Helpers/Helpers';

import { Todo } from './types/Todo';
import { TodoStatus } from './types/Status';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [status, setStatus] = useState<TodoStatus>(TodoStatus.all);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [processedIds, setprocessedIds] = useState<number[]>([]);
  const noTodos = todos.length === 0;
  const filteredTodos = filterTodos(todos, status);

  useEffect(() => {
    getTodos()
      .then(setTodos)
      .catch(() => setErrorMessage('Unable to load todos'));
  }, []);

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          todoList={todos}
          onError={setErrorMessage}
          updateTodoList={setTodos}
          updateTempTodo={setTempTodo}
          updateProcessedIds={setprocessedIds}
        />

        <TodoList
          filteredTodos={filteredTodos}
          updateTodolist={setTodos}
          onError={setErrorMessage}
          todoList={todos}
          processedIds={processedIds}
          updateProcessedIds={setprocessedIds}
        />

        {tempTodo && <TempTodo todo={tempTodo} />}

        {!noTodos && (
          <Footer
            todoList={todos}
            updateTodolist={setTodos}
            status={status}
            onStatusChange={(value: TodoStatus) => setStatus(value)}
            updateProcessedIds={setprocessedIds}
            onError={setErrorMessage}
          />
        )}
      </div>

      <Error errorMessage={errorMessage} hideError={setErrorMessage} />
    </div>
  );
};
