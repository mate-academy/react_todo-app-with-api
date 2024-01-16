/* eslint-disable max-len */
import React, { useEffect, useMemo, useState } from 'react';
import { UserWarning } from './UserWarning';
import { Todo, FilterType, ErrorType } from './types';
import {
  getTodos, updateTodoTitle, updateTodo, deleteTodo,
} from './api/todos';
import { TodoList } from './components/TodoList';
import { Footer } from './components/Footer';
import { Header } from './components/Header';
import { Error } from './components/Error';

const USER_ID = 12139;

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filterType, setFilterType] = useState(FilterType.ALL);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [isLoading, setIsLoading] = useState<number[]>([]);

  const handleError = (error: ErrorType) => {
    setErrorMessage(error);
  };

  useEffect(
    () => {
      getTodos(USER_ID)
        .then(setTodos)
        .catch((error) => {
          setErrorMessage(`Unable to load todos. Please try again. ${error}`);
        });
    }, [],
  );

  const handleEditTodo = (todoId: number, newTitle: string) => {
    if (!newTitle) {
      return deleteTodo(todoId);
    }

    setIsLoading(prev => [...prev, todoId]);

    return updateTodoTitle(todoId, newTitle)
      .then(updatedTodo => {
        setTodos(currentTodos => currentTodos.map(
          todo => (todoId === todo.id ? updatedTodo : todo),
        ));
      })
      .catch(() => {
        setErrorMessage(ErrorType.TITLE);
      })
      .finally(() => {
        setIsLoading(prev => prev.filter(id => id !== todoId));
      });
  };

  const setTodoCompleted = (todoToUpdate: Todo): Promise<void> => {
    return new Promise((resolve, reject) => {
      setIsLoading(prev => [...prev, todoToUpdate.id]);
      updateTodo(todoToUpdate.id, todoToUpdate)
        .then(updatedTodo => {
          setTodos(currentTodos => {
            return currentTodos
              .map(el => (el.id === todoToUpdate.id ? updatedTodo : el));
          });
        })
        .catch(() => {
          handleError(ErrorType.UPDATE);
          reject();
        })
        .finally(() => {
          setIsLoading(prev => prev.filter(id => id !== todoToUpdate.id));
          resolve();
        });
    });
  };

  const toggleCompleted = async (todo: Todo, completed?: boolean) => {
    const newTodo = {
      ...todo,
      completed: completed || !todo.completed,
    };

    await setTodoCompleted(newTodo);
  };

  const toggleCompletedAll = () => {
    if (todos.every((todo) => todo.completed)) {
      todos.forEach(async (todo) => {
        await toggleCompleted(todo, false);
      });
    } else {
      todos.forEach(async (todo) => {
        await toggleCompleted(todo, true);
      });
    }
  };

  const addTodo = (todo: Todo) => {
    setTodos(prev => [...prev, todo]);
  };

  const handleDeleteTodo = (id: number) => {
    setIsLoading(prev => [...prev, id]);

    const deletingTodo = async () => {
      try {
        if (todos) {
          await deleteTodo(id);
          setTodos(prev => prev.filter(todo => todo.id !== id));
        }
      } catch (error) {
        handleError(ErrorType.DELETE);
      } finally {
        setIsLoading(prev => prev.filter(todoId => todoId !== id));
      }
    };

    deletingTodo();
  };

  const todosToRender = useMemo(
    () => {
      return todos.filter(todo => {
        return filterType === FilterType.ALL
          || (filterType === FilterType.COMPLETED ? todo.completed : !todo.completed);
      });
    },
    [todos, filterType],
  );

  const hideErrorMessage = () => {
    setErrorMessage(null);
  };

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          addTodo={addTodo}
          setTempTodo={setTempTodo}
          handleError={handleError}
          setIsLoading={setIsLoading}
          toggleCompletedAll={toggleCompletedAll}
        />

        <TodoList
          todos={todosToRender}
          tempTodo={tempTodo}
          setTodos={setTodos}
          isLoading={isLoading}
          setIsLoading={setIsLoading}
          handleError={handleError}
          handleEditTodo={handleEditTodo}
          handleDeleteTodo={handleDeleteTodo}
          toggleCompleted={toggleCompleted}
        />

        {todos.length > 0 && (
          <Footer
            todos={todos}
            setFilterType={setFilterType}
            filterType={filterType}
            setIsLoading={setIsLoading}
            handleDeleteTodo={handleDeleteTodo}
          />
        )}
      </div>

      {errorMessage && (
        <Error
          hideErrorMessage={hideErrorMessage}
          errorMessage={errorMessage}
        />
      )}
    </div>
  );
};
