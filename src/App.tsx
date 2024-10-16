import React, { useEffect, useRef, useState } from 'react';
import { Header } from './components/header';
import { TodoList } from './components/todoList';
import { Footer } from './components/footer';
import { ErrorNotification } from './components/error';

import { TodoFilter } from './types/filter';
import { Todo } from './types/Todo';
import { Error } from './types/errors';

import { getTodos, USER_ID } from './api/todos';
import { filterTodos } from './utils/filterFunction';
import { TodoServiceApi } from './utils/todoService';

export const App: React.FC = () => {
  // #region useState
  const [todos, setTodos] = useState<Todo[]>([]);
  const [sortFilter, setSortFilter] = useState<TodoFilter>(TodoFilter.All);
  const [errorMessage, setErrorMessage] = useState('');
  const [loadingTodos, setLoadingTodos] = useState([0]);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [todoText, setTodoText] = useState<string>('');

  //#endregion

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, [isSubmitting]);

  // #region constants

  const areTodosActive =
    todos.every(todo => todo.completed) && todos.length > 0;
  const preparedTodos = filterTodos(todos, sortFilter);
  const activeTodosCounter = todos.filter(todo => !todo.completed).length;
  const notActiveTodosCounter = todos.filter(todo => todo.completed).length;
  const handleError = (message: Error) => {
    setErrorMessage(message);
    setTimeout(() => {
      setErrorMessage('');
    }, 3000);
  };

  //#endregion

  useEffect(() => {
    getTodos()
      .then(setTodos)
      .catch(() => {
        handleError(Error.GET);
      });
  }, []);

  const handleDelete = (id: number) => {
    setIsSubmitting(true);
    setLoadingTodos(prevTodo => [...prevTodo, id]);

    TodoServiceApi.deleteTodo(id)
      .then(() => setTodos(prevTodo => prevTodo.filter(elem => elem.id !== id)))
      .catch(() => handleError(Error.DELETE))
      .finally(() => {
        setLoadingTodos([0]);
        setIsSubmitting(false);
      });
  };

  const handleFormSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    setIsSubmitting(true);

    const trimmedTodo = todoText.trim();

    if (trimmedTodo.length === 0) {
      handleError(Error.TITLE);
      setIsSubmitting(false);

      return;
    }

    setTempTodo({
      id: 0,
      title: trimmedTodo,
      userId: USER_ID,
      completed: false,
    });

    TodoServiceApi.addTodo(trimmedTodo)
      .then(newTodo => {
        setTodos(prevTodos => [...prevTodos, newTodo]);
        setTodoText('');
      })
      .catch(() => {
        handleError(Error.POST);
      })
      .finally(() => {
        setIsSubmitting(false);
        setTempTodo(null);
      });
  };

  // #region Togglers

  const handleToggleTodo = (id: number, currentStatus: boolean) => {
    setIsSubmitting(true);
    setLoadingTodos(prevTodo => [...prevTodo, id]);

    TodoServiceApi.updateTodo(id, { completed: !currentStatus })
      .then(updatedTodo =>
        setTodos(prevTodos =>
          prevTodos.map(oneTodo => (oneTodo.id === id ? updatedTodo : oneTodo)),
        ),
      )
      .catch(() => handleError(Error.PATCH))
      .finally(() => {
        setLoadingTodos([0]);
        setIsSubmitting(false);
      });
  };


  const handleToggleAll = async () => {
    const allTodosCompleted = todos.every(todo => todo.completed);
    const todosToToggle = todos.filter(
      todo => todo.completed === allTodosCompleted,
    );

    setIsSubmitting(true);
    setLoadingTodos(prevLoadingTodos => [
      ...prevLoadingTodos,
      ...todosToToggle.map(todo => todo.id),
    ]);

    try {
      const updatedTodosPromises = todosToToggle.map(todo => {
        const updatedTodos = TodoServiceApi.updateTodo(todo.id, {
          completed: !todo.completed,
        });

        return updatedTodos;
      });

      const updatedTodos = await Promise.all(updatedTodosPromises);

      setTodos(prevTodos =>
        prevTodos.map(todo => {
          const updatedTodo = updatedTodos.find(
            updated => updated.id === todo.id,
          );

          return updatedTodo || todo;
        }),
      );
    } catch {
      handleError(Error.PATCH);
    } finally {
      setIsSubmitting(false);
      setLoadingTodos([0]);
    }
  };

  // #endregion

  // #region TodoEditing

  const handleTitleUpdate = (id: number, newTitle: string) => {
    setIsSubmitting(true);
    setLoadingTodos(prev => [...prev, id]);

    const trimmedTitle = newTitle.trim();

    TodoServiceApi.updateTodo(id, { title: trimmedTitle })
      .then(updatedTodo => {
        setTodos(prevTodos =>
          prevTodos.map(todo => (todo.id === id ? updatedTodo : todo)),
        );
      })
      .catch(() => handleError(Error.PATCH))
      .finally(() => {
        setLoadingTodos([0]);
        setIsSubmitting(false);
      });
  };

  // #endregion

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          areTodosActive={areTodosActive}
          handleFormSubmit={handleFormSubmit}
          todoText={todoText}
          setTodoText={setTodoText}
          isSubmitting={isSubmitting}
          inputRef={inputRef}
          handleToggleAll={handleToggleAll}
          loadingTodos={loadingTodos}
          hasTodos={todos.length > 0}
        />
        <TodoList
          todos={preparedTodos}
          handleDelete={handleDelete}
          loadingTodos={loadingTodos}
          tempTodo={tempTodo}
          handleToggleTodo={handleToggleTodo}
          handleTitleUpdate={handleTitleUpdate}
        />

        {!!todos.length && (
          <Footer
            sortFilter={sortFilter}
            setSortFilter={setSortFilter}
            activeTodosCounter={activeTodosCounter}
            notActiveTodosCounter={notActiveTodosCounter}
            todos={todos}
            handleDelete={handleDelete}
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
