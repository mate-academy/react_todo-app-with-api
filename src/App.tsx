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

const USER_ID = 6616;

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [error, setError] = useState<Error>(Error.Nothing);
  const [query, setQuery] = useState('');
  const [disabledInput, setDisabledInput] = useState(false);
  const [tempTodo, setTempTodo] = useState<Todo>();
  const [loadingIds, setLoadingIds] = useState<number[]>([]);
  const [filterType, setFilterType] = useState<FilterType>(FilterType.All);

  const removeError = () => {
    setError(Error.Nothing);
  };

  const generateError = useCallback((errorType: Error) => {
    setError(errorType);
    setTimeout(() => {
      setError(Error.Nothing);
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
      generateError(Error.Add);
    } finally {
      setDisabledInput(false);
      setTempTodo(undefined);
    }
  }, []);

  const removeTodo = useCallback(async (id: number) => {
    setLoadingIds(state => [...state, id]);

    try {
      await deleteTodo(id);

      setTodos(state => state.filter(todo => todo.id !== id));
    } catch {
      generateError(Error.Delete);
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
          generateError(Error.Delete);
        });
    });
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    if (!query.trim()) {
      generateError(Error.Title);

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
      generateError(Error.Update);
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
        generateError(Error.Load);
      }
    };

    getTodosFromServer();
  }, []);

  const remainingTodos = todos.filter(todo => !todo.completed).length;

  const completedTodos = todos.filter(todo => todo.completed).length;

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

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

      <Notification error={error} onDelete={removeError} />
    </div>
  );
};
