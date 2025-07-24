/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useMemo, useState } from 'react';
import { UserWarning } from './UserWarning';
import * as TodoAPI from './api/todos';
import { Todo } from './types/Todo';
import { FilterOption } from './types/FilterOption';
import { ErrorMessage } from './types/ErrorMessage';
import { TodoList } from './components/TodoList';
import { Footer } from './components/Footer';
import { ErrorNotification } from './components/ErrorNotification';
import { TodoForm } from './components/TodoForm';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<ErrorMessage | ''>('');
  const [filter, setFilter] = useState<FilterOption>('All');
  const [todoTitle, setTodoTitle] = useState<string>('');
  const [todoLoading, setTodoLoading] = useState<boolean>(false);
  const [tempTodo, setTempTodo] = useState<Todo | undefined>(undefined);
  const [loadingIds, setLoadingIds] = useState<Set<number>>(new Set());

  //#region FETCHING_TODOS
  const fetchTodos = async () => {
    setLoading(true);
    setError('');

    try {
      const todosData = await TodoAPI.getTodos();

      setTodos(todosData);
    } catch {
      setError(ErrorMessage.LoadTodos);
    } finally {
      setLoading(false);

      setTimeout(() => {
        setError('');
      }, 3000);
    }
  };

  useEffect(() => {
    if (!TodoAPI.USER_ID) {
      return;
    }

    fetchTodos();
  }, []);
  //#endregion

  //#region ADDING_TODOS
  const addNewTodo = async (e: React.FormEvent) => {
    e.preventDefault();

    const trimmedTitle = todoTitle.trim();

    if (!trimmedTitle) {
      setError(ErrorMessage.EmptyTitle);

      return;
    }

    setError('');
    setTodoLoading(true);

    setTempTodo({
      id: 0,
      title: todoTitle,
      userId: TodoAPI.USER_ID,
      completed: false,
    });

    try {
      const responseTodo = await TodoAPI.addTodo({
        title: trimmedTitle,
        userId: TodoAPI.USER_ID,
        completed: false,
      });

      setTodos(prev => [...prev, responseTodo]);

      setTodoTitle('');
    } catch {
      setError(ErrorMessage.AddTodo);
    } finally {
      setTodoLoading(false);

      setTempTodo(undefined);
    }
  };
  //#endregion

  //#region DELETING_TODOS
  const deleteTodo = async (id: number): Promise<void> => {
    setLoadingIds(prev => new Set(prev).add(id));
    setError('');

    try {
      await TodoAPI.deleteTodo(id);

      setTodos(prevTodos => prevTodos.filter(todo => todo.id !== id));
    } catch (err) {
      setError(ErrorMessage.DeleteTodo);
      throw err;
    } finally {
      setLoadingIds(prev => {
        const newSet = new Set(prev);

        newSet.delete(id);

        return newSet;
      });
    }
  };

  const clearCompleted = async () => {
    const completedTodos = todos.filter(todo => todo.completed);

    if (completedTodos.length === 0) {
      return;
    }

    setTodoLoading(true);
    setError('');

    const results = await Promise.allSettled(
      completedTodos.map(todo => TodoAPI.deleteTodo(todo.id)),
    );

    const deletedIds = results
      .map((res, i) =>
        res.status === 'fulfilled' ? completedTodos[i].id : null,
      )
      .filter((id): id is number => id !== null);

    if (deletedIds.length < completedTodos.length) {
      setError(ErrorMessage.DeleteTodo);
    }

    setTodos(prev => prev.filter(todo => !deletedIds.includes(todo.id)));

    setTodoLoading(false);
  };
  //#endregion

  //#region UPDATING_TODOS
  const updateTodoStatus = async (id: number) => {
    const todo = todos.find(t => t.id === id);

    if (!todo) {
      return;
    }

    setLoadingIds(prev => new Set(prev).add(id));
    setError('');

    try {
      const response = await TodoAPI.updateTodo(id, {
        completed: !todo.completed,
      });

      setTodos(prev =>
        prev.map(t => (t.id === id ? { ...t, ...response } : t)),
      );
    } catch {
      setError(ErrorMessage.UpdateTodo);
    } finally {
      setLoadingIds(prev => {
        const copy = new Set(prev);

        copy.delete(id);

        return copy;
      });
    }
  };

  const updateTodoTitle = async (
    id: number,
    newTitle: string,
  ): Promise<void> => {
    const todo = todos.find(t => t.id === id);

    if (!todo) {
      return;
    }

    if (todo.title === newTitle) {
      return;
    }

    setLoadingIds(prev => new Set(prev).add(id));
    setError('');

    try {
      if (newTitle.trim() === '') {
        await TodoAPI.deleteTodo(id);

        setTodos(prev => prev.filter(t => t.id !== id));
      } else {
        const response = await TodoAPI.updateTodo(id, { title: newTitle });

        setTodos(prev =>
          prev.map(t => (t.id === id ? { ...t, ...response } : t)),
        );
      }
    } catch (err) {
      if (newTitle.trim() === '') {
        setError(ErrorMessage.DeleteTodo);
      } else {
        setError(ErrorMessage.UpdateTodo);
      }

      throw err;
    } finally {
      setLoadingIds(prev => {
        const copy = new Set(prev);

        copy.delete(id);

        return copy;
      });
    }
  };

  const toggleAllActive = async () => {
    if (todos.length === 0) {
      return;
    }

    const allCompleted = todos.every(todo => todo.completed);
    const newStatus = !allCompleted;

    const todosToUpdate = todos.filter(todo => todo.completed !== newStatus);

    if (todosToUpdate.length === 0) {
      return; // no change needed
    }

    setTodoLoading(true);
    setError('');

    const results = await Promise.allSettled(
      todosToUpdate.map(todo =>
        TodoAPI.updateTodo(todo.id, { completed: newStatus }),
      ),
    );

    const successfullyUpdated = results
      .map((res, i) =>
        res.status === 'fulfilled' ? todosToUpdate[i].id : null,
      )
      .filter((id): id is number => id !== null);

    if (successfullyUpdated.length < todosToUpdate.length) {
      setError(ErrorMessage.UpdateTodo);
    }

    setTodos(prev =>
      prev.map(todo =>
        successfullyUpdated.includes(todo.id)
          ? { ...todo, completed: newStatus }
          : todo,
      ),
    );

    setTodoLoading(false);
  };
  //#endregion

  const filteredTodos = useMemo(() => {
    switch (filter) {
      case 'Active':
        return todos.filter(t => !t.completed);
      case 'Completed':
        return todos.filter(t => t.completed);
      case 'All':
      default:
        return todos;
    }
  }, [todos, filter]);

  const activeCount = useMemo(
    () => todos.filter(todo => !todo.completed).length,
    [todos],
  );
  const completedCount = useMemo(
    () => todos.filter(todo => todo.completed).length,
    [todos],
  );

  if (!TodoAPI.USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">My todos</h1>

      <div className="todoapp__content">
        <TodoForm
          todos={todos}
          newNoteTitle={todoTitle}
          onAdd={addNewTodo}
          onTyping={setTodoTitle}
          onToggle={toggleAllActive}
          disabled={todoLoading}
        />

        {loading ? (
          <div className="todoapp__loader" data-cy="Loader"></div>
        ) : (
          <>
            <TodoList
              todos={filteredTodos}
              tempTodo={tempTodo}
              onDelete={deleteTodo}
              onToggle={updateTodoStatus}
              onUpdate={updateTodoTitle}
              todoLoading={todoLoading}
              loadingIds={loadingIds}
            />
            <Footer
              todos={todos}
              filter={filter}
              onFilterChange={setFilter}
              activeCount={activeCount}
              completedCount={completedCount}
              onClear={clearCompleted}
            />
          </>
        )}
      </div>

      <ErrorNotification message={error} onClear={() => setError('')} />
    </div>
  );
};
