/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { UserWarning } from './UserWarning';
import { deleteTodos, getTodos, postTodos, updateTodos } from './api/todos';
import { Todo } from './types/Todo';
import { Header } from './components/Header/Header';
import { TodoList } from './components/TodoList/TodoList';
import { Filters, ErrorsMessage } from './types/enums';
import { USER_ID } from './consts/consts';
import { Footer } from './components/Footer/Footer';
// eslint-disable-next-line max-len
import { ErrorNotification } from './components/ErrorNotifications/ErrorNotifications';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState(Filters.all);
  const [title, setTitle] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [addingTodoId, setAddingTodoId] = useState<number | null>(null);
  const [deletingTodoIds, setDeletingTodoIds] = useState<number[]>([]);
  const [updatingTodoIds, setUpdatingTodoIds] = useState<number[]>([]);
  const [editingTodoId, setEditingTodoId] = useState<number | null>(null);
  const [editingTodoTitle, setEditingTodoTitle] = useState('');
  const editTitleRef = useRef<HTMLInputElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!USER_ID) {
      return;
    }

    const todosFromServer = async () => {
      try {
        const preparedTodos = await getTodos();

        setTodos(preparedTodos);
      } catch {
        setError(ErrorsMessage.loadError);
      }
    };

    todosFromServer();
  }, []);

  useEffect(() => {
    if (!error) {
      return;
    }

    const timer = setTimeout(() => setError(''), 3000);

    return () => clearTimeout(timer);
  }, [error]);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const focusTitleInput = useCallback(() => {
    if (inputRef.current && editingTodoId === null) {
      setTimeout(() => inputRef.current?.focus(), 0);
    }
  }, [editingTodoId]);

  const getFilteredTodos = (todoList: Todo[], query: string) => {
    switch (query) {
      case Filters.active:
        return todoList.filter(todo => !todo.completed);
      case Filters.completed:
        return todoList.filter(todo => todo.completed);
      default:
        return todoList;
    }
  };

  const visibleTodos = getFilteredTodos(todos, filter);

  interface TempTodo extends Todo {
    isTemp?: boolean;
  }

  const items = todos.filter(
    todo => !todo.completed && !(todo as TempTodo).isTemp,
  );

  const handleAddTodo = async (event: React.FormEvent) => {
    event.preventDefault();
    const trimmedTitle = title.trim();

    if (!trimmedTitle) {
      setError(ErrorsMessage.titleError);

      return;
    }

    setIsAdding(true);
    const tempId = Date.now();

    setAddingTodoId(tempId);

    const tempTodo: Todo & { isTemp?: boolean } = {
      id: tempId,
      title: trimmedTitle,
      completed: false,
      userId: USER_ID,
      isTemp: true,
    };

    setTodos(prev => [...prev, tempTodo]);

    try {
      const newTodo = await postTodos({
        title: trimmedTitle,
        userId: USER_ID,
        completed: false,
      });

      setTodos(prev => prev.map(todo => (todo.id === tempId ? newTodo : todo)));
      setTitle('');
    } catch {
      setError(ErrorsMessage.addingError);
      setTodos(prev => prev.filter(todo => todo.id !== tempId));
    } finally {
      setIsAdding(false);
      setAddingTodoId(null);
      focusTitleInput();
    }
  };

  const handleDeleteTodo = async (todoId: number) => {
    setDeletingTodoIds(prev => [...prev, todoId]);
    try {
      await deleteTodos(todoId);
      setTodos(prev => prev.filter(todo => todo.id !== todoId));
    } catch {
      setError(ErrorsMessage.deleteError);
    } finally {
      setDeletingTodoIds(prev => prev.filter(id => id !== todoId));
      focusTitleInput();
    }
  };

  const handleDeleteCompleteTodo = async () => {
    const completedIds = todos.filter(t => t.completed).map(t => t.id);

    if (!completedIds.length) {
      return;
    }

    setDeletingTodoIds(prev => [...prev, ...completedIds]);

    try {
      const results = await Promise.allSettled(
        completedIds.map(id => deleteTodos(id)),
      );
      const hasError = results.some(r => r.status === 'rejected');

      if (hasError) {
        setError(ErrorsMessage.deleteError);
      }

      const successfulIds = completedIds.filter(
        (_, i) => results[i].status === 'fulfilled',
      );

      setTodos(prev => prev.filter(todo => !successfulIds.includes(todo.id)));
    } finally {
      setDeletingTodoIds([]);
      focusTitleInput();
    }
  };

  const handleToggleTodo = async (todo: Todo) => {
    setUpdatingTodoIds(prev => [...prev, todo.id]);
    try {
      const updatedTodo = await updateTodos(todo.id, {
        completed: !todo.completed,
      });

      setTodos(prev => prev.map(t => (t.id === todo.id ? updatedTodo : t)));
    } catch {
      setError(ErrorsMessage.updateError);
    } finally {
      setUpdatingTodoIds(prev => prev.filter(id => id !== todo.id));
    }
  };

  const handleToggleAll = async () => {
    const allCompleted = todos.every(todo => todo.completed);
    const updatedStatus = !allCompleted;
    const todosToUpdate = todos.filter(
      todo => todo.completed !== updatedStatus,
    );

    setUpdatingTodoIds(prev => [...prev, ...todosToUpdate.map(t => t.id)]);

    try {
      const updatedTodos = await Promise.all(
        todosToUpdate.map(todo =>
          updateTodos(todo.id, { completed: updatedStatus }).catch(() => {
            setError(ErrorsMessage.updateError);

            return todo;
          }),
        ),
      );

      setTodos(prev =>
        prev.map(todo => {
          const updated = updatedTodos.find(t => t.id === todo.id);

          return updated ?? todo;
        }),
      );
    } finally {
      setUpdatingTodoIds(prev =>
        prev.filter(id => !todosToUpdate.some(t => t.id === id)),
      );
    }
  };

  const handleEditing = useCallback((todo: Todo) => {
    setEditingTodoId(todo.id);
    setEditingTodoTitle(todo.title);
  }, []);

  const handleEditingChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setEditingTodoTitle(event.target.value);
    },
    [],
  );

  const handleEditCancel = useCallback(
    (event: React.KeyboardEvent<HTMLInputElement>) => {
      if (event.key === 'Escape') {
        setEditingTodoId(null);
      }
    },
    [],
  );

  const handleEditSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (editingTodoId === null) {
      return;
    }

    const trimmedTitle = editingTodoTitle.trim();
    const currentTodo = todos.find(t => t.id === editingTodoId);

    if (!currentTodo) {
      return;
    }

    if (!trimmedTitle) {
      handleDeleteTodo(editingTodoId);

      return;
    }

    if (trimmedTitle === currentTodo.title) {
      setEditingTodoId(null);

      return;
    }

    setUpdatingTodoIds(prev => [...prev, editingTodoId]);

    try {
      const updatedTodo = await updateTodos(editingTodoId, {
        title: trimmedTitle,
      });

      setTodos(prev =>
        prev.map(todo => (todo.id === editingTodoId ? updatedTodo : todo)),
      );
      setEditingTodoId(null);
    } catch {
      setError(ErrorsMessage.updateError);
    } finally {
      setUpdatingTodoIds(prev => prev.filter(id => id !== editingTodoId));
    }
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
          title={title}
          setTitle={setTitle}
          isAdding={isAdding}
          handleToggleAll={handleToggleAll}
          handleAddTodo={handleAddTodo}
          ref={inputRef}
        />

        <TodoList
          visibleTodos={visibleTodos}
          handleToggleTodo={handleToggleTodo}
          editingTodoId={editingTodoId}
          handleEditSubmit={handleEditSubmit}
          editTitleRef={editTitleRef}
          editingTodoTitle={editingTodoTitle}
          handleEditingChange={handleEditingChange}
          handleEditCancel={handleEditCancel}
          updatingTodoIds={updatingTodoIds}
          handleEditing={handleEditing}
          handleDeleteTodo={handleDeleteTodo}
          addingTodoId={addingTodoId}
          deletingTodoIds={deletingTodoIds}
        />

        {todos.length > 0 && (
          <Footer
            todos={todos}
            items={items}
            filter={filter}
            setFilter={setFilter}
            handleDeleteCompleteTodo={handleDeleteCompleteTodo}
          />
        )}
      </div>

      <ErrorNotification error={error} setError={setError} />
    </div>
  );
};
