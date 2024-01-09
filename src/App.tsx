/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useState, useEffect } from 'react';
import { UserWarning } from './UserWarning';
import { Form } from './components/Form';
import { Todo } from './types/Todo';
import { TodoList } from './components/TodoList';
import { Footer } from './components/Footer';
import { Status } from './types/Status';
import { getTodos, updateTodo, deleteTodo } from './api/todos';

const USER_ID = 12132;

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filtredByStatus, setFiltredByStatus] = useState<Status>(Status.ALL);
  const [errorNotification, setErrorNotification] = useState<string | null>(
    null,
  );
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [procesingTodoIds, setProcesingTodoIds] = useState<number[]>([]);

  const showErrorNotification = (message: string) => {
    setErrorNotification(message);

    setTimeout(() => {
      setErrorNotification(null);
    }, 3000);
  };

  useEffect(() => {
    getTodos(USER_ID)
      .then((data) => {
        setTodos(data);
      })
      .catch(() => {
        showErrorNotification('Unable to load todos');
      });
  }, []);

  const addNewTodo = (newTodo: Todo) => {
    setTodos([...todos, newTodo]);
  };

  const handleUpdate = (updatedtodo: Todo) => {
    setProcesingTodoIds(prev => [...prev, updatedtodo.id]);

    updateTodo(updatedtodo)
      .then((todoFromserver) => {
        setTodos((corentTodos) => {
          const newTodos = [...corentTodos];
          const index = newTodos.findIndex(
            (todo) => todo.id === updatedtodo.id,
          );

          newTodos.splice(index, 1, todoFromserver);

          return newTodos;
        });
      })
      .catch(() => {
        showErrorNotification('Unable to update a todo');
      })
      .finally(() => {
        setProcesingTodoIds(prev => prev
          .filter(id => id !== updatedtodo.id));
      });
  };

  const togCheck = (todo: Todo) => {
    const chekedtodo = { ...todo, completed: !todo.completed };

    handleUpdate(chekedtodo);
  };

  const isAllCompleted = todos.every((todo) => todo.completed);

  const toggleAll = () => {
    const todosToUpdate = todos.filter((todo) => (isAllCompleted
      ? todo.completed
      : !todo.completed));

    const updatePromises = todosToUpdate.map((todo) => (
      handleUpdate({
        ...todo,
        completed: !isAllCompleted,
      })));

    return Promise.all(updatePromises);
  };

  const toDelete = (id: number) => {
    setTodos(prevState => prevState.filter((todo) => todo.id !== id));
  };

  const handleDeletedTodo = (id: number) => {
    setProcesingTodoIds((prev) => [...prev, id]);

    deleteTodo(id)
      .then(() => {
        toDelete(id);
      })
      .catch(() => {
        showErrorNotification('Unable to delete a todo');
      })
      .finally(() => {
        setProcesingTodoIds((prev) => prev
          .filter((processingId) => processingId !== id));
      });
  };

  const filtredTodo = todos.filter((todo) => {
    switch (filtredByStatus) {
      case Status.ACTIVE:
        return !todo.completed;
      case Status.COMPLETED:
        return todo.completed;
      default:
        return true;
    }
  });

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          {todos.length > 0 && (
            <button
              type="button"
              className={`todoapp__toggle-all
                ${isAllCompleted ? 'active' : ''}
              `}
              data-cy="ToggleAllButton"
              onClick={toggleAll}
            />
          )}
          <Form
            USER_ID={USER_ID}
            addNewTodo={addNewTodo}
            showErrorNotification={showErrorNotification}
            setTempTodo={setTempTodo}
            todos={filtredTodo}
          />
        </header>

        {todos.length > 0 && (
          <>
            <TodoList
              handleDeletedTodo={handleDeletedTodo}
              todos={filtredTodo}
              togCheck={togCheck}
              tempTodo={tempTodo}
              handleUpdate={handleUpdate}
              processingTodosIds={procesingTodoIds}
            />

            <Footer
              setTodos={setTodos}
              todos={todos}
              setFiltredByStatus={setFiltredByStatus}
              filtredByStatus={filtredByStatus}
              showErrorNotification={showErrorNotification}
              setProcesingTodoIds={setProcesingTodoIds}
            />
          </>
        )}
      </div>

      {errorNotification && (
        <div
          data-cy="ErrorNotification"
          className="notification is-danger is-light has-text-weight-normal"
        >
          <button
            data-cy="HideErrorButton"
            type="button"
            className="delete"
            onClick={() => setErrorNotification(null)}
          />
          {errorNotification}
        </div>
      )}
    </div>
  );
};
