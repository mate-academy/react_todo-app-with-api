/* eslint-disable max-len */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useRef, useState } from 'react';
import { UserWarning } from './UserWarning';
import {
  addTodo,
  deleteTodo,
  getTodos,
  updateTodo,
  USER_ID,
} from './api/todos';
import { Todo } from './types/Todo';
import { Header } from './components/Header/Header';
import { TodoList } from './components/TodoList/TodoList';
import { Footer } from './components/Footer/Footer';
import { ErrorNotification } from './components/ErrorNotification/ErrorNotification';

type FilterStatus = 'all' | 'active' | 'completed';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [error, setError] = useState('');

  const [filter, setFilter] = useState<FilterStatus>('all');

  const [newTitle, setNewTitle] = useState('');
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [loadingIds, setLoadingIds] = useState<number[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  const activeTodos = todos.filter(todo => !todo.completed).length;

  const [editingId, setEditingId] = useState<number | null>(null);

  const [editedTitle, setEditedTitle] = useState('');

  const editInputRef = useRef<HTMLInputElement>(null);

  const [isCancelling, setIsCancelling] = useState(false);

  const [isLoading, setIsLoading] = useState(true);

  const loadTodos = async () => {
    try {
      setError('');
      setIsLoading(true);

      const todosFromServer = await getTodos();

      setTodos(todosFromServer);
    } catch {
      setError('Unable to load todos');
    } finally {
      setIsLoading(false); // ❗ ОБОВʼЯЗКОВО
    }
  };

  useEffect(() => {
    loadTodos();
  }, []);

  useEffect(() => {
    inputRef.current?.focus();
  }, [todos, tempTodo, error]);

  useEffect(() => {
    if (editingId !== null) {
      editInputRef.current?.focus();
      editInputRef.current?.select();
    }
  }, [editingId]);

  useEffect(() => {
    if (!error) {
      return;
    }

    const timer = setTimeout(() => {
      setError('');
    }, 3000);

    return () => clearTimeout(timer);
  }, [error]);

  if (!USER_ID) {
    return <UserWarning />;
  }

  const visibleTodos = todos.filter(todo => {
    switch (filter) {
      case 'active':
        return !todo.completed;

      case 'completed':
        return todo.completed;

      default:
        return true;
    }
  });

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const trimmedTitle = newTitle.trim();

    if (!trimmedTitle) {
      setError('Title should not be empty');
      inputRef.current?.focus();

      return;
    }

    setError('');

    const todoToSend = {
      title: trimmedTitle,
      completed: false,
      userId: USER_ID,
    };

    const temp = {
      id: 0,
      ...todoToSend,
    };

    setTempTodo(temp);

    try {
      const createdTodo = await addTodo(todoToSend);

      setTodos(current => [...current, createdTodo]);
      setNewTitle('');

      setTempTodo(null);

      setTimeout(() => {
        inputRef.current?.focus();
      }, 0);
      // inputRef.current?.focus();
    } catch {
      setError('Unable to add a todo');
      setNewTitle(trimmedTitle);

      setTempTodo(null);

      setTimeout(() => {
        inputRef.current?.focus();
      }, 0);
    } finally {
      // setTempTodo(null);
      setLoadingIds(ids => ids.filter(id => id !== temp.id));

      // inputRef.current?.focus();
    }
  };

  const handleDelete = async (todoId: number) => {
    setError('');

    setLoadingIds(ids => [...ids, todoId]);

    try {
      await deleteTodo(todoId);

      setTodos(current => {
        const updated = current.filter(todo => todo.id !== todoId);

        return updated;
      });
      inputRef.current?.focus();
    } catch {
      setError('Unable to delete a todo');
    } finally {
      setLoadingIds(ids => ids.filter(id => id !== todoId));
    }
  };

  const completedTodos = todos.filter(todo => todo.completed);

  const handleClearCompleted = async () => {
    const completedIds = completedTodos.map(todo => todo.id);

    setLoadingIds(ids => [...ids, ...completedIds]);

    const results = await Promise.allSettled(
      completedTodos.map(todo => deleteTodo(todo.id)),
    );

    const successIds = completedTodos
      .filter((_, index) => results[index].status === 'fulfilled')
      .map(todo => todo.id);

    const hasErrors = results.some(result => result.status === 'rejected');

    if (hasErrors) {
      setError('Unable to delete a todo');
    }

    setTodos(current => current.filter(todo => !successIds.includes(todo.id)));

    setLoadingIds(ids => ids.filter(id => !completedIds.includes(id)));
  };

  const handleToggle = async (todo: Todo) => {
    setError('');

    setLoadingIds(ids => [...ids, todo.id]);

    try {
      const updatedTodo = await updateTodo(todo.id, {
        completed: !todo.completed,
      });

      setTodos(current =>
        current.map(item => (item.id === todo.id ? updatedTodo : item)),
      );
    } catch {
      setError('Unable to update a todo');
    } finally {
      setLoadingIds(ids => ids.filter(id => id !== todo.id));
    }
  };

  const allCompleted = todos.length > 0 && todos.every(todo => todo.completed);

  const handleToggleAll = async () => {
    const newStatus = !allCompleted;

    const todosToUpdate = todos.filter(todo => todo.completed !== newStatus);

    const ids = todosToUpdate.map(todo => todo.id);

    setLoadingIds(current => [...current, ...ids]);

    const results = await Promise.allSettled(
      todosToUpdate.map(todo =>
        updateTodo(todo.id, {
          completed: newStatus,
        }),
      ),
    );

    const updatedTodos = [...todos];

    results.forEach(result => {
      if (result.status === 'fulfilled') {
        const updated = result.value;

        const todoIndex = updatedTodos.findIndex(
          todo => todo.id === updated.id,
        );

        updatedTodos[todoIndex] = updated;
      }
    });

    if (results.some(result => result.status === 'rejected')) {
      setError('Unable to update a todo');
    }

    setTodos(updatedTodos);

    setLoadingIds(current => current.filter(id => !ids.includes(id)));
  };

  const handleRename = async (todo: Todo) => {
    const trimmedTitle = editedTitle.trim();

    if (trimmedTitle === todo.title) {
      setEditingId(null);

      return;
    }

    if (!trimmedTitle) {
      await handleDelete(todo.id);

      return;
    }

    setLoadingIds(ids => [...ids, todo.id]);

    try {
      const updatedTodo = await updateTodo(todo.id, {
        title: trimmedTitle,
      });

      setTodos(current =>
        current.map(item => (item.id === todo.id ? updatedTodo : item)),
      );

      setEditingId(null);
    } catch {
      setError('Unable to update a todo');
    } finally {
      setLoadingIds(ids => ids.filter(id => id !== todo.id));
    }
  };

  return (
    <section className="section container">
      <div className="todoapp">
        <h1 className="todoapp__title">todos</h1>

        <div className="todoapp__content">
          <Header
            isLoading={isLoading}
            todosLength={todos.length}
            allCompleted={allCompleted}
            loading={loadingIds.length > 0}
            newTitle={newTitle}
            tempTodoExists={tempTodo !== null}
            onToggleAll={handleToggleAll}
            onSubmit={handleSubmit}
            onChangeTitle={setNewTitle}
            inputRef={inputRef}
          />

          <TodoList
            todosLength={todos.length}
            visibleTodos={visibleTodos}
            tempTodo={tempTodo}
            loadingIds={loadingIds}
            editingId={editingId}
            editedTitle={editedTitle}
            isCancelling={isCancelling}
            editInputRef={editInputRef}
            setEditedTitle={setEditedTitle}
            setEditingId={setEditingId}
            setIsCancelling={setIsCancelling}
            onToggle={handleToggle}
            onDelete={handleDelete}
            onRename={handleRename}
          />

          <Footer
            todosLength={todos.length}
            tempTodo={tempTodo}
            activeTodos={activeTodos}
            completedTodosCount={completedTodos.length}
            filter={filter}
            onFilterChange={setFilter}
            onClearCompleted={handleClearCompleted}
          />
        </div>

        <ErrorNotification error={error} onClose={() => setError('')} />
      </div>
    </section>
  );
};
