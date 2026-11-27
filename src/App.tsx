import classNames from 'classnames';
import { FormEvent, useEffect, useRef, useState } from 'react';
import {
  createTodo,
  deleteTodo,
  getTodos,
  TodoChanges,
  updateTodo,
  USER_ID,
} from './api/todos';
import { Footer } from './components/Footer/Footer';
import { Header } from './components/Header/Header';
import { TodoItem } from './components/TodoItem/TodoItem';
import { Todo } from './types/Todo';
import { ErrorText, FilterStatus } from './types/ui';
import { UserWarning } from './UserWarning';

const TodoApp = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filter, setFilter] = useState(FilterStatus.All);
  const [title, setTitle] = useState('');
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [pendingIds, setPendingIds] = useState<ReadonlySet<number>>(new Set());
  const [errorMessage, setErrorMessage] = useState('');
  const pending = useRef(new Set<number>());
  const errorTimeout = useRef<number>();
  const newTodoField = useRef<HTMLInputElement>(null);

  function showError(message: string) {
    window.clearTimeout(errorTimeout.current);
    setErrorMessage(message);

    if (message) {
      errorTimeout.current = window.setTimeout(() => setErrorMessage(''), 3000);
    }
  }

  useEffect(() => {
    let cancelled = false;

    getTodos()
      .then(result => {
        if (!cancelled) {
          setTodos(result);
        }
      })
      .catch(() => {
        if (!cancelled) {
          showError(ErrorText.Load);
        }
      })
      .finally(() => {
        if (!cancelled) {
          setIsLoading(false);
        }
      });

    return () => {
      cancelled = true;
      window.clearTimeout(errorTimeout.current);
    };
  }, []);

  const newTodoDisabled = isLoading || tempTodo !== null;

  useEffect(() => {
    if (!newTodoDisabled) {
      newTodoField.current?.focus();
    }
  }, [newTodoDisabled]);

  async function handleAdd(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (newTodoDisabled) {
      return;
    }

    const newTitle = title.trim();

    if (!newTitle) {
      showError(ErrorText.Empty);

      return;
    }

    const newTodo = { title: newTitle, completed: false, userId: USER_ID };

    showError('');
    setTempTodo({ ...newTodo, id: 0 });

    try {
      const addedTodo = await createTodo(newTitle);

      setTodos(current => [...current, addedTodo]);
      setTitle('');
    } catch {
      showError(ErrorText.Add);
    } finally {
      setTempTodo(null);
    }
  }

  async function processTodo(
    id: number,
    request: () => Promise<void>,
    failureMessage: string,
  ) {
    if (pending.current.has(id)) {
      return false;
    }

    pending.current.add(id);
    setPendingIds(new Set(pending.current));

    try {
      await request();

      return true;
    } catch {
      showError(failureMessage);

      return false;
    } finally {
      pending.current.delete(id);
      setPendingIds(new Set(pending.current));
    }
  }

  function saveTodo(id: number, changes: TodoChanges) {
    return processTodo(
      id,
      async () => {
        const updated = await updateTodo(id, changes);

        setTodos(current =>
          current.map(todo =>
            todo.id === id ? { ...todo, ...updated } : todo,
          ),
        );
      },
      ErrorText.Update,
    );
  }

  function removeTodo(id: number) {
    return processTodo(
      id,
      async () => {
        await deleteTodo(id);
        setTodos(current => current.filter(todo => todo.id !== id));
      },
      ErrorText.Delete,
    );
  }

  async function handleDelete(id: number) {
    showError('');

    const deleted = await removeTodo(id);

    if (deleted) {
      newTodoField.current?.focus();
    }

    return deleted;
  }

  function handleToggle(id: number, completed: boolean) {
    showError('');
    void saveTodo(id, { completed });
  }

  function handleRename(id: number, newTitle: string) {
    showError('');

    return saveTodo(id, { title: newTitle });
  }

  const activeCount = todos.filter(todo => !todo.completed).length;
  const allCompleted = todos.length > 0 && activeCount === 0;
  const visibleTodos = todos.filter(todo => {
    return (
      filter === FilterStatus.All ||
      todo.completed === (filter === FilterStatus.Completed)
    );
  });

  function handleToggleAll() {
    const completed = !allCompleted;
    const changedTodos = todos.filter(todo => todo.completed !== completed);

    showError('');
    void Promise.all(changedTodos.map(({ id }) => saveTodo(id, { completed })));
  }

  const completedToDelete = todos.filter(
    todo => todo.completed && !pendingIds.has(todo.id),
  );

  async function handleClearCompleted() {
    showError('');
    await Promise.all(completedToDelete.map(({ id }) => removeTodo(id)));
    newTodoField.current?.focus();
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          showToggle={todos.length > 0}
          allCompleted={allCompleted}
          isTogglingDisabled={pendingIds.size > 0}
          onToggleAll={handleToggleAll}
          newTitle={title}
          isAdding={newTodoDisabled}
          onChangeTitle={setTitle}
          onSubmit={handleAdd}
          inputRef={newTodoField}
        />

        {(todos.length > 0 || tempTodo) && (
          <section className="todoapp__main" data-cy="TodoList">
            {visibleTodos.map(todo => (
              <TodoItem
                key={todo.id}
                todo={todo}
                isPending={pendingIds.has(todo.id)}
                onToggle={handleToggle}
                onDelete={handleDelete}
                onRename={handleRename}
              />
            ))}
            {tempTodo && <TodoItem todo={tempTodo} isPending />}
          </section>
        )}

        <Footer
          countActive={activeCount}
          todosLength={todos.length}
          current={filter}
          setFilter={setFilter}
          canClearCompleted={completedToDelete.length > 0}
          onClearCompleted={() => void handleClearCompleted()}
        />
      </div>

      <div
        className={classNames('notification is-danger is-light', {
          hidden: !errorMessage,
        })}
        data-cy="ErrorNotification"
        role="alert"
      >
        <button
          aria-label="Dismiss error"
          className="delete"
          data-cy="HideErrorButton"
          type="button"
          tabIndex={errorMessage ? 0 : -1}
          onClick={() => showError('')}
        />
        {errorMessage}
      </div>
    </div>
  );
};

export const App = () => (USER_ID ? <TodoApp /> : <UserWarning />);
