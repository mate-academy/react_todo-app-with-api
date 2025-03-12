/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useState } from 'react';
import { UserWarning } from './components/UserWarning';
import { getTodos, USER_ID } from './api/todos';
import { Header } from './components/Header';
import { TodoList } from './components/TodoList';
import { Footer } from './components/Footer';
import { Todo } from './types/Todo';
import { Filter } from './types/Filter';
import { ErrorNotification } from './components/ErrorNotification';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filter, setFilter] = useState(Filter.All);
  const [errorMessage, setErrorMessage] = useState('');
  const [isAdd, setIsAdd] = useState(false);
  const [isDelete, setIsDelete] = useState(false);
  const [isChange, setIsChange] = useState(false);
  const [tempId, setTempId] = useState<number[]>([]);
  const [todoCounter, setTodoCounter] = useState(0);
  const isEmpty = !todos.length;

  useEffect(() => {
    getTodos()
      .then(setTodos)
      .catch(() => {
        setErrorMessage('Unable to load todos');
      });
  }, []);

  useEffect(() => {
    if (!isAdd) {
      setTodoCounter(todos.filter(todo => !todo.completed).length);
    }
  }, [todos, isAdd]);

  if (!USER_ID) {
    return <UserWarning />;
  }

  if (errorMessage.trim()) {
    setTimeout(() => {
      setErrorMessage('');
    }, 3000);
  }

  const getFilteredTodos = () => {
    switch (filter) {
      case Filter.Active:
        return todos.filter(todo => !todo.completed);

      case Filter.Completed:
        return todos.filter(todo => todo.completed);

      case Filter.All:
      default:
        return todos;
    }
  };

  const filteredTodos = getFilteredTodos();

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          todos={filteredTodos}
          allTodos={todos}
          isEmpty={isEmpty}
          isDelete={isDelete}
          setTodos={setTodos}
          setErrorMessage={setErrorMessage}
          setIsAdd={setIsAdd}
          setIsChange={setIsChange}
          setChangedId={setTempId}
          setTodoCounter={setTodoCounter}
        />
        {todos && (
          <TodoList
            todos={filteredTodos}
            isAdd={isAdd}
            isDelete={isDelete}
            isChange={isChange}
            tempId={tempId}
            setTodos={setTodos}
            setIsDelete={setIsDelete}
            setErrorMessage={setErrorMessage}
          />
        )}

        {todos.length !== 0 && (
          <Footer
            todos={filteredTodos}
            filter={filter}
            todoCounter={todoCounter}
            setTodos={setTodos}
            setIsDelete={setIsDelete}
            setDeletedId={setTempId}
            setFilter={setFilter}
            setErrorMessage={setErrorMessage}
          />
        )}
      </div>

      <ErrorNotification
        errorMessage={errorMessage}
        setErrorMessage={setErrorMessage}
      />
    </div>
  );
};
