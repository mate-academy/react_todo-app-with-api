import React, { useState, useEffect, useRef } from 'react';
import cn from 'classnames';

import {
  USER_ID,
  createTodo,
  getTodos,
  removeTodo,
  updateTodo,
} from '../api/todos';
import { TodoList } from './TodoList';
import { Footer } from './Footer';
import { Todo } from '../types/Todo';
import { ErrorNotification } from './ErrorNotification';
import { Errors } from '../types/Errors';
import { FilterBy } from '../types/FiilterBy';
import { getFilteredTodos } from '../utils/getFilteredTodos';

export const App: React.FC = () => {
  const inputRef = useRef<HTMLInputElement>(null);

  const [todos, setTodos] = useState<Todo[]>([]);
  const [errorMessage, setErrorMessage] = useState<Errors | null>(null);
  const [filterBy, setFilterBy] = useState(FilterBy.All);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [isDisabled, setIsDisabled] = useState(false);
  const [titleText, setTitleText] = useState('');
  const [changingIDs, setChangingIDs] = useState<number[]>([]);
  const [isEmptyTitleDelete, setIsEmptyTitleDelete] = useState(false);

  const handleEmptyTitleDelete = () => setIsEmptyTitleDelete(true);

  const handleClearingError = () => setErrorMessage(null);

  const handleChangingFilterBy = (value: FilterBy) => setFilterBy(value);

  const prepareToAction = (id: number) => {
    setErrorMessage(null);
    setChangingIDs(curIDs => [...curIDs, id]);
  };

  const visibleTodos = getFilteredTodos(todos, filterBy);

  const activeTodosCount: number = todos.filter(todo => !todo.completed).length;
  const hasCompletedTodo: boolean = todos.some(todo => todo.completed);
  const areAllTodosCompleted: boolean = todos.every(todo => todo.completed);

  const handleSubmit = (event: React.FormEvent) => {
    event?.preventDefault();

    const normalizedTitle = titleText.trim();

    if (!normalizedTitle.trim()) {
      setErrorMessage(Errors.Empty);

      return;
    }

    setIsDisabled(true);

    const newTodo = {
      id: 0,
      title: normalizedTitle,
      userId: USER_ID,
      completed: false,
    };

    setTempTodo(newTodo);

    prepareToAction(newTodo.id);

    createTodo(newTodo)
      .then(createdTodo => {
        setTempTodo(null);
        setTodos(prevTodos => [...prevTodos, createdTodo]);
        setTitleText('');
      })
      .catch(() => {
        setErrorMessage(Errors.Add);
        setTempTodo(null);
      })
      .finally(() => {
        setIsDisabled(false);
        setChangingIDs(curIDs => curIDs.filter(curID => curID !== newTodo.id));
      });
  };

  const handleDeletingTodo = (id: number) => {
    setErrorMessage(null);
    setChangingIDs(curIDs => [...curIDs, id]);

    return removeTodo(id)
      .then(() => {
        setTodos(prevTodos => prevTodos.filter(todo => todo.id !== id));
      })
      .catch(error => {
        setErrorMessage(Errors.Delete);
        throw error;
      })
      .finally(() => {
        setChangingIDs(curIDs => curIDs.filter(curID => curID !== id));
        if (!isEmptyTitleDelete) {
          inputRef.current?.focus();
        }

        setIsEmptyTitleDelete(false);
      });
  };

  const handleClearingCompletedTodos = () => {
    todos.forEach(todo => {
      if (todo.completed) {
        handleDeletingTodo(todo.id);
      }
    });
  };

  const toggleTodo = (id: number, completed: boolean) => {
    prepareToAction(id);

    updateTodo(id, { completed: !completed })
      .then(updatedTodo => {
        setTodos(currentTodos =>
          currentTodos.map(todo =>
            todo.id === updatedTodo.id ? updatedTodo : todo,
          ),
        );
      })
      .catch(() => setErrorMessage(Errors.Update))
      .finally(() =>
        setChangingIDs(curIDs => curIDs.filter(curID => curID !== id)),
      );
  };

  const toggleAllTodos = () => {
    if (activeTodosCount) {
      todos.forEach(todo => {
        if (!todo.completed) {
          toggleTodo(todo.id, todo.completed);
        }
      });
    } else {
      todos.forEach(todo => {
        toggleTodo(todo.id, todo.completed);
      });
    }
  };

  const handleRenameTodo = (id: number, title: string) => {
    prepareToAction(id);

    return updateTodo(id, { title })
      .then(updatedTodo => {
        setTodos(currentTodos =>
          currentTodos.map(todo =>
            todo.id === updatedTodo.id ? updatedTodo : todo,
          ),
        );
      })
      .catch(error => {
        setErrorMessage(Errors.Update);
        throw error;
      })
      .finally(() =>
        setChangingIDs(curIDs => curIDs.filter(curID => curID !== id)),
      );
  };

  useEffect(() => {
    getTodos()
      .then(setTodos)
      .catch(() => {
        setErrorMessage(Errors.Load);
      });
  }, []);

  useEffect(() => {
    if (!errorMessage) {
      return;
    }

    const timerID = setTimeout(() => setErrorMessage(null), 3000);

    return () => clearTimeout(timerID);
  }, [errorMessage, isDisabled]);

  useEffect(() => {
    inputRef.current?.focus();
  }, [tempTodo]);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          {todos.length !== 0 && (
            <button
              data-cy="ToggleAllButton"
              type="button"
              className={cn('todoapp__toggle-all', {
                active: areAllTodosCompleted,
              })}
              onClick={toggleAllTodos}
            />
          )}

          <form onSubmit={event => handleSubmit(event)}>
            <input
              data-cy="NewTodoField"
              type="text"
              disabled={isDisabled}
              ref={inputRef}
              value={titleText}
              className="todoapp__new-todo"
              placeholder="What needs to be done?"
              onChange={event => setTitleText(event.target.value)}
            />
          </form>
        </header>

        {todos.length > 0 && (
          <>
            <TodoList
              todos={visibleTodos}
              tempTodo={tempTodo}
              onDelete={handleDeletingTodo}
              onRename={handleRenameTodo}
              changingIDs={changingIDs}
              onToggle={toggleTodo}
              onEmptyTitleDelete={handleEmptyTitleDelete}
            />

            <Footer
              onFilterClick={handleChangingFilterBy}
              activeTodosCount={activeTodosCount}
              onClearCompleted={handleClearingCompletedTodos}
              selectedFilterBy={filterBy}
              hasCompletedTodo={hasCompletedTodo}
            />
          </>
        )}
      </div>

      <ErrorNotification
        errorMessage={errorMessage}
        onDeleteClick={handleClearingError}
      />
    </div>
  );
};
