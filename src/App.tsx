/* eslint-disable jsx-a11y/no-autofocus */
/* eslint-disable max-len */
/* eslint-disable react/jsx-no-comment-textnodes */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useMemo, useState } from 'react';
import { getTodos } from './api/todos';
import { Todo } from './types/Todo';
import { USER_ID } from './utils/userId';
import { Header } from './components/Header';
import { TodoList } from './components/TodoList';
import { Field } from './types/Field';
import { Footer } from './components/Footer';
import { ErrorMessage } from './components/ErrorMessage';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [selectedField, setSelectedField] = useState<Field>(Field.all);
  const [selectedTodo, setSelectedTodo] = useState<Todo | null>(null);
  const [inputTitle, setInputTitle] = useState('');
  const [updatedTitle, setUpdatedTitle] = useState('');
  const [wasError, setWasError] = useState(false);

  const loadTodos = () => getTodos(USER_ID)
    .then(someTodos => {
      setTodos(someTodos);
    })
    .catch(() => setErrorMessage('Incorrect URL'));

  useEffect(() => {
    loadTodos();
  }, []);

  const preparedTodos: Todo[] = useMemo(() => {
    switch (selectedField) {
      case 'active':
        return todos.filter(todo => !todo.completed);
      case 'completed':
        return todos.filter(todo => todo.completed);
      default:
        return todos;
    }
  }, [todos, selectedField]);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          todos={todos}
          setWasError={setWasError}
          setTodos={setTodos}
          setErrorMessage={setErrorMessage}
          inputTitle={inputTitle}
          loadTodos={loadTodos}
          setInputTitle={setInputTitle}
        />

        <TodoList
          todos={todos}
          preparedTodos={preparedTodos}
          setTodos={setTodos}
          selectedTodo={selectedTodo}
          setSelectedTodo={setSelectedTodo}
          setErrorMessage={setErrorMessage}
          updatedTitle={updatedTitle}
          setUpdatedTitle={setUpdatedTitle}
          loadTodos={loadTodos}
          setWasError={setWasError}
          wasError={wasError}
        />

        {/* Hide the footer if there are no todos */}
        <Footer
          setErrorMessage={setErrorMessage}
          preparedTodos={preparedTodos}
          todos={todos}
          setSelectedField={setSelectedField}
          selectedField={selectedField}
          setTodos={setTodos}
        />
      </div>

      <ErrorMessage
        errorMessage={errorMessage}
        setErrorMessage={setErrorMessage}
      />
    </div>
  );
};
