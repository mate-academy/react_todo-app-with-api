import React, { FormEvent, useEffect, useRef, useState } from 'react';
import { UserWarning } from './UserWarning';
import {
  createTodo,
  deleteTodo,
  getTodos,
  updateTodo,
  USER_ID,
} from './api/todos';
import { Todo } from './types/Todo';
import { TodoFilter } from './types/TodoFilter';
import { TodoHeader } from './components/TodoHeader';
import { TodoList } from './components/TodoList';
import { TodoFooter } from './components/TodoFooter';
import { ErrorNotification } from './components/ErrorNotification';
export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filter, setFilter] = useState<TodoFilter>('all');
  const [errorMessage, setErrorMessage] = useState('');
  const [title, setTitle] = useState('');
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [deletingTodoIds, setDeletingTodoIds] = useState<number[]>([]);
  const [updatingTodoIds, setUpdatingTodoIds] = useState<number[]>([]);
  const [editingTodoId, setEditingTodoId] = useState<number | null>(null);
  const [editingTitle, setEditingTitle] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  const newTodoField = useRef<HTMLInputElement>(null);

  useEffect(() => {
    getTodos()
      .then(setTodos)
      .catch(() => {
        setErrorMessage('Unable to load todos');
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  useEffect(() => {
    if (!errorMessage) {
      return;
    }

    const timeoutId = setTimeout(() => {
      setErrorMessage('');
    }, 3000);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [errorMessage]);

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();

    const trimmedTitle = title.trim();

    if (!trimmedTitle) {
      setErrorMessage('Title should not be empty');

      return;
    }

    const newTodo: Todo = {
      id: 0,
      userId: USER_ID,
      title: trimmedTitle,
      completed: false,
    };

    setTempTodo(newTodo);
    setIsAdding(true);

    createTodo({
      userId: USER_ID,
      title: trimmedTitle,
      completed: false,
    })
      .then(createdTodo => {
        setTodos(currentTodos => [...currentTodos, createdTodo]);
        setTitle('');
      })
      .catch(() => {
        setErrorMessage('Unable to add a todo');
      })
      .finally(() => {
        setTempTodo(null);
        setIsAdding(false);

        setTimeout(() => {
          newTodoField.current?.focus();
        }, 0);
      });
  };

  const handleDelete = (todoId: number) => {
    setDeletingTodoIds(currentIds => [...currentIds, todoId]);

    deleteTodo(todoId)
      .then(() => {
        setTodos(currentTodos =>
          currentTodos.filter(currentTodo => currentTodo.id !== todoId),
        );

        if (editingTodoId === todoId) {
          setEditingTodoId(null);
        }
      })
      .catch(() => {
        setErrorMessage('Unable to delete a todo');
      })
      .finally(() => {
        setDeletingTodoIds(currentIds =>
          currentIds.filter(id => id !== todoId),
        );

        setTimeout(() => {
          newTodoField.current?.focus();
        }, 0);
      });
  };

  const activeTodosCount = todos.filter(todo => !todo.completed).length;

  const completedTodos = todos.filter(todo => todo.completed);

  const handleClearCompleted = () => {
    completedTodos.forEach(todo => {
      handleDelete(todo.id);
    });
  };

  const handleToggleTodo = (todo: Todo) => {
    setUpdatingTodoIds(currentIds => [...currentIds, todo.id]);

    updateTodo(todo.id, {
      completed: !todo.completed,
    })
      .then(updatedTodo => {
        setTodos(currentTodos =>
          currentTodos.map(currentTodo =>
            currentTodo.id === todo.id ? updatedTodo : currentTodo,
          ),
        );
      })
      .catch(() => {
        setErrorMessage('Unable to update a todo');
      })
      .finally(() => {
        setUpdatingTodoIds(currentIds =>
          currentIds.filter(id => id !== todo.id),
        );
      });
  };

  const handleToggleAll = () => {
    const shouldComplete = todos.some(todo => !todo.completed);

    const todosToUpdate = todos.filter(
      todo => todo.completed !== shouldComplete,
    );

    todosToUpdate.forEach(todo => {
      handleToggleTodo(todo);
    });
  };

  const handleStartEditing = (todo: Todo) => {
    setEditingTodoId(todo.id);
    setEditingTitle(todo.title);
  };

  const handleSaveEditing = (todo: Todo) => {
    const trimmedTitle = editingTitle.trim();

    if (trimmedTitle === todo.title) {
      setEditingTodoId(null);

      return;
    }

    if (!trimmedTitle) {
      handleDelete(todo.id);

      return;
    }

    setUpdatingTodoIds(currentIds => [...currentIds, todo.id]);

    updateTodo(todo.id, {
      title: trimmedTitle,
    })
      .then(updatedTodo => {
        setTodos(currentTodos =>
          currentTodos.map(currentTodo =>
            currentTodo.id === todo.id ? updatedTodo : currentTodo,
          ),
        );

        setEditingTodoId(null);
      })
      .catch(() => {
        setErrorMessage('Unable to update a todo');
      })
      .finally(() => {
        setUpdatingTodoIds(currentIds =>
          currentIds.filter(id => id !== todo.id),
        );
      });
  };

  const visibleTodos = todos.filter(todo => {
    if (filter === 'active') {
      return !todo.completed;
    }

    if (filter === 'completed') {
      return todo.completed;
    }

    return true;
  });

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <TodoHeader
          title={title}
          isAdding={isAdding}
          showToggleAll={!isLoading && todos.length > 0}
          allCompleted={todos.length > 0 && todos.every(todo => todo.completed)}
          inputRef={newTodoField}
          onTitleChange={setTitle}
          onSubmit={handleSubmit}
          onToggleAll={handleToggleAll}
        />

        <TodoList
          todos={visibleTodos}
          tempTodo={tempTodo}
          deletingTodoIds={deletingTodoIds}
          updatingTodoIds={updatingTodoIds}
          editingTodoId={editingTodoId}
          editingTitle={editingTitle}
          onDelete={handleDelete}
          onToggle={handleToggleTodo}
          onStartEditing={handleStartEditing}
          onEditingTitleChange={setEditingTitle}
          onSaveEditing={handleSaveEditing}
          onCancelEditing={() => setEditingTodoId(null)}
        />

        {todos.length > 0 && (
          <TodoFooter
            activeTodosCount={activeTodosCount}
            hasCompletedTodos={completedTodos.length > 0}
            filter={filter}
            onFilterChange={setFilter}
            onClearCompleted={handleClearCompleted}
          />
        )}
      </div>

      <ErrorNotification
        message={errorMessage}
        onHide={() => setErrorMessage('')}
      />
    </div>
  );
};
