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

const USER_ID = 7001;

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [error, setError] = useState('');
  const [filterType, setFilterType] = useState(FilterType.All);
  const [isDisabledInput, setIsDisabledInput] = useState(false);
  const [tempTodo, setTempTodo] = useState<Todo>();
  const [isWaiting, setIsWaiting] = useState(0);
  const [isDeletingCompleted, setIsDeletingCompleted] = useState(false);
  const activeTodos = todos.filter(todo => !todo.completed).length;
  const completedTodos = todos.filter(todo => todo.completed);

  useEffect(() => {
    const getTodosFromServer = async () => {
      try {
        const todosFromServer = await getTodos(USER_ID);

        setTodos(todosFromServer);
      } catch {
        setError('load');
      }
    };

    getTodosFromServer();
  }, []);

  const addNewTodo = useCallback(async (todo: Omit<Todo, 'id'>) => {
    setIsDisabledInput(true);
    setTempTodo({ ...todo, id: 0 });
    if (todo.title) {
      try {
        const newTodo = await postTodos(todo);

        setTodos(state => [...state, newTodo]);
      } catch {
        setError('Unable to add a todo');
        setTimeout(() => {
          setError('');
        }, 3000);
      } finally {
        setIsDisabledInput(false);
        setTempTodo(undefined);
      }
    } else {
      setError('Title can`t be empty');
    }
  }, []);

  const removeTodo = useCallback(async (id: number) => {
    setIsWaiting(id);

    try {
      await deleteTodos(id);
    } catch {
      setError('Unable to delete a todo');
      setTimeout(() => {
        setError('');
      }, 3000);
    } finally {
      setIsWaiting(0);
    }
  }, []);

  const changeTodo = useCallback(async (id: number, data: Partial<Todo>) => {
    setIsWaiting(id);
    try {
      await patchTodo(id, data);

      setTodos(state => state.map(todo => {
        if (todo.id === id) {
          return { ...todo, ...data };
        }

        return todo;
      }));
    } catch {
      setError('Unable to update a todo');
    } finally {
      setIsWaiting(0);
    }
  }, []);

  const toggleAllTodos = useCallback(() => {
    const areAllDone = todos.every(todo => todo.completed);

    if (areAllDone) {
      todos.forEach(el => {
        changeTodo(el.id, { completed: false });
      });
    } else {
      const notDoneTodos = todos.filter(el => !el.completed);

      notDoneTodos.forEach(element => {
        changeTodo(element.id, { completed: true });
      });
    }
  }, [todos]);

  const removeComletedTodos = () => {
    setIsDeletingCompleted(true);

    completedTodos.forEach(todo => {
      deleteTodos(todo.id)
        .then(() => {
          setTodos(todos.filter(item => !item.completed));
        })
        .catch(() => {
          setError('Unable to delete todos');
        })
        .finally(() => {
          setIsDeletingCompleted(false);
        });
    });
  };

  const removeError = () => {
    setError('');
  };

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
          onError={setError}
          userId={USER_ID}
          onAdd={addNewTodo}
          isDisabledInput={isDisabledInput}
        />
        <TodoList
          onUpdateTodo={changeTodo}
          todos={todos}
          activeTodos={activeTodos}
          filterType={filterType}
          tempTodo={tempTodo}
          isWaiting={isWaiting}
          removeTodo={removeTodo}
          isDeletingCompleted={isDeletingCompleted}
        />
        {todos.length > 0 && (
          <Footer
            completedTodos={completedTodos}
            activeTodos={activeTodos}
            filterType={filterType}
            onSetFilterType={setFilterType}
            onDeleteCompletedTodos={removeComletedTodos}
          />
        )}
      </div>

      <Notification
        error={error}
        removeError={removeError}
      />
    </div>
  );
};
