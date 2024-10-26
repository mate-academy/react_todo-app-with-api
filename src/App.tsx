/* eslint-disable max-len */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useState } from 'react';
import { UserWarning } from './UserWarning';
import { USER_ID } from './api/todos';
import classNames from 'classnames';
import { Todo } from './types/Todo';
import * as todosFromServer from './api/todos';
import { wait } from './utils/fetchClient';
import { TodoForm } from './components/TodoForm/TodoForm';
import { TodoList } from './components/TodoList/TodoList';
import { TodoFooter } from './components/TodoFooter/TodoFooter';
import { Status } from './types/Status';
import { TodoItem } from './components/TodoItem/TodoItem';

const getTodosByStatus = (status: string, todos: Todo[]) => {
  const preperedTodos = [...todos];

  if (status) {
    switch (status) {
      case Object.keys(Status)[Object.values(Status).indexOf(Status.active)]:
        return preperedTodos.filter(todo => !todo.completed);
      case Object.keys(Status)[Object.values(Status).indexOf(Status.completed)]:
        return preperedTodos.filter(todo => todo.completed);
      default:
        return preperedTodos;
    }
  }

  return preperedTodos;
};

export const App: React.FC = () => {
  // const [titleError, setTitleError] = useState(false);
  const [todos, setTodos] = useState<Todo[]>([]);
  // const [loadError, setLoadError] = useState(false);
  // const [addError, setAddError] = useState(false);
  // const [deleteError, setDeleteError] = useState(false);
  // const [updateError, setUpdateError] = useState(false);
  const [status, setStatus] = useState('all');
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [loadingTodos, setLoadingTodos] = useState<Todo[]>([]);
  const [edit, setEdit] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const temp = (currentTodo: Todo) => {
    setLoadingTodos(prevArray => [...prevArray, currentTodo]);
  };

  const filteredTodos = getTodosByStatus(status, todos);

  async function addTodo(newTodoTitle: string) {
    const editedTitle = newTodoTitle.trim();

    if (!editedTitle) {
      setErrorMessage('Title should not be empty');
      wait(3000).then(() => setErrorMessage('Title should not be empty'));

      return;
    } else {
      setTempTodo({
        id: 0,
        userId: 839,
        title: editedTitle,
        completed: false,
      });

      return todosFromServer
        .createTodos({
          userId: 839,
          title: editedTitle,
          completed: false,
        })
        .then(newTodo => {
          setTodos(prevTodos => [...prevTodos, newTodo]);
          setTempTodo(null);
        })
        .catch(error => {
          setErrorMessage('Unable to add a todo');
          setTempTodo(null);
          wait(3000).then(() => setErrorMessage(''));
          throw error;
        });
    }
  }

  async function updateTodo(
    updatedTodo: Todo,
    // successUpdateState?: VoidFunction,
  ): Promise<void> {
    return todosFromServer
      .updateTodos(updatedTodo)
      .then((todo: Todo) => {
        setTodos(currentTodos => {
          const newTodos = [...currentTodos];
          const index = newTodos.findIndex(
            thisTodo => thisTodo.id === updatedTodo.id,
          );

          newTodos.splice(index, 1, todo);

          return newTodos;
        });
        setEdit(false);
        // successUpdateState?.();
      })
      .catch(error => {
        setEdit(true);
        setErrorMessage('Unable to update a todo');
        wait(3000).then(() => setErrorMessage(''));
        setLoadingTodos([]);
        throw error;
      });
  }

  const deleteTodo = (paramTodo: Todo) => {
    todosFromServer
      .deleteTodos(paramTodo.id)
      .then(() =>
        setTodos(prevTodos =>
          prevTodos.filter(todo => todo.id !== paramTodo.id),
        ),
      )
      .catch(() => {
        setErrorMessage('Unable to delete a todo');
        wait(3000).then(() => {
          setErrorMessage('');
        });
        setLoadingTodos(array => array.filter(a => a.id !== paramTodo.id));
      });
  };

  useEffect(() => {
    todosFromServer
      .getTodos()
      .then(setTodos)
      .catch(() => setErrorMessage('Unable to load todos'));
    wait(3000).then(() => setErrorMessage(''));
  }, []);

  if (!USER_ID) {
    return <UserWarning />;
  }

  const deleteCompletedTodos = (todosToDelete: Todo[]) => {
    todosToDelete.forEach(todo => deleteTodo(todo));
  };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          {/* Add a todo on form submit */}
          <TodoForm
            onSubmit={addTodo}
            setErrorMessage={setErrorMessage}
            todos={todos}
            updateTodo={updateTodo}
            setTempArray={temp}
            edit={edit}
          />
        </header>

        <TodoList
          todos={filteredTodos}
          updateTodo={updateTodo}
          deleteTodo={deleteTodo}
          array={loadingTodos}
          setLoadingTodos={temp}
          edit={edit}
        />

        {tempTodo && (
          <TodoItem
            todo={tempTodo}
            updateTodo={updateTodo}
            deleteTodo={deleteTodo}
            loadingTodos={loadingTodos}
            setLoadingTodos={temp}
            edit={edit}
          />
        )}

        {!!todos.length && (
          // {/* Hide the footer if there are no todos */}
          <TodoFooter
            todos={todos}
            setStatus={setStatus}
            status={status}
            deleteCompletedTodos={deleteCompletedTodos}
            setLoadingTodos={setLoadingTodos}
          />
        )}
      </div>

      {/* {error && ( */}
      {/* DON'T use conditional rendering to hide the notification */}
      {/* Add the 'hidden' class to hide the message smoothly */}

      <div
        data-cy="ErrorNotification"
        className={classNames(
          'notification is-danger is-light has-text-weight-normal',
          {
            hidden: !errorMessage,
          },
        )}
      >
        {/* show only one message at a time  */}

        <button data-cy="HideErrorButton" type="button" className="delete" />

        {errorMessage && errorMessage}
      </div>
    </div>
  );
};
