/* eslint-disable jsx-a11y/control-has-associated-label */
import React, {
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';

import cn from 'classnames';
import {
  addTodo, getTodos, removeTodo, updateTodo,
} from './api/todos';

import { AuthContext } from './components/Auth/AuthContext';
import { TodoList } from './components/Auth/TodoList';
import { FilterType, Todo } from './types/Todo';
import { TodoFooter } from './components/Auth/TodoFooter';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [todoTitle, setTodoTitle] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [isAddingError, setIsAddingError] = useState(false);
  const [isDeletingError, setIsDeletingAddingError] = useState(false);
  const [isUpdatingError, setIsUpdatingError] = useState(false);
  const [emptyQueryError, setEmptyQueryError] = useState(false);
  const [
    filteredTodos,
    setFilteredTodos,
  ] = useState(FilterType.ALL);
  const [toggleAll, setToggleAll] = useState(true);
  const [toggleLoader, setToggleLoader] = useState(false);
  const [selectedId, setSelectedId] = useState(0);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const user = useContext(AuthContext);
  const newTodoField = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (newTodoField.current) {
      newTodoField.current.focus();
    }
  }, []);

  useEffect(() => {
    if (user) {
      getTodos(user.id)
        .then(setTodos);
    }
  }, []);

  if (isError) {
    setTimeout(() => {
      setIsError(false);
    }, 3000);
  }

  const handleAddTodo = () => {
    setIsLoading(true);

    if (todoTitle === '') {
      setIsAddingError(false);
      setIsError(true);
      setEmptyQueryError(true);
    }

    if (user && todoTitle !== '') {
      addTodo({
        userId: user.id,
        title: todoTitle,
        completed: false,
      })
        .then((newTodo: Todo) => {
          setTodos((prev) => [...prev, newTodo]);
          setSelectedId(newTodo.id);
        })
        .catch(() => {
          setIsError(true);
          setEmptyQueryError(false);
          setIsUpdatingError(false);
          setIsDeletingAddingError(false);
          setIsAddingError(true);
        })
        .finally(() => {
          setTodoTitle('');
          setIsLoading(false);
          setToggleLoader(false);
        });
    }
  };

  const handleDeleteTodo = (todoId: number) => {
    setIsLoading(true);
    setSelectedId(todoId);

    removeTodo(todoId)
      .then(() => setTodos((prev: Todo[]) => prev
        .filter(todo => todo.id !== todoId)))
      .catch(() => {
        setIsError(true);
        setEmptyQueryError(false);
        setIsAddingError(false);
        setIsUpdatingError(false);
        setIsDeletingAddingError(true);
      })
      .finally(() => setIsLoading(false));
  };

  const handleUpdateTodo = (todoId: number, data: Partial<Todo>) => {
    setSelectedId(todoId);
    setIsLoading(true);

    updateTodo(todoId, data)
      .then(updatedTodo => {
        setTodos(prev => prev
          .map(todo => (todo.id === todoId
            ? updatedTodo
            : todo)));
      })
      .catch(() => {
        setIsError(true);
        setEmptyQueryError(false);
        setIsAddingError(false);
        setIsDeletingAddingError(false);
        setIsUpdatingError(true);
      })
      .finally(() => {
        setIsLoading(false);
        setToggleLoader(false);
      });
  };

  let visibleTodos = [...todos];

  switch (filteredTodos) {
    case (FilterType.ACTIVE):
      visibleTodos = [...todos].filter(el => el.completed === false);
      break;

    case FilterType.COMPLETED:
      visibleTodos = [...todos].filter(el => el.completed === true);
      break;

    default:
      visibleTodos = [...todos];
  }

  const handlerToggler = () => {
    setToggleAll(!toggleAll);
    setToggleLoader(true);

    return visibleTodos
      .forEach(el => handleUpdateTodo(el.id, { completed: toggleAll }));
  };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          {visibleTodos.length > 0 && (
            <button
              data-cy="ToggleAllButton"
              type="button"
              className={cn(
                'todoapp__toggle-all',
                {
                  active: todos.every(todo => todo.completed),
                },
              )}
              onClick={() => handlerToggler()}
            />
          )}

          <form onSubmit={(event) => {
            event.preventDefault();
            handleAddTodo();
          }}
          >
            <input
              value={todoTitle}
              data-cy="NewTodoField"
              type="text"
              ref={newTodoField}
              className="todoapp__new-todo"
              placeholder="What needs to be done?"
              onChange={event => setTodoTitle(event.target.value)}
            />
          </form>
        </header>

        <TodoList
          todos={visibleTodos}
          handleDeleteTodo={handleDeleteTodo}
          handleUpdateTodo={handleUpdateTodo}
          isLoading={isLoading}
          selectedId={selectedId}
          toggleLoader={toggleLoader}
        />

        {todos.length > 0 && (
          <TodoFooter
            todos={todos}
            setFilteredTodos={setFilteredTodos}
            handleDeleteTodo={handleDeleteTodo}
          />
        )}
      </div>

      {isError && (
        <div
          data-cy="ErrorNotification"
          className="notification is-danger is-light has-text-weight-normal"
        >
          <button
            data-cy="HideErrorButton"
            type="button"
            className="delete"
            onClick={() => setIsError(false)}
          />
          {emptyQueryError && 'Title can`t be empty'}
          {isDeletingError && 'Unable to delete a todo'}
          {isAddingError && 'Unable to add a todo'}
          {isUpdatingError && 'Unable to update a todo'}
        </div>
      )}

    </div>
  );
};
