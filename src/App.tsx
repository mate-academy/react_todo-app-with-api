/* eslint-disable max-len */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useState, useRef, useMemo } from 'react';
import { UserWarning } from './UserWarning';
import { addTodo, deleteTodo, getTodos, updateTodo } from './api/todos';
import { Todo } from './types/Todo';
import { FilterStatus } from './types/FilterStatus';
import { USER_ID } from './constants';
import { ErrorNotification } from './components/ErrorNotification';
import { TodoHeader } from './components/TodoHeader';
import { TodoServiceErrors } from './types/TodoServiceErrors';
import { TodoFooter } from './components/TodoFooter';
import { TodoList } from './components/TodoList';

export const App: React.FC = () => {
  const [todosFromServer, setTodosFromServer] = useState<Todo[]>([]);
  const [todosErrorMessage, setTodosErrorMessage] =
    useState<TodoServiceErrors | null>(null);
  const [filterStatus, setFilterStatus] = useState<FilterStatus>(
    FilterStatus.All,
  );

  const [isLoading, setIsLoading] = useState(false);

  const [newTodoTitle, setNewTodoTitle] = useState('');
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);

  const [editingTodoId, setEditingTodoId] = useState<number | null>(null);

  const [processingTodoIds, setPocessingTodoIds] = useState<number[]>([]);

  const inputRef = useRef<HTMLInputElement>(null);

  const isAdding = tempTodo !== null;

  useEffect(() => {
    if (!isAdding) {
      inputRef.current?.focus();
    }
  }, [isAdding]);

  useEffect(() => {
    setTodosErrorMessage(null);
    setIsLoading(true);

    getTodos()
      .then(setTodosFromServer)
      .catch(() => {
        setTodosErrorMessage(TodoServiceErrors.UnableToLoad);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  const getFilteredTodos = (todos: Todo[], filter: FilterStatus): Todo[] => {
    return todos.filter(todo => {
      switch (filter) {
        case FilterStatus.Active:
          return !todo.completed;
        case FilterStatus.Completed:
          return todo.completed;
        default:
          return true;
      }
    });
  };

  const filteredTodos = useMemo(() => {
    return getFilteredTodos(todosFromServer, filterStatus);
  }, [todosFromServer, filterStatus]);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    const title = newTodoTitle.trim();

    if (!title) {
      setTodosErrorMessage(TodoServiceErrors.TitleEmpty);

      return;
    }

    const newTempTodo: Todo = {
      id: 0,
      userId: USER_ID,
      title: title,
      completed: false,
    };

    setTempTodo(newTempTodo);

    addTodo(newTempTodo)
      .then(createdTodo => {
        setTodosFromServer(currentTodo => [...currentTodo, createdTodo]);
        setNewTodoTitle('');
      })
      .catch(() => {
        setTodosErrorMessage(TodoServiceErrors.UnableToAddTodo);
      })
      .finally(() => {
        setTempTodo(null);
      });
  };

  const handleNewTodoTitleChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setNewTodoTitle(event.target.value);
  };

  const handleDeleteTodo = (todoId: number) => {
    setPocessingTodoIds(currrentIds => [...currrentIds, todoId]);

    deleteTodo(todoId)
      .then(() => {
        setTodosFromServer(currentTodos =>
          currentTodos.filter(todo => todo.id !== todoId),
        );
      })
      .catch(() => {
        setTodosErrorMessage(TodoServiceErrors.UnableToDeleteTodo);
      })
      .finally(() => {
        setPocessingTodoIds(ids => ids.filter(id => id !== todoId));
        inputRef.current?.focus();
      });
  };

  const completedTodos = useMemo(() => {
    return todosFromServer.some(todo => todo.completed);
  }, [todosFromServer]);

  const handleClearCompleted = () => {
    const idsToDelete = todosFromServer
      .filter(todo => todo.completed)
      .map(todo => todo.id);

    setPocessingTodoIds(currentIds => [...currentIds, ...idsToDelete]);

    Promise.allSettled(idsToDelete.map(id => deleteTodo(id)))
      .then(results => {
        const successfulIds: number[] = [];

        results.forEach((result, index) => {
          if (result.status === 'fulfilled') {
            successfulIds.push(idsToDelete[index]);
          } else {
            setTodosErrorMessage(TodoServiceErrors.UnableToDeleteTodo);
          }
        });

        setTodosFromServer(current =>
          current.filter(todo => !successfulIds.includes(todo.id)),
        );
      })
      .finally(() => {
        setPocessingTodoIds(ids => ids.filter(id => !idsToDelete.includes(id)));
        inputRef.current?.focus();
      });
  };

  const activeTodosCount = useMemo(() => {
    return todosFromServer.filter(todo => !todo.completed).length;
  }, [todosFromServer]);

  const handleToggleTodo = (todo: Todo) => {
    const updatedTodo = { ...todo, completed: !todo.completed };

    setPocessingTodoIds(currentIds => [...currentIds, updatedTodo.id]);

    updateTodo(updatedTodo)
      .then(responseTodo => {
        setTodosFromServer(currentTodos =>
          currentTodos.map(currentTodo =>
            currentTodo.id === responseTodo.id ? responseTodo : currentTodo,
          ),
        );
      })
      .catch(() => {
        setTodosErrorMessage(TodoServiceErrors.UnableToUpdateTodo);
      })
      .finally(() => {
        setPocessingTodoIds(currentIds =>
          currentIds.filter(currentId => currentId !== todo.id),
        );
      });
  };

  const areAllCompleted =
    todosFromServer.length > 0 && todosFromServer.every(todo => todo.completed);

  const handleToggleAll = () => {
    const todosToUpdate = todosFromServer.filter(
      todo => todo.completed !== !areAllCompleted,
    );

    if (todosToUpdate.length === 0) {
      return;
    }

    const idsToUpdate = todosToUpdate.map(todo => todo.id);

    setPocessingTodoIds(currentIds => [...currentIds, ...idsToUpdate]);

    Promise.allSettled(
      todosToUpdate.map(todo =>
        updateTodo({ ...todo, completed: !areAllCompleted }),
      ),
    )
      .then(results => {
        const updatedTodos = results.map((result, i) =>
          result.status === 'fulfilled' ? result.value : todosToUpdate[i],
        );

        setTodosFromServer(currentTodos =>
          currentTodos.map(currentTodo =>
            idsToUpdate.includes(currentTodo.id)
              ? updatedTodos.find(
                  updatedTodo => updatedTodo.id === currentTodo.id, // eslint-disable-line prettier/prettier
                ) || currentTodo // eslint-disable-line prettier/prettier
              : currentTodo,
          ),
        );
      })
      .catch(() => {
        setTodosErrorMessage(TodoServiceErrors.UnableToUpdateTodo);
      })
      .finally(() => {
        setPocessingTodoIds(currentIds =>
          currentIds.filter(id => !todosToUpdate.some(todo => todo.id === id)),
        );
      });
  };

  const handleUpdateTodo = (todo: Todo, newTitle: string) => {
    const trimmedTitle = newTitle.trim();

    if (trimmedTitle === '') {
      setPocessingTodoIds(current => [...current, todo.id]);

      deleteTodo(todo.id)
        .then(() => {
          setTodosFromServer(currentTodos =>
            currentTodos.filter(currentTodo => currentTodo.id !== todo.id),
          );

          setEditingTodoId(null);
        })
        .catch(() => {
          setTodosErrorMessage(TodoServiceErrors.UnableToDeleteTodo);
        })
        .finally(() => {
          setPocessingTodoIds(ids => ids.filter(id => id !== todo.id));
        });

      return;
    }

    if (todo.title === trimmedTitle) {
      setEditingTodoId(null);

      return;
    }

    const updatedTodo = { ...todo, title: trimmedTitle };

    setPocessingTodoIds(ids => [...ids, todo.id]);

    updateTodo(updatedTodo)
      .then(responseTodo => {
        setTodosFromServer(currentTodos =>
          currentTodos.map(currentTodo =>
            currentTodo.id === responseTodo.id ? responseTodo : currentTodo,
          ),
        );

        setEditingTodoId(null);
      })
      .catch(() => {
        setTodosErrorMessage(TodoServiceErrors.UnableToUpdateTodo);
      })
      .finally(() => {
        setPocessingTodoIds(ids => ids.filter(id => id !== todo.id));
      });
  };

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <TodoHeader
          newTodoTitle={newTodoTitle}
          isAdding={isAdding}
          inputRef={inputRef}
          onNewTodoTitleChange={handleNewTodoTitleChange}
          onSubmit={handleSubmit}
          onToggleAll={handleToggleAll}
          areAllCompleted={areAllCompleted}
          hasTodos={todosFromServer.length > 0}
          isLoading={isLoading}
        />

        {isLoading ? (
          <div className="todoapp__main" data-cy="TodosLoader">
            <div className="loader" />
          </div>
        ) : (
          <TodoList
            todos={filteredTodos}
            processingTodoIds={processingTodoIds}
            tempTodo={tempTodo}
            handleDeleteTodo={handleDeleteTodo}
            handleToggleTodo={handleToggleTodo}
            editingTodoId={editingTodoId}
            setEditingTodoId={setEditingTodoId}
            handleUpdateTodo={handleUpdateTodo}
          />
        )}

        {Boolean(todosFromServer.length) && (
          <TodoFooter
            activeTodosCount={activeTodosCount}
            filterStatus={filterStatus}
            setFilterStatus={setFilterStatus}
            onClearCompleted={handleClearCompleted}
            hasCompletedTodos={completedTodos}
          />
        )}
      </div>

      <ErrorNotification
        message={todosErrorMessage}
        onClose={() => setTodosErrorMessage(null)}
      />
    </div>
  );
};
