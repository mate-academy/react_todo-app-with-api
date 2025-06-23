/* eslint-disable @typescript-eslint/indent */
/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { UserWarning } from './UserWarning';
import {
  addTodo,
  deleteTodo,
  getTodos,
  updateCheckTodo,
  updateTitleTodo,
  USER_ID,
} from './api/todos';
import { Todo } from './types/Todo';
import { TodoList } from './components/TodoList/TodoList';
import {
  ERROR_MESSAGES,
  FILTERS,
  ProcessState,
  States,
} from './utils/constants';
import { Footer } from './components/Footer/Footer';
import { Header } from './components/Header/Header';
import cn from 'classnames';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filtredField, setFiltredField] = useState<FILTERS>(FILTERS.ALL);
  const [error, setError] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [procTodoIds, setProcTodoIds] = useState<Map<number, ProcessState>>(
    new Map(),
  );
  const inputRef = useRef<HTMLInputElement>(null);
  const completedCount = useMemo(
    () => todos.filter(t => t.completed).length,
    [todos],
  );
  const [hasCompleted, setHasCompleted] = useState(completedCount > 0);

  const filtredTodos = useMemo(() => {
    let filtered: Todo[];

    switch (filtredField) {
      case FILTERS.ACTIVE:
        filtered = todos.filter(t => !t.completed);
        break;

      case FILTERS.COMPLETED:
        filtered = todos.filter(t => t.completed);
        break;

      default:
        filtered = todos;
    }

    return filtered;
  }, [todos, filtredField]);

  const showError = (message: string) => {
    setError(message);

    setTimeout(() => {
      setError(null);
    }, 3000);
  };

  useEffect(() => {
    if (!USER_ID) {
      return;
    }

    getTodos()
      .then(result => {
        setTodos(result);
      })
      .catch(() => showError(ERROR_MESSAGES.LOAD_TODOS))
      .finally(() => inputRef.current?.focus());
  }, []);

  useEffect(() => {
    setHasCompleted(completedCount > 0);
  }, [completedCount]);

  if (!USER_ID) {
    return <UserWarning />;
  }

  const deleteErrors = () => {
    setError(null);
  };

  const onFilter = (field: FILTERS) => {
    if (field === filtredField) {
      return;
    }

    setFiltredField(field);
  };

  const handleAdd = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!title.trim()) {
      setTitle('');
      showError(ERROR_MESSAGES.EMPTY_TITLE);

      return;
    }

    const newTodo = {
      title: title.trim(),
      userId: USER_ID,
      completed: false,
    };

    setTempTodo({ id: 0, ...newTodo });

    addTodo(newTodo)
      .then(result => {
        setTodos(prev => [...prev, result]);
        setTitle('');
      })
      .catch(() => {
        showError(ERROR_MESSAGES.ADD_TODO);
      })
      .finally(() => {
        setTempTodo(null);
        setTimeout(() => inputRef.current?.focus(), 0);
      });
  };

  const handleDelete = (todoId: number) => {
    // setDeletingTodosId(prev => [...prev, todoId]);

    setProcTodoIds(prev => {
      const newMap = new Map(prev);

      newMap.set(todoId, { [States.Deleting]: true });

      return newMap;
    });

    deleteTodo(todoId)
      .then(() => {
        setTodos(items => items.filter(i => i.id !== todoId));
      })
      .catch(() => {
        showError(ERROR_MESSAGES.DELETE_TODO);
      })
      .finally(() => {
        // setDeletingTodosId(prev => prev.filter(id => id !== todoId));
        setProcTodoIds(prev => {
          const newMap = new Map(prev);

          newMap.delete(todoId);

          return newMap;
        });
        setTimeout(() => inputRef.current?.focus(), 0);
      });
  };

  const deleteCompleted = () => {
    setHasCompleted(false);

    todos.forEach(t => {
      if (t.completed) {
        handleDelete(t.id);
      }
    });
  };

  const handleCheck = (todosToCheckId: number[], completedNew: boolean) => {
    // setTogglingTodosId(prev => [...prev, ...todosToCheckId]);
    setProcTodoIds(prev => {
      const newMap = new Map(prev);

      todosToCheckId.forEach(id => {
        newMap.set(id, { [States.Toggling]: true });
      });

      return newMap;
    });

    const sendChecks = todosToCheckId.map(t =>
      updateCheckTodo(t, completedNew).then(() => t),
    );

    Promise.all(sendChecks)
      .then(result => {
        setTodos(prev =>
          prev.map(t => {
            if (result.includes(t.id)) {
              return {
                ...t,
                completed: completedNew,
              };
            }

            return t;
          }),
        );
      })
      .catch(() => showError(ERROR_MESSAGES.UPDATE_TODO))
      .finally(() => {
        setProcTodoIds(prev => {
          const newMap = new Map(prev);

          todosToCheckId.forEach(id => {
            newMap.delete(id);
          });

          return newMap;
        });
      });
  };

  const handleCheckAll = () => {
    if (completedCount === 0) {
      handleCheck(
        todos.map(t => t.id),
        true,
      );

      return;
    }

    if (completedCount === todos.length) {
      handleCheck(
        todos.map(t => t.id),
        false,
      );
    } else {
      handleCheck(
        todos.filter(t => !t.completed).map(t => t.id),
        true,
      );
    }
  };

  const handleEditTitle = (todo: Todo, newTitle: string) => {
    if (todo.title === newTitle) {
      if (procTodoIds.has(todo.id)) {
        setProcTodoIds(prev => {
          const newMap = new Map(prev);

          newMap.delete(todo.id);

          return newMap;
        });
      }

      return;
    }

    setProcTodoIds(prev => {
      const newMap = new Map(prev);

      newMap.set(todo.id, { [States.Editing]: true });

      return newMap;
    });

    if (newTitle.trim() === '') {
      deleteTodo(todo.id)
        .then(() => {
          setTodos(items => items.filter(i => i.id !== todo.id));
        })
        .catch(() => {
          showError(ERROR_MESSAGES.DELETE_TODO);
          setProcTodoIds(prev => {
            const newMap = new Map(prev);

            newMap.set(todo.id, { [States.Editing]: false });

            return newMap;
          });
        });

      return;
    }

    updateTitleTodo(todo.id, newTitle.trim())
      .then(() => {
        setTodos(prev =>
          prev.map(t => {
            if (t.id === todo.id) {
              return {
                ...t,
                title: newTitle,
              };
            }

            return t;
          }),
        );

        setProcTodoIds(prev => {
          const newMap = new Map(prev);

          newMap.delete(todo.id);

          return newMap;
        });
      })
      .catch(() => {
        showError(ERROR_MESSAGES.UPDATE_TODO);
        setProcTodoIds(prev => {
          const newMap = new Map(prev);

          newMap.set(todo.id, { [States.Editing]: false });

          return newMap;
        });
      });
  };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          isAllTodosCompleted={completedCount === todos.length}
          title={title}
          setTitle={setTitle}
          onAdd={handleAdd}
          tempTodo={tempTodo}
          checkAll={handleCheckAll}
          hasTodos={todos.length > 0}
          ref={inputRef}
        />
        <TodoList
          todos={filtredTodos}
          tempTodo={tempTodo}
          onDelete={handleDelete}
          onCheck={handleCheck}
          onEditTodo={handleEditTitle}
          processingTodos={procTodoIds}
        />

        {/* Hide the footer if there are no todos */}
        {todos.length > 0 && (
          <Footer
            activeTodosCount={todos.length - completedCount}
            filtredField={filtredField}
            onFilter={onFilter}
            hasCompleted={hasCompleted}
            onDeleteCompleted={deleteCompleted}
          />
        )}
      </div>

      {/* DON'T use conditional rendering to hide the notification */}
      {/* Add the 'hidden' class to hide the message smoothly */}
      <div
        data-cy="ErrorNotification"
        className={cn(
          'notification is-danger is-light has-text-weight-normal',
          {
            hidden: !error,
          },
        )}
      >
        <button
          data-cy="HideErrorButton"
          type="button"
          className="delete"
          onClick={deleteErrors}
        />
        {/* show only one message at a time */}
        {error}
      </div>
    </div>
  );
};
