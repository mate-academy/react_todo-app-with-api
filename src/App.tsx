/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable max-len */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React from 'react';
import { UserWarning } from './UserWarning';
import { USER_ID, addTodo, deleteTodo } from './api.ts/todos';
import { useEffect, useState, useRef } from 'react';
import { getTodos } from './api.ts/todos';
import { Todo, FilterType, ErrorMessage } from './types/Todo';
import { Header } from './components/Header';
import { TodoItem } from './components/TodoItem';
import { ErrorNotification } from './components/ErrorNotification';
import { Footer } from './components/Footer';
import { TempTodoItem } from './components/TempTodoItem';
import { updateTodo } from './api.ts/todos';

export const App: React.FC = () => {
  const field = useRef<HTMLInputElement>(null);
  const [todos, setTodos] = useState<Todo[]>([]);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState<FilterType>(FilterType.All);
  const [loading, setLoading] = useState(false);
  const [todoTitle, setTodoTitle] = useState('');
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [deletingIds, setDeletingIds] = useState<number[]>([]);
  const [updatingIds, setUpdatingIds] = useState<number[]>([]);

  function showError(message: string) {
    setError(message);
    setTimeout(() => {
      setError('');
    }, 3000);
  }

  async function loadTodos() {
    setError('');
    setLoading(true);
    try {
      const result = await getTodos();

      setTodos(result);
      field.current?.focus();
    } catch {
      showError(ErrorMessage.UnableLoadTodos);
    } finally {
      setLoading(false);
    }
  }

  async function handleAddTodo(event: React.FormEvent) {
    setError('');
    event.preventDefault();

    const title = todoTitle.trim();

    if (!title) {
      showError(ErrorMessage.TitleEmpty);

      return;
    }

    const todo = {
      id: 0,
      completed: false,
      title,
      userId: USER_ID,
    };

    setTempTodo(todo);

    try {
      setLoading(true);
      const newTodo = await addTodo(title);

      setTodos([...todos, newTodo]);
      setTodoTitle('');
      setTempTodo(null);
    } catch {
      showError(ErrorMessage.UnableAddTodo);
      setTempTodo(null);
    } finally {
      setLoading(false);
      field.current?.focus();
    }
  }

  async function handleDeleteTodo(id: number) {
    setDeletingIds([...deletingIds, id]);

    try {
      await deleteTodo(id);
      setTodos(todos.filter(todo => todo.id !== id));
    } catch {
      showError(ErrorMessage.UnableDeleteTodo);
    } finally {
      setDeletingIds(deletingIds.filter(delId => delId !== id));
    }
  }

  async function handleToggleTodo(todo: Todo) {
    setError('');
    setUpdatingIds([...updatingIds, todo.id]);

    try {
      const updatedTodo = await updateTodo(todo.id, {
        completed: !todo.completed,
      });

      setTodos(todos.map(t => (t.id === updatedTodo.id ? updatedTodo : t)));
    } catch {
      showError(ErrorMessage.UnableToggleTodo);
    } finally {
      setUpdatingIds(updatingIds.filter(updId => updId !== todo.id));
    }
  }

  const toggleAll = todos.every(todo => todo.completed);

  async function handleToggleAll() {
    setError('');
    const newStatus = !toggleAll;
    const todosToUpdate = todos.filter(todo => todo.completed !== newStatus);
    const updatingIdsArray = todosToUpdate.map(todo => todo.id);

    setUpdatingIds(prev => [...prev, ...updatingIdsArray]);
    try {
      const result = await Promise.allSettled(
        todosToUpdate.map(todo =>
          updateTodo(todo.id, { completed: newStatus }),
        ),
      );
      const hasErrors = result.some(r => r.status === 'rejected');

      if (hasErrors) {
        showError(ErrorMessage.UnableToggleTodo);
      }

      const successfulUpd: Todo[] = [];

      result.forEach(res => {
        if (res.status === 'fulfilled') {
          successfulUpd.push(res.value);
        }
      });
      setTodos(currentTodos =>
        currentTodos.map(todo => {
          const upd = successfulUpd.find(u => u.id === todo.id);

          return upd ? upd : todo;
        }),
      );
    } catch {
      showError(ErrorMessage.UnableToggleTodo);
    } finally {
      setUpdatingIds(prev => prev.filter(id => !updatingIdsArray.includes(id)));
    }
  }

  useEffect(() => {
    if (!loading) {
      field.current?.focus();
    }
  }, [loading]);

  useEffect(() => {
    loadTodos();
  }, []);

  useEffect(() => {
    if (deletingIds.length === 0 && !loading) {
      field.current?.focus();
    }
  }, [deletingIds, loading]);

  if (!USER_ID) {
    return <UserWarning />;
  }

  function getFilteredTodos() {
    if (filter === FilterType.All) {
      return todos;
    }

    if (filter === FilterType.Active) {
      return todos.filter(todo => !todo.completed);
    }

    if (filter === FilterType.Completed) {
      return todos.filter(todo => todo.completed);
    }

    return todos;
  }

  async function handleClearCompleted() {
    setError('');
    const completedIds = todos
      .filter(todo => todo.completed)
      .map(todo => todo.id);

    setDeletingIds([...deletingIds, ...completedIds]);

    try {
      const result = await Promise.allSettled(
        completedIds.map(id => deleteTodo(id)),
      );

      const hasErrors = result.some(r => r.status === 'rejected');

      if (hasErrors) {
        showError(ErrorMessage.UnableDeleteTodo);
      }

      const successfulIds = completedIds.filter(
        (id, index) => result[index].status === 'fulfilled',
      );

      setTodos(todos.filter(todo => !successfulIds.includes(todo.id)));
    } finally {
      setDeletingIds([]);
    }
  }

  const filteredTodos = getFilteredTodos();
  const activeTodosCount = todos.filter(todo => !todo.completed).length;
  const completedTodosCount = todos.filter(todo => todo.completed).length;

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          todos={todos}
          activeTodosCount={activeTodosCount}
          loading={loading}
          field={field}
          todoTitle={todoTitle}
          handleAddTodo={handleAddTodo}
          setTodoTitle={setTodoTitle}
          toggleAll={toggleAll}
          handleToggleAll={handleToggleAll}
        />

        {(filteredTodos.length > 0 || tempTodo) && (
          <section className="todoapp__main" data-cy="TodoList">
            {filteredTodos.map(todo => (
              <TodoItem
                key={todo.id}
                todo={todo}
                loading={loading}
                deletingIds={deletingIds}
                handleDeleteTodo={handleDeleteTodo}
                updatingIds={updatingIds}
                handleToggleTodo={handleToggleTodo}
                showError={showError}
                setTodos={setTodos}
                setUpdatingIds={setUpdatingIds}
              />
            ))}

            <TempTodoItem tempTodo={tempTodo} />
          </section>
        )}

        {/* Hide the footer if there are no todos */}
        {todos.length > 0 && (
          <Footer
            activeTodosCount={activeTodosCount}
            filter={filter}
            setFilter={setFilter}
            completedTodosCount={completedTodosCount}
            handleClearCompleted={handleClearCompleted}
          />
        )}
      </div>

      {/* DON'T use conditional rendering to hide the notification */}
      {/* Add the 'hidden' class to hide the message smoothly */}
      <ErrorNotification error={error} loading={loading} setError={setError} />
    </div>
  );
};
