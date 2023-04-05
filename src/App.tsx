/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useState, useEffect, useCallback } from 'react';
import { Todo } from './types/Todo';
import {
  deleteTodo,
  getTodos,
  patchTodo,
  postTodo,
} from './api/todos';
import { TodoList } from './components/TodoList';
import { Error } from './types/Error';
import { Notification } from './components/Notification';
import { Footer } from './components/Footer';
import { FilterType } from './types/FilterType';
import { Header } from './components/Header';
import { Loader } from './components/Loader';

const USER_ID = 6616;

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [errorMessage, setErrorMessage] = useState<Error>(Error.None);
  const [query, setQuery] = useState('');
  const [disabledInput, setDisabledInput] = useState(false);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [loadingIds, setLoadingIds] = useState<number[]>([]);
  const [filterType, setFilterType] = useState<FilterType>(FilterType.All);
  const [isLoading, setIsLoading] = useState(true);

  const removeError = () => {
    setErrorMessage(Error.None);
  };

  const showError = useCallback((errorType: Error) => {
    setErrorMessage(errorType);
    setTimeout(() => {
      removeError();
    }, 3000);
  }, []);

  const addTodo = useCallback(async (title: string) => {
    setDisabledInput(true);

    const newTodo = {
      title,
      userId: USER_ID,
      completed: false,
    };

    setTempTodo({ ...newTodo, id: 0 });

    try {
      const addedTodo = await postTodo(newTodo);

      setTodos(state => [...state, addedTodo]);
    } catch {
      showError(Error.Add);
    } finally {
      setDisabledInput(false);
      setTempTodo(null);
    }
  }, []);

  const removeTodo = useCallback(async (id: number) => {
    setLoadingIds(state => [...state, id]);

    try {
      await deleteTodo(id);

      setTodos(state => state.filter(todo => todo.id !== id));
    } catch {
      showError(Error.Delete);
    } finally {
      setLoadingIds(state => state.filter(el => el !== id));
    }
  }, []);

  const removeCompleted = () => {
    const completed = todos.filter(todo => todo.completed);

    completed.forEach(todo => {
      deleteTodo(todo.id)
        .then(() => {
          setTodos(todos.filter(task => !task.completed));
        })
        .catch(() => {
          showError(Error.Delete);
        });
    });
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    if (!query.trim()) {
      showError(Error.Title);

      return;
    }

    addTodo(query.trim());
    setQuery('');
  };

  const handleUpdate = useCallback(async (id: number, data: Partial<Todo>) => {
    setLoadingIds(state => [...state, id]);

    try {
      await patchTodo(id, data);

      setTodos(state => state.map(todo => {
        if (todo.id === id) {
          return { ...todo, ...data };
        }

        return todo;
      }));
    } catch {
      showError(Error.Update);
    } finally {
      setLoadingIds(state => state.filter(el => el !== id));
    }
  }, []);

  const handleToggleAll = useCallback(() => {
    const areAllDone = todos.every(todo => todo.completed);

    if (areAllDone) {
      todos.forEach(el => {
        handleUpdate(el.id, { completed: false });
      });
    } else {
      const notDoneTodos = todos.filter(el => !el.completed);

      notDoneTodos.forEach(element => {
        handleUpdate(element.id, { completed: true });
      });
    }
  }, [todos]);

  useEffect(() => {
    const getTodosFromServer = async () => {
      try {
        const todosFromServer = await getTodos(USER_ID);

        setTodos(todosFromServer);
      } catch {
        showError(Error.Load);
      } finally {
        setIsLoading(false);
      }
    };

    getTodosFromServer();
  }, []);

  const remainingTodos = todos.filter(todo => !todo.completed).length;

  const completedTodos = todos.filter(todo => todo.completed).length;

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      {isLoading
        ? <Loader isLoading={isLoading} />
        : (
          <div className="todoapp__content">
            <Header
              onToggleAll={handleToggleAll}
              onSubmit={handleSubmit}
              query={query}
              onInputChange={handleInputChange}
              disabledInput={disabledInput}
            />

            {todos.length > 0 && (
              <>
                <TodoList
                  todos={todos}
                  tempTodo={tempTodo}
                  onDelete={removeTodo}
                  loadingIds={loadingIds}
                  onUpdateTodo={handleUpdate}
                  filterType={filterType}
                />
                <Footer
                  remainingTodos={remainingTodos}
                  filterType={filterType}
                  setFilterType={setFilterType}
                  completedTodos={completedTodos}
                  onDeleteCompleted={removeCompleted}
                />
              </>
            )}
          </div>
        )}

      <Notification error={errorMessage} onDelete={removeError} />
    </div>
  );
};
