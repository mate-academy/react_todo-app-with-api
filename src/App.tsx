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
  const [titleError, setTitleError] = useState(false);
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loadError, setLoadError] = useState(false);
  const [addError, setAddError] = useState(false);
  const [deleteError, setDeleteError] = useState(false);
  const [updateError, setUpdateError] = useState(false);
  const [status, setStatus] = useState('all');
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [tempArray, setTempArray] = useState<Todo[]>([]);
  const [edit, setEdit] = useState(false);

  const temp = (currentTodo: Todo) => {
    setTempArray(prevArray => [...prevArray, currentTodo]);
  };

  const filteredTodos = getTodosByStatus(status, todos);

  async function addTodo(newTodoTitle: string) {
    const editedTitle = newTodoTitle.trim();

    if (!editedTitle) {
      setTitleError(true);
      wait(3000).then(() => setTitleError(false));

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
          setAddError(true);
          setTempTodo(null);
          wait(3000).then(() => setAddError(false));
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
        setUpdateError(true);
        wait(3000).then(() => setUpdateError(false));
        setTempArray([]);
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
        setDeleteError(true);
        wait(3000).then(() => {
          setDeleteError(false);
        });
      });
  };

  useEffect(() => {
    todosFromServer
      .getTodos()
      .then(setTodos)
      .catch(() => setLoadError(true));
    wait(3000).then(() => setLoadError(false));
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
            setTitleError={setTitleError}
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
          array={tempArray}
          setTempArray={temp}
          edit={edit}
        />

        {tempTodo && (
          <TodoItem
            todo={tempTodo}
            updateTodo={updateTodo}
            deleteTodo={deleteTodo}
            tempArray={tempArray}
            setTempArray={temp}
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
            setTempArray={setTempArray}
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
            hidden:
              !titleError &&
              !loadError &&
              !addError &&
              !deleteError &&
              !updateError,
          },
        )}
      >
        <button data-cy="HideErrorButton" type="button" className="delete" />
        {/* show only one message at a time */}
        {loadError && 'Unable to load todos'}
        {titleError && 'Title should not be empty'}
        {addError && 'Unable to add a todo'}
        {deleteError && 'Unable to delete a todo'}
        {updateError && 'Unable to update a todo'}
      </div>
    </div>
  );
};
