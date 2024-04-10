import React, { useState, useEffect } from 'react';

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
import ErrorNotification from './components/ErrorNotification';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [status, setStatus] = useState<Status>(Status.All);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [isInputDisabled, setIsInputDisabled] = useState(false);
  const [headerError, setHeaderError] = useState(false);
  const [, setLoading] = useState<number | string | null>(null);
  const [isShouldFocusInput, setIsShouldFocusInput] = useState(false);
  const [loadingTodoIds, setLoadingTodoIds] = useState<number[]>([]);

  useEffect(() => {
    postService
      .getTodos()
      .then(setTodos)
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
    setLoadingTodoIds(prevIds => [...prevIds, id]);

    postService
      .deleteTodo(id)
      .then(() => {
        setTodos(prevTodos => prevTodos.filter(todoItem => todoItem.id !== id));
      })
      .catch(() => {
        handleError('Unable to delete a todo', setErrorMessage);
      })
      .finally(() => {
        setLoading(null);
        setLoadingTodoIds(prevIds =>
          prevIds.filter(currentId => currentId !== id),
        );
      });
  };

  const updateTodo = async (patchTodo: Todo, title: string): Promise<void> => {
    const trimmedTitle = title.trim();

    if (!trimmedTitle) {
      deleteTodo(patchTodo.id);

      return;
    }

    setLoading(patchTodo.id);
    setLoadingTodoIds(prevIds => [...prevIds, patchTodo.id]);

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
      setLoadingTodoIds(prevIds =>
        prevIds.filter(currentId => currentId !== patchTodo.id),
      );
    }
  };

  const handleClearCompleted = () => {
    const completedTodoIds = todos
      .filter(duty => duty.completed)
      .map(duty => duty.id);

    completedTodoIds.forEach(id => {
      setLoadingTodoIds(prevIds => [...prevIds, id]);

      postService
        .deleteTodo(id)
        .then(() => {
          setTodos(prevTodos =>
            prevTodos.filter(todoItem => todoItem.id !== id),
          );
        })
        .catch(() => {
          handleError('Unable to delete a todo', setErrorMessage);
        })
        .finally(() => {
          setLoadingTodoIds(prevIds =>
            prevIds.filter(currentId => currentId !== id),
          );
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
          setLoadingTodoIds={setLoadingTodoIds}
        />
        <TodoList
          todos={filteredTodos}
          onDeleteTodo={deleteTodo}
          updateTodo={updateTodo}
          tempTodo={tempTodo}
          setLoading={setLoading}
          setErrorMessage={setErrorMessage}
          loadingTodoIds={loadingTodoIds}
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
      <ErrorNotification
        errorMessage={errorMessage}
        setErrorMessage={setErrorMessage}
      />
    </div>
  );
};

export default App;
