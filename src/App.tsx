/* eslint-disable jsx-a11y/control-has-associated-label */
import cn from 'classnames';
import React, {
  useContext, useEffect, useState, useCallback, FormEvent, useMemo,
} from 'react';
import { AuthContext } from './components/Auth/AuthContext';
import { Todo } from './types/Todo';
import {
  getTodos, addTodo, removeTodo, updateTodo,
} from './api/todos';
import { FilterType } from './types/FilterType';
import { Item } from './components/Item';
import { Footer } from './components/Footer';

export const App: React.FC = () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const user = useContext(AuthContext);
  const [todos, setTodos] = useState<Todo[]>([]);
  const [todoTitle, setTodoTitle] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [userId, setUserId] = useState(0);
  const [filterType, setFilterType] = useState(FilterType.All);
  const [toggleValue, setToggleValue] = useState(true);

  const handleError = useCallback(
    (error: string) => {
      setErrorMessage(error);

      setTimeout(() => {
        setErrorMessage('');
      }, 2000);
    },
    [],
  );

  useEffect(() => {
    if (user) {
      setUserId(user.id);
      setErrorMessage('');

      getTodos(user.id)
        .then(response => setTodos(response))
        .catch(handleError);
    }
  }, [user]);

  const handleAddTodo = (event: FormEvent) => {
    event.preventDefault();

    if (todoTitle.trim().length === 0) {
      handleError('Title is empty');

      return;
    }

    addTodo({
      title: todoTitle,
      userId,
      completed: false,
    }).then((newTodo: Todo) => setTodos((prev) => [...prev, newTodo]))
      .catch(() => handleError('Unable to add a todo'))
      .finally(() => {
        setTodoTitle('');
        setErrorMessage('');
      });
  };

  const deleteHandler = useCallback((todoId: number) => {
    removeTodo(todoId)
      .then(() => {
        setTodos(prev => prev.filter(({ id }) => id !== todoId));
      })
      .catch(() => {
        handleError('Unable to delete a todo');
      });
  }, []);

  const handleTodoChange = useCallback(
    (todoId: number, data: Partial<Todo>) => {
      updateTodo(todoId, data)
        .then(updatedTodo => {
          setTodos(prev => (
            prev.map(todo => (todo.id === todoId
              ? updatedTodo
              : todo))
          ));
        })
        .catch(() => handleError('Unable to update a todo'));
    },
    [],
  );

  const handleToggleAll = () => {
    todos.forEach(todo => {
      handleTodoChange(todo.id, { completed: toggleValue });
    });

    setToggleValue(!toggleValue);
  };

  const visibleTodos = useMemo(() => {
    switch (filterType) {
      case FilterType.Active:
        return todos.filter(todo => !todo.completed);
      case FilterType.Completed:
        return todos.filter(todo => todo.completed);
      default:
        return [...todos];
    }
  }, [todos, filterType]);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>
      <header className="todoapp__header">
        {todos.length > 0 && (
          <button
            data-cy="ToggleAllButton"
            type="button"
            className={cn(
              'todoapp__toggle-all',
              {
                active: todos.every(todo => todo.completed),
              },
            )}
            onClick={handleToggleAll}
          />
        )}

        <form onSubmit={(event) => handleAddTodo(event)}>
          <input
            data-cy="NewTodoField"
            type="text"
            className="todoapp__new-todo"
            placeholder="What needs to be done?"
            value={todoTitle}
            onChange={(event) => {
              const { value } = event.target;

              setTodoTitle(value);
            }}
          />
        </form>
      </header>

      {todos.length > 0 && (
        <div className="todoapp__content">
          <section className="todoapp__main" data-cy="TodoList">
            {visibleTodos.map(todo => (
              <Item
                todo={todo}
                deleteHandler={deleteHandler}
                handleUpdate={handleTodoChange}
                key={todo.id}
              />
            ))}
          </section>

          <Footer
            todos={todos}
            filterType={filterType}
            handleFilter={setFilterType}
            handleRemoveTodo={deleteHandler}
          />
        </div>
      )}

      {errorMessage && (
        <div
          data-cy="Notification"
          className="notification is-danger is-light has-text-weight-normal"
        >
          <button
            data-cy="HideErrorButton"
            type="button"
            className="delete"
            onClick={() => handleError('')}
          />
          {errorMessage}
        </div>
      )}
    </div>
  );
};
