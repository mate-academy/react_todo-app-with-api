/* eslint-disable @typescript-eslint/indent */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, {
  useCallback, useEffect, useMemo, useState,
} from 'react';
import cn from 'classnames';
import { TodoList } from './components/TodoList';
import { FooterFilter } from './components/FooterFilter';
import { Filter } from './types/Filter';
import {
 getTodos, deleteTodo, addTodos, updateTodo,
} from './api/todos';
import { Todo } from './types/Todo';
import { Errors } from './types/Errors';

const USER_ID = 11551;

export const App: React.FC = () => {
  const [filter, setFilter] = useState<Filter>('all');
  const [todos, setTodos] = useState<Todo[]>([]);
  const [error, setError] = useState<Errors | null>(null);
  const [title, setTitle] = useState<string>('');
  const [tempTodo, setTempTodo] = useState<null | Todo>(null);
  const [deletedTodoId, setDeletedTodoId] = useState<number | null>(null);
  const [deletedTodosId, setDeletedTodosId] = useState<number[]>([]);
  const [isAddingTodo, setIsAddingTodo] = useState<boolean>(false);

  const fetchData = useMemo(() => async () => {
    try {
      const fetchTodos = await getTodos(USER_ID);

      setTodos(fetchTodos);
    } catch (e) {
      setError(Errors.load);
      setTimeout(() => setError(null), 3000);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleFilter = useCallback((newFilter: Filter) => {
    setFilter(newFilter);
  }, []);

  const handleRemove = useCallback(async (todoId: number) => {
    try {
      setDeletedTodoId(todoId);
      await deleteTodo(todoId);

      setTodos(prevTodos => prevTodos.filter(todo => todo.id !== todoId));
    } catch {
      setError(Errors.delete);
    }
  }, []);

  const onSubmit = useCallback(async () => {
    try {
      setIsAddingTodo(true);

      if (!title.trim()) {
        setError(Errors.noTitle);
        setTimeout(() => {
          setError(null);
        }, 3000);

        return;
      }

      const trimmedTitle = title.trim();

      const temporaryTodo = {
        id: +(new Date()),
        title: trimmedTitle,
        userId: USER_ID,
        completed: false,
      };

      setTempTodo(temporaryTodo);

      const response = await addTodos({
        title: trimmedTitle,
        userId: USER_ID,
        completed: false,
      });

      setTitle('');
      setTempTodo(null);
      if (tempTodo !== null) {
        setTempTodo(response);
      } else {
        setTodos(prevTodos => [...prevTodos, response]);
      }

      setIsAddingTodo(false);
    } catch {
      setError(Errors.add);
      setTimeout(() => {
        setError(null);
      }, 3000);
      setTempTodo(null);
      setIsAddingTodo(false);
    }
  }, [title, tempTodo, setTempTodo, setError, error]);

  const handleSubmit: React.FormEventHandler = useCallback((event) => {
    event.preventDefault();

    onSubmit();
  }, [onSubmit]);

  const handleToggleCompleted = (id: number) => {
    const selectedTodo = todos.find(todo => todo.id === id);

    if (selectedTodo) {
      updateTodo(id, {
        completed: !selectedTodo.completed,
      })
        .then(() => {
          const updatedTodos = todos.map(todo => {
            if (todo.id === id) {
              return {
                ...todo,
                completed: !selectedTodo.completed,
              };
            }

            return todo;
          });

          setTodos(updatedTodos);
        })
        .catch(() => {
          setError(Errors.update);
          setTimeout(() => {
            setError(null);
          }, 3000);
        });
    }
  };

  const handleToggleAll = () => {
    let todosCopy = todos;

    if (todos.some((t) => !t.completed)) {
      todosCopy = todos.map((t) => ({
        ...t,
        completed: true,
      }));
    } else {
      todosCopy = todos.map((t) => ({
        ...t,
        completed: !t.completed,
      }));
    }

    setTodos(todosCopy);
  };

  const handleClearCompleted = () => {
    const filterCompleted = todos.filter(todo => todo.completed);
    const deletedTodos: number[] = [];
    const todosIdList = filterCompleted.map(todo => todo.id);

    setDeletedTodosId(todosIdList);

    for (let i = 0; i < filterCompleted.length; i += 1) {
      deleteTodo(filterCompleted[i].id)
        .then(() => {
          deletedTodos.push(filterCompleted[i].id);
        })
        .catch(() => {
          setError(Errors.delete);
          setTimeout(() => setError(null), 3000);
        })
        .finally(() => {
          setDeletedTodosId([]);
          const updatedValues = todos
            .filter(todo => !deletedTodos.includes(todo.id));

          setTodos(updatedValues);
        });
    }
  };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          {todos.length > 0
            && (
              <button
                type="button"
                className="todoapp__toggle-all active"
                data-cy="ToggleAllButton"
                onClick={handleToggleAll}
              />
            )}
          <form onSubmit={handleSubmit}>
            <input
              data-cy="NewTodoField"
              type="text"
              className="todoapp__new-todo"
              placeholder="What needs to be done?"
              // eslint-disable-next-line jsx-a11y/no-autofocus
              ref={input => input && input.focus()}
              disabled={tempTodo !== null}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </form>
        </header>

        {todos
        && (
        <TodoList
          filter={filter}
          todos={todos}
          handleRemove={handleRemove}
          tempTodo={tempTodo}
          deletedTodoId={deletedTodoId}
          deletedTodosId={deletedTodosId}
          isAddingTodo={isAddingTodo}
          handleToggleCompleted={handleToggleCompleted}
          setError={setError}
          onSubmit={onSubmit}
        />
)}

        {todos.length !== 0
          && (
            <FooterFilter
              handleFilter={handleFilter}
              todos={todos}
              handleClearCompleted={handleClearCompleted}
            />
          )}

      </div>

      <div
        data-cy="ErrorNotification"
        className={cn('notification is-danger is-light has-text-weight-normal',
          { hidden: error === null })}
      >
        {error
          && (
            <button
              data-cy="HideErrorButton"
              type="button"
              className="delete"
              onClick={() => setError(null)}
            />
          )}
        {error}
      </div>
    </div>
  );
};

export default React.memo(App);
