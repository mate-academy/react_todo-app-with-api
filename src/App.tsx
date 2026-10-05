import React, { useEffect, useState, useRef } from 'react';
import { UserWarning } from './UserWarning';
import { Todo } from './types/Todo';
import { FilterStatus } from './types/Filter';
import { ErrorText } from './types/Errors';
import {
  getTodos,
  createTodo,
  deleteTodo,
  updateTodo,
  USER_ID,
} from './api/todos';

import { Header } from './components/Header';
import { TodoList } from './components/TodoList';
import { Footer } from './components/Footer';
import { ErrorNotification } from './components/ErrorNotification';
import { useVisibleTodos } from './hooks/useVisibleTodos';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [errorMessage, setErrorMessage] = useState<ErrorText | ''>('');
  const [filter, setFilter] = useState<FilterStatus>(FilterStatus.All);

  const [newTodoTitle, setNewTodoTitle] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [loadingTodoIds, setLoadingTodoIds] = useState<number[]>([]);

  const [editingTodoId, setEditingTodoId] = useState<number | null>(null);
  const [editTitle, setEditTitle] = useState('');

  const newTodoFieldRef = useRef<HTMLInputElement>(null);

  // Вызываем хук ДО любых if-условий (до !USER_ID)
  const visibleTodos = useVisibleTodos(todos, filter);

  useEffect(() => {
    setErrorMessage('');
    getTodos()
      .then(setTodos)
      .catch(() => setErrorMessage(ErrorText.Load));
  }, []);

  useEffect(() => {
    if (!errorMessage) {
      return;
    }

    const timer = setTimeout(() => setErrorMessage(''), 3000);

    return () => clearTimeout(timer);
  }, [errorMessage]);

  if (!USER_ID) {
    return <UserWarning />;
  }

  const handleAddTodo = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedTitle = newTodoTitle.trim();

    if (!trimmedTitle) {
      setErrorMessage(ErrorText.EmptyTitle);

      return;
    }

    setErrorMessage('');
    setIsSubmitting(true);
    setTempTodo({
      id: 0,
      userId: USER_ID,
      title: trimmedTitle,
      completed: false,
    });

    createTodo({ title: trimmedTitle, userId: USER_ID, completed: false })
      .then(newTodo => {
        setTodos(prev => [...prev, newTodo]);
        setNewTodoTitle('');
      })
      .catch(() => setErrorMessage(ErrorText.Add))
      .finally(() => {
        setTempTodo(null);
        setIsSubmitting(false);
        setTimeout(() => {
          if (newTodoFieldRef.current) {
            newTodoFieldRef.current.focus();
          }
        }, 0);
      });
  };

  const handleDelete = (todoId: number) => {
    setErrorMessage('');
    setLoadingTodoIds(prev => [...prev, todoId]);

    return deleteTodo(todoId)
      .then(() => {
        setTodos(prev => prev.filter(t => t.id !== todoId));
        setTimeout(() => {
          if (newTodoFieldRef.current) {
            newTodoFieldRef.current.focus();
          }
        }, 0);
      })
      .catch(() => {
        setErrorMessage(ErrorText.Delete);
        throw new Error();
      })
      .finally(() => {
        setLoadingTodoIds(prev => prev.filter(id => id !== todoId));
      });
  };

  const handleClearCompleted = () => {
    const completedTodos = todos.filter(t => t.completed);

    completedTodos.forEach(todo => {
      handleDelete(todo.id);
    });
  };

  const handleUpdate = (todoId: number, data: Partial<Todo>) => {
    setErrorMessage('');
    setLoadingTodoIds(prev => [...prev, todoId]);

    return updateTodo(todoId, data)
      .then(updated => {
        setTodos(prev => prev.map(t => (t.id === todoId ? updated : t)));
      })
      .catch(() => {
        setErrorMessage(ErrorText.Update);
        throw new Error();
      })
      .finally(() => {
        setLoadingTodoIds(prev => prev.filter(id => id !== todoId));
      });
  };

  const renameTodo = (todoId: number, newTitle: string) => {
    const trimmed = newTitle.trim();
    const currentTodo = todos.find(t => t.id === todoId);

    if (!currentTodo || trimmed === currentTodo.title) {
      setEditingTodoId(null);

      return;
    }

    if (!trimmed) {
      handleDelete(todoId)
        .then(() => setEditingTodoId(null))
        .catch(() => {});

      return;
    }

    handleUpdate(todoId, { title: trimmed })
      .then(() => setEditingTodoId(null))
      .catch(() => {});
  };

  const handleToggleAll = () => {
    const activeCount = todos.filter(t => !t.completed).length;
    const targetStatus = activeCount > 0;
    const todosToUpdate = todos.filter(t => t.completed !== targetStatus);

    todosToUpdate.forEach(todo => {
      handleUpdate(todo.id, { completed: targetStatus });
    });
  };

  const activeTodosCount = todos.filter(t => !t.completed).length;
  const hasCompletedTodos = todos.some(t => t.completed);
  const isAllCompleted = todos.length > 0 && activeTodosCount === 0;

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          title={newTodoTitle}
          onChange={setNewTodoTitle}
          onSubmit={handleAddTodo}
          disabled={isSubmitting}
          inputRef={newTodoFieldRef}
          isAllCompleted={isAllCompleted}
          hasTodos={todos.length > 0}
          onToggleAll={handleToggleAll}
        />

        {(todos.length > 0 || tempTodo) && (
          <>
            <TodoList
              todos={visibleTodos}
              tempTodo={tempTodo}
              loadingTodoIds={loadingTodoIds}
              editingTodoId={editingTodoId}
              editTitle={editTitle}
              onDelete={handleDelete}
              onUpdate={handleUpdate}
              onRename={renameTodo}
              setEditingTodoId={setEditingTodoId}
              setEditTitle={setEditTitle}
            />

            <Footer
              activeCount={activeTodosCount}
              filter={filter}
              setFilter={setFilter}
              hasCompleted={hasCompletedTodos}
              onClearCompleted={handleClearCompleted}
            />
          </>
        )}
      </div>

      <ErrorNotification
        errorMessage={errorMessage}
        onClose={() => setErrorMessage('')}
      />
    </div>
  );
};
