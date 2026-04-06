/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useEffect, useRef, useState } from 'react';
import { UserWarning } from './UserWarning';
import * as todoService from './api/todos';
import { Todo } from './types/Todo';
import { USER_ID } from './constants';
import { Header } from './components/Header';
import { TodoList } from './components/TodoList';
import { Footer } from './components/Footer';
import { ErrorNotification } from './components/ErrorNotification';
import { ErrorMessage } from './types/ErrorMessage';

export enum Filter {
  All = 'all',
  Active = 'active',
  Completed = 'completed',
}

export const App: React.FC = () => {
  // #region states
  const [todos, setTodos] = useState<Todo[]>([]);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState<Filter>(Filter.All);
  const [title, setTitle] = useState('');
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [processingIds, setProcessingIds] = useState<number[]>([]);
  const [editingTodoId, setEditingTodoId] = useState<number | null>(null);
  const [editingTitle, setEditingTitle] = useState('');
  // #endregion states
  const inputRef = useRef<HTMLInputElement>(null);
  const visibleTodos = todos.filter(todo => {
    switch (filter) {
      case Filter.Active:
        return !todo.completed;
      case Filter.Completed:
        return todo.completed;
      default:
        return true;
    }
  });

  useEffect(() => {
    todoService
      .getTodos(USER_ID)
      .then(setTodos)
      .catch(() => {
        setError(ErrorMessage.LoadTodos);

        setTimeout(() => {
          setError('');
        }, 3000);
      });
  }, []);

  if (!USER_ID) {
    return <UserWarning />;
  }
  // #endregion handlers

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          todos={todos}
          setError={setError}
          title={title}
          setTitle={setTitle}
          setTempTodo={setTempTodo}
          setTodos={setTodos}
          inputRef={inputRef}
          tempTodo={tempTodo}
          setProcessingIds={setProcessingIds}
        />

        {(todos.length > 0 || tempTodo) && (
          <TodoList
            todos={visibleTodos}
            tempTodo={tempTodo}
            processingIds={processingIds}
            setTodos={setTodos}
            setProcessingIds={setProcessingIds}
            setError={setError}
            editingTodoId={editingTodoId}
            setEditingTodoId={setEditingTodoId}
            editingTitle={editingTitle}
            setEditingTitle={setEditingTitle}
            inputRef={inputRef}
          />
        )}

        {todos.length > 0 && (
          <Footer
            todos={todos}
            setProcessingIds={setProcessingIds}
            setTodos={setTodos}
            setError={setError}
            inputRef={inputRef}
            filter={filter}
            setFilter={setFilter}
          />
        )}
      </div>

      <ErrorNotification error={error} setError={setError} />
    </div>
  );
};
