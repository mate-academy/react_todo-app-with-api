import React, { useEffect, useMemo, useState } from 'react';
import { UserWarning } from './UserWarning';
import { Todo } from './types/Todo';
import { Filter } from './types/Filter';
import { ErrorMessage } from './types/ErrorMessage';
import * as todosApi from './api/todos';
import { Header } from './components/Header';
import { TodoList } from './components/TodoList';
import { Footer } from './components/Footer';
import { ErrorNotification } from './components/ErrorNotification';

const USER_ID = 4527;

type TodoPatch = Partial<Pick<Todo, 'title' | 'completed'>>;

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filter, setFilter] = useState<Filter>(Filter.All);
  const [errorMessage, setErrorMessage] = useState('');
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [loadingIds, setLoadingIds] = useState<number[]>([]);

  useEffect(() => {
    todosApi
      .getTodos(USER_ID)
      .then(setTodos)
      .catch(() => setErrorMessage(ErrorMessage.Load));
  }, []);

  useEffect(() => {
    if (!errorMessage) {
      return undefined;
    }

    const timerId = setTimeout(() => setErrorMessage(''), 3000);

    return () => clearTimeout(timerId);
  }, [errorMessage]);

  const visibleTodos = useMemo(() => {
    switch (filter) {
      case Filter.Active:
        return todos.filter(todo => !todo.completed);
      case Filter.Completed:
        return todos.filter(todo => todo.completed);
      default:
        return todos;
    }
  }, [todos, filter]);

  const startLoading = (ids: number[]) => {
    setLoadingIds(current => [...current, ...ids]);
  };

  const stopLoading = (ids: number[]) => {
    setLoadingIds(current => current.filter(id => !ids.includes(id)));
  };

  const handleAdd = async (rawTitle: string): Promise<boolean> => {
    const title = rawTitle.trim();

    if (!title) {
      setErrorMessage(ErrorMessage.EmptyTitle);

      return false;
    }

    setErrorMessage('');
    setTempTodo({ id: 0, userId: USER_ID, title, completed: false });

    try {
      const newTodo = await todosApi.addTodo({
        userId: USER_ID,
        title,
        completed: false,
      });

      setTodos(current => [...current, newTodo]);

      return true;
    } catch {
      setErrorMessage(ErrorMessage.Add);

      return false;
    } finally {
      setTempTodo(null);
    }
  };

  const handleDelete = async (todoId: number): Promise<boolean> => {
    setErrorMessage('');
    startLoading([todoId]);

    try {
      await todosApi.deleteTodo(todoId);
      setTodos(current => current.filter(todo => todo.id !== todoId));

      return true;
    } catch {
      setErrorMessage(ErrorMessage.Delete);

      return false;
    } finally {
      stopLoading([todoId]);
    }
  };

  const handleUpdate = async (
    todo: Todo,
    data: TodoPatch,
  ): Promise<boolean> => {
    setErrorMessage('');
    startLoading([todo.id]);

    try {
      const updated = await todosApi.updateTodo(todo.id, data);

      setTodos(current =>
        current.map(item => (item.id === todo.id ? updated : item)),
      );

      return true;
    } catch {
      setErrorMessage(ErrorMessage.Update);

      return false;
    } finally {
      stopLoading([todo.id]);
    }
  };

  const handleToggleAll = async () => {
    const targetStatus = !todos.every(todo => todo.completed);
    const changed = todos.filter(todo => todo.completed !== targetStatus);
    const ids = changed.map(todo => todo.id);

    setErrorMessage('');
    startLoading(ids);

    const results = await Promise.allSettled(
      changed.map(todo =>
        todosApi.updateTodo(todo.id, { completed: targetStatus }),
      ),
    );

    const updatedTodos = results
      .filter(
        (result): result is PromiseFulfilledResult<Todo> =>
          result.status === 'fulfilled',
      )
      .map(result => result.value);

    if (updatedTodos.length > 0) {
      setTodos(current =>
        current.map(
          todo => updatedTodos.find(item => item.id === todo.id) || todo,
        ),
      );
    }

    if (updatedTodos.length < changed.length) {
      setErrorMessage(ErrorMessage.Update);
    }

    stopLoading(ids);
  };

  const handleClearCompleted = async () => {
    const completed = todos.filter(todo => todo.completed);
    const ids = completed.map(todo => todo.id);

    setErrorMessage('');
    startLoading(ids);

    const results = await Promise.allSettled(
      completed.map(todo => todosApi.deleteTodo(todo.id)),
    );

    const deletedIds = completed
      .filter((_, index) => results[index].status === 'fulfilled')
      .map(todo => todo.id);

    if (deletedIds.length > 0) {
      setTodos(current =>
        current.filter(todo => !deletedIds.includes(todo.id)),
      );
    }

    if (deletedIds.length < completed.length) {
      setErrorMessage(ErrorMessage.Delete);
    }

    stopLoading(ids);
  };

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          todos={todos}
          isDisabled={tempTodo !== null}
          onAdd={handleAdd}
          onToggleAll={handleToggleAll}
        />

        <TodoList
          todos={visibleTodos}
          tempTodo={tempTodo}
          loadingIds={loadingIds}
          onDelete={handleDelete}
          onUpdate={handleUpdate}
        />

        {todos.length > 0 && (
          <Footer
            todos={todos}
            filter={filter}
            onFilterChange={setFilter}
            onClearCompleted={handleClearCompleted}
          />
        )}
      </div>

      <ErrorNotification
        message={errorMessage}
        onClose={() => setErrorMessage('')}
      />
    </div>
  );
};
