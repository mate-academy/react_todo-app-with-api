/* eslint-disable max-len */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useRef, useState } from 'react';
import classNames from 'classnames';
import { UserWarning } from './UserWarning';
import { Todo } from './types/Todo';
import { FilterOptions } from './types/FilterOptions';
import { Errors } from './types/Errors';
import { TodoList } from './components/TodoList';
import { TodoFilter } from './components/TodoFilter';
import * as clientService from './api/todos';

const USER_ID = 44;
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
  const [errorMasage, setErrorMasage] = useState(Errors.noError);
  const [filterBy, setFilterBy] = useState(FilterOptions.All);
  const filteredTodos = getFilteredTodos(todos, filterBy);
  const uncompletedTodos = todos.filter(todo => !todo.completed);
  const completedTodos = todos.filter(todo => todo.completed);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [todoTitle, setTodoTitle] = useState('');
  const titleField = useRef<HTMLInputElement>(null);
  const [isDisabled, setIsDisabled] = useState(false);

  const reset = () => {
    setTodoTitle('');
    setIsDisabled(false);
    setTempTodo(null);
    setErrorMasage(Errors.noError);
  };

  const handleErrorHide = () => {
    setErrorMasage(Errors.noError);
  };

  function loadTodos() {
    clientService.getTodos(USER_ID)
      .then(setTodos)
      .catch(() => setErrorMasage(Errors.cantGetArray));
  }

  const addTodo = (title: string, userId: number, completed: boolean) => {
    setIsDisabled(true);
    setTempTodo({
      title,
      userId,
      completed: false,
      id: 0,
    });

    clientService.addTodos({ title, userId, completed })
      .then(newTodo => setTodos(currentTodos => {
        return [...currentTodos, newTodo];
      }))
      .catch(error => {
        setIsDisabled(false);
        setTempTodo(null);
        setErrorMasage(Errors.cantAdd);
        throw error;
      })
      .then(() => {
        reset();
      });
  };

  const deleteTodo = (id: number) => {
    return clientService.deleteTodos(id)
      .then(() => {
        setTodos(todos.filter(todo => todo.id !== id));
      })
      .catch(error => {
        setErrorMasage(Errors.cantDelete);
        throw error;
      });
  };

  const onClearCompleted = () => {
    todos.filter(todo => todo.completed).map(todo => (
      deleteTodo(todo.id)
        .catch((error) => {
          throw error;
        })
        .then(() => {
          setTodos(uncompletedTodos);
        })
    ));
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => loadTodos(), [USER_ID]);

  useEffect(() => {
    titleField.current?.focus();
    const timerId = window.setTimeout(() => {
      setErrorMasage(Errors.noError);
    }, 3000);

    return () => {
      clearTimeout(timerId);
    };
  }, [errorMasage, todos]);

  const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTodoTitle(event.target.value);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!todoTitle.trim()) {
      setErrorMasage(Errors.cantBeEmptyTitle);

      return;
    }

    setErrorMasage(Errors.noError);
    addTodo(todoTitle.trim(), USER_ID, false);
  };

  const handleTodoUpdate = (updatedTodo: Todo) => {
    return clientService.updateTodo(updatedTodo)
      .catch(error => {
        setErrorMasage(Errors.cantUpdate);
        throw error;
      })
      .then(todo => {
        setTodos(currentTodos => {
          const newTodos = [...currentTodos];
          const index = newTodos.findIndex(tdo => tdo.id === updatedTodo.id);

          newTodos.splice(index, 1, todo);

          return newTodos;
        });
      });
  };

  const toggleAll = () => {
    const allCompleted = uncompletedTodos.length === 0;
    const todosToToggle = allCompleted ? completedTodos : uncompletedTodos;

    todosToToggle.forEach(todo => {
      handleTodoUpdate({ ...todo, completed: !allCompleted }).catch(() => {});
    });
  };

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          {/* this buttons is active only if there are some active todos */}
          {!!todos.length && (
            <button
              type="button"
              className={
                classNames('todoapp__toggle-all', { active: !!todos.every(t => t.completed) })
              }
              data-cy="ToggleAllButton"
              onClick={toggleAll}
            />
          )}

          {/* Add a todo on form submit */}
          <form onSubmit={handleSubmit}>
            <input
              data-cy="NewTodoField"
              type="text"
              className="todoapp__new-todo"
              placeholder="What needs to be done?"
              disabled={isDisabled}
              ref={titleField}
              value={todoTitle}
              onChange={handleTitleChange}
            />
          </form>
        </header>

        {!!todos.length && (
          <>
            <TodoList
              todos={filteredTodos}
              deleteTodo={deleteTodo}
              tempTodo={tempTodo}
              onUpdateTodo={handleTodoUpdate}
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
                disabled={completedTodos.length === 0}
              >
                Clear completed
              </button>

            </footer>
          </>
        )}
      </div>
      <div
        data-cy="ErrorNotification"
        className={classNames('notification is-danger is-light has-text-weight-normal', {
          hidden: !errorMasage,
        })}
      >
        <button
          data-cy="HideErrorButton"
          type="button"
          className="delete"
          onClick={handleErrorHide}
        />
        {errorMasage}
      </div>
    </div>
  );
};
