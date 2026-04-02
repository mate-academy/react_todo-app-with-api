import React, { useEffect, useRef, useState } from 'react';
import { UserWarning } from './UserWarning';
import {
  getTodos,
  USER_ID,
  deleteTodo as deleteTodoAPI,
  addTodo,
} from './api/todos';
import { Footer } from './components/Footer';
import { ErrorNotification } from './components/ErrorNotification';
import { TodoItem } from './components/TodoItem';
import { Status } from './types/StatusType';
import { Todo } from './types/Todo';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<Status>(Status.All);
  const [loading, setLoading] = useState(true);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [isAdding, setIsAdding] = useState(false);

  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (errorMessage) {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = setTimeout(() => {
        setErrorMessage(null);
      }, 3000);
    }
  }, [errorMessage]);

  useEffect(() => {
    inputRef.current?.focus();
  }, [isAdding]);

  useEffect(() => {
    setLoading(true);
    setErrorMessage(null);

    getTodos()
      .then(data => setTodos(data))
      .catch(() => setErrorMessage('Unable to load todos'))
      .finally(() => setLoading(false));
  }, []);

  const visibleTodos = todos.filter(todo => {
    if (filterStatus === Status.Active) {
      return !todo.completed;
    }

    if (filterStatus === Status.Completed) {
      return todo.completed;
    }

    return true;
  });

  const handleSubmitForm = async (
    event: React.FormEvent<HTMLFormElement>,
  ): Promise<void> => {
    event.preventDefault();

    const trimmedTitle = inputValue.trim();

    if (!trimmedTitle) {
      setErrorMessage('Title should not be empty');

      return;
    }

    setIsAdding(true);
    setErrorMessage(null);

    const newTempTodo: Todo = {
      id: 0,
      userId: USER_ID,
      title: trimmedTitle,
      completed: false,
      loading: true,
    };

    setTempTodo(newTempTodo);

    try {
      const createdTodo = await addTodo({
        userId: USER_ID,
        title: trimmedTitle,
        completed: false,
      });

      setTodos(current => [...current, { ...createdTodo, loading: false }]);
      setInputValue('');
      setTempTodo(null);
    } catch {
      setErrorMessage('Unable to add a todo');
      setTempTodo(null);
    } finally {
      setIsAdding(false);
      inputRef.current?.focus();
    }
  };

  const deleteTodo = async (id: number) => {
    setErrorMessage(null);

    setTodos(current =>
      current.map(todo => (todo.id === id ? { ...todo, loading: true } : todo)),
    );

    try {
      await deleteTodoAPI(id);
      setTodos(current => current.filter(todo => todo.id !== id));
    } catch {
      setTodos(current =>
        current.map(todo =>
          todo.id === id ? { ...todo, loading: false } : todo,
        ),
      );
      setErrorMessage('Unable to delete a todo');
    }

    inputRef.current?.focus();
  };

  const handleEditTodo = async (
    id: number,
    newTitle: string,
  ): Promise<'updated' | 'deleted' | 'error'> => {
    const trimmed = newTitle.trim();
    const todo = todos.find(t => t.id === id);

    if (!todo) {
      return 'error';
    }

    if (!trimmed) {
      setTodos(current =>
        current.map(t => (t.id === id ? { ...t, loading: true } : t)),
      );

      try {
        await deleteTodoAPI(id);
        setTodos(current => current.filter(t => t.id !== id));
        return 'deleted';
      } catch {
        setTodos(current =>
          current.map(t => (t.id === id ? { ...t, loading: false } : t)),
        );
        setErrorMessage('Unable to delete a todo');
        return 'error';
      }
    }

    if (trimmed === todo.title) {
      return 'updated';
    }

    setTodos(current =>
      current.map(t => (t.id === id ? { ...t, loading: true } : t)),
    );

    try {
      const { updateTodo } = await import('./api/todos');

      await updateTodo(id, { title: trimmed });

      setTodos(current =>
        current.map(t =>
          t.id === id ? { ...t, title: trimmed, loading: false } : t,
        ),
      );

      return 'updated';
    } catch {
      setTodos(current =>
        current.map(t => (t.id === id ? { ...t, loading: false } : t)),
      );
      setErrorMessage('Unable to update a todo');

      return 'error';
    }
  };

  const handleCheckedId = async (id: number) => {
    const todo = todos.find(t => t.id === id);

    if (!todo) {
      return;
    }

    const newStatus = !todo.completed;

    setTodos(current =>
      current.map(t => (t.id === id ? { ...t, loading: true } : t)),
    );

    try {
      const { updateTodo } = await import('./api/todos');

      await updateTodo(id, { completed: newStatus });

      setTodos(current =>
        current.map(t =>
          t.id === id ? { ...t, completed: newStatus, loading: false } : t,
        ),
      );
    } catch {
      setTodos(current =>
        current.map(t => (t.id === id ? { ...t, loading: false } : t)),
      );
      setErrorMessage('Unable to update a todo');
    }
  };

  const handleToggleAll = async () => {
    const areAllCompleted = todos.every(todo => todo.completed);
    const newStatus = !areAllCompleted;

    const todosToUpdate = todos.filter(todo => todo.completed !== newStatus);

    setTodos(current =>
      current.map(todo =>
        todosToUpdate.some(t => t.id === todo.id)
          ? { ...todo, loading: true }
          : todo,
      ),
    );

    try {
      const { updateTodo } = await import('./api/todos');

      await Promise.all(
        todosToUpdate.map(todo =>
          updateTodo(todo.id, { completed: newStatus }),
        ),
      );

      setTodos(current =>
        current.map(todo =>
          todosToUpdate.some(t => t.id === todo.id)
            ? { ...todo, completed: newStatus, loading: false }
            : todo,
        ),
      );
    } catch {
      setErrorMessage('Unable to update a todo');

      setTodos(current =>
        current.map(todo =>
          todosToUpdate.some(t => t.id === todo.id)
            ? { ...todo, loading: false }
            : todo,
        ),
      );
    }
  };

  const clearCompleted = async () => {
    const completed = todos.filter(todo => todo.completed);

    setTodos(current =>
      current.map(todo =>
        completed.some(c => c.id === todo.id)
          ? { ...todo, loading: true }
          : todo,
      ),
    );

    const results = await Promise.allSettled(
      completed.map(todo => deleteTodoAPI(todo.id)),
    );

    const deletedIds = completed
      .filter((_, i) => results[i].status === 'fulfilled')
      .map(todo => todo.id);

    setTodos(current => current.filter(todo => !deletedIds.includes(todo.id)));

    if (results.some(r => r.status === 'rejected')) {
      setErrorMessage('Unable to delete a todo');
    }

    inputRef.current?.focus();
  };

  const handleInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
  };

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          {!!todos.length && (
            <button
              type="button"
              className={`todoapp__toggle-all${
                todos.every(todo => todo.completed) ? ' active' : ''
              }`}
              data-cy="ToggleAllButton"
              onClick={handleToggleAll}
            />
          )}

          <form onSubmit={handleSubmitForm}>
            <input
              ref={inputRef}
              data-cy="NewTodoField"
              type="text"
              className="todoapp__new-todo"
              placeholder="What needs to be done?"
              value={inputValue}
              onChange={handleInput}
              disabled={isAdding}
            />
          </form>
        </header>

        {!loading && todos.length > 0 && (
          <section className="todoapp__main" data-cy="TodoList">
            {visibleTodos.map(todo => (
              <TodoItem
                key={todo.id}
                todo={todo}
                onDelete={deleteTodo}
                onToggleComplete={handleCheckedId}
                onEdit={handleEditTodo}
              />
            ))}

            {tempTodo && (
              <TodoItem
                key={0}
                todo={tempTodo}
                onDelete={deleteTodo}
                onToggleComplete={handleCheckedId}
                onEdit={handleEditTodo}
              />
            )}
          </section>
        )}

        {!loading && todos.length > 0 && (
          <Footer
            todos={todos}
            setFilterStatus={setFilterStatus}
            filterStatus={filterStatus}
            onClearCompleted={clearCompleted}
          />
        )}
      </div>

      <ErrorNotification
        errorMessage={errorMessage}
        onClose={() => setErrorMessage(null)}
      />
    </div>
  );
};
