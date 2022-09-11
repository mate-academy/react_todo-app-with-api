/* eslint-disable jsx-a11y/control-has-associated-label */
import React, {
  useContext, useEffect, useRef, useState,
} from 'react';
import {
  deleteTodo, getTodos, postTodos, updateTodo,
} from './api/todos';
import { AuthContext } from './components/Auth/AuthContext';
import { Error } from './components/Error';
import { Footer } from './components/Footer';
import { TodoForm } from './components/TodoForm';
import { TodoList } from './components/TodoList';
import { Todo } from './types/Todo';

export const App: React.FC = () => {
  const user = useContext(AuthContext);
  const newTodoField = useRef<HTMLInputElement>(null);
  const [todos, setTodos] = useState<Todo[]>([]);
  const [hasError, setHasError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [activeAll, setActiveAll] = useState(true);
  const [activeFilter, setActiveFilter] = useState('All');

  const updateTodos = () => {
    if (user) {
      getTodos(user.id)
        .then(res => {
          setTodos(res);
        })
        .catch(() => {
          setHasError(true);
          setErrorMessage('Unble to load');
        });
    }
  };

  useEffect(() => {
    if (newTodoField.current) {
      newTodoField.current.focus();
    }

    updateTodos();

    for (let i = 0; i < todos.length; i += 1) {
      if (!todos[i].completed) {
        setActiveAll(false);
      }
    }
  }, []);

  useEffect(() => {
    updateTodos();
  }, [user]);

  const removeError = () => {
    setHasError(false);
  };

  const addTodo = (title: string) => {
    if (!title) {
      setHasError(true);
      setErrorMessage('Title can\'t be empty');

      setTimeout(() => removeError(), 3000);

      return;
    }

    if (user) {
      postTodos(title, user.id || 0)
        .then(() => {
          getTodos(user.id).then(res => {
            setTodos(res);
          });
        })
        .catch(() => {
          setHasError(true);
          setErrorMessage('Unble to load');
        });
    }
  };

  const removeTodo = (id: number | undefined) => {
    deleteTodo(id || 0).then(updateTodos)
      .catch(() => {
        setHasError(true);
        setErrorMessage('Unble to delete');
      });
  };

  const patchTodo = (value: string, id: number | undefined) => {
    if (value.trim() === '') {
      deleteTodo(id || 0)
        .then(updateTodos)
        .catch(() => {
          setHasError(true);
          setErrorMessage('Unble to delete');
        });

      return;
    }

    updateTodo(value, id || 0).then(updateTodos)
      .catch(() => {
        setHasError(true);
        setErrorMessage('Unble to update');
      });
  };

  const visibleTodos = todos.filter(todo => {
    if (activeFilter === 'All') {
      return true;
    }

    if (activeFilter === 'Active') {
      if (!todo.completed) {
        return true;
      }

      return false;
    }

    if (activeFilter === 'Completed') {
      if (todo.completed) {
        return true;
      }

      return false;
    }

    return 0;
  });

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <TodoForm
          newTodoField={newTodoField}
          addTodo={addTodo}
          setActiveAll={setActiveAll}
          activeAll={activeAll}
          setActiveFilter={setActiveFilter}
        />
        <TodoList
          todos={visibleTodos}
          deleteTodo={removeTodo}
          updateTodos={updateTodos}
          activeAll={activeAll}
          patchTodo={patchTodo}
          setHasError={setHasError}
          setErrorMessage={setErrorMessage}
        />
        {todos.length > 0
          && (
            <Footer
              todos={todos}
              setActiveFilter={setActiveFilter}
              activeFilter={activeFilter}
              updateTodos={updateTodos}
            />
          )}

        {hasError
          && <Error errorMessage={errorMessage} removeError={removeError} />}
      </div>
    </div>
  );
};
