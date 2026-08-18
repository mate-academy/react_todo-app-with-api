import React, { useEffect, useRef, useState } from 'react';

import {
  createTodo,
  deleteTodo,
  getTodos,
  updateTodo,
  USER_ID,
} from './api/todos';

import { ErrorNotification } from './components/ErrorNotification';
import { TodoFooter } from './components/TodoFooter';
import { TodoHeader } from './components/TodoHeader';
import { TodoList } from './components/TodoList';
import { Todo } from './types/Todo';
import { UserWarning } from './UserWarning';

type Filter = 'All' | 'Active' | 'Completed';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [filter, setFilter] = useState<Filter>('All');

  const [title, setTitle] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);

  const [loadingIds, setLoadingIds] = useState<Set<number>>(new Set());

  const [editingTodoId, setEditingTodoId] = useState<number | null>(null);

  const [editTitle, setEditTitle] = useState('');

  const inputRef = useRef<HTMLInputElement>(null);

  const editInputRef = useRef<HTMLInputElement>(null);

  const errorTimerRef = useRef<number | null>(null);

  const editRequestStartedRef = useRef(false);

  const hideError = () => {
    if (errorTimerRef.current !== null) {
      window.clearTimeout(errorTimerRef.current);
      errorTimerRef.current = null;
    }

    setErrorMessage('');
  };

  const showError = (message: string) => {
    if (errorTimerRef.current !== null) {
      window.clearTimeout(errorTimerRef.current);
    }

    setErrorMessage(message);

    errorTimerRef.current = window.setTimeout(() => {
      setErrorMessage('');
      errorTimerRef.current = null;
    }, 3000);
  };

  const startLoading = (todoId: number) => {
    setLoadingIds(currentIds => {
      const nextIds = new Set(currentIds);

      nextIds.add(todoId);

      return nextIds;
    });
  };

  const stopLoading = (todoId: number) => {
    setLoadingIds(currentIds => {
      const nextIds = new Set(currentIds);

      nextIds.delete(todoId);

      return nextIds;
    });
  };

  const updateTodoInState = (todoId: number, changes: Partial<Todo>) => {
    setTodos(currentTodos =>
      currentTodos.map(todo =>
        todo.id === todoId
          ? {
            ...todo,
            ...changes,
          }
          : todo,
      ),
    );
  };

  useEffect(() => {
    getTodos()
      .then(loadedTodos => {
        setTodos(loadedTodos);
      })
      .catch(() => {
        showError('Unable to load todos');
      });

    return () => {
      if (errorTimerRef.current !== null) {
        window.clearTimeout(errorTimerRef.current);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!isAdding && editingTodoId === null) {
      inputRef.current?.focus();
    }
  }, [isAdding, editingTodoId]);

  useEffect(() => {
    if (editingTodoId !== null) {
      editInputRef.current?.focus();
    }
  }, [editingTodoId]);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    hideError();

    const trimmedTitle = title.trim();

    if (!trimmedTitle) {
      showError('Title should not be empty');

      inputRef.current?.focus();

      return;
    }

    setIsAdding(true);

    setTempTodo({
      id: 0,
      userId: USER_ID,
      title: trimmedTitle,
      completed: false,
    });

    createTodo(trimmedTitle)
      .then(createdTodo => {
        setTodos(currentTodos => [...currentTodos, createdTodo]);

        setTitle('');
      })
      .catch(() => {
        showError('Unable to add a todo');
      })
      .finally(() => {
        setIsAdding(false);
        setTempTodo(null);

        inputRef.current?.focus();
      });
  };

  const handleDelete = (todoId: number) => {
    hideError();

    startLoading(todoId);

    deleteTodo(todoId)
      .then(() => {
        setTodos(currentTodos =>
          currentTodos.filter(todo => todo.id !== todoId),
        );
      })
      .catch(() => {
        showError('Unable to delete a todo');
      })
      .finally(() => {
        stopLoading(todoId);

        inputRef.current?.focus();
      });
  };

  const handleToggle = (todo: Todo) => {
    hideError();

    startLoading(todo.id);

    updateTodo(todo.id, {
      completed: !todo.completed,
    })
      .then(updatedTodo => {
        updateTodoInState(todo.id, updatedTodo);
      })
      .catch(() => {
        showError('Unable to update a todo');
      })
      .finally(() => {
        stopLoading(todo.id);
      });
  };

  const allCompleted = todos.length > 0 && todos.every(todo => todo.completed);

  const handleToggleAll = () => {
    hideError();

    const newStatus = !allCompleted;

    const todosToUpdate = todos.filter(todo => todo.completed !== newStatus);

    todosToUpdate.forEach(todo => {
      startLoading(todo.id);
    });

    const requests = todosToUpdate.map(todo =>
      updateTodo(todo.id, {
        completed: newStatus,
      }),
    );

    Promise.allSettled(requests)
      .then(results => {
        results.forEach((result, index) => {
          const todo = todosToUpdate[index];

          if (result.status === 'fulfilled') {
            updateTodoInState(todo.id, result.value);
          }
        });

        if (results.some(result => result.status === 'rejected')) {
          showError('Unable to update a todo');
        }
      })
      .finally(() => {
        todosToUpdate.forEach(todo => {
          stopLoading(todo.id);
        });
      });
  };

  const handleEditStart = (todo: Todo) => {
    if (loadingIds.has(todo.id)) {
      return;
    }

    setEditingTodoId(todo.id);
    setEditTitle(todo.title);

    editRequestStartedRef.current = false;
  };

  const cancelEditing = () => {
    editRequestStartedRef.current = false;

    setEditingTodoId(null);
    setEditTitle('');
  };

  const handleEditSubmit = (event?: React.FormEvent<HTMLFormElement>) => {
    event?.preventDefault();

    if (editingTodoId === null) {
      return;
    }

    if (editRequestStartedRef.current) {
      return;
    }

    const todo = todos.find(currentTodo => currentTodo.id === editingTodoId);

    if (!todo) {
      cancelEditing();

      return;
    }

    const trimmedTitle = editTitle.trim();

    if (trimmedTitle === todo.title) {
      cancelEditing();

      return;
    }

    if (!trimmedTitle) {
      editRequestStartedRef.current = true;

      startLoading(todo.id);

      deleteTodo(todo.id)
        .then(() => {
          setTodos(currentTodos =>
            currentTodos.filter(currentTodo => currentTodo.id !== todo.id),
          );

          setEditingTodoId(null);
          setEditTitle('');
        })
        .catch(() => {
          showError('Unable to delete a todo');
        })
        .finally(() => {
          editRequestStartedRef.current = false;
          stopLoading(todo.id);
        });

      return;
    }

    editRequestStartedRef.current = true;

    startLoading(todo.id);

    updateTodo(todo.id, {
      title: trimmedTitle,
    })
      .then(updatedTodo => {
        updateTodoInState(todo.id, updatedTodo);

        setEditingTodoId(null);
        setEditTitle('');
      })
      .catch(() => {
        showError('Unable to update a todo');

        // форму НЕ закриваємо
      })
      .finally(() => {
        editRequestStartedRef.current = false;
        stopLoading(todo.id);
      });
  };

  const handleEditKeyUp = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Escape') {
      cancelEditing();
    }
  };

  const handleClearCompleted = () => {
    hideError();

    const completedTodos = todos.filter(todo => todo.completed);

    completedTodos.forEach(todo => {
      startLoading(todo.id);
    });

    const requests = completedTodos.map(todo => deleteTodo(todo.id));

    Promise.allSettled(requests)
      .then(results => {
        const deletedIds = completedTodos
          .filter((_, index) => results[index].status === 'fulfilled')
          .map(todo => todo.id);

        setTodos(currentTodos =>
          currentTodos.filter(todo => !deletedIds.includes(todo.id)),
        );

        if (results.some(result => result.status === 'rejected')) {
          showError('Unable to delete a todo');
        }
      })
      .finally(() => {
        completedTodos.forEach(todo => {
          stopLoading(todo.id);
        });

        inputRef.current?.focus();
      });
  };

  let visibleTodos = todos;

  switch (filter) {
    case 'Active':
      visibleTodos = todos.filter(todo => !todo.completed);
      break;

    case 'Completed':
      visibleTodos = todos.filter(todo => todo.completed);
      break;

    case 'All':
    default:
      visibleTodos = todos;
  }

  const activeTodosCount = todos.filter(todo => !todo.completed).length;

  const hasCompletedTodos = todos.some(todo => todo.completed);

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
          hasTodos={todos.length > 0}
          allCompleted={allCompleted}
          inputRef={inputRef}
          onTitleChange={setTitle}
          onSubmit={handleSubmit}
          onToggleAll={handleToggleAll}
        />

        {(todos.length > 0 || tempTodo !== null) && (
          <TodoList
            todos={visibleTodos}
            tempTodo={tempTodo}
            loadingIds={loadingIds}
            editingTodoId={editingTodoId}
            editTitle={editTitle}
            editInputRef={editInputRef}
            onToggle={handleToggle}
            onDelete={handleDelete}
            onEditStart={handleEditStart}
            onEditChange={setEditTitle}
            onEditSubmit={handleEditSubmit}
            onEditKeyUp={handleEditKeyUp}
          />
        )}

        {todos.length > 0 && (
          <TodoFooter
            filter={filter}
            activeTodosCount={activeTodosCount}
            hasCompletedTodos={hasCompletedTodos}
            onFilterChange={setFilter}
            onClearCompleted={handleClearCompleted}
          />
        )}
      </div>

      <ErrorNotification errorMessage={errorMessage} onHide={hideError} />
    </div>
  );
};
