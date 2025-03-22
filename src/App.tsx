/* eslint-disable max-len */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useRef, useState } from 'react';
import { UserWarning } from './UserWarning';
import { updateTodo, deleteTodo, getTodos, USER_ID } from './api/todos';
import { Todo } from './types/Todo';
import classNames from 'classnames';
import { Header } from './components/Header';
import { TodoList } from './components/TodoList';
import { Footer } from './components/Footer';
import { FilterType } from './enums/FilterType';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [loadingTodoId, setLoadingTodoId] = useState<number[]>([]);
  const inputFocus = useRef<HTMLInputElement>(null);
  const [inputValue, setInputValue] = useState('');
  const [selectedLink, setSelectedLink] = useState<FilterType>(FilterType.All);

  useEffect(() => {
    getTodos()
      .then(setTodos)
      .catch(() => {
        setErrorMessage('Unable to load todos');
      });
  }, []);

  useEffect(() => {
    if (errorMessage) {
      const timer = setTimeout(() => {
        setErrorMessage('');
      }, 3000);

      return () => clearTimeout(timer);
    }

    return;
  }, [errorMessage]);

  const filterTodos = (selectedLinkProp: FilterType) => {
    switch (selectedLinkProp) {
      case FilterType.Active:
        return todos.filter(todo => !todo.completed);
      case FilterType.Completed:
        return todos.filter(todo => todo.completed);
      default:
        return todos;
    }
  };

  const filteredTodos = filterTodos(selectedLink);

  const onDeleteTodo = (todoId: number) => {
    setLoadingTodoId([todoId]);

    deleteTodo(todoId)
      .then(() => {
        const filtered = todos.filter(todoItem => todoItem.id !== todoId);

        setTodos(filtered);
      })
      .catch(() => setErrorMessage(`Unable to delete a todo`))
      .finally(() => setLoadingTodoId([]));
  };

  const onUpdateTodo = (updatedTodo: Todo) => {
    setLoadingTodoId([updatedTodo.id]);

    updateTodo(updatedTodo)
      .then(todoEle => {
        const updatedTodos = todos.map(t =>
          t.id === todoEle.id ? updatedTodo : t,
        );

        setTodos(updatedTodos);
      })
      .catch(() => setErrorMessage('Unable to update a todo'))
      .finally(() => {
        setLoadingTodoId([]);
      });
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
          todos={todos}
          setLoadingTodoId={setLoadingTodoId}
          inputFocus={inputFocus}
          inputValue={inputValue}
          setInputValue={setInputValue}
        />

        <TodoList
          todos={todos}
          setTodos={setTodos}
          setErrorMessage={setErrorMessage}
          loadingTodoId={loadingTodoId}
          setLoadingTodoId={setLoadingTodoId}
          filteredTodos={filteredTodos}
          onDeleteTodo={onDeleteTodo}
          onUpdateTodo={onUpdateTodo}
        />

        {filterTodos(FilterType.All)?.length > 0 && (
          <Footer
            loadingTodoId={loadingTodoId}
            setLoadingTodoId={setLoadingTodoId}
            todos={todos}
            setTodos={setTodos}
            setErrorMessage={setErrorMessage}
            selectedLink={selectedLink}
            setSelectedLink={setSelectedLink}
          />
        )}
      </div>

      <div
        data-cy="ErrorNotification"
        className={classNames(
          'notification is-danger is-light has-text-weight-normal',
          {
            hidden: errorMessage.length === 0,
          },
        )}
      >
        <button data-cy="HideErrorButton" type="button" className="delete" />
        {errorMessage.length > 0 && errorMessage}
      </div>
    </div>
  );
};
