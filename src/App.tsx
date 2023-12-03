/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useContext } from 'react';
import { Header } from './components/Header';
import { TodoList } from './components/TodoList';
import { Footer } from './components/Footer';
import { Todo } from './types/Todo';
import { addTodo, getTodos, deleteTodo } from './api/todos';
import { ErrorNotification } from './types/ErrorNotification';
import { Error } from './components/Error';
import { TodoItem } from './components/TodoItem';
import { TodosContext } from './TodosContext';

const USER_ID = 11988;

export const App: React.FC = () => {
  const context = useContext(TodosContext);

  const {
    todos,
    setTodos,
    setErrorMessage,
    setTitle,
    tempTodo,
    setTempTodo,
    setIsInputDisabled,
    setIsLoader,
  } = context;

  useEffect(() => {
    setErrorMessage(ErrorNotification.Default);
    getTodos(USER_ID)
      .then(setTodos)
      .catch(() => setErrorMessage(ErrorNotification.LoadError));
  }, []);

  const createTodo = async (newTodo: Omit<Todo, 'id'>) => {
    setErrorMessage(ErrorNotification.Default);

    try {
      setIsInputDisabled(true);
      setTempTodo({ id: 0, ...newTodo });
      const todo = await addTodo(newTodo);

      setTodos([...todos, todo]);
    } catch (error) {
      setErrorMessage(ErrorNotification.AddError);
      throw error;
    } finally {
      setTempTodo(null);
      setIsInputDisabled(false);
    }

    setTitle('');
  };

  const removeTodo = async (todo: Todo) => {
    setErrorMessage(ErrorNotification.Default);

    try {
      setIsLoader(todo.id);
      await deleteTodo(todo.id);
    } catch (error) {
      setErrorMessage(ErrorNotification.DeleteError);
      setIsLoader(null);
      throw error;
    } finally {
      setTempTodo(null);
    }

    setTodos(todos.filter(item => item.id !== todo.id));
  };

  const deleteSeveral = async () => {
    try {
      const deletePromises = todos
        .filter(todo => todo.completed)
        .map(todo => deleteTodo(todo.id));

      await Promise.allSettled(deletePromises);
    } catch (error) {
      setErrorMessage(ErrorNotification.DeleteError);
      throw error;
    } finally {
      const newTodos = todos.filter(todo => !todo.completed);

      setTodos(newTodos);
    }
  };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          onAdd={createTodo}
          userId={USER_ID}
        />
        {todos.length !== 0 && (
          <TodoList
            removeTodo={removeTodo}
          />
        )}

        {tempTodo && (
          <TodoItem
            todo={tempTodo}
            removeTodo={removeTodo}
            isTempTodo
          />
        )}

        {todos.length !== 0 && (
          <Footer
            deleteCompleted={deleteSeveral}
          />
        )}
      </div>

      <Error />
    </div>
  );
};
