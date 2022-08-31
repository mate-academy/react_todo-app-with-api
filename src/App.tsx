/* eslint-disable jsx-a11y/control-has-associated-label */
import React, {
  useContext, useEffect, useRef, useState,
} from 'react';
import { getTodos } from './api/todos';
import { AuthContext } from './components/Auth/AuthContext';
import { Error } from './components/Error';
import { Footer } from './components/Footer';
import { TodoForm } from './components/TodoForm';
import { TodoList } from './components/TodoList';
import { Todo } from './types/Todo';
import { client } from './utils/fetchClient';

export const App: React.FC = () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const user = useContext(AuthContext);
  const newTodoField = useRef<HTMLInputElement>(null);
  const [todos, setTodos] = useState<Todo[]>([]);
  const [visibleTodos, setVisibleTodos] = useState<Todo[]>([]);
  const [hasError, setHasError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [activeAll, setActiveAll] = useState(true);
  const [activeFilter, setActiveFilter] = useState('All');

  useEffect(() => {
    if (newTodoField.current) {
      newTodoField.current.focus();
    }

    if (user) {
      getTodos(user.id)
        .then(res => setTodos(res))
        .catch(() => {
          setHasError(true);
          setErrorMessage('Unble to load');
        });
      setVisibleTodos(todos);
    }

    for (let i = 0; i < todos.length; i += 1) {
      if (!todos[i].completed) {
        setActiveAll(false);
      }
    }
  }, []);

  useEffect(() => {
    if (user) {
      getTodos(user.id).then(res => {
        setTodos(res);
      }).catch(() => {
        setHasError(true);
        setErrorMessage('Unble to load');
      });
    }
  }, [user]);

  useEffect(() => {
    setVisibleTodos(todos);
  }, [todos]);

  useEffect(() => {
    if (activeFilter === 'Active') {
      const newTodos = todos.filter(todo => todo.completed === false);

      setVisibleTodos(newTodos);
    }

    if (activeFilter === 'Completed') {
      const newTodos = todos.filter(todo => todo.completed === true);

      setVisibleTodos(newTodos);
    }

    if (activeFilter === 'All') {
      setVisibleTodos(todos);
    }
  }, [activeFilter]);

  const removeError = () => {
    setHasError(false);
  };

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

  const addTodo = (title: string) => {
    if (!title) {
      setHasError(true);
      setErrorMessage('Title can\'t be empty');

      setTimeout(() => removeError(), 3000);

      return;
    }

    if (user) {
      client.post('/todos', {
        title,
        userId: user.id || 0,
        completed: false,
      }).then(() => {
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

  const deleteTodo = (id: number | undefined) => {
    client.delete(`/todos/${id}`).then(updateTodos)
      .catch(() => {
        setHasError(true);
        setErrorMessage('Unble to delete');
      });
  };

  const patchTodo = (value: string, id: number | undefined) => {
    if (value.trim() === '') {
      client.delete(`/todos/${id}`)
        .then(updateTodos)
        .catch(() => {
          setHasError(true);
          setErrorMessage('Unble to delete');
        });

      return;
    }

    client.patch(`/todos/${id}`, {
      title: value,
    }).then(updateTodos)
      .catch(() => {
        setHasError(true);
        setErrorMessage('Unble to update');
      });
  };

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
          deleteTodo={deleteTodo}
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
