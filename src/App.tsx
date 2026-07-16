import React, { useMemo, useState, useEffect, useRef } from 'react';
import * as todoServese from './api/todos';
import { Todo } from './types/Todo';
import { TodoItems } from './components/TodoItems/TodoItems';
import { Header } from './components/Header/Header';
import { Footer } from './components/Footer/Footer';
import { ErrorMessages } from './types/ErrorMessages';
import { ErrorNotification } from './components/ErrorNotif/ErrorNotification';

export enum FilterStatus {
  All = 'all',
  Active = 'active',
  Completed = 'completed',
}

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [error, setError] = useState<ErrorMessages | null>(null);
  const [loading, setLoading] = useState(true);
  const [addNewTodo, setAddNewTodo] = useState('');
  const [loadingTodoId, setLoadingTodoId] = useState<number | null>(null);
  const [deletingTodoIds, setDeletingTodoIds] = useState<number[]>([]);
  const [filterStatus, setFilterStatus] = useState<FilterStatus>(
    FilterStatus.All,
  );

  const uncompletedTodosCount = todos.filter(todo => !todo.completed).length;

  const completedTodos = useMemo(() => {
    return todos.filter(todo => todo.completed);
  }, [todos]);

  const [isHeaderLoading, setIsHeaderLoading] = useState(false);
  const headerInputRef = useRef<HTMLInputElement | null>(null);

  const [editingId, setEditingId] = useState<number | null>(null);
  const currentEditInputRef = useRef<HTMLInputElement | null>(null);

  const focusMainInput = () => {
    if (headerInputRef.current) {
      headerInputRef.current.focus();
    }
  };

  useEffect(() => {
    if (!error) {
      return;
    }

    const timerId = setTimeout(() => {
      setError(null);
    }, 3000);

    return () => clearTimeout(timerId);
  }, [error]);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    const trimmedTitle = addNewTodo.trim();

    if (trimmedTitle === '') {
      setError(ErrorMessages.TitleEmpty);

      return;
    }

    const newTodo: Omit<Todo, 'id'> = {
      title: trimmedTitle,
      userId: todoServese.USER_ID,
      completed: false,
    };

    setLoading(true);
    setLoadingTodoId(todoServese.USER_ID);
    setIsHeaderLoading(true);

    todoServese
      .createTodo(newTodo)
      .then(newTodoFromServer => {
        setTodos(currentTodos => [...currentTodos, newTodoFromServer]);
        setAddNewTodo('');
        setError(null);
      })
      .catch(() => {
        setError(ErrorMessages.AddFail);
      })
      .finally(() => {
        setLoadingTodoId(null);
        setLoading(false);
        setIsHeaderLoading(false);
      });
  };

  const handleDelete = (todoID: number) => {
    setError(null);
    setLoading(true);
    setLoadingTodoId(todoID);

    return todoServese
      .deleteTodo(todoID)
      .then(() => {
        setTodos(prev => prev.filter(p => p.id !== todoID));
        setEditingId(null);
        focusMainInput();
      })
      .catch(() => {
        setError(ErrorMessages.DeleteFail);
        focusMainInput();
        currentEditInputRef.current?.focus();
      })
      .finally(() => {
        setLoading(false);
        setLoadingTodoId(null);
      });
  };

  const handleDeleteClearCompleted = () => {
    if (completedTodos.length === 0) {
      return;
    }

    setError(null);
    setLoading(true);

    const idsToDelete = completedTodos.map(todo => todo.id);

    setDeletingTodoIds(idsToDelete);

    const failedIds: number[] = [];

    const deletePromises = completedTodos.map(todo =>
      todoServese.deleteTodo(todo.id).catch(() => {
        failedIds.push(todo.id);

        setError(ErrorMessages.DeleteFail);

        return null;
      }),
    );

    Promise.all(deletePromises)
      .then(() => {
        setTodos(currentTodos =>
          currentTodos.filter(
            todo => !todo.completed || failedIds.includes(todo.id),
          ),
        );
      })
      .finally(() => {
        setDeletingTodoIds([]);
        setLoading(false);
        focusMainInput();
      });
  };

  const handlePatch = (todoID: number, completed: boolean, title: string) => {
    setError(null);
    setLoading(true);
    setLoadingTodoId(todoID);

    todoServese
      .patchTodo(todoID, completed, title)
      .then(() => {
        setTodos(prev => {
          return prev.map(todo => {
            if (todo.id === todoID) {
              return {
                ...todo,
                completed: !todo.completed,
                title,
              };
            }

            return todo;
          });
        });
      })
      .catch(() => {
        setError(ErrorMessages.UpdateFail);
      })
      .finally(() => {
        setLoading(false);
        setLoadingTodoId(null);
      });
  };

  const handlePatchAllToggle = () => {
    setError(null);

    if (todos.length === 0) {
      return;
    }

    setLoading(true);

    const targetCompletedStatus = !todos.every(todo => todo.completed);

    const todosToUpdate = todos.filter(
      todo => todo.completed !== targetCompletedStatus,
    );

    const patchPromises = todosToUpdate.map(todo =>
      todoServese.patchTodo(todo.id, targetCompletedStatus, todo.title),
    );

    Promise.all(patchPromises)
      .then(() => {
        setTodos(prevTodos => {
          return prevTodos.map(todo => ({
            ...todo,
            completed: targetCompletedStatus,
          }));
        });
      })
      .catch(() => {
        setError(ErrorMessages.UpdateFail);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handlePatchText = (
    todoID: number,
    completed: boolean,
    title: string,
  ) => {
    if (loadingTodoId === todoID) {
      return;
    }

    const trimmedTitle = title.trim();

    if (trimmedTitle === '') {
      handleDelete(todoID);

      return;
    }

    if (trimmedTitle === todos.find(todo => todo.id === todoID)?.title) {
      setEditingId(null);

      return;
    }

    setLoading(true);
    setLoadingTodoId(todoID);

    todoServese
      .patchTodo(todoID, completed, trimmedTitle)
      .then(() => {
        setTodos(prev => {
          return prev.map(todo => {
            if (todo.id === todoID) {
              return {
                ...todo,
                completed,
                title: trimmedTitle,
              };
            }

            setEditingId(null);

            return todo;
          });
        });
      })
      .catch(() => {
        setError(ErrorMessages.UpdateFail);
        if (currentEditInputRef.current) {
          currentEditInputRef.current.focus();
        }
      })
      .finally(() => {
        setLoadingTodoId(null);
        setLoading(false);
      });
  };

  useEffect(() => {
    todoServese
      .getTodos()
      .then(setTodos)
      .catch(() => {
        setError(ErrorMessages.LoadFail);
      })
      .finally(() => {
        setLoading(false);
        focusMainInput();
      });
  }, []);

  const filteredTodos = useMemo(() => {
    switch (filterStatus) {
      case FilterStatus.All:
        return todos;

      case FilterStatus.Active:
        return todos.filter(todo => !todo.completed);

      case FilterStatus.Completed:
        return todos.filter(todo => todo.completed);

      default:
        return todos;
    }
  }, [todos, filterStatus]);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          todo={{
            id: -1,
            title: addNewTodo,
            userId: todoServese.USER_ID,
            completed: false,
          }}
          todos={todos}
          addNewTodo={addNewTodo}
          completedTodos={completedTodos}
          headerInputRef={headerInputRef}
          isHeaderLoading={isHeaderLoading}
          setAddNewTodo={setAddNewTodo}
          handleSubmit={handleSubmit}
          handlePatchAllToggle={handlePatchAllToggle}
          setLoading={setLoading}
        />

        <section className="todoapp__main" data-cy="TodoList">
          {filteredTodos.map(todo => (
            <TodoItems
              key={todo.id}
              todo={todo}
              loadingTodo={
                loadingTodoId === todo.id || deletingTodoIds.includes(todo.id)
              }
              editingId={editingId}
              activeInputRef={currentEditInputRef}
              handleDelete={handleDelete}
              handlePatch={handlePatch}
              handlePatchText={handlePatchText}
              setEditingId={setEditingId}
            />
          ))}

          {loading && loadingTodoId === todoServese.USER_ID && (
            <TodoItems
              key={-1}
              todo={{
                id: -1,
                title: addNewTodo,
                userId: todoServese.USER_ID,
                completed: false,
              }}
              loadingTodo={loading}
              editingId={editingId}
              activeInputRef={currentEditInputRef}
              handleDelete={handleDelete}
              handlePatch={handlePatch}
              handlePatchText={handlePatchText}
              setEditingId={setEditingId}
            />
          )}
        </section>

        {todos.length > 0 && (
          <Footer
            uncompletedTodosCount={uncompletedTodosCount}
            filterStatus={filterStatus}
            completedTodosCount={completedTodos.length}
            setFilterStatus={setFilterStatus}
            handleDeleteClearCompleted={handleDeleteClearCompleted}
          />
        )}
      </div>

      <ErrorNotification errorMessage={error} onClose={() => setError(null)} />
    </div>
  );
};
