/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useState } from 'react';
import { Todo } from './types/Todo';
import { getTodos, deleteTodo, updateTodo } from './api/todos';
import { AppHeader } from './components/app-header';
import { Error } from './components/error';
import { AppFooter } from './components/app-footer';
import { ToDo } from './components/todo';
import { Errors } from './types/errors';
import { FilterKeys } from './types/filters';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [filter, setFilter] = useState<FilterKeys>(FilterKeys.all);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [loadingIds, setLoadingIds] = useState<number[]>([]);
  const inputRef = React.useRef<HTMLInputElement>(null);

  const filteredTodos = todos?.filter(todo => {
    if (filter === FilterKeys.active) {
      return !todo.completed;
    }

    if (filter === FilterKeys.completed) {
      return todo.completed;
    }

    return true;
  });

  const isCompletedTodos = todos?.some(todo => todo.completed);

  const removeTodo = async (id: number) => {
    setLoadingIds(prev => [...prev, id]);
    setError(null);

    try {
      await deleteTodo(id);

      setTodos(prev => (prev ? prev.filter(t => t.id !== id) : null));
    } catch (err) {
      setError(Errors.errorDelete);

      throw err;
    } finally {
      setLoadingIds(prev => prev.filter(itemId => itemId !== id));
      setTimeout(() => inputRef.current?.focus(), 0);
    }
  };

  const onUpdateTodo = async (todoToUpdate: Todo) => {
    const { id, title } = todoToUpdate;

    if (!title.trim()) {
      await removeTodo(id);

      return;
    }

    setLoadingIds(prev => [...prev, todoToUpdate.id]);
    setError(null);

    try {
      const updatedTodo = await updateTodo(todoToUpdate);

      setTodos(prev =>
        prev
          ? prev.map(toDo => (toDo.id === todoToUpdate.id ? updatedTodo : toDo))
          : null,
      );
    } catch (err) {
      setError(Errors.errorUpdate);

      throw err;
    } finally {
      setLoadingIds(prev => prev.filter(itemId => itemId !== todoToUpdate.id));
      setTimeout(() => inputRef.current?.focus(), 0);
    }
  };

  const isAllCompleted = todos?.every(todo => todo.completed);

  const changeAllTodosStatus = async (todosToUpdate: Todo[]) => {
    if (!todosToUpdate.length) {
      return;
    }

    const newStatus = !isAllCompleted;
    const idsToUpdate = todosToUpdate.map(todo => todo.id);

    setLoadingIds(prev => [...prev, ...idsToUpdate]);
    setError(null);

    try {
      const updates = todosToUpdate
        .filter(todo => todo.completed !== newStatus)
        .map(todo => updateTodo({ ...todo, completed: newStatus }));

      await Promise.all(updates);

      setTodos(prev =>
        prev ? prev.map(todo => ({ ...todo, completed: newStatus })) : null,
      );
    } catch {
      setError(Errors.errorUpdate);
    } finally {
      setLoadingIds(prev => prev.filter(id => !idsToUpdate.includes(id)));
    }
  };

  const onClearCompleted = async () => {
    const completedTodos = todos?.filter(todo => todo.completed) || [];

    setError(null);

    await Promise.all(completedTodos.map(todo => removeTodo(todo.id)));
  };

  useEffect(() => {
    setError(null);
    setIsLoading(true);

    getTodos()
      .then(res => setTodos(res))
      .catch(() => setError(Errors.errorLoad))
      .finally(() => setIsLoading(false));
  }, []);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>
      <AppHeader
        setError={setError}
        setTodos={setTodos}
        setTempTodo={setTempTodo}
        inputRef={inputRef}
        onUpdateTodoStatus={changeAllTodosStatus}
        todos={todos}
        isAllCompleted={isAllCompleted}
      />
      <div className="todoapp__content">
        {!isLoading && (
          <section className="todoapp__main" data-cy="TodoList">
            {filteredTodos?.map(todo => (
              <ToDo
                todo={todo}
                key={todo.id}
                onDelete={removeTodo}
                onUpdate={onUpdateTodo}
                isLoading={loadingIds.includes(todo.id)}
              />
            ))}
            {tempTodo && (
              <div
                data-cy="Todo"
                className={`todo ${tempTodo.completed ? 'completed' : ''}`}
              >
                <label
                  className="todo__status-label"
                  htmlFor={`todo-status-${tempTodo.id}`}
                >
                  <input
                    id={`todo-status-${tempTodo.id}`}
                    data-cy="TodoStatus"
                    type="checkbox"
                    className="todo__status"
                    checked={tempTodo.completed}
                    aria-label="Toggle todo status"
                    onChange={() => {}}
                  />
                </label>

                <span data-cy="TodoTitle" className="todo__title">
                  {tempTodo.title}
                </span>

                {/* overlay will cover the todo while it is being deleted or updated */}
                <div data-cy="TodoLoader" className="modal overlay is-active">
                  <div className="modal-background has-background-white-ter" />
                  <div className="loader" />
                </div>
              </div>
            )}
          </section>
        )}

        {/* Hide the footer if there are no todos */}
        {!!todos?.length && (
          <AppFooter
            todos={todos}
            filter={filter}
            setFilter={setFilter}
            onClearCompleted={onClearCompleted}
            isCompletedTodos={isCompletedTodos}
          />
        )}
      </div>

      <Error error={error} setError={setError} />
    </div>
  );
};
