import React, {
  useCallback,
  useContext, useEffect, useMemo, useState,
} from 'react';
import {
  addTodo, deleteTodo, getTodos, updateTodo,
} from './api/todos';
import { AuthContext } from './components/Auth/AuthContext';
// eslint-disable-next-line max-len
import { ErrorNotification } from './components/ErrorNotification/ErrorNotification';
import { Footer } from './components/Footer/Footer';
import { Header } from './components/Header/Header';
import { TodoList } from './components/TodoList/TodoList';
import { ErrorTypes, FilterTypes } from './types/Enums';
import { Todo } from './types/Todo';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [isError, setIsError] = useState(false);
  const [filterType, setFilterType] = useState('All');
  const [isLoading, setIsLoading] = useState(false);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [deletingTodosIds, setDeletingTodosIds] = useState<number[]>([]);
  const [updatingTodosIds, setUpdatingTodosIds] = useState<number[]>([]);

  const user = useContext(AuthContext);

  const closeError = useCallback(() => {
    setTimeout(() => {
      setErrorMessage('');
      setIsError(false);
    }, 3000);
  }, []);

  const showError = useCallback((errorType: string) => {
    setErrorMessage(errorType);
    setIsError(true);

    setTimeout(() => {
      setErrorMessage('');
      setIsError(false);
    }, 3000);
  }, []);

  useEffect(() => {
    if (user) {
      getTodos(user.id)
        .then(setTodos)
        .catch(() => {
          showError(ErrorTypes.UnableToLoad);
        });
    }
  }, [showError, user]);

  const addNewTodo = useCallback(async (newTitle: string) => {
    if (!newTitle.trim()) {
      showError(ErrorTypes.EmptyTitle);

      return;
    }

    setIsLoading(true);

    if (user) {
      try {
        setTempTodo({
          id: 0,
          title: newTitle.trim(),
          completed: false,
          userId: user.id,
        });

        const newTodo = await addTodo({
          title: newTitle.trim(),
          userId: user?.id,
          completed: false,
        });

        setTodos(prev => [...prev, newTodo]);
        closeError();
      } catch (error) {
        showError(ErrorTypes.UnableToAdd);
      } finally {
        setIsLoading(false);
        setTempTodo(null);
      }
    }
  }, [closeError, showError, user]);

  const removeTodo = useCallback(async (todoId: number) => {
    try {
      setDeletingTodosIds(prev => [...prev, todoId]);

      await deleteTodo(todoId);

      setTodos(currentTodos => currentTodos.filter(todo => todo.id !== todoId));
      closeError();
    } catch (error) {
      showError(ErrorTypes.NotDelete);
    } finally {
      setDeletingTodosIds(prev => prev.filter(id => id !== todoId));
    }
  }, [closeError, showError]);

  const deleteCompleated = () => {
    todos.forEach(todo => {
      if (todo.completed) {
        removeTodo(todo.id);
      }
    });
  };

  const updatingTodo = (todoToUpdate: Todo) => {
    setUpdatingTodosIds(prev => [...prev, todoToUpdate.id]);

    updateTodo(todoToUpdate.id, todoToUpdate.title, todoToUpdate.completed)
      .then((updatedTodo) => {
        setTodos(currentTodos => currentTodos.map(todo => (
          todo.id !== updatedTodo.id
            ? todo
            : updatedTodo
        )));
      })
      .catch(() => {
        showError(ErrorTypes.UnableToUpdate);
      })
      .finally(() => {
        setUpdatingTodosIds([]);
      });
  };

  const filteredTodos = useMemo(() => {
    switch (filterType) {
      case FilterTypes.ACTIVE:
        return todos.filter(todo => !todo.completed);

      case FilterTypes.COMPLETED:
        return todos.filter(todo => todo.completed);

      case FilterTypes.All:
        return todos;

      default:
        throw new Error('Invalid sorting type');
    }
  }, [todos, filterType]);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          todos={todos}
          updatingTodo={updatingTodo}
          isLoading={isLoading}
          setIsLoading={setIsLoading}
          onAddTodo={addNewTodo}
        />
        {todos.length !== 0 && (
          <>
            <TodoList
              todos={filteredTodos}
              tempTodo={tempTodo}
              removeTodo={removeTodo}
              isLoading={isLoading}
              deletingTodosIds={deletingTodosIds}
              updatingTodo={updatingTodo}
              todosToUpdate={updatingTodosIds}
            />

            <Footer
              filterType={filterType}
              filteredTodos={filteredTodos}
              setFilterType={setFilterType}
              deleteCompleated={deleteCompleated}
            />
          </>
        )}
      </div>

      {errorMessage && (
        <ErrorNotification
          errorMessage={errorMessage}
          closeError={closeError}
          isError={isError}

        />
      )}
    </div>
  );
};
