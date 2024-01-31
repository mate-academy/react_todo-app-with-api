/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useCallback, useEffect, useState } from 'react';
import { Todo } from './types/Todo';
import { Filter } from './types/Filter';
import * as PostServise from './api/todos';
import { Error } from './types/Error';
import { TodoList } from './components/TodoList';
import { UserWarning } from './UserWarning';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { ErrorMessage } from './components/ErrorMessage';
import { addLoader } from './utils/addLoader';

const USER_ID = 12126;

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filterBy, setFilterBy] = useState(Filter.all);
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);

  const completedTodo = todos.filter(todo => todo.completed);
  const uncompletedTodo = todos.filter(todo => !todo.completed);
  const allCompleted = todos.length === completedTodo.length;

  useEffect(() => {
    setErrorMessage('');

    PostServise.getTodos(USER_ID)
      .then((todoTask) => {
        const addTask = todoTask.map(task => ({
          ...task, loading: false,
        }));

        setTodos(addTask);
        setIsLoading(true);
      })
      .catch(() => setErrorMessage(Error.get))
      .finally(() => setIsLoading(false));
  }, []);

  const handleFilterChange = useCallback((filter: Filter) => {
    setFilterBy(filter);
  }, []);
  const filterTodos = () => {
    switch (filterBy) {
      case Filter.active:
        return todos.filter(todo => !todo.completed);
      case Filter.completed:
        return todos.filter(todo => todo.completed);
      default:
        return todos;
    }
  };

  const visibleTodos = filterTodos();

  const updateTodo = (updatedTodo: Todo) => {
    setErrorMessage('');
    addLoader(setTodos, updatedTodo.id, true);

    return PostServise.updateTodo(updatedTodo)
      .then((todo) => {
        setTodos(currentTodos => currentTodos.map(
          currentTodo => (currentTodo.id === todo.id
            ? { ...todo } : currentTodo),
        ));
      })
      .catch((error) => {
        setErrorMessage(Error.patch);

        throw error;
      })
      .finally(() => {
        addLoader(setTodos, updatedTodo.id, false);
      });
  };

  const toggleAll = (toggle: boolean) => {
    setErrorMessage('');

    const toggleTodos = todos.filter(
      todo => todo.completed !== toggle,
    );

    toggleTodos.forEach(
      todo => addLoader(setTodos, todo.id, true),
    );

    const updatePromises = toggleTodos.map(
      todo => PostServise.updateTodo({
        ...todo,
        completed: toggle,
      }));

    Promise.all(updatePromises)
      .then(updatedTodos => {
        setTodos(currentTodos => currentTodos.map(
          currentTodo => {
            const updatedTodo = updatedTodos
              .find(todo => todo.id === currentTodo.id);

            return updatedTodo
              ? { ...currentTodo, completed: toggle }
              : currentTodo;
          }));
      })
      .catch(error => {
        setErrorMessage(Error.patch);
        throw error;
      })
      .finally(() => {
        toggleTodos.forEach(todo => addLoader(setTodos, todo.id, false));
      });
  };

  const addTodo = (title: string) => {
    setErrorMessage('');

    setTempTodo({
      id: 0,
      userId: USER_ID,
      title,
      completed: false,
      loading: true,
    });

    const request = PostServise.createTodo({
      userId: USER_ID,
      title,
      completed: false,
    })
      .then(newTodo => {
        const addedTodo = {
          ...newTodo,
          loading: false,
        };

        setTodos(currentTodos => [...currentTodos, addedTodo]);
      })
      .catch((error) => {
        setErrorMessage(Error.post);
        throw error;
      })
      .finally(() => {
        setTempTodo(null);
      });

    return request;
  };

  const deleteTodos = (postId: number) => {
    setErrorMessage('');
    setIsLoading(true);

    addLoader(setTodos, postId, true);

    return PostServise.deleteTodos(postId)
      .then(() => {
        setTodos(currentTodo => currentTodo.filter(todo => todo.id !== postId));
      })
      .catch(() => {
        setErrorMessage(Error.delete);
      })
      .finally(() => {
        addLoader(setTodos, postId, false);
        setIsLoading(false);
      });
  };

  const clearCompleted = () => {
    setErrorMessage('');
    setIsLoading(true);

    setTodos(currentTodos => currentTodos.map(todo => (todo.completed
      ? { ...todo, loading: true } : todo)));

    const deletePromises = completedTodo
      .map((todo) => PostServise.deleteTodos(todo.id)
        .then(() => {
          setTodos(currentTodos => currentTodos
            .filter(currentTodo => currentTodo.id !== todo.id));
        })
        .finally(() => {
          addLoader(setTodos, todo.id, false);
        }));

    Promise.all(deletePromises)
      .catch(() => {
        setErrorMessage(Error.delete);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  return (
    <>
      {USER_ID ? (
        <div className="todoapp">
          <h1 className="todoapp__title">Todos</h1>

          <div className="todoapp__content">
            <Header
              todos={todos}
              addTodo={addTodo}
              error={errorMessage}
              setError={setErrorMessage}
              loading={isLoading}
              setLoading={setIsLoading}
              toggleAll={toggleAll}
              allCompleted={allCompleted}
            />

            <TodoList
              todos={visibleTodos}
              onDelete={deleteTodos}
              tempTodo={tempTodo}
              updatedTodos={updateTodo}

            />

            {todos.length > 0 && (
              <Footer
                filterBy={filterBy}
                changeFilter={handleFilterChange}
                completedTodos={completedTodo}
                uncompletedTodos={uncompletedTodo}
                clearCompleted={clearCompleted}
              />
            )}
          </div>

          <ErrorMessage
            error={errorMessage}
            setError={setErrorMessage}
          />
        </div>
      ) : (
        <UserWarning />
      )}
    </>

  );
};
