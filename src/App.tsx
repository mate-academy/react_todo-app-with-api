/* eslint-disable max-len */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useCallback, useEffect, useRef, useState } from 'react';

import { Footer } from './components/footer';
import { ErrorMessage, FilteredStatus, Todo } from './types/Todo';
import { Header } from './components/header';
import { TodoList } from './components/todoList';
import { ErrorsMessage } from './components/errorsMessage';
import * as todoService from './api/todos';
import { UserWarning } from './UserWarning';
import { TempTodo } from './components/tempTodo';

//const USER_ID = 2548;

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filteredStatus, setFilteredStatus] = useState<FilteredStatus>(
    FilteredStatus.ALL,
  );
  const [errorMessage, setErrorMessage] = useState<ErrorMessage>(
    ErrorMessage.DEFAULT,
  );
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState('');
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [loadingTodo, setLoadingTodo] = useState<number[]>([]);
  const [editTodoId, setEditTodoId] = useState<number | null>(null);

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleErrorMessages = useCallback((message: ErrorMessage) => {
    setErrorMessage(message);
    const timeOutId = setTimeout(() => {
      setErrorMessage(ErrorMessage.DEFAULT);
    }, 3000);

    return () => clearTimeout(timeOutId);
  }, []);

  function loadTodo() {
    setLoading(true);

    todoService
      .getTodos()
      .then(setTodos)
      .catch(() => handleErrorMessages(ErrorMessage.LOAD))
      .finally(() => setLoading(false));
  }

  useEffect(loadTodo, [handleErrorMessages]);

  const filteredTodo = todos.filter(todo => {
    switch (filteredStatus) {
      case FilteredStatus.ACTIVE:
        return !todo.completed;

      case FilteredStatus.COMPLETED:
        return todo.completed;

      default:
        return true;
    }
  });

  const addTodo = useCallback(
    ({ id, title, completed, userId }: Todo) => {
      if (!query.trim()) {
        handleErrorMessages(ErrorMessage.TITLE);

        return;
      }

      setTempTodo({ id, title, completed, userId });
      (inputRef.current as HTMLInputElement).disabled = true;

      todoService
        .createTodo({ id, title, completed, userId })
        .then(newTodo => {
          setTodos(currentTodos => [...currentTodos, newTodo]);
          setTempTodo(null);
          setQuery('');
          (inputRef.current as HTMLInputElement).disabled = false;
          inputRef.current?.focus();
        })
        .catch(() => {
          handleErrorMessages(ErrorMessage.ADD);
          setTempTodo(null);
          (inputRef.current as HTMLInputElement).disabled = false;
          inputRef.current?.focus();
        });
    },
    [handleErrorMessages, query],
  );

  const removeTodo = useCallback(
    (todoId: number) => {
      setLoadingTodo(prev => [...prev, todoId]);
      todoService
        .deleteTodo(todoId)
        .then(() => {
          const selectedTodo = todos.filter(todo => todo.id !== todoId);

          setTodos(selectedTodo);
          inputRef.current?.focus();
        })
        .catch(() => {
          handleErrorMessages(ErrorMessage.DELETE);
          inputRef.current?.focus();
        })
        .finally(() =>
          setLoadingTodo(prev => prev.filter(id => id !== todoId)),
        );
    },
    [handleErrorMessages, todos],
  );

  const deleteAllCompletedTodo = useCallback(() => {
    const completedTodos = todos.filter(todo => todo.completed);

    if (completedTodos.length === 0) {
      return;
    }

    setLoadingTodo(completedTodos.map(todo => todo.id));

    completedTodos.forEach(todo =>
      todoService
        .deleteTodo(todo.id)
        .then(() => {
          setTodos(currentTodos =>
            currentTodos.filter(el => el.id !== todo.id),
          );
          inputRef.current?.focus();
        })
        .catch(() => {
          handleErrorMessages(ErrorMessage.DELETE);
          inputRef.current?.focus();
        })
        .finally(() => {
          setLoadingTodo([]);
        }),
    );
  }, [handleErrorMessages, todos]);

  const todosStatusChange = useCallback(
    (updatedTodo: Todo) => {
      setLoadingTodo(prev => [...prev, updatedTodo.id]);
      todoService
        .updateTodo(updatedTodo)
        .then(todo => {
          setTodos(currentTodos => {
            return currentTodos.map(el => (todo.id === el.id ? todo : el));
          });
          setEditTodoId(null);
        })
        .catch(() => {
          setLoadingTodo(loadingTodo.filter(id => id !== updatedTodo.id));
          handleErrorMessages(ErrorMessage.UPDATE);
        })
        .finally(() => {
          setLoadingTodo(ids => ids.filter(id => id !== updatedTodo.id));
        });
    },
    [handleErrorMessages, loadingTodo],
  );

  const changeAllTodosStatus = useCallback(() => {
    const areAllCompleted = todos.every(todo => todo.completed);
    const todosToUpdate = todos.filter(
      todo => todo.completed !== !areAllCompleted,
    );

    if (todosToUpdate.length === 0) {
      return;
    }

    setLoadingTodo(todosToUpdate.map(todo => todo.id));

    Promise.all(
      todosToUpdate.map(todo =>
        todoService.updateTodo({ ...todo, completed: !areAllCompleted }),
      ),
    )
      .then(updatedTodos => {
        setTodos(currentTodos =>
          currentTodos.map(todo => {
            const updated = updatedTodos.find(t => t.id === todo.id);

            return updated || todo;
          }),
        );
      })
      .catch(() => handleErrorMessages(ErrorMessage.UPDATE))
      .finally(() => setLoadingTodo([]));
  }, [todos, handleErrorMessages]);

  if (!todoService.USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          todos={todos}
          addTodo={addTodo}
          query={query}
          setQuery={setQuery}
          inputRef={inputRef}
          changeAllTodosStatus={changeAllTodosStatus}
        />

        {!loading && (
          <>
            <TodoList
              filteredTodo={filteredTodo}
              removeTodo={removeTodo}
              loadingTodo={loadingTodo}
              todosStatusChange={todosStatusChange}
              editTodoId={editTodoId}
              setEditTodoId={setEditTodoId}
            />
            {tempTodo && <TempTodo tempTodo={tempTodo} />}
          </>
        )}

        {/* Hide the footer if there are no todos */}
        {todos.length > 0 && (
          <Footer
            todos={todos}
            filteredStatus={filteredStatus}
            setFilteredStatus={setFilteredStatus}
            deleteAllCompletedTodo={deleteAllCompletedTodo}
          />
        )}
      </div>

      {/* DON'T use conditional rendering to hide the notification */}
      {/* Add the 'hidden' class to hide the message smoothly */}
      <ErrorsMessage
        errorMessage={errorMessage}
        setErrorMessage={setErrorMessage}
      />
    </div>
  );
};
