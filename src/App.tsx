import React, { useEffect, useRef, useState } from 'react';
import cn from 'classnames';

import * as todoService from './api/todos';
import { UserWarning } from './UserWarning';
import { USER_ID } from './api/todos';

import { Todo } from './types/Todo';
import { Header } from './components/Header/Header';
import { TodoList } from './components/TodoList/TodoList';
import { Footer } from './components/Footer/Footer';
import { SortBy } from './types/SortBy';
import { showErrorMesage } from './utils/showErrorMesage';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loadingTodo, setLoadingTodo] = useState<Todo | null>(null);

  const [activationArrow, setActivationArrow] = useState(false);
  const [selectedSort, setSelectedSort] = useState<SortBy>(SortBy.All);
  const [errorMessage, setErrorMessage] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [activateTodosId, setActivateTodosId] = useState<number[]>([]);

  const [todoTitle, setTodoTitle] = useState('');
  const [loading, setLoading] = useState(false);

  const [deletingListId, setDeletingListId] = useState<number[]>([]);

  const inputRef = useRef<HTMLInputElement>(null);

  const handleFocusInput = () => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const sortList = (sort: SortBy) => {
    switch (sort) {
      case SortBy.Active:
        return todos.filter(todo => !todo.completed);
      case SortBy.Completed:
        return todos.filter(todo => todo.completed);
      default:
        return todos;
    }
  };

  const sortedArray = sortList(selectedSort);

  const addTodos = (title: string, completed: boolean, userId: number) => {
    const newTempTodo: Todo = {
      id: 0,
      title: todoTitle.trim(),
      completed: false,
      userId: USER_ID,
    };

    setLoading(true);
    setLoadingTodo(newTempTodo);
    setErrorMessage('');

    return todoService
      .createTodo({ title, completed, userId })
      .then(newTodo => {
        setTodos((currentTodos: Todo[]) => [...currentTodos, newTodo]);
        setLoadingTodo(null);
      })
      .catch(er => {
        showErrorMesage('Unable to add a todo', setErrorMessage);
        setLoadingTodo(null);
        throw er;
      })
      .finally(() => {
        setLoading(false);
        setTimeout(() => handleFocusInput(), 0);
      });
  };

  const reset = () => {
    setErrorMessage('');
    setTodoTitle('');
  };

  useEffect(() => {
    todoService
      .getTodos()
      .then(currentTodos => {
        const hasIncompleteTodos = currentTodos.some(td => !td.completed);

        setActivationArrow(!hasIncompleteTodos);
        setTodos(currentTodos);
      })
      .catch(er => {
        showErrorMesage('Unable to load todos', setErrorMessage);
        throw er;
      });
  }, []);

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>
      <div className="todoapp__content">
        <Header
          todosState={{ todos, setTodos }}
          titleState={{ todoTitle, setTodoTitle }}
          setActivateTodosId={setActivateTodosId}
          reset={reset}
          inputRef={inputRef}
          isDeleting={isDeleting}
          loading={loading}
          addTodos={addTodos}
          setErrorMessage={setErrorMessage}
          activationArrowState={{ activationArrow, setActivationArrow }}
        />

        <TodoList
          sortedArray={sortedArray}
          loadingTodo={loadingTodo}
          setErrorMessage={setErrorMessage}
          setIsDeleting={setIsDeleting}
          deletingListId={deletingListId}
          setTodos={setTodos}
          todos={todos}
          focusInput={handleFocusInput}
          activateTodosId={activateTodosId}
        />

        {!!todos.length && (
          <Footer
            setSelectedSort={setSelectedSort}
            todos={todos}
            howSort={selectedSort}
            setTodos={setTodos}
            setErrorMessage={setErrorMessage}
            focusInput={handleFocusInput}
            setIsDeleting={setIsDeleting}
            setDeletingListId={setDeletingListId}
          />
        )}
      </div>
      <div
        data-cy="ErrorNotification"
        className={cn(
          'notification is-danger is-light has-text-weight-normal',
          { hidden: !errorMessage },
        )}
      >
        <button
          data-cy="HideErrorButton"
          type="button"
          className="delete"
          onClick={() => setErrorMessage('')}
        />
        {errorMessage}
      </div>
    </div>
  );
};
