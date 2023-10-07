/* eslint-disable max-len */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, {
  useContext, useEffect, useState,
} from 'react';
import classNames from 'classnames';

import { Filter } from '../types/Filter';
import { TodosFilter } from '../components/TodosFilter/TodosFilter';
import { TodosList } from '../components/TodosList/TodosList';
import { TodosContext } from '../TodosContext';
import { USER_ID } from '../utils/userId';
import { addTodos, deleteTodo, updateTodo } from '../api/todos';
import { Todo } from '../types/Todo';

export const TodoApp: React.FC = () => {
  const {
    todos,
    setTodos,
    errorMessage,
    setErrorMessage,
    errorDiv,
    inputTitle,
    tempTodo,
    setTempTodo,
  } = useContext(TodosContext);
  const [title, setTitle] = useState('');
  const [filter, setFilter] = useState(Filter.ALL);
  const [isDeleteCompleted, setIsDeleteCompleted] = useState(false);
  const [toggleCompletedArray, setToggleCompletedArray] = useState<number[]>([]);

  const noCompleteTodos = todos.filter(elem => !elem.completed);
  const completeTodos = todos.filter(elem => elem.completed);
  const isSomeComplete = todos.some(todo => todo.completed === true);
  const allCompleted = todos.every(todo => todo.completed === true);

  useEffect(() => {
    if (inputTitle.current !== null) {
      inputTitle.current.focus();
    }
  }, []);

  const handlerFilterChange = (newFilter: string) => {
    setFilter(newFilter);
  };

  const handlerChangeTitle = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value);
  };

  const handlerAddTodo = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (title.trim() !== '') {
      const newTask = {
        userId: USER_ID,
        title: title.trim(),
        completed: false,
      };

      if (inputTitle.current !== null) {
        inputTitle.current.disabled = true;
      }

      setTempTodo({
        ...newTask,
        id: 0,
      });
      addTodos(newTask)
        .then(newTodo => {
          setTitle('');
          setTodos((prevTodos) => [...prevTodos, newTodo]);
        })
        .catch(() => {
          setErrorMessage('Unable to add a todo');
          setTempTodo(null);
          if (errorDiv.current !== null) {
            errorDiv.current.classList.remove('hidden');
            setTimeout(() => {
              if (errorDiv.current !== null) {
                errorDiv.current.classList.add('hidden');
                setErrorMessage('');
              }
            }, 3000);
          }
        })
        .finally(() => {
          if (inputTitle.current !== null) {
            inputTitle.current.disabled = false;
            inputTitle.current.focus();
          }

          setTempTodo(null);
        });
    } else {
      setErrorMessage('Title should not be empty');
      if (errorDiv.current !== null) {
        errorDiv.current.classList.remove('hidden');
        setTimeout(() => {
          if (errorDiv.current !== null) {
            errorDiv.current.classList.add('hidden');
            setErrorMessage('');
          }
        }, 3000);
      }
    }
  };

  const handlerCompleteAll = () => {
    todos.forEach((eachTodo) => {
      if (allCompleted) {
        setToggleCompletedArray([-1]);
        updateTodo({ ...eachTodo, completed: false })
          .then(() => {
            setTodos((currentTodos: Todo[]) => currentTodos
              .map(elem => ({ ...elem, completed: false })));
          })
          .catch(() => {
            setErrorMessage('Unable to update a todo');
            if (errorDiv.current !== null) {
              errorDiv.current.classList.remove('hidden');
              setTimeout(() => {
                if (errorDiv.current !== null) {
                  errorDiv.current.classList.add('hidden');
                  setErrorMessage('');
                }
              }, 3000);
            }
          })
          .finally(() => setToggleCompletedArray([]));
      } else if (!eachTodo.completed) {
        setToggleCompletedArray(currentIds => [...currentIds, eachTodo.id]);
        updateTodo({ ...eachTodo, completed: true })
          .then(() => {
            setTodos((currentTodos: Todo[]) => currentTodos
              .map(elem => ({ ...elem, completed: true })));
          })
          .catch(() => {
            setErrorMessage('Unable to update a todo');
            if (errorDiv.current !== null) {
              errorDiv.current.classList.remove('hidden');
              setTimeout(() => {
                if (errorDiv.current !== null) {
                  errorDiv.current.classList.add('hidden');
                  setErrorMessage('');
                }
              }, 3000);
            }
          })
          .finally(() => setToggleCompletedArray([]));
      }
    });
    if (todos.some(todo => todo.completed === false)) {
      const updatedTodos = todos.map((todo) => ({
        ...todo,
        completed: true,
      }));

      setTodos(updatedTodos);
    } else {
      const updatedTodos = todos.map((todo) => ({
        ...todo,
        completed: false,
      }));

      setTodos(updatedTodos);
    }
  };

  const handlerClearCompletes = () => {
    completeTodos.forEach((eachTodo) => {
      setIsDeleteCompleted(true);

      deleteTodo(eachTodo.id)
        .then(() => {
          setTodos((currentTodos: Todo[]) => currentTodos
            .filter(elem => elem.id !== eachTodo.id));
        })
        .catch(() => {
          setErrorMessage('Unable to delete a todo');
          if (errorDiv.current !== null) {
            errorDiv.current.classList.remove('hidden');
            setTimeout(() => {
              if (errorDiv.current !== null) {
                errorDiv.current.classList.add('hidden');
                setErrorMessage('');
              }
            }, 3000);
          }
        })
        .finally(() => {
          setIsDeleteCompleted(false);
          if (inputTitle.current !== null) {
            inputTitle.current.focus();
          }
        });
    });
  };

  const filteredTodos = todos.filter((todo) => {
    if (filter === Filter.ALL) {
      return true;
    }

    if (filter === Filter.ACTIVE) {
      return !todo.completed;
    }

    return todo.completed;
  });

  const handlerCloseError = () => {
    if (errorDiv.current !== null) {
      errorDiv.current.classList.add('hidden');
      setErrorMessage('');
    }
  };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          {todos.length !== 0 && (
            <button
              type="button"
              className={classNames('todoapp__toggle-all', {
                active: allCompleted,
              })}
              data-cy="ToggleAllButton"
              onClick={handlerCompleteAll}
            />
          )}

          {/* Add a todo on form submit */}
          <form onSubmit={handlerAddTodo}>
            <input
              ref={inputTitle}
              data-cy="NewTodoField"
              type="text"
              className="todoapp__new-todo"
              placeholder="What needs to be done?"
              value={title}
              onChange={handlerChangeTitle}
            />
          </form>
        </header>

        {(todos.length !== 0 || tempTodo !== null) && (
          <TodosList
            todos={filteredTodos}
            isDeleting={isDeleteCompleted}
            ToggleComplete={toggleCompletedArray}
          />
        )}

        {(todos.length !== 0 || tempTodo !== null) && (
          <footer className="todoapp__footer" data-cy="Footer">
            <span className="todo-count" data-cy="TodosCounter">
              {`${noCompleteTodos.length} items left`}
            </span>

            <TodosFilter
              currentFilter={filter}
              onFilterChange={handlerFilterChange}
            />

            {/* don't show this button if there are no completed todos */}
            <button
              type="button"
              className="todoapp__clear-completed"
              data-cy="ClearCompletedButton"
              disabled={!isSomeComplete}
              onClick={handlerClearCompletes}
            >
              Clear completed
            </button>
          </footer>
        )}
      </div>

      {/* Notification is shown in case of any error */}
      {/* Add the 'hidden' class to hide the message smoothly */}
      <div
        ref={errorDiv}
        data-cy="ErrorNotification"
        className="hidden notification
          is-danger is-light has-text-weight-normal"
      >
        <button
          data-cy="HideErrorButton"
          type="button"
          className="delete"
          onClick={handlerCloseError}
        />
        {/* show only one message at a time */}
        {errorMessage}
        {/* <br />
        Unable to add a todo
        <br />
        Unable to update a todo */}
      </div>

    </div>

  );
};
