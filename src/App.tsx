/* eslint-disable jsx-a11y/control-has-associated-label */
import React, {
  useContext,
  useEffect,
  useState,
} from 'react';

import cn from 'classnames';

import { AuthContext } from './components/Auth/AuthContext';
import { Filter } from './components/Filter';
import { ErrorNotification } from './components/ErrorNotification';
import { TodoList } from './components/TodoList';
import { TodoInfo } from './components/TodoInfo';

import {
  addTodo,
  deleteTodo,
  getTodos,
  updateTodo,
} from './api/todos';

import { Todo } from './types/Todo';
import { FilterStatus } from './types/FilterLink';

export const App: React.FC = () => {
  const user = useContext(AuthContext);

  const [todosFromServer, setTodosFromServer] = useState<Todo[]>([]);
  const [isError, setIsError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [newTodoTitle, setNewTodoTitle] = useState('');
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [todosForDelete, setTodosForDelete] = useState<Todo[]>([]);
  const [todosForUpdate, setTodosForUpdate] = useState<Todo[]>([]);
  const [filterStatus, setFilterStatus] = useState<FilterStatus>('All');

  useEffect(() => {
    if (user) {
      getTodos(user.id)
        .then(setTodosFromServer)
        .catch(() => {
          setIsError(true);
          setErrorMessage('Can\'t load todos');
        });
    }
  }, []);

  const handleChangeNewTodoTitle = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => (
    setNewTodoTitle(event.currentTarget.value)
  );

  const handleSubmitAddNewTodo = (event: React.FormEvent) => {
    event.preventDefault();

    if (!newTodoTitle.trim()) {
      setIsError(true);
      setErrorMessage('Title can\'t be empty');
      setNewTodoTitle('');

      return;
    }

    if (user) {
      setTempTodo({
        id: 0,
        userId: user.id,
        title: newTodoTitle,
        completed: false,
      });

      setIsAdding(true);

      addTodo(user.id, newTodoTitle)
        .then((addedTodo) => {
          setTodosFromServer(currentTodos => (
            [...currentTodos,
              {
                id: addedTodo.id,
                userId: addedTodo.userId,
                title: addedTodo.title,
                completed: addedTodo.completed,
              },
            ]
          ));

          setNewTodoTitle('');
        })
        .catch(() => {
          setIsError(true);
          setErrorMessage('Unable to add a todo');
        })
        .finally(() => {
          setIsAdding(false);
          setTempTodo(null);
        });
    }
  };

  const handleClickCloseErrorMessage = () => {
    setIsError(false);
  };

  const setNewFilterStatus = (status: FilterStatus) => {
    setFilterStatus(status);
  };

  const setTodoForDelete = (chosenTodo: Todo) => {
    setTodosForDelete(todos => [...todos, chosenTodo]);

    deleteTodo(chosenTodo.id)
      .then(() => (
        setTodosFromServer(currentTodos => currentTodos.filter(
          todo => todo.id !== chosenTodo.id,
        ))
      ))
      .catch(() => {
        setTodosForDelete([]);
        setIsError(true);
        setErrorMessage('Unable to delete a todo');
      });
  };

  const setTodoForUpdate = (chosenTodo: Todo) => {
    setTodosForUpdate(todos => [...todos, chosenTodo]);

    updateTodo(chosenTodo.id, chosenTodo.title, !chosenTodo.completed)
      .then((udpatedTodo) => {
        setTodosFromServer(currentTodos => currentTodos.map(todo => (
          todo.id !== udpatedTodo.id
            ? todo
            : {
              id: udpatedTodo.id,
              userId: udpatedTodo.userId,
              title: udpatedTodo.title,
              completed: udpatedTodo.completed,
            }
        )));
      })
      .catch(() => {
        setIsError(true);
        setErrorMessage('Unable to update a todo');
      })
      .finally(() => {
        setTodosForUpdate([]);
      });
  };

  const handleClickClearCompletedTodos = () => {
    todosFromServer.forEach(todo => {
      if (todo.completed) {
        setTodoForDelete(todo);
      }
    });
  };

  const amountOfTodosToComplete = todosFromServer.filter(
    todo => !todo.completed,
  ).length;

  const handleClickToggleAllTodosStatuses = () => (
    todosFromServer.forEach(todo => {
      if (!todo.completed || !amountOfTodosToComplete) {
        setTodoForUpdate(todo);
      }
    })
  );

  const todos = todosFromServer.filter(todo => {
    switch (filterStatus) {
      case 'Active':
        return !todo.completed;

      case 'Completed':
        return todo.completed;

      default:
        return true;
    }
  });

  if (isError) {
    setTimeout(() => setIsError(false), 3000);
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          {todosFromServer.length !== 0 && (
            <button
              data-cy="ToggleAllButton"
              type="button"
              className={cn(
                'todoapp__toggle-all',
                { active: !amountOfTodosToComplete },
              )}
              onClick={handleClickToggleAllTodosStatuses}
            />
          )}

          <form onSubmit={handleSubmitAddNewTodo}>
            <input
              data-cy="NewTodoField"
              type="text"
              className="todoapp__new-todo"
              placeholder="What needs to be done?"
              value={newTodoTitle}
              onChange={handleChangeNewTodoTitle}
              disabled={isAdding}
            />
          </form>
        </header>

        <TodoList
          todos={todos}
          todosForDelete={todosForDelete}
          todosForUpdate={todosForUpdate}
          onSetTodoForDelete={setTodoForDelete}
          onSetTodoForUpdate={setTodoForUpdate}
        />
        {tempTodo && <TodoInfo todo={tempTodo} isAdding={isAdding} />}

        {todosFromServer.length !== 0 && (
          <footer className="todoapp__footer" data-cy="Footer">
            <span className="todo-count" data-cy="todosCounter">
              {`${amountOfTodosToComplete} items left`}
            </span>

            <Filter onSetFilterStatus={setNewFilterStatus} />

            <button
              data-cy="ClearCompletedButton"
              type="button"
              className="todoapp__clear-completed"
              disabled={amountOfTodosToComplete === todosFromServer.length}
              onClick={handleClickClearCompletedTodos}
            >
              Clear completed
            </button>
          </footer>
        )}
      </div>

      <ErrorNotification
        isError={isError}
        onCloseErrorMessage={handleClickCloseErrorMessage}
        errorMessage={errorMessage}
      />
    </div>
  );
};
