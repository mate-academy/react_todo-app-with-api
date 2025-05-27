/* eslint-disable max-len */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useState, useRef } from 'react';
import { UserWarning } from './UserWarning';
import {
  getTodos,
  USER_ID,
  addTodo as apiAddTodo,
  deleteTodo as apiDeleteTodo,
  updateTodo as apiUpdateTodo,
} from './api/todos';
import { Todo } from './types/Todo';
import { FilterType } from './types/Filter';
import { Footer } from './components/Footer';
import { TodoList } from './components/TodoList';
import { ErrorNotification } from './components/ErrorNotification';
import { Header } from './components/Header';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<FilterType>(FilterType.All);
  const [title, setTitle] = useState('');
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [loadingTodoIds, setLoadingTodoIds] = useState<number[]>([]);
  const [editingTodoId, setEditingTodoId] = useState<number | null>(null);
  const [editingTitle, setEditingTitle] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!USER_ID) {
      return;
    }

    const loadTodos = async () => {
      try {
        const data = await getTodos();

        setTodos(data);
      } catch {
        setError('Unable to load todos');
        setTimeout(() => setError(null), 3000);
      }
    };

    loadTodos();
  }, []);

  useEffect(() => {
    if (!tempTodo) {
      inputRef.current?.focus();
    }
  }, [tempTodo]);

  useEffect(() => {
    inputRef.current?.focus();
  }, [todos]);

  if (!USER_ID) {
    return <UserWarning />;
  }

  const filteredTodos = todos.filter(todo => {
    switch (filter) {
      case FilterType.Active:
        return !todo.completed;
      case FilterType.Completed:
        return todo.completed;
      default:
        return true;
    }
  });

  const handleCloseError = () => {
    setError(null);
  };

  const handleAddTodo = async (event: React.FormEvent) => {
    event.preventDefault();

    if (title.trim() === '') {
      setError('Title should not be empty');
      setTimeout(() => setError(null), 3000);

      return;
    }

    const trimmedTitle = title.trim();

    setTempTodo({
      id: 0,
      userId: USER_ID,
      title: trimmedTitle,
      completed: false,
    });

    try {
      const newTodo = await apiAddTodo(trimmedTitle);

      setTodos(prev => [...prev, newTodo]);
      setTitle('');
      setTempTodo(null);
    } catch {
      setError('Unable to add a todo');
      setTimeout(() => setError(null), 3000);
      setTempTodo(null);
    } finally {
      setTempTodo(null);
    }
  };

  const handleUpdateTitle = async (id: number, newTitle: string) => {
    setLoadingTodoIds(prev => [...prev, id]);

    try {
      const updatedTodo = await apiUpdateTodo(id, { title: newTitle });

      setTodos(prev =>
        prev.map(todo =>
          todo.id === id ? { ...todo, title: updatedTodo.title } : todo,
        ),
      );
    } catch {
      setError('Unable to update a todo');
      setTimeout(() => setError(null), 3000);
      throw new Error('Unable to update a todo');
    } finally {
      setLoadingTodoIds(prev => prev.filter(todoId => todoId !== id));
    }
  };

  const handleDeleteTodo = async (id: number) => {
    setLoadingTodoIds(prev => [...prev, id]);

    try {
      await apiDeleteTodo(id);
      setTodos(prev => prev.filter(todo => todo.id !== id));
    } catch {
      setError('Unable to delete a todo');
      setTimeout(() => setError(null), 3000);
    } finally {
      setLoadingTodoIds(prev => prev.filter(todoId => todoId !== id));
    }
  };

  const handleClearCompleted = async () => {
    const completedTodos = todos.filter(todo => todo.completed);

    if (completedTodos.length === 0) {
      return;
    }

    setLoadingTodoIds(prev => [...prev, ...completedTodos.map(t => t.id)]);

    const promises: Promise<{ id: number; success: boolean }>[] =
      completedTodos.map(todo =>
        apiDeleteTodo(todo.id)
          .then(() => ({ id: todo.id, success: true }))
          .catch(() => ({ id: todo.id, success: false })),
      );

    const results = await Promise.all(promises);

    if (results.some(r => !r.success)) {
      setError('Unable to delete a todo');
      setTimeout(() => setError(null), 3000);
    }

    const successIds = results.filter(r => r.success).map(r => r.id);

    setTodos(prev => prev.filter(todo => !successIds.includes(todo.id)));

    setLoadingTodoIds(prev =>
      prev.filter(id => !completedTodos.some(t => t.id === id)),
    );
  };

  const handleToggleStatus = async (todoId: number, completed: boolean) => {
    setLoadingTodoIds(prev => [...prev, todoId]);

    try {
      const updatedTodo = await apiUpdateTodo(todoId, { completed });

      setTodos(prev =>
        prev.map(todo =>
          todo.id === todoId
            ? { ...todo, completed: updatedTodo.completed }
            : todo,
        ),
      );
    } catch {
      setError('Unable to update a todo');
      setTimeout(() => setError(null), 3000);
    } finally {
      setLoadingTodoIds(prev => prev.filter(id => id !== todoId));
    }
  };

  const handleToggleAll = async () => {
    const allCompleted = todos.every(todo => todo.completed);
    const newCompletedStatus = !allCompleted;

    const todosToUpdate = todos.filter(
      todo => todo.completed !== newCompletedStatus,
    );

    if (todosToUpdate.length === 0) {
      return;
    }

    setLoadingTodoIds(prev => [...prev, ...todosToUpdate.map(t => t.id)]);

    setTodos(prev =>
      prev.map(todo =>
        todosToUpdate.some(t => t.id === todo.id)
          ? { ...todo, completed: newCompletedStatus }
          : todo,
      ),
    );

    const promises = todosToUpdate.map(todo =>
      apiUpdateTodo(todo.id, { completed: newCompletedStatus }).catch(() => {
        setError('Unable to update a todo');
        setTimeout(() => setError(null), 3000);

        return null;
      }),
    );

    await Promise.all(promises);

    setLoadingTodoIds(prev =>
      prev.filter(id => !todosToUpdate.some(t => t.id === id)),
    );
  };

  const handleStartEditing = (todo: Todo) => {
    setEditingTodoId(todo.id);
    setEditingTitle(todo.title);
  };

  const handleChangeEditingTitle = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditingTitle(e.target.value);
  };

  const handleCancelEditing = () => {
    setEditingTodoId(null);
    setEditingTitle('');
  };

  const handleSaveEditing = async () => {
    if (editingTodoId === null) {
      return;
    }

    const todo = todos.find(t => t.id === editingTodoId);

    if (!todo) {
      handleCancelEditing();

      return;
    }

    const trimmedTitle = editingTitle.trim();

    if (trimmedTitle === todo.title) {
      handleCancelEditing();

      return;
    }

    if (trimmedTitle === '') {
      setLoadingTodoIds(prev => [...prev, editingTodoId]);
      try {
        await apiDeleteTodo(editingTodoId);
        setTodos(prev => prev.filter(t => t.id !== editingTodoId));
        handleCancelEditing();
      } catch {
        setError('Unable to delete a todo');
      } finally {
        setLoadingTodoIds(prev => prev.filter(id => id !== editingTodoId));
      }

      return;
    }

    setLoadingTodoIds(prev => [...prev, editingTodoId]);
    try {
      const updatedTodo = await apiUpdateTodo(editingTodoId, {
        title: trimmedTitle,
      });

      setTodos(prev =>
        prev.map(t =>
          t.id === editingTodoId ? { ...t, title: updatedTodo.title } : t,
        ),
      );
      handleCancelEditing();
    } catch {
      setError('Unable to update a todo');
    } finally {
      setLoadingTodoIds(prev => prev.filter(id => id !== editingTodoId));
    }
  };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          title={title}
          onTitleChange={setTitle}
          onAdd={handleAddTodo}
          inputRef={inputRef}
          disabled={!!tempTodo}
          allCompleted={todos.length > 0 && todos.every(todo => todo.completed)}
          toggleAll={handleToggleAll}
          disabledToggleAll={loadingTodoIds.length > 0}
          isVisible={todos.length > 0}
          // isVisible={todos.length > 0 && !loadingTodoIds}
          // isVisible={todos.length > 0 && loadingTodoIds.length === 0}
        />

        <TodoList
          todos={filteredTodos}
          onDelete={handleDeleteTodo}
          onToggle={handleToggleStatus}
          onUpdateTitle={handleUpdateTitle}
          loadingTodoIds={loadingTodoIds}
          tempTodo={tempTodo}
          onStartEditing={handleStartEditing}
          onChangeEditingTitle={handleChangeEditingTitle}
          onSaveEditing={handleSaveEditing}
        />

        {todos.length > 0 && (
          <Footer
            todos={todos}
            filter={filter}
            setFilter={setFilter}
            onClearCompleted={handleClearCompleted}
          />
        )}
      </div>

      <ErrorNotification error={error} onClose={handleCloseError} />
    </div>
  );
};
