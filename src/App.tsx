import React, { useState, useEffect, useRef } from 'react';
import { UserWarning } from './UserWarning';
import {
  USER_ID,
  getTodos,
  addTodo,
  deleteTodo,
  updateTodo,
} from './api/todos';
import { Todo } from './types/Todo';
import { Header } from './Components/Header';
import { TodoList } from './Components/TodoList';
import { Footer } from './Components/Footer';
import { ErrorNotification } from './Components/ErrorNotification';
import { ErrorMessage } from './types/Errors';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [title, setTitle] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [processingIds, setProcessingIds] = useState<number[]>([]);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const newTodoField = useRef<HTMLInputElement>(null);

  const visibleTodos = todos.filter(todo => {
    if (filterStatus === 'Active') {
      return !todo.completed;
    }

    if (filterStatus === 'Completed') {
      return todo.completed;
    }

    return true;
  });

  const activeTodosCount = todos.filter(todo => !todo.completed).length;
  const areAllCompleted =
    todos.length > 0 && todos.every(todo => todo.completed);

  const triggerError = (message: string) => {
    setErrorMessage(message);
    setTimeout(() => {
      setErrorMessage('');
    }, 3000);
  };

  useEffect(() => {
    if (!USER_ID) {
      return;
    }

    setErrorMessage('');
    getTodos()
      .then(data => {
        setTodos(data);
      })
      .catch(() => {
        triggerError(ErrorMessage.Load);
      });
  }, []);

  const handleToggle = (todoToUpdate: Todo) => {
    setErrorMessage('');
    setProcessingIds(current => [...current, todoToUpdate.id]);

    updateTodo(todoToUpdate.id, { completed: !todoToUpdate.completed })
      .then(updatedTodo => {
        setTodos(currentTodos =>
          currentTodos.map(todo =>
            todo.id === todoToUpdate.id ? updatedTodo : todo,
          ),
        );
      })
      .catch(() => {
        triggerError(ErrorMessage.Update);
      })
      .finally(() => {
        setProcessingIds(current =>
          current.filter(id => id !== todoToUpdate.id),
        );
      });
  };

  const handleToggleAll = () => {
    const targetStatus = !areAllCompleted;

    const todosToUpdate = todos.filter(todo => todo.completed !== targetStatus);

    if (todosToUpdate.length === 0) {
      return;
    }

    setErrorMessage('');

    const idsToUpdate = todosToUpdate.map(todo => todo.id);

    setProcessingIds(current => [...current, ...idsToUpdate]);

    const updatePromises = todosToUpdate.map(todo => {
      return updateTodo(todo.id, { completed: targetStatus })
        .then(updatedTodo => {
          setTodos(currentTodos =>
            currentTodos.map(t => (t.id === todo.id ? updatedTodo : t)),
          );
        })
        .catch(error => {
          throw error;
        })
        .finally(() => {
          setProcessingIds(current => current.filter(id => id !== todo.id));
        });
    });

    Promise.all(updatePromises).catch(() => {
      triggerError(ErrorMessage.Update);
    });
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    if (!title.trim()) {
      triggerError(ErrorMessage.EmptyTitle);

      return;
    }

    setErrorMessage('');
    setIsSubmitting(true);

    setTempTodo({
      id: 0,
      title: title.trim(),
      completed: false,
      userId: USER_ID,
    });

    addTodo({
      title: title.trim(),
      completed: false,
      userId: USER_ID,
    })
      .then(newTodo => {
        setTodos(currentTodos => [...currentTodos, newTodo]);
        setTitle('');
      })
      .catch(() => {
        triggerError(ErrorMessage.Add);
      })
      .finally(() => {
        setTempTodo(null);
        setIsSubmitting(false);
      });
  };

  const handleDelete = (todoId: number) => {
    setErrorMessage('');
    setProcessingIds(current => [...current, todoId]);

    deleteTodo(todoId)
      .then(() => {
        setTodos(currentTodos =>
          currentTodos.filter(todo => todo.id !== todoId),
        );
      })
      .catch(() => {
        triggerError(ErrorMessage.Delete);
      })
      .finally(() => {
        setProcessingIds(current => current.filter(id => id !== todoId));
        newTodoField.current?.focus();
      });
  };

  const handleRename = (todoId: number, newTitle: string) => {
    const trimmedTitle = newTitle.trim();

    if (!trimmedTitle) {
      setErrorMessage('');
      setProcessingIds(current => [...current, todoId]);

      return deleteTodo(todoId)
        .then(() => {
          setTodos(currentTodos =>
            currentTodos.filter(todo => todo.id !== todoId),
          );
        })
        .catch(error => {
          triggerError(ErrorMessage.Delete);
          throw error;
        })
        .finally(() => {
          setProcessingIds(current => current.filter(id => id !== todoId));
        });
    }

    setErrorMessage('');
    setProcessingIds(current => [...current, todoId]);

    return updateTodo(todoId, { title: trimmedTitle })
      .then(updatedTodo => {
        setTodos(currentTodos =>
          currentTodos.map(todo => (todo.id === todoId ? updatedTodo : todo)),
        );
      })
      .catch(error => {
        triggerError(ErrorMessage.Update);
        throw error;
      })
      .finally(() => {
        setProcessingIds(current => current.filter(id => id !== todoId));
      });
  };

  if (!USER_ID) {
    return <UserWarning />;
  }

  const hasCompletedTodos = todos.some(todo => todo.completed);

  const handleClearCompleted = () => {
    const completedTodos = todos.filter(todo => todo.completed);

    setErrorMessage('');
    setProcessingIds(current => [...current, ...completedTodos.map(t => t.id)]);

    const deletePromises = completedTodos.map(todo => {
      return deleteTodo(todo.id)
        .then(() => {
          setTodos(currentTodos => currentTodos.filter(t => t.id !== todo.id));
        })
        .catch(error => {
          throw error;
        })
        .finally(() => {
          setProcessingIds(current => current.filter(id => id !== todo.id));
        });
    });

    Promise.all(deletePromises)
      .catch(() => {
        triggerError(ErrorMessage.Delete);
      })
      .finally(() => {
        newTodoField.current?.focus();
      });
  };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          title={title}
          onTitleChange={setTitle}
          onSubmit={handleSubmit}
          isSubmitting={isSubmitting}
          inputRef={newTodoField}
          onToggleAll={handleToggleAll}
          areAllCompleted={areAllCompleted}
          hasTodos={todos.length > 0}
        />

        {(todos.length > 0 || tempTodo) && (
          <TodoList
            todos={visibleTodos}
            processingIds={processingIds}
            onDelete={handleDelete}
            onToggle={handleToggle}
            onRename={handleRename}
            tempTodo={tempTodo}
          />
        )}

        {todos.length > 0 && (
          <Footer
            activeTodosCount={activeTodosCount}
            filterStatus={filterStatus}
            onFilterChange={setFilterStatus}
            hasCompleted={hasCompletedTodos}
            onClearCompleted={handleClearCompleted}
          />
        )}
      </div>

      <ErrorNotification
        message={errorMessage}
        onClose={() => setErrorMessage('')}
      />
    </div>
  );
};
