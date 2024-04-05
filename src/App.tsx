import React, { useState, useEffect } from 'react';
import cn from 'classnames';

import { UserWarning } from './UserWarning';
import { USER_ID } from './api/todos';
import Header from './components/Header';
import Footer from './components/Footer';
import TodoList from './components/TodoList';
import { Status } from './types/Status';
import * as postService from './api/todos';
import { Todo } from './types/Todo';
import { handleError } from './components/Error';
import { filterTodos } from './utils/TodoHelpers/FilterTodos';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [status, setStatus] = useState<Status>(Status.All);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [isInputDisabled, setIsInputDisabled] = useState(false);
  const [headerError, setHeaderError] = useState(false);
  const [loading, setLoading] = useState<number | string | null>(null);
  const [isShouldFocusInput, setIsShouldFocusInput] = useState(false);
  const [loadAll, setLoadAll] = useState<number[]>([]);

  useEffect(() => {
    postService
      .getTodos()
      .then(fetchedTodos => {
        setTodos(fetchedTodos);
      })
      .catch(() => {
        handleError('Unable to load todos', setErrorMessage);
      });
  }, []);
  useEffect(() => {
    if (isShouldFocusInput) {
      setIsShouldFocusInput(false);
    }
  }, [isShouldFocusInput]);

  if (!USER_ID) {
    return <UserWarning />;
  }

  const itemsLeft = todos.filter(({ completed }) => !completed).length;
  const haveCompletedTodos = todos.some(({ completed }) => completed);
  const allCompleted = todos.every(({ completed }) => completed);

  const filteredTodos = filterTodos(todos, status);

  const addTodo = (title: string, setTitle: (title: string) => void) => {
    const trimmedTitle = title.trim();

    if (!trimmedTitle) {
      handleError('Title should not be empty', setErrorMessage);

      return;
    }

    setIsInputDisabled(true);

    const newTodo: Omit<Todo, 'id'> = {
      title: trimmedTitle,
      completed: false,
      userId: USER_ID,
      status: status,
    };

    const fakeTodo: Todo = {
      id: 0,
      ...newTodo,
    };

    setTempTodo(fakeTodo);
    setLoading(trimmedTitle);

    postService
      .postTodo(newTodo)
      .then(createdTodo => {
        setTodos(prevTodos => [...prevTodos, createdTodo]);
        setIsShouldFocusInput(true);
        setTitle('');
        setHeaderError(false);
      })
      .catch(() => {
        handleError('Unable to add a todo', setErrorMessage);
        setHeaderError(true);
      })
      .finally(() => {
        setIsInputDisabled(false);
        setTempTodo(null);
      });
  };

  const deleteTodo = (id: number) => {
    setLoading(id);
    postService
      .deleteTodo(id)
      .then(() => {
        setTodos(prevTodos => prevTodos.filter(todoItem => todoItem.id !== id));
      })
      .catch(() => {
        handleError('Unable to delete a todo', setErrorMessage);
      })
      .finally(() => {
        setTempTodo(null);
        setLoading(null);
      });
  };

  const updateTodo = async (patchTodo: Todo, title: string): Promise<void> => {
    const trimmedTitle = title.trim();

    if (!trimmedTitle) {
      deleteTodo(patchTodo.id);

      return;
    }

    setLoading(patchTodo.id);

    try {
      const updatedTask = await postService.updateTodo(patchTodo);

      setIsShouldFocusInput(false);
      setTodos(currentTodos =>
        currentTodos.map(todoItem => {
          if (todoItem.id === updatedTask.id) {
            return {
              ...todoItem,
              title: updatedTask.title,
              completed: updatedTask.completed,
            };
          }

          return todoItem;
        }),
      );
    } catch (error) {
      handleError('Unable to update a todo', setErrorMessage);
    } finally {
      setLoading(null);
      setLoadAll([]);
    }
  };

  const handleClearCompleted = () => {
    const completedTodoIds = todos
      .filter(duty => duty.completed)
      .map(duty => duty.id);

    completedTodoIds.forEach(id => {
      postService
        .deleteTodo(id)
        .then(() => {
          setTodos(prevTodos =>
            prevTodos.filter(todoItem => todoItem.id !== id),
          );
        })
        .catch(() => {
          handleError('Unable to delete a todo', setErrorMessage);
        });
    });
  };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>
      <div className="todoapp__content">
        <Header
          isAllCompleted={allCompleted}
          onAddTodo={addTodo}
          todosLength={todos.length}
          tempTodo={tempTodo}
          updateTodo={updateTodo}
          isInputDisabled={isInputDisabled}
          todos={todos}
          onUpdateTodo={updateTodo}
          setLoading={setLoading}
          headerError={headerError}
          setLoadAll={setLoadAll}
        />
        <TodoList
          todos={filteredTodos}
          onDeleteTodo={deleteTodo}
          updateTodo={updateTodo}
          tempTodo={tempTodo}
          loading={loading}
          setLoading={setLoading}
          setErrorMessage={setErrorMessage}
          loadAll={loadAll}
        />
        {todos.length > 0 && (
          <Footer
            todos={todos}
            onStatusChange={setStatus}
            status={status}
            itemsLeft={itemsLeft}
            haveCompletedTodos={haveCompletedTodos}
            handleClearCompleted={handleClearCompleted}
          />
        )}
      </div>
      <div
        data-cy="ErrorNotification"
        className={cn(
          'notification is-danger is-light has-text-weight-normal',
          {
            hidden: !errorMessage,
          },
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

export default App;
