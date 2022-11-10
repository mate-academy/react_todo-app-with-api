/* eslint-disable jsx-a11y/control-has-associated-label */
import React, {
  ChangeEvent, FormEvent,
  useCallback,
  useContext, useEffect, useMemo, useRef, useState,
} from 'react';
import cn from 'classnames';
// eslint-disable-next-line import/no-extraneous-dependencies
import { debounce } from 'lodash';
import { AuthContext } from './components/Auth/AuthContext';
import {
  addNewTodo, deleteTodo, getTodos, updateTodo,
} from './api/todos';
import { TodosList } from './components/TodosList';
import { Todo } from './types/Todo';
import { ErrorNotification } from './components/ErrorNotification';

enum FilterBy {
  ALL,
  ACTIVE,
  COMPLETED,
}

export const App: React.FC = () => {
  const user = useContext(AuthContext);
  const newTodoField = useRef<HTMLInputElement>(null);

  const [todos, setTodos] = useState<Todo[]>([]);
  const [visibleTodos, setVisibleTodos] = useState<Todo[]>([]);
  const [selectedFilter, setSelectedFilter] = useState<FilterBy>(FilterBy.ALL);
  const [counter, setCounter] = useState(0);

  const [newTodoTitle, setNewTodoTitle] = useState('');
  const [emptyTitleError, setEmptyTitleError] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [deletingCompletedTodos, setDeletingCompletedTodos] = useState(false);

  const [addingError, setAddingError] = useState(false);
  const [deletingError, setDeletingError] = useState(false);
  const [addingNewTodo, setAddingNewTodo] = useState(false);
  const [updatingError, setUpdatingError] = useState(false);

  const [toggleAll, setToggleAll] = useState(false);

  const increaseCounter = () => {
    setCounter(prevState => prevState + 1);
  };

  const filterTodos = (filterBy: FilterBy) => {
    if (todos) {
      setVisibleTodos(todos.filter((todo: Todo) => {
        switch (filterBy) {
          case FilterBy.ACTIVE:
            return !todo.completed;
          case FilterBy.COMPLETED:
            return todo.completed;
          default:
            return true;
        }
      }));
    }
  };

  const todosLength = () => {
    return todos?.filter(todo => !todo.completed).length || '0';
  };

  const todosCompletedLength = () => {
    return todos?.filter(todo => todo.completed).length;
  };

  const getTodosFromApi = useCallback(async () => {
    try {
      if (user) {
        setIsAdding(true);
        const apiTodos = await getTodos(user.id).then(gotTodos => gotTodos);

        if (apiTodos.length === 0) {
          setTodos([]);
          setVisibleTodos([]);
          setIsAdding(false);

          return;
        }

        setTodos(apiTodos);
        setVisibleTodos(apiTodos);
        setIsAdding(false);
      }
    } catch {
      setAddingError(true);
    }
  }, []);

  const handleFilter = (filterBy: FilterBy) => {
    filterTodos(filterBy);
    setSelectedFilter(filterBy);
  };

  useEffect(() => {
    // focus the element with `ref={newTodoField}`
    if (newTodoField.current) {
      newTodoField.current.focus();
    }

    getTodosFromApi();
  }, [counter]);

  const debounceCallback = useCallback(
    () => {
      setEmptyTitleError(false);
      setAddingError(false);
      setUpdatingError(false);
    }, [],
  );

  const onSetError = useMemo(
    () => debounce(debounceCallback, 3000),
    [],
  );

  const closeError = () => {
    setEmptyTitleError(false);
    setAddingError(false);
    setDeletingError(false);
    setUpdatingError(false);
  };

  const handleOnChangeNewTodoTitle = (event: ChangeEvent<HTMLInputElement>) => {
    setNewTodoTitle(event.target.value);
  };

  const handleOnSubmitNewTodo = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setAddingNewTodo(true);
    if (newTodoTitle.trim() === '') {
      setEmptyTitleError(true);

      return;
    }

    if (user) {
      await addNewTodo({
        userId: user.id,
        title: newTodoTitle,
        completed: false,
      });

      setCounter((prevState) => prevState + 1);
    }

    setNewTodoTitle('');
    setAddingNewTodo(false);
  };

  const onDeleteTodo = async (id: number) => {
    await deleteTodo(id);
    increaseCounter();
  };

  const handleClearCompleted = () => {
    setDeletingCompletedTodos(true);
    todos?.forEach(async (todo) => {
      if (todo.completed) {
        try {
          await deleteTodo(todo.id);
          increaseCounter();
          setDeletingCompletedTodos(false);
        } catch {
          setDeletingError(true);
        }
      }
    });
  };

  const onToggleAll = (newStatus: boolean) => {
    setToggleAll(prevState => !prevState);
    try {
      todos.forEach(async (todo) => {
        await updateTodo({
          ...todo,
          completed: newStatus,
        }, todo.id);
        increaseCounter();
      });
    } catch {
      setUpdatingError(true);
    }
  };

  useEffect(() => {
    filterTodos(selectedFilter);
  }, [todos]);

  useEffect(() => {
    if (todosCompletedLength() === todos.length && todos.length) {
      setToggleAll(true);

      return;
    }

    setToggleAll(false);
  }, [visibleTodos.length !== 0, visibleTodos]);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          <button
            data-cy="ToggleAllButton"
            type="button"
            className={cn('todoapp__toggle-all', {
              active: toggleAll,
              hidden: !visibleTodos,
            })}
            onClick={() => onToggleAll(!toggleAll)}
          />

          <form onSubmit={handleOnSubmitNewTodo}>
            <input
              data-cy="NewTodoField"
              type="text"
              ref={newTodoField}
              className="todoapp__new-todo"
              placeholder="What needs to be done?"
              value={newTodoTitle}
              onChange={handleOnChangeNewTodoTitle}
              disabled={isAdding}
            />
          </form>
        </header>
        {todos.length !== 0 && user && (
          <>
            <TodosList
              todos={visibleTodos}
              onDeleteTodo={onDeleteTodo}
              addingNewTodo={addingNewTodo}
              tempTodo={{
                id: 0,
                userId: user.id,
                title: newTodoTitle,
                completed: false,
              }}
              deletingCompletedTodos={deletingCompletedTodos}
              increaseCounter={increaseCounter}
              setUpdatingError={setUpdatingError}
            />

            <footer className="todoapp__footer" data-cy="Footer">
              <span className="todo-count" data-cy="todosCounter">
                {`${todosLength()} items left`}
              </span>

              <nav className="filter" data-cy="Filter">
                <a
                  data-cy="FilterLinkAll"
                  href="#/"
                  className={cn('filter__link',
                    { selected: selectedFilter === FilterBy.ALL })}
                  onClick={() => handleFilter(FilterBy.ALL)}
                >
                  All
                </a>

                <a
                  data-cy="FilterLinkActive"
                  href="#/active"
                  className={cn('filter__link',
                    { selected: selectedFilter === FilterBy.ACTIVE })}
                  onClick={() => handleFilter(FilterBy.ACTIVE)}
                >
                  Active
                </a>
                <a
                  data-cy="FilterLinkCompleted"
                  href="#/completed"
                  className={cn('filter__link',
                    { selected: selectedFilter === FilterBy.COMPLETED })}
                  onClick={() => handleFilter(FilterBy.COMPLETED)}
                >
                  Completed
                </a>
              </nav>

              <button
                data-cy="ClearCompletedButton"
                type="button"
                className={cn('todoapp__clear-completed', {
                  hidden: todosCompletedLength() === 0,
                })}
                disabled={todosLength() === 0}
                onClick={handleClearCompleted}
              >
                Clear completed
              </button>
            </footer>
          </>
        )}
      </div>

      {(emptyTitleError
        || addingError
        || deletingError
        || updatingError) && (
        <ErrorNotification
          onClose={onSetError}
          closeError={closeError}
          emptyTitleError={emptyTitleError}
          addingError={addingError}
          deletingError={deletingError}
          updatingError={updatingError}
        />
      )}
    </div>
  );
};
