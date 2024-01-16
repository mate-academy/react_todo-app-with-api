/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useRef, useState } from 'react';
import classNames from 'classnames';
import { UserWarning } from './UserWarning';
import { TodoList } from './components/TodoList';
import { TodoFilter } from './components/TodoFilter';
import * as clientService from './api/todos';
import { Todo } from './types/Todo';
import { Errors } from './types/Errors';
import { FilterOptions } from './types/FilterOptions';

const USER_ID = 12166;
const getFilteredTodos = (todos: Todo[], filterBy: FilterOptions) => {
  switch (filterBy) {
    case FilterOptions.Active:
      return todos.filter(todo => !todo.completed);
    case FilterOptions.Completed:
      return todos.filter(todo => todo.completed);
    default:
      return todos;
  }
};

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filterBy, setFilterBy] = useState(FilterOptions.All);
  const filteredTodos = getFilteredTodos(todos, filterBy);
  const uncompletedTodos = todos.filter(todo => !todo.completed);
  const completedTodos = todos.filter(todo => todo.completed);
  const [loadingTodosId, setLoadingTodosId] = useState<number[]>([]);
  const [temporaryTodo, setTemporaryTodo] = useState<Todo | null>(null);
  const [todoTitle, setTodoTitle] = useState('');
  const [errorMasage, setErrorMasage] = useState(Errors.allGood);
  const titleField = useRef<HTMLInputElement>(null);
  const [isDisabled, setIsDisabled] = useState(false);

  const reset = () => {
    setTodoTitle('');
    setErrorMasage(Errors.allGood);
    setTemporaryTodo(null);
    setIsDisabled(false);
    titleField.current?.focus();
  };

  function loadTodos() {
    clientService.getTodos(USER_ID)
      .then(setTodos)
      .catch(() => setErrorMasage(Errors.cantGetArray));
  }

  const addProcessing = (id: number) => {
    setLoadingTodosId(current => [...current, id]);
  };

  const removeProcessing = (idToRemove: number) => {
    setLoadingTodosId(current => current.filter(id => id !== idToRemove));
  };

  function updateTodoOnServer(todoForChange: Todo, changedTodo: Todo) {
    setTodos(currentTodos => {
      const newTodos = [...currentTodos];
      const index = newTodos.findIndex(
        currentTodo => currentTodo.id === changedTodo.id,
      );

      newTodos.splice(index, 1, todoForChange);

      return newTodos;
    });
  }

  const addTodo = (
    title: string, userId: number, completed: boolean,
  ) => {
    setIsDisabled(true);
    setTemporaryTodo({
      title, userId, completed: false, id: 0,
    });
    addProcessing(0);

    clientService.addTodo({ title, userId, completed })
      .then(newTodo => {
        setTodos(currentTodos => {
          return [...currentTodos, newTodo];
        });
        reset();
        removeProcessing(0);
      })
      .catch(() => {
        setErrorMasage(Errors.cantAdd);
        setTemporaryTodo(null);
        setIsDisabled(false);
        setLoadingTodosId([]);
      });
  };

  const updateTodo = (updatedTodo: Todo) => {
    addProcessing(updatedTodo.id);

    return clientService.updateTodo(updatedTodo)
      .catch((e) => {
        setErrorMasage(Errors.cantUpdate);
        removeProcessing(updatedTodo.id);
        throw e;
      })
      .then(todo => {
        updateTodoOnServer(todo, updatedTodo);
        removeProcessing(updatedTodo.id);
      });
  };

  const onDelete = (id: number) => {
    addProcessing(id);

    return clientService.deleteTodo(id)
      .then(() => {
        setTodos((curent) => curent.filter((todo) => todo.id !== id));
        titleField.current?.focus();
        removeProcessing(id);
      })
      .catch((e) => {
        setErrorMasage(Errors.cantDelete);
        removeProcessing(id);
        throw e;
      });
  };

  const onClearCompleted = () => {
    completedTodos.forEach(todo => {
      onDelete(todo.id);
    });
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(loadTodos, [USER_ID]);
  // Error will hide after 3s
  useEffect(() => {
    const timerId = window.setTimeout(() => {
      setErrorMasage(Errors.allGood);
    }, 3000);

    return () => {
      clearTimeout(timerId);
    };
  }, [errorMasage]);
  useEffect(() => {
    if (!isDisabled) {
      titleField.current?.focus();
    }
  }, [isDisabled]);

  const handelErrorHide = () => {
    setErrorMasage(Errors.allGood);
  };

  const handelTitelChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTodoTitle(event.target.value);
  };

  const handelSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!todoTitle.trim()) {
      setErrorMasage(Errors.cantBeEmptyTitle);

      return;
    }

    setErrorMasage(Errors.allGood);
    addTodo(todoTitle.trim(), USER_ID, false);
  };

  const handleToggleAll = () => {
    const isEveryDone = todos.every((td) => td.completed);

    if (isEveryDone) {
      completedTodos.forEach(toggleTodo => {
        addProcessing(toggleTodo.id);

        clientService.updateTodo({
          ...toggleTodo,
          completed: !toggleTodo.completed,
        })
          .catch((e) => {
            removeProcessing(toggleTodo.id);
            setErrorMasage(Errors.cantUpdate);
            throw e;
          })
          .then(todo => {
            updateTodoOnServer(todo, toggleTodo);
            removeProcessing(toggleTodo.id);
          });
      });
    } else {
      uncompletedTodos.forEach(toggleTodo => {
        addProcessing(toggleTodo.id);
        clientService.updateTodo({
          ...toggleTodo,
          completed: true,
        })
          .catch((e) => {
            removeProcessing(toggleTodo.id);
            setErrorMasage(Errors.cantUpdate);
            throw e;
          })
          .then(todo => {
            updateTodoOnServer(todo, toggleTodo);
            removeProcessing(toggleTodo.id);
          });
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
        <header className="todoapp__header">
          {!!todos.length && (
            <button
              type="button"
              className={
                classNames('todoapp__toggle-all',
                  !!todos.every(t => t.completed) && 'active')
              }
              data-cy="ToggleAllButton"
              onClick={handleToggleAll}
            />
          )}

          <form onSubmit={handelSubmit}>
            <input
              data-cy="NewTodoField"
              type="text"
              className="todoapp__new-todo"
              placeholder="What needs to be done?"
              disabled={isDisabled}
              ref={titleField}
              value={todoTitle}
              onChange={handelTitelChange}
            />
          </form>
        </header>

        {!!todos.length && (
          <>
            <TodoList
              todos={filteredTodos}
              onDelete={onDelete}
              temporaryTodo={temporaryTodo}
              onUpdate={updateTodo}
              loadingTodosId={loadingTodosId}
            />
            <footer className="todoapp__footer" data-cy="Footer">
              <span className="todo-count" data-cy="TodosCounter">
                {`${uncompletedTodos.length} items left`}
              </span>

              <TodoFilter changeFilter={setFilterBy} />

              <button
                type="button"
                className="todoapp__clear-completed"
                data-cy="ClearCompletedButton"
                onClick={onClearCompleted}
                disabled={!completedTodos.length}
              >
                Clear completed
              </button>

            </footer>
          </>
        )}

      </div>

      <div
        data-cy="ErrorNotification"
        className={
          classNames('notification is-danger is-light has-text-weight-normal',
            { 'has-text-weight-normal hidden': !errorMasage })
        }
      >
        <button
          data-cy="HideErrorButton"
          type="button"
          className="delete"
          onClick={handelErrorHide}
        />
        {errorMasage}
      </div>

    </div>
  );
};
