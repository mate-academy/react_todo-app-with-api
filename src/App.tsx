/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useRef, useState } from 'react';
import {
  addTodo,
  deleteTodo,
  getTodos,
  updateTodo,
  USER_ID,
} from './api/todos';
import { ErrorNotification } from './components/ErrorNotification';
import { Footer } from './components/Footer';
import { Header } from './components/Header';
import { TodoList } from './components/TodoList';
import { Todo } from './types/Todo';
import { UserWarning } from './UserWarning';

export const App: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');
  const [newTitle, setNewTitle] = useState('');
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [processingIds, setProcessingIds] = useState<number[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [editingTodoId, setEditingTodoId] = useState<number | null>(null);
  const [editingTitle, setEditingTitle] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const activeTodosCount = todos.filter(todo => !todo.completed).length;
  const hasTodos = todos.length > 0;
  const areAllCompleted = hasTodos && activeTodosCount === 0;

  const filteredTodos = todos.filter(todo => {
    if (filter === 'active') {
      return !todo.completed;
    }

    if (filter === 'completed') {
      return todo.completed;
    }

    return true;
  });

  const handleError = (message: string) => {
    setErrorMessage(message);

    setTimeout(() => {
      setErrorMessage('');
    }, 3000);
  };

  useEffect(() => {
    setErrorMessage('');

    getTodos()
      .then(loadedTodos => {
        setTodos(loadedTodos);
      })
      .catch(() => {
        handleError('Unable to load todos');
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    if (!isAdding) {
      inputRef.current?.focus();
    }
  }, [isAdding]);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    setErrorMessage('');

    const trimmedTitle = newTitle.trim();

    if (!trimmedTitle) {
      handleError('Title should not be empty');
      inputRef.current?.focus();

      return;
    }

    const nextTempTodo: Todo = {
      id: 0,
      userId: USER_ID,
      title: trimmedTitle,
      completed: false,
    };

    setIsAdding(true);
    setTempTodo(nextTempTodo);

    addTodo(trimmedTitle)
      .then(createdTodo => {
        setTodos(currentTodos => [...currentTodos, createdTodo]);
        setNewTitle('');
      })
      .catch(() => {
        handleError('Unable to add a todo');
      })
      .finally(() => {
        setTempTodo(null);
        setIsAdding(false);
      });
  };

  const handleCancelEditing = () => {
    setEditingTodoId(null);
    setEditingTitle('');
  };

  const handleDeleteTodo = (todoId: number) => {
    setErrorMessage('');
    setProcessingIds(currentIds => [...currentIds, todoId]);

    deleteTodo(todoId)
      .then(() => {
        setTodos(currentTodos =>
          currentTodos.filter(todo => todo.id !== todoId),
        );

        if (editingTodoId === todoId) {
          handleCancelEditing();
        }

        inputRef.current?.focus();
      })
      .catch(() => {
        handleError('Unable to delete a todo');
      })
      .finally(() => {
        setProcessingIds(currentIds => currentIds.filter(id => id !== todoId));
      });
  };

  const handleClearCompleted = () => {
    const completedTodos = todos.filter(todo => todo.completed);

    completedTodos.forEach(todo => {
      handleDeleteTodo(todo.id);
    });
  };

  const handleToggleTodo = (todo: Todo) => {
    setErrorMessage('');
    setProcessingIds(currentIds => [...currentIds, todo.id]);

    updateTodo(todo.id, { completed: !todo.completed })
      .then(() => {
        setTodos(currentTodos =>
          currentTodos.map(t =>
            t.id === todo.id ? { ...t, completed: !t.completed } : t,
          ),
        );
      })
      .catch(() => {
        handleError('Unable to update a todo');
      })
      .finally(() => {
        setProcessingIds(currentIds => currentIds.filter(id => id !== todo.id));
      });
  };

  const handleToggleAll = () => {
    const nextCompletedState = !areAllCompleted;

    todos.forEach(todo => {
      if (todo.completed !== nextCompletedState) {
        handleToggleTodo(todo);
      }
    });
  };

  const handleStartEditing = (todo: Todo) => {
    setEditingTodoId(todo.id);
    setEditingTitle(todo.title);
  };

  const handleRenameTodo = (todo: Todo) => {
    if (editingTodoId !== todo.id) {
      return;
    }

    const trimmedTitle = editingTitle.trim();

    if (trimmedTitle === todo.title) {
      handleCancelEditing();

      return;
    }

    if (!trimmedTitle) {
      handleDeleteTodo(todo.id);

      return;
    }

    setErrorMessage('');
    setProcessingIds(currentIds => [...currentIds, todo.id]);

    updateTodo(todo.id, { title: trimmedTitle })
      .then(updatedTodo => {
        setTodos(currentTodos =>
          currentTodos.map(currentTodo =>
            currentTodo.id === todo.id ? updatedTodo : currentTodo,
          ),
        );
        handleCancelEditing();
      })
      .catch(() => {
        handleError('Unable to update a todo');
      })
      .finally(() => {
        setProcessingIds(currentIds => currentIds.filter(id => id !== todo.id));
      });
  };

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          areAllCompleted={areAllCompleted}
          hasTodos={hasTodos}
          inputRef={inputRef}
          isAdding={isAdding}
          newTitle={newTitle}
          onSubmit={handleSubmit}
          onTitleChange={setNewTitle}
          onToggleAll={handleToggleAll}
        />

        <TodoList
          editingTitle={editingTitle}
          editingTodoId={editingTodoId}
          loading={loading}
          onCancelEditing={handleCancelEditing}
          onDelete={handleDeleteTodo}
          onEditingTitleChange={setEditingTitle}
          onRename={handleRenameTodo}
          onStartEditing={handleStartEditing}
          onToggle={handleToggleTodo}
          processingIds={processingIds}
          tempTodo={tempTodo}
          todos={filteredTodos}
        />

        <Footer
          filter={filter}
          hasCompleted={todos.some(todo => todo.completed)}
          loading={loading}
          onClearCompleted={handleClearCompleted}
          setFilter={setFilter}
          todos={todos}
        />
      </div>

      <ErrorNotification
        message={errorMessage}
        onClose={() => setErrorMessage('')}
      />
    </div>
  );
};
