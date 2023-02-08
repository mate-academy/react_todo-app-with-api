/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useCallback, useEffect, useState } from 'react';
import {
  getTodos,
  addTodo,
  deleteTodo,
  updateTodo,
} from './api/todos';
import { filteredTodos, activeTodosCount } from './helpers/functionsTodos';
import { NotificationTodo } from './Components/NotificationTodo';
import { TodoFooter } from './Components/TodoFooter';
import { TodoHeader } from './Components/TodoHeader';
import { TodoList } from './Components/TodoList';
import { Loader } from './Components/Loader';

import { Todo } from './types/Todo';
import { Filter } from './types/Filter';
import { Errors } from './types/Errors';

const USER_ID = 6211;

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [isSelected, setIsSelected] = useState(true);
  const [filter, setFilter] = useState(Filter.All);
  const [error, setError] = useState(false);
  const [errorNotification, setErrorNotification] = useState(Errors.Empty);
  const [inputValue, setInputValue] = useState('');
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [deletingId, setDeletingId] = useState<number[]>([]);

  const visibeTodos = filteredTodos(todos, filter);
  const activeTodosQuantity = activeTodosCount(todos).length;
  const completedTodos = visibeTodos.length - activeTodosQuantity;
  const completedTodoList = filteredTodos(todos, Filter.Completed);

  useEffect(() => {
    const loadTodos = async () => {
      try {
        const loadedTodos = await getTodos();

        setTodos(loadedTodos);
      } catch (err) {
        throw new Error();
      } finally {
        setIsSelected(false);
      }
    };

    loadTodos();
  }, []);

  const setNotification = (message: Errors) => {
    setErrorNotification(message);
    setError(true);
  };

  const clearNotification = useCallback(() => {
    setError(false);
  }, []);

  const clearInput = () => {
    setInputValue('');
  };

  const handleCreateTodo = useCallback((title: string) => {
    clearNotification();

    if (!title) {
      setNotification(Errors.Empty);
    }

    if (title.trim()) {
      const newTodo = {
        id: 0,
        title,
        userId: USER_ID,
        completed: false,
      };

      setTempTodo(newTodo);
      addTodo(newTodo)
        .then((todo) => {
          setTodos((prevTodos) => [...prevTodos, todo]);
        })
        .catch(() => {
          setNotification(Errors.ErrorOnAdd);
        })
        .finally(() => {
          clearInput();
          setTempTodo(null);
        });
    }
  }, []);

  const handleDeleteTodo = useCallback((todoDel: Todo) => {
    setDeletingId(prev => [...prev, todoDel.id]);

    deleteTodo(todoDel.id)
      .then(() => {
        setTodos(prevTodos => (
          prevTodos.filter(todo => todo.id !== todoDel.id)
        ));
      })
      .catch(() => {
        setNotification(Errors.ErrorOnDelete);
      })
      .finally(() => {
        setDeletingId(prev => prev.filter(id => id !== todoDel.id));
      });
    clearNotification();
  }, []);

  const handleDeleteCompleted = useCallback(() => {
    clearNotification();

    completedTodoList.forEach(todo => handleDeleteTodo(todo));
  }, [todos]);

  const handleUpdate = useCallback(
    (
      updatingTodo: Todo,
      newField: Partial<Todo>,
    ) => {
      setDeletingId(prev => [...prev, updatingTodo.id]);
      updateTodo(updatingTodo.id, newField)
        .then(updatedTodo => {
          setTodos(prevTodos => (
            prevTodos.map(todo => (
              todo === updatingTodo
                ? updatedTodo
                : todo
            ))
          ));
        })
        .catch(() => setErrorNotification(Errors.ErrorOnUpdating))
        .finally(() => {
          setDeletingId(prev => prev.filter(id => id !== updatingTodo.id));
        });

      clearNotification();
    }, [],
  );

  const handleToggle = (todo: Todo) => {
    handleUpdate(todo, { completed: !todo.completed });
  };

  const hangleTaggleAll = (isCompleted: boolean) => {
    const checkedTodoForToggle = todos
      .filter(todo => todo.completed === isCompleted);

    checkedTodoForToggle.forEach(todo => handleToggle(todo));
  };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <TodoHeader
          setInputValue={setInputValue}
          inputValue={inputValue}
          createTodo={handleCreateTodo}
          tempTodo={tempTodo}
          activeTodosQuantity={activeTodosQuantity}
          hangleTaggleAllTodos={hangleTaggleAll}
        />

        {isSelected && <Loader />}
        {visibeTodos.length > 0 && (
          <TodoList
            todos={visibeTodos}
            handleDeleteTodo={handleDeleteTodo}
            tempTodo={tempTodo}
            deletingId={deletingId}
            handleUpdate={handleUpdate}
          />
        )}

        <TodoFooter
          setFilter={setFilter}
          filter={filter}
          activeTodos={activeTodosQuantity}
          completedTodos={completedTodos}
          handleDeleteCompleted={handleDeleteCompleted}
        />
      </div>

      <NotificationTodo
        setError={setError}
        error={error}
        errorNotification={errorNotification}
        clearNotification={clearNotification}
      />
    </div>
  );
};
