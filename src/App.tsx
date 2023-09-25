/* eslint-disable jsx-a11y/control-has-associated-label */
// #region import
import React, { useEffect, useState } from 'react';
import { UserWarning } from './UserWarning';
import { Footer, Status } from './components/Footer/Footer';
import { Header } from './components/Header/Header';
import { Section } from './components/Section/Section';
import { Error } from './components/Error/Error';
import { Todo } from './types/Todo';
import * as todoService from './api/todos';
// #endregion
const USER_ID = 11449;

function getVisibleTodos(todos: Todo[], newStatus: Status) {
  switch (newStatus) {
    case Status.ACTIVE:
      return todos.filter(todo => !todo.completed);

    case Status.COMPLETED:
      return todos.filter(todo => todo.completed);

    default:
      return todos;
  }
}

export const App: React.FC = () => {
  // #region loadTodos
  const [todos, setTodos] = useState<Todo[]>([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [status, setStatus] = useState(Status.ALL);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [newTitle, setNewTitle] = useState('');
  const visibleTodos = getVisibleTodos(todos, status);

  const completedTodos = todos.filter(todo => todo.completed);
  const idsOfCompletedTodos = completedTodos.map(todo => todo.id);

  const clearError = () => {
    if (errorMessage) {
      setTimeout(() => {
        setErrorMessage('');
      }, 3000);
    }
  };

  useEffect(clearError, [errorMessage]);

  function loadTodos() {
    todoService.getTodos(USER_ID)
      .then(response => {
        setTodos(response);
      })
      .catch(() => {
        setErrorMessage('Unable to load todos');
      });
  }

  useEffect(loadTodos, []);
  // #endregion

  // #region add, delete, update
  const addTodo = ({ userId, title, completed }: Todo) => {
    setIsLoading(true);

    const promise = todoService.createTodo({
      userId, title: title.trim(), completed,
    })
      .then(newTodo => {
        setTodos(currentTodos => [...currentTodos, newTodo]);
        setNewTitle('');
      })
      .catch(() => {
        setErrorMessage('Unable to add a todo');
        clearError();
      })
      .finally(() => {
        setIsLoading(false);
        setTempTodo(null);
      });

    setTempTodo({
      id: 0, userId: USER_ID, title, completed,
    });

    return promise;
  };

  const deleteTodo = (id: number) => {
    setIsLoading(true);
    setSelectedId(id);

    return todoService.deleteTodo(id)
      .then(() => {
        setTodos(currentTodos => currentTodos.filter(todo => todo.id !== id));
      })
      .catch(() => {
        setErrorMessage('Unable to delete a todo');
      })
      .finally(() => {
        setIsLoading(false);
        setSelectedId(null);
      });
  };

  const deleteCompleted = () => {
    setIsLoading(true);

    return Promise.all(
      idsOfCompletedTodos.map(id => todoService.deleteTodo(id)),
    )
      .then(() => {
        setTodos(
          currentTodos => currentTodos.filter(
            todo => !idsOfCompletedTodos.includes(todo.id),
          ),
        );
      })
      .catch(() => {
        setErrorMessage('Unable to delete a todo');
      })
      .finally(() => {
        setIsLoading(false);
        setSelectedId(null);
      });
  };

  // #endregion
  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">

        <Header
          newTitle={newTitle}
          setNewTitle={setNewTitle}
          isLoading={isLoading}
          userId={USER_ID}
          todos={todos}
          onSubmit={addTodo}
          setErrorMessage={setErrorMessage}
        />

        {visibleTodos && (
          <Section
            tempTodo={tempTodo}
            visibleTodos={visibleTodos}
            onDelete={deleteTodo}
            selectedId={selectedId}
            isLoading={isLoading}
          />
        )}

        {(todos.length > 0 || tempTodo) && (
          <Footer
            todos={todos}
            setStatus={setStatus}
            currentStatus={status}
            onClearCompleted={deleteCompleted}
          />
        )}

      </div>

      <Error
        errorMessage={errorMessage}
        setErrorMessage={setErrorMessage}
      />
    </div>
  );
};
