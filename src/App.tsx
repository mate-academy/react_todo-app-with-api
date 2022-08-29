/* eslint-disable jsx-a11y/control-has-associated-label */
import React, {
  FormEvent, useCallback,
  useContext, useEffect, useMemo, useState,
} from 'react';
import classNames from 'classnames';
import { AuthContext } from './components/Auth/AuthContext';
import {
  addTodo,
  getTodos, removeTodoById,
  updateTodoById,
} from './api/todos';
import { TodoItem } from './components/TodoItem';
import { TodoFooter } from './components/TodoFooter';
import { Notification } from './components/Notification';
import { Todo, TodoUpdateFields } from './types/Todo';
import { FilterType } from './types/FilterType';

import './styles/index.scss';
import { useParams } from 'react-router-dom';

export const App: React.FC = () => {
  const user = useContext(AuthContext);
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodoTitle, setNewTodoTitle] = useState('');
  const [userId, setUserId] = useState(0);
  const [errorMessage, setErrorMessage] = useState('');
  const [loadingIds, setLoadingIds] = useState<number[]>([]);
  const { filterType } = useParams()


  const handleError = useCallback(
    (er: string) => {
      setErrorMessage(er);

      setTimeout(() => {
        setErrorMessage('');
      }, 3000);
    },
    [],
  );

  useEffect(() => {
    if (user) {
      setUserId(user.id);
      setErrorMessage('');

      getTodos(user.id)
        .then(setTodos)
        .catch(handleError);
    }
  }, [user]);

  const handleAddTodo = (event: FormEvent) => {
    event.preventDefault();

    if (!newTodoTitle.trim()) {
      handleError('Title can\'t be empty');

      return;
    }

    addTodo({
      title: newTodoTitle,
      userId,
      completed: false,
    }).then((newTodo: Todo) => setTodos((prev) => [...prev, newTodo]))
      .catch(() => handleError('Unable to add a todo'))
      .finally(() => setNewTodoTitle(''));
  };

  const handleRemoveTodo = useCallback(
    (todoId: number) => {
      setLoadingIds(prev => [...prev, todoId]);

      removeTodoById(todoId)
        .then(() => setTodos(prev => prev.filter(({ id }) => id !== todoId)))
        .catch(() => handleError('Unable to delete a todo'))
        .finally(() => setLoadingIds(prev => prev.filter(el => el !== todoId)));
    },
    [],
  );

  const handleTodoChange = useCallback(
    (todoId: number, data: TodoUpdateFields) => {
      setLoadingIds(prev => [...prev, todoId]);

      updateTodoById(todoId, data)
        .then(updatedTodo => {
          setTodos(prev => (
            prev.map(todo => (todo.id === todoId ? updatedTodo : todo))
          ));
        })
        .catch(() => handleError('Unable to update a todo'))
        .finally(() => setLoadingIds(prev => prev.filter(el => el !== todoId)));
    },
    [],
  );

  const handleToggleAll = () => {
    const newCompleted = todos.some(({ completed }) => !completed);
    const idsForUpdate: number[] = [];

    todos.forEach(todo => {
      if (todo.completed !== newCompleted) {
        idsForUpdate.push(todo.id);
        // handleTodoChange(todo.id, { completed: newCompleted });
      }
    });

    setLoadingIds(prev => [...prev, ...idsForUpdate]);
    const requests = idsForUpdate.map(id => (
      updateTodoById(id, { completed: newCompleted })
    ));

    Promise.all(requests)
      .then((res) => setTodos(prev => (
        [...prev.filter(todo => !idsForUpdate.includes(todo.id)), ...res]
      )))
      .catch(() => handleError('Unable to update todos'))
      .finally(() => setLoadingIds(prev => (
        prev.filter(id => loadingIds.includes(id)))));
  };

  const isAllCompleted = useMemo(() => (
    todos.every(el => el.completed)
  ), [todos]);

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
            className={classNames(
              'todoapp__toggle-all',
              { active: isAllCompleted },
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
            value={newTodoTitle}
            onChange={(event) => setNewTodoTitle(event.target.value)}
          />
        </form>
      </header>

      {todos.length > 0 && (
        <div className="todoapp__content">
          <section className="todoapp__main" data-cy="TodoList">
            {visibleTodos.map(todo => (
              <TodoItem
                key={todo.id}
                todo={todo}
                handleRemoveTodo={handleRemoveTodo}
                handleUpdate={handleTodoChange}
                isLoading={loadingIds.includes(todo.id)}
              />
            ))}
          </section>

          <TodoFooter
            todos={todos}
            setTodos={setTodos}
            handleError={handleError}
            setLoadingIds={setLoadingIds}
          />
        </div>
      )}

      {errorMessage && (
        <Notification message={errorMessage} setMessage={setErrorMessage} />
      )}
    </div>
  );
};
