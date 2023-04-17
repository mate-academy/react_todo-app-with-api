/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useState, useCallback } from 'react';
import { UserWarning } from './UserWarning';
import { TodoList } from './components/TodoList';
import { Todo } from './types/Todo';
import {
  deleteTodos, getTodos, patchTodo, postTodos,
} from './api/todos';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { FilterType } from './types/FilterType';
import { Notification } from './components/Notification';
import { getFilteredTodos } from './utils/helpers';
import { USER_ID } from './utils/user';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [filterType, setFilterType] = useState(FilterType.All);
  const [isDisabledInput, setIsDisabledInput] = useState(false);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [togglingTodos, setTogglingTodos] = useState({});

  const activeTodos = todos.filter(todo => !todo.completed).length;
  const completedTodos = todos.filter(todo => todo.completed);
  const visibleTodos = getFilteredTodos(todos, filterType);

  useEffect(() => {
    const getTodosFromServer = async () => {
      try {
        const todosFromServer = await getTodos(USER_ID);

        setTodos(todosFromServer);
      } catch {
        setErrorMessage('Cannot load todos');
      }
    };

    getTodosFromServer();
  }, []);

  const addNewTodo = useCallback(async (todo: Omit<Todo, 'id'>) => {
    setIsDisabledInput(true);
    setTempTodo({ ...todo, id: 0 });
    try {
      const newTodo = await postTodos(todo);

      setTodos(state => [...state, newTodo]);
    } catch {
      setErrorMessage('Unable to add a todo');
      setTimeout(() => {
        setErrorMessage('');
      }, 3000);
    } finally {
      setIsDisabledInput(false);
      setTempTodo(null);
    }
  }, []);

  const removeTodo = useCallback(async (id: number) => {
    setTogglingTodos(state => ({
      ...state,
      [id]: true,
    }));

    try {
      await deleteTodos(id);
      setTodos(state => state.filter(todo => todo.id !== id));
    } catch {
      setErrorMessage('Unable to delete a todo');
      setTimeout(() => {
        setErrorMessage('');
      }, 3000);
    } finally {
      setTogglingTodos({});
    }
  }, []);

  const changeTodo = useCallback(async (
    id: number, data: Pick<Todo, 'title'> | Pick<Todo, 'completed' >,
  ) => {
    setTogglingTodos(state => ({
      ...state,
      [id]: true,
    }));
    try {
      await patchTodo(id, data);
      setTodos(state => state.map(todo => {
        if (todo.id === id) {
          return { ...todo, ...data };
        }

        return todo;
      }));
    } catch {
      setErrorMessage('Unable to update a todo');
    } finally {
      setTogglingTodos({});
    }
  }, []);

  const toggleAllTodos = useCallback(() => {
    const areAllDone = todos.every(todo => todo.completed);

    if (areAllDone) {
      todos.forEach(el => {
        setTogglingTodos(state => ({
          ...state,
          [el.id]: true,
        }));
        changeTodo(el.id, { completed: false });
      });
    } else {
      const notDoneTodos = todos.filter(el => !el.completed);

      notDoneTodos.forEach(element => {
        setTogglingTodos(state => ({
          ...state,
          [element.id]: true,
        }));
        changeTodo(element.id, { completed: true });
      });
    }
  }, [todos]);

  const removeComletedTodos = useCallback(() => {
    completedTodos.forEach(todo => {
      setTogglingTodos(state => ({
        ...state,
        [todo.id]: true,
      }));

      deleteTodos(todo.id)
        .then(() => {
          setTodos(todos.filter(item => !item.completed));
        })
        .catch(() => {
          setErrorMessage('Unable to delete todos');
        });
    });
  }, [todos]);

  const removeErrorMessage = useCallback(() => {
    setErrorMessage('');
  }, []);

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          onToggle={toggleAllTodos}
          activeTodos={activeTodos}
          onErrorMessage={setErrorMessage}
          userId={USER_ID}
          onAdd={addNewTodo}
          isDisabledInput={isDisabledInput}
        />
        <TodoList
          togglingTodos={togglingTodos}
          onUpdateTodo={changeTodo}
          todos={todos}
          activeTodos={activeTodos}
          filterType={filterType}
          tempTodo={tempTodo}
          removeTodo={removeTodo}
          visibleTodos={visibleTodos}
        />
        {todos.length > 0 && (
          <Footer
            completedTodos={completedTodos}
            visibleTodos={visibleTodos}
            filterType={filterType}
            onSetFilterType={setFilterType}
            onDeleteCompletedTodos={removeComletedTodos}
          />
        )}
      </div>

      <Notification
        errorMessage={errorMessage}
        removeErrorMessage={removeErrorMessage}
      />
    </div>
  );
};
