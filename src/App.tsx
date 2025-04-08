/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useRef, useState } from 'react';
import { UserWarning } from './UserWarning';
import { USER_ID } from './api/todos';
import { TodoList } from './components/TodoList';
import { Footer } from './components/Footer';
import { Todo } from './types/Todo';
import { ErrorMessage } from './types/ErrorMessage';
import { filter, FilterType } from './utils/filter';
import { getTodos, postTodo, deleteTodo, updateTodo } from './api/todos';
import { Form } from './components/Form';
import { TodoCard } from './components/TodoCard';
import { Toggler } from './components/Toggler';

export const App: React.FC = () => {
  const [todosFromServer, setTodosFromServer] = useState<Todo[]>([]);
  const [errorMessage, setErrorMessage] = useState<ErrorMessage | null>(null);
  const [errorVisible, setErrorVisible] = useState(false);
  const [shownTodos, setShownTodos] = useState<Todo[]>([]);
  const [filterType, setFilterType] = useState(FilterType.ALL);
  const [tempTodo, setTempTodo] = useState<Todo | null>();
  const [processedIDs, setProcessedIDs] = useState<number[]>([]);

  const loadTodos = () => {
    getTodos()
      .then(todos => setTodosFromServer(todos))
      .catch(() => setErrorMessage('Unable to load todos'));
  };

  const errorTimeout = useRef(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const focusField = () => {
    setTimeout(() => inputRef.current?.focus(), 0);
  };

  useEffect(() => focusField(), [shownTodos]);
  useEffect(() => {
    loadTodos();
    focusField();
  }, []);

  useEffect(
    () => setShownTodos(filter(todosFromServer, filterType)),
    [todosFromServer, filterType],
  );

  useEffect(() => {
    window.clearTimeout(errorTimeout.current);
    errorTimeout.current = 0;
    if (errorMessage) {
      setErrorVisible(true);
      errorTimeout.current = window.setTimeout(
        () => setErrorVisible(false),
        3000,
      );
    }
  }, [errorMessage]);

  if (!USER_ID) {
    return <UserWarning />;
  }

  const addTodo = (title: string): Promise<boolean> => {
    if (!title) {
      setErrorMessage('Title should not be empty');
      focusField();

      return Promise.resolve(false);
    }

    setTempTodo({
      id: 0,
      userId: USER_ID,
      title: title,
      completed: false,
    });

    return postTodo({ userId: USER_ID, title: title, completed: false })
      .then(todo => {
        setTodosFromServer(prev => [...prev, todo]);

        return true;
      })
      .catch(() => {
        setErrorMessage('Unable to add a todo');
        focusField();

        return false;
      })
      .finally(() => {
        setTempTodo(null);
      });
  };

  const toggleTodo = (todoToUpdate: Todo) => {
    return updateTodo({
      ...todoToUpdate,
      completed: !todoToUpdate.completed,
    })
      .then(updatedTodo => {
        setTodosFromServer(prev =>
          prev.map(todo => (todo.id === updatedTodo.id ? updatedTodo : todo)),
        );
      })
      .catch(() => setErrorMessage('Unable to update a todo'));
  };

  const editTodo = (todoToUpdate: Todo, newTitle: string) => {
    return updateTodo({
      ...todoToUpdate,
      title: newTitle,
    })
      .then(updatedTodo => {
        setTodosFromServer(prev =>
          prev.map(todo => (todo.id === updatedTodo.id ? updatedTodo : todo)),
        );
      })
      .catch(() => {
        setErrorMessage('Unable to update a todo');
        throw new Error();
      });
  };

  const deleteTodoWrapper = (id: number) => {
    return deleteTodo(id)
      .then(() => {
        setTodosFromServer(prev => prev.filter(todo => todo.id !== id));
      })
      .catch(() => {
        setErrorMessage('Unable to delete a todo');
        throw new Error();
      });
  };

  const bulkDelete = (todos: Todo[]) => {
    setProcessedIDs(todos.map(todo => todo.id));
    Promise.allSettled(todos.map(todo => deleteTodo(todo.id)))
      .then(results => {
        const successedResults = results
          .map((result, index) =>
            result.status === 'fulfilled' ? todos[index] : null,
          )
          .filter(it => {
            if (it === null) {
              setErrorMessage('Unable to delete a todo');
            }

            return it !== null;
          });

        setTodosFromServer(prev =>
          prev.filter(todo => !successedResults.includes(todo)),
        );
      })
      .catch(() => setErrorMessage('Unable to delete a todo'))
      .finally(() => {
        focusField();
        setProcessedIDs([]);
      });
  };

  const toggleAll = () => {
    if (shownTodos.every(todo => todo.completed)) {
      return Promise.allSettled(shownTodos.map(todo => toggleTodo(todo)));
    } else {
      return Promise.allSettled(
        shownTodos
          .filter(todo => !todo.completed)
          .map(todo => toggleTodo(todo)),
      );
    }
  };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          {/* this button should have `active` class only if all todos are completed */}
          {todosFromServer.length && (
            <Toggler shownTodos={shownTodos} toggleAll={toggleAll} />
          )}

          {/* Add a todo on form submit */}
          <Form onSubmit={addTodo} inputRef={inputRef} />
        </header>

        <TodoList
          todos={shownTodos}
          onDelete={deleteTodoWrapper}
          onEdit={editTodo}
          onToggle={toggleTodo}
          inProcess={processedIDs}
        />
        {tempTodo && (
          <TodoCard
            todo={tempTodo}
            isDefaultLoading={true}
            onDelete={() => new Promise(() => {})}
            onEdit={() => new Promise(() => {})}
            onToggle={() => new Promise(() => {})}
          />
        )}
        {/* Use the extracted Footer component */}
        {/* Hide the footer if there are no todos */}
        {todosFromServer.length !== 0 && (
          <Footer
            shownTodos={shownTodos}
            filterType={filterType}
            setFilterType={setFilterType}
            counter={todosFromServer.filter(todo => !todo.completed).length}
            bulkDelete={bulkDelete}
          />
        )}
      </div>

      {/* DON'T use conditional rendering to hide the notification */}
      {/* Add the 'hidden' class to hide the message smoothly */}
      <div
        data-cy="ErrorNotification"
        className={`notification is-danger is-light has-text-weight-normal ${!errorVisible && 'hidden'}`}
      >
        <button
          data-cy="HideErrorButton"
          title="HideErrorButton"
          type="button"
          className="delete"
          onClick={() => setErrorVisible(false)}
        />
        {errorMessage}
      </div>
    </div>
  );
};
