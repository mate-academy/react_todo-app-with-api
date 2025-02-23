/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */

import React, { useEffect, useMemo, useState } from 'react';
import { UserWarning } from './UserWarning';
import { USER_ID, changeTodo, deleteTodo, getTodos } from './api/todos';
import { Todo, TodoStatus } from './types/todo';
import classNames from 'classnames';
import { Header } from './components/Header';
import { TodoList } from './components/TodoList';
import { Footer } from './components/Footer/Footer';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [status, setStatus] = useState<TodoStatus>(TodoStatus.all);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);

  // Set of IDs of todos currently being deleted/updated for loader (TodoItem.tsx)
  const [loadingTodoIds, setLoadingTodoIds] = useState<Set<number>>(new Set());

  // fetch todos from the server on component mount
  useEffect(() => {
    getTodos()
      .then(setTodos)
      .catch(() => {
        setErrorMessage('Unable to load todos');
        setTimeout(() => {
          setErrorMessage('');
        }, 3000);
      });
  }, []);

  // filter todos based on the current status (all, active, completed)
  const filteredTodos = useMemo(() => {
    switch (status) {
      case TodoStatus.active:
        return todos.filter(todo => !todo.completed);
      case TodoStatus.completed:
        return todos.filter(todo => todo.completed);
      default:
        return todos;
    }
  }, [status, todos]);

  // deletes a todo by id and updates the state
  const handleDeleteTodo = async (id: number) => {
    // sets the loader (TodoItem.tsx) to the todo that is being deleted
    setLoadingTodoIds(prevIds => new Set(prevIds).add(id));

    try {
      await deleteTodo(id);
      setTodos(prevTodos => prevTodos.filter(todo => todo.id !== id));
    } catch (error) {
      setErrorMessage('Unable to delete a todo');
      setTimeout(() => {
        setErrorMessage('');
      }, 3000);

      // throws error to be caught in another component (TodoItem.tsx)
      throw error;
    } finally {
      // removed deleted todo id to stop the loader
      setLoadingTodoIds(prevIds => {
        const newIds = new Set(prevIds);

        newIds.delete(id);

        return newIds;
      });
    }
  };

  // deletes all completed todos and updates the state
  const handleDeleteCompleted = async () => {
    const completedTodos = todos.filter(todo => todo.completed);

    // sets all completed todos ids which being deleted
    setLoadingTodoIds(new Set(completedTodos.map(todo => todo.id)));

    const deletionPromises = completedTodos.map(todo =>
      handleDeleteTodo(todo.id),
    );

    await Promise.all(deletionPromises);

    // removed all completed todos ids to stop loader
    setLoadingTodoIds(new Set());

    setTimeout(() => {
      setErrorMessage('');
    }, 3000);
  };

  // updates a todo and updates the state with the new todo
  const handleChangeTodo = async (updatedTodo: Todo) => {
    // sets the loader to the todo that is being changed
    setLoadingTodoIds(prevIds => new Set(prevIds).add(updatedTodo.id));

    try {
      const changedTodo = await changeTodo(updatedTodo);

      setTodos(prevTodos =>
        prevTodos.map(todo =>
          todo.id === updatedTodo.id ? changedTodo : todo,
        ),
      );
    } catch (error) {
      setErrorMessage('Unable to update a todo');
      setTimeout(() => {
        setErrorMessage('');
      }, 3000);

      // throws error to be caught in another component (TodoItem.tsx)
      throw error;
    } finally {
      // removed changed todo id to stop the loader
      setLoadingTodoIds(prevIds => {
        const newIds = new Set(prevIds);

        newIds.delete(updatedTodo.id);

        return newIds;
      });
    }
  };

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          todos={todos}
          setTodos={setTodos}
          setLoadingTodoIds={setLoadingTodoIds}
          setErrorMessage={setErrorMessage}
          setTempTodo={setTempTodo}
          changeTodoStatus={handleChangeTodo}
        />

        <TodoList
          todos={filteredTodos}
          tempTodo={tempTodo}
          onDelete={handleDeleteTodo}
          loadingTodoIds={loadingTodoIds}
          changeTodo={handleChangeTodo}
        />

        {/* Only render Footer if there are todos */}
        {!!todos.length && (
          <Footer
            todos={todos}
            handleDeleteCompleted={handleDeleteCompleted}
            status={status}
            setStatus={setStatus}
          />
        )}
      </div>

      <div
        data-cy="ErrorNotification"
        className={classNames(
          'notification is-danger is-light has-text-weight-normal',
          { hidden: !errorMessage },
        )}
      >
        <button
          data-cy="HideErrorButton"
          type="button"
          className="delete"
          onClick={() => setErrorMessage('')}
        />
        {errorMessage}
      </div>
    </div>
  );
};
