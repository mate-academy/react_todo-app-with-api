/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useRef, useState } from 'react';

import { UserWarning } from './UserWarning';
import * as service from './api/todos';
import { Todo } from './types/Todo';
import { Footer } from './components/Footer';
import { Header } from './components/Header';
import { Filter } from './types/Filter';
import { TodoList } from './components/TodoList';
import { ErrorMessage } from './components/ErrorMessage';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loadingIds, setLoadingIds] = useState<number[]>([]);
  const [filterTodos, setFilterTodos] = useState<Filter>(Filter.ALL);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);

  const [todoTitle, setTodoTitle] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    service
      .getTodos()
      .then(setTodos)
      .catch(() => setErrorMessage('Unable to load todos'));
  }, []);

  useEffect(() => {
    if (errorMessage) {
      const timer = setTimeout(() => {
        setErrorMessage('');
      }, 3000);

      return () => clearTimeout(timer);
    }

    return undefined;
  }, [errorMessage]);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [inputRef, isSubmitting]);

  if (!service.USER_ID) {
    return <UserWarning />;
  }

  const filteredTodos = todos.filter(todo => {
    switch (filterTodos) {
      case Filter.ACTIVE:
        return !todo.completed;

      case Filter.COMPLETED:
        return todo.completed;

      default:
        return true;
    }
  });

  const todosAmount = todos.filter(todo => !todo.completed).length;
  const completedTodos = todos.filter(todo => todo.completed);

  // #region todoOperations

  const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setErrorMessage('');
    setTodoTitle(event.target.value);
  };

  const updateTodo = (updatedTodo: Todo) => {
    return service
      .updateTodos(updatedTodo)
      .then(() => {
        setTodos(currentTodos =>
          currentTodos.map(todo =>
            todo.id === updatedTodo.id ? updatedTodo : todo,
          ),
        );
      })
      .catch(error => {
        setErrorMessage('Unable to update a todo');
        throw error;
      })
      .finally(() => {
        if (inputRef.current) {
          inputRef.current.focus();
        }
      });
  };

  const addTodo = ({ title }: { title: string }) => {
    const trimmedTitle = title.trim();

    if (!trimmedTitle) {
      setErrorMessage('Title should not be empty');

      return;
    }

    const newTempTodo: Todo = {
      id: 0,
      userId: service.USER_ID,
      title: trimmedTitle,
      completed: false,
    };

    setTempTodo(newTempTodo);
    setIsSubmitting(true);

    service
      .createTodos({
        userId: service.USER_ID,
        title: trimmedTitle,
        completed: false,
      })
      .then(newTodo => {
        setTodos(currentTodos => [...currentTodos, newTodo]);
        setTodoTitle('');
      })
      .catch(() => {
        setErrorMessage('Unable to add a todo');
      })
      .finally(() => {
        setTempTodo(null);
        setIsSubmitting(false);

        if (inputRef.current) {
          inputRef.current.focus();
        }
      });
  };

  const deleteTodo = (todoId: number) => {
    return service
      .deleteTodos(todoId)
      .then(() => {
        setTodos(currentTodos =>
          currentTodos.filter(todo => todo.id !== todoId),
        );
      })
      .catch((error) => {
        setErrorMessage('Unable to delete a todo');
        throw error;
      })
      .finally(() => {
        if (inputRef.current) {
          inputRef.current.focus();
        }
      });
  };

  const deleteCompleted = (completed: Todo[]) => {
    setLoadingIds(prevIds => [...prevIds, ...completed.map(todo => todo.id)]);

    Promise.all(
      completed.map(todo =>
        service.deleteTodos(todo.id).then(() => {
          setTodos(currentTodos => currentTodos.filter(t => t.id !== todo.id));
        }),
      ),
    )
      .catch(() => {
        setErrorMessage('Unable to delete a todo');

        if (inputRef.current) {
          inputRef.current.focus();
        }
      })
      .finally(() => {
        setLoadingIds(prevIds =>
          prevIds.filter(id => !completed.some(todo => todo.id === id)),
        );

        if (inputRef.current) {
          inputRef.current.focus();
        }
      });
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    addTodo({ title: todoTitle });
  };

  const handleButtonClose = () => {
    setErrorMessage('');
  };

  const toggleAllTodos = () => {
    const allCompleted = todos.every(todo => todo.completed);
    const newStatus = !allCompleted;

    const todosToUpdate = todos.filter(todo => todo.completed !== newStatus);

    setLoadingIds(prevIds => [
      ...prevIds,
      ...todosToUpdate.map(todo => todo.id),
    ]);

    Promise.all(
      todosToUpdate.map(todo =>
        service
          .updateTodos({ ...todo, completed: newStatus })
          .then(updatedTodo => {
            setTodos(currentTodos =>
              currentTodos.map(t =>
                t.id === updatedTodo.id ? updatedTodo : t,
              ),
            );
          }),
      ),
    )
      .catch(() => {
        setErrorMessage('Unable to update a todo');
      })
      .finally(() => {
        setLoadingIds(prevIds =>
          prevIds.filter(id => !todosToUpdate.some(todo => todo.id === id)),
        );
      });
  };

  // #endregion

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          todos={todos}
          completedTodos={completedTodos}
          toggleAllTodos={toggleAllTodos}
          handleSubmit={handleSubmit}
          inputRef={inputRef}
          todoTitle={todoTitle}
          handleTitleChange={handleTitleChange}
          isSubmitting={isSubmitting}
        />

        <TodoList
          filteredTodos={filteredTodos}
          deleteTodo={deleteTodo}
          updateTodo={updateTodo}
          loadingIds={loadingIds}
          tempTodo={tempTodo}
        />

        {todos.length !== 0 && (
          <Footer
            todosAmount={todosAmount}
            filterTodos={filterTodos}
            setFilterTodos={setFilterTodos}
            completedTodos={completedTodos}
            deleteCompleted={deleteCompleted}
          />
        )}
      </div>

      <ErrorMessage
        errorMessage={errorMessage}
        handleButtonClose={handleButtonClose}
      />
    </div>
  );
};
