/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useState } from 'react';
import { getTodos } from './api/todos';
import { Form } from './components/Form/Form';
import { Footer } from './components/Footer/Footer';
import { TodoList } from './components/TodoList/TodoList';
import { Todo } from './types/Todo';
import { SortField } from './types/SortField';
import { getSortedTodos } from './utils/getSortedTodos';
import { ErrorType } from './types/Error';
import { ErrorMessage } from './components/ErrorMessage/ErrorMessage';
import { TodoItem } from './components/TodoItem/TodoItem';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [sortField, setSortField] = useState<SortField>(SortField.All);
  const [error, setError] = useState<ErrorType | null>(null);
  const [deletingIds, setDeletingIds] = useState<number[]>([]);
  const [updatingIds, setUpdatingIds] = useState<number[]>([]);

  useEffect(() => {
    getTodos()
      .then(setTodos)
      .catch(() => setError(ErrorType.LoadFail));
  }, []);

  const sortedTodos = getSortedTodos(todos, sortField);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Form
          todos={todos}
          deletingIds={deletingIds}
          setTodos={setTodos}
          setTempTodo={setTempTodo}
          setError={setError}
          setUpdatingIds={setUpdatingIds}
        />
        <TodoList
          todos={sortedTodos}
          deletingIds={deletingIds}
          updatingIds={updatingIds}
          setTodos={setTodos}
          setError={setError}
          setDeletingIds={setDeletingIds}
          setUpdatingIds={setUpdatingIds}
        />
        {tempTodo && (
          <TodoItem
            todo={tempTodo}
            isTemp={true}
            deletingIds={deletingIds}
            updatingIds={updatingIds}
            setTodos={setTodos}
            setError={setError}
            setDeletingIds={setDeletingIds}
            setUpdatingIds={setUpdatingIds}
          />
        )}
        {!!todos.length && (
          <Footer
            todos={todos}
            sortField={sortField}
            setSortField={setSortField}
            setTodos={setTodos}
            setError={setError}
            setDeletingIds={setDeletingIds}
          />
        )}
      </div>

      <ErrorMessage error={error} />
    </div>
  );
};
