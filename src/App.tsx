import React, { useEffect, useState, useRef, FormEvent } from 'react';
import {
  addTodo,
  deleteTodo,
  getTodos,
  updateTodo,
  USER_ID,
} from './api/todos';
import { Todo } from './types/Todo';
import { Footer as TodoFooter } from './components/Footer';
import { Filter } from './types/Filter';
import { errorMessages, ErrorMessages } from './types/ErrorMessages';
import { getFilteredTodos } from './utils/getFilteredTodos';
import { UserWarning } from './UserWarning';
import cn from 'classnames';
import { TodoList } from './components/TodoList';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [error, setError] = useState<ErrorMessages | null>(null);
  const [isLoading, setIsLoading] = useState<number[]>([]);
  const [title, setTitle] = useState<string>('');
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [filter, setFilter] = useState<Filter>(Filter.all);

  const filteredTodos = getFilteredTodos(todos, { status: filter });
  const activeTodos = todos.filter(todo => !todo.completed);
  const completedTodos = todos.filter(todo => todo.completed);

  useEffect(() => {
    getTodos()
      .then(setTodos)
      .catch(() => setError(errorMessages.load))
      .finally(() => {
        inputRef.current?.focus();
      });
  }, []);

  useEffect(() => {
    if (!error) {
      return;
    }

    const timerId = setTimeout(() => setError(null), 3000);

    return () => clearTimeout(timerId);
  }, [error]);

  const handleAddTodo = (event: FormEvent) => {
    event.preventDefault();

    if (!title) {
      setError(errorMessages.title);

      return;
    }

    if (inputRef.current) {
      inputRef.current.disabled = true;
    }

    const newTodo: Omit<Todo, 'id'> = {
      title: title.trim(),
      userId: USER_ID,
      completed: false,
    };

    setTempTodo({
      id: 0,
      ...newTodo,
    });

    setIsLoading(curr => [...curr, 0]);

    addTodo(newTodo)
      .then(newTodoFromServer => {
        setTodos(currentTodos => [...currentTodos, newTodoFromServer]);
        setTitle('');
      })
      .catch(() => {
        setError(errorMessages.add);
      })
      .finally(() => {
        if (inputRef.current) {
          inputRef.current.disabled = false;
          inputRef.current.focus();
        }

        setTempTodo(null);
        setIsLoading(curr => curr.filter(todoId => todoId !== 0));
      });
  };

  const handleDeleteTodo = async (todoId: number) => {
    setIsLoading(curr => [...curr, todoId]);

    return deleteTodo(todoId)
      .then(() =>
        setTodos(currentTodos =>
          currentTodos.filter(todo => todo.id !== todoId),
        ),
      )
      .catch(() => {
        setError(errorMessages.delete);
        throw new Error('not deleted');
      })
      .finally(() => {
        setIsLoading(curr => curr.filter(delTodoId => delTodoId !== todoId));
        inputRef.current?.focus();
      });
  };

  const handleTodoStatusChange = async (todo: Todo) => {
    setIsLoading(curr => [...curr, todo.id]);

    try {
      const updatedTodo = await updateTodo({
        ...todo,
        completed: !todo.completed,
      });

      setTodos(curr =>
        curr.map(t => (t.id === updatedTodo.id ? updatedTodo : t)),
      );
    } catch {
      setError(errorMessages.update);
    } finally {
      setIsLoading(curr => curr.filter(id => id !== todo.id));
    }
  };

  const handleTodoStatusChangeAll = async () => {
    const todosToToggle = activeTodos.length ? activeTodos : completedTodos;

    await Promise.allSettled(todosToToggle.map(handleTodoStatusChange));
  };

  const handleClearCompleted = async () => {
    const completedIds = completedTodos.map(todo => todo.id);

    await Promise.all(completedIds.map(handleDeleteTodo));
  };

  if (!USER_ID) {
    return <UserWarning />;
  }

  const handleRenameTodo = async (todo: Todo) => {
    setIsLoading(curr => [...curr, todo.id]);

    try {
      const updatedTodo = await updateTodo({ ...todo });

      setTodos(curr =>
        curr.map(t => (t.id === updatedTodo.id ? updatedTodo : t)),
      );

      return updatedTodo.title;
    } catch {
      setError(errorMessages.update);
      throw new Error('Failed to update todo');
    } finally {
      setIsLoading(curr => curr.filter(id => id !== todo.id));
    }
  };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          {!!todos.length && (
            <button
              type="button"
              className={cn('todoapp__toggle-all', {
                active: activeTodos.length === 0,
              })}
              data-cy="ToggleAllButton"
              onClick={handleTodoStatusChangeAll}
            />
          )}

          <form onSubmit={handleAddTodo}>
            <input
              ref={inputRef}
              value={title}
              onChange={event => setTitle(event.target.value.trimStart())}
              data-cy="NewTodoField"
              type="text"
              className="todoapp__new-todo"
              placeholder="What needs to be done?"
            />
          </form>
        </header>

        <section className="todoapp__main" data-cy="TodoList">
          <TodoList
            todos={filteredTodos}
            tempTodo={tempTodo}
            onRemoveTodo={handleDeleteTodo}
            onToggleTodoCompletion={handleTodoStatusChange}
            onUpdateTodoTitle={handleRenameTodo}
            isLoading={isLoading}
          />
        </section>

        {!!todos.length && (
          <TodoFooter
            filter={filter}
            setFilter={setFilter}
            activeCount={activeTodos.length}
            completedCount={completedTodos.length}
            onClearCompleted={handleClearCompleted}
          />
        )}
      </div>

      <div
        data-cy="ErrorNotification"
        className={cn(
          'notification is-danger is-light has-text-weight-normal',
          { hidden: !error },
        )}
      >
        <button
          data-cy="HideErrorButton"
          type="button"
          className="delete"
          onClick={() => setError(null)}
        />
        {error}
      </div>
    </div>
  );
};
