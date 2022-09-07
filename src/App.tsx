import React, {
  useContext, useState, useEffect, useMemo,
} from 'react';
import { AuthContext } from './components/Auth/AuthContext';
import { Todo } from './types/Todo';
import {
  getTodos, editTodo, deleteTodo, addTodo,
} from './api/todos';
import { Header } from './components/Header';
import { TodoList } from './components/TodoList';
import { Footer } from './components/Footer';
import { Notification } from './components/Notification';

export const App: React.FC = () => {
  const user = useContext(AuthContext);
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const loadTodos = async (userId: number) => {
    try {
      const todosFromServer = await getTodos(userId);

      setTodos(todosFromServer);
    } catch (error) {
      setErrorMessage('Can\'t load todos');
    }
  };

  useEffect(() => {
    if (!user) {
      return;
    }

    loadTodos(user.id);
  }, [user?.id]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setErrorMessage('');
    }, 3000);

    return () => clearTimeout(timer);
  }, [errorMessage]);

  // eslint-disable-next-line no-console
  console.log(user);
  // eslint-disable-next-line no-console
  console.log(todos);
  // eslint-disable-next-line no-console
  console.log(filter);

  const handleCheckbox = async (todoId: number, data: {}) => {
    setLoading(true);

    try {
      await editTodo(todoId, data);

      setTodos(todos.map(todo => {
        if (todoId === todo.id) {
          return {
            ...todo,
            completed: !todo.completed,
          };
        }

        return todo;
      }));
    } catch (error) {
      setErrorMessage('Unable to update a todo');
    } finally {
      setLoading(false);
    }
  };

  const changeTitle = async (todoId: number, title: string) => {
    setLoading(true);

    try {
      await editTodo(todoId, { title });

      setTodos(todos.map(todo => {
        if (todoId === todo.id) {
          return {
            ...todo,
            title,
          };
        }

        return todo;
      }));
    } catch (error) {
      setErrorMessage('Unable to update a todo');
    } finally {
      setLoading(false);
    }
  };

  const removeTodo = async (todoId: number) => {
    setLoading(true);

    try {
      await deleteTodo(todoId);

      setTodos(todos.filter(todo => todo.id !== todoId));
    } catch (error) {
      setErrorMessage('Unable to delete a todo');
    } finally {
      setLoading(false);
    }
  };

  const createTodo = async (title: string) => {
    setLoading(true);

    if (user) {
      const newTodo = {
        userId: user.id,
        completed: false,
        title,
      };

      try {
        await addTodo(newTodo);
        await loadTodos(user.id);
      } catch (error) {
        setErrorMessage('Unable to add a new todo');
      } finally {
        setLoading(false);
      }
    }
  };

  const todoLength = todos.length;
  const completedTodos = todos.filter(todo => todo.completed);
  const activeTodos = todos.filter(todo => !todo.completed);

  const toggleAllTodos = () => {
    const allCompleted = activeTodos.length === 0;
    const forToggle = allCompleted ? completedTodos : activeTodos;

    forToggle.forEach(async (todo) => {
      try {
        await editTodo(todo.id,
          { ...todo, completed: !allCompleted });
      } catch {
        setErrorMessage('Unable to update a todo');
      }
    });

    setTodos(todos.map(todo => {
      return { ...todo, completed: !allCompleted };
    }));
  };

  const clearCompleted = () => {
    completedTodos.forEach(async (todo) => {
      try {
        await deleteTodo(todo.id);
      } catch (error) {
        setErrorMessage('Unable to delete a todo');
      }
    });

    setTodos(activeTodos);
  };

  const visibleTodos = useMemo(() => {
    return todos.filter(todo => {
      switch (filter) {
        case 'active':
          return todo.completed === false;
        case 'completed':
          return todo.completed === true;
        default:
          return todo;
      }
    });
  }, [todos, filter]);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          onAdd={createTodo}
          showError={setErrorMessage}
          todoLength={todoLength}
          completedTodos={completedTodos}
          toggleAllTodos={toggleAllTodos}
        />

        {todos.length > 0 && (
          <>
            <TodoList
              todos={visibleTodos}
              loading={loading}
              onChecked={handleCheckbox}
              onChangeTitle={changeTitle}
              onRemove={removeTodo}
            />
            <Footer
              setFilter={setFilter}
              filter={filter}
              completedTodos={completedTodos}
              todos={todos}
              clearCompleted={clearCompleted}
            />
          </>
        )}
      </div>

      {errorMessage.length > 0 && <Notification message={errorMessage} />}
    </div>
  );
};
