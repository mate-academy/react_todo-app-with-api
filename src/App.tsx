/* eslint-disable import/extensions */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable padding-line-between-statements */
/* eslint-disable @typescript-eslint/indent */
/* eslint-disable prettier/prettier */
import { TodoHeader } from './components/TodoHeader';
import { TodoItem } from './components/TodoItem';
import { TodoFooter } from './components/TodoFooter';
import { ErrorNotification } from './components/ErrorNotification';
import { TempTodo } from './components/TempTodo';

import React, {
  FormEvent,
  KeyboardEvent,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import classNames from 'classnames';

import { UserWarning } from './UserWarning';
import {
  USER_ID,
  createTodo,
  deleteTodo,
  getTodos,
  updateTodo,
} from './api/todos';
import { Todo } from './types/Todo';

type FilterStatus = 'All' | 'Active' | 'Completed';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState<FilterStatus>('All');

  const [title, setTitle] = useState('');
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [isAdding, setIsAdding] = useState(false);

  const [processingTodoIds, setProcessingTodoIds] = useState<number[]>([]);

  const [editingTodoId, setEditingTodoId] = useState<number | null>(null);
  const [editingTitle, setEditingTitle] = useState('');

  const newTodoField = useRef<HTMLInputElement>(null);
  const editField = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setLoading(true);
    setError('');

    getTodos()
      .then(setTodos)
      .catch(() => {
        setError('Unable to load todos');
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    if (!error) {
      return;
    }

    const timer = setTimeout(() => {
      setError('');
    }, 3000);

    return () => clearTimeout(timer);
  }, [error]);

  useEffect(() => {
    if (editingTodoId !== null) {
      editField.current?.focus();
    }
  }, [editingTodoId]);

  const activeTodos = todos.filter(todo => !todo.completed);

  const visibleTodos = useMemo(() => {
    switch (filter) {
      case 'Active':
        return todos.filter(todo => !todo.completed);

      case 'Completed':
        return todos.filter(todo => todo.completed);

      default:
        return todos;
    }
  }, [todos, filter]);

  const startProcessing = (todoId: number) => {
    setProcessingTodoIds(currentIds =>
      currentIds.includes(todoId)
        ? currentIds
        : [...currentIds, todoId],
    );
  };

  const stopProcessing = (todoId: number) => {
    setProcessingTodoIds(currentIds =>
      currentIds.filter(id => id !== todoId),
    );
  };

  const focusNewTodoField = () => {
    setTimeout(() => {
      newTodoField.current?.focus();
    }, 0);
  };

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();

    const trimmedTitle = title.trim();

    if (!trimmedTitle) {
      setError('Title should not be empty');
      return;
    }

    const newTodo: Todo = {
      id: 0,
      userId: USER_ID,
      title: trimmedTitle,
      completed: false,
    };

    setError('');
    setIsAdding(true);
    setTempTodo(newTodo);

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
        setError('Unable to add a todo');
      })
      .finally(() => {
        setIsAdding(false);
        setTempTodo(null);
        focusNewTodoField();
      });
  };

  const handleDelete = (todoId: number) => {
    setError('');
    startProcessing(todoId);

    return deleteTodo(todoId)
      .then(() => {
        setTodos(currentTodos =>
          currentTodos.filter(todo => todo.id !== todoId),
        );
      })
      .catch(() => {
        setError('Unable to delete a todo');
        throw new Error('Unable to delete a todo');
      })
      .finally(() => {
        stopProcessing(todoId);
        focusNewTodoField();
      });
  };

  const handleClearCompleted = () => {
    const completedTodos = todos.filter(todo => todo.completed);

    Promise.allSettled(
      completedTodos.map(todo => handleDelete(todo.id)),
    ).then(results => {
      const hasError = results.some(
        result => result.status === 'rejected',
      );

      if (hasError) {
        setError('Unable to delete a todo');
      }
    });
  };

  const handleToggleTodo = (todo: Todo) => {
    setError('');
    startProcessing(todo.id);

    return updateTodo(todo.id, {
      completed: !todo.completed,
    })
      .then(updatedTodo => {
        setTodos(currentTodos =>
          currentTodos.map(currentTodo =>
            currentTodo.id === todo.id
              ? updatedTodo
              : currentTodo,
          ),
        );
      })
      .catch(() => {
        setError('Unable to update a todo');
        throw new Error('Unable to update a todo');
      })
      .finally(() => {
        stopProcessing(todo.id);
        focusNewTodoField();
      });
  };

  const handleToggleAll = () => {
    const shouldComplete = !todos.every(todo => todo.completed);

    const todosToUpdate = todos.filter(
      todo => todo.completed !== shouldComplete,
    );

    setError('');

    todosToUpdate.forEach(todo => {
      startProcessing(todo.id);
    });

    Promise.allSettled(
      todosToUpdate.map(todo =>
        updateTodo(todo.id, {
          completed: shouldComplete,
        })
          .then(updatedTodo => {
            setTodos(currentTodos =>
              currentTodos.map(currentTodo =>
                currentTodo.id === updatedTodo.id
                  ? updatedTodo
                  : currentTodo,
              ),
            );
          })
          .finally(() => {
            stopProcessing(todo.id);
          }),
      ),
    ).then(results => {
      const hasError = results.some(
        result => result.status === 'rejected',
      );

      if (hasError) {
        setError('Unable to update a todo');
      }

      focusNewTodoField();
    });
  };

  const handleStartEditing = (todo: Todo) => {
    setEditingTodoId(todo.id);
    setEditingTitle(todo.title);
  };

  const cancelEditing = () => {
    setEditingTodoId(null);
    setEditingTitle('');
  };

  const saveEditing = (todo: Todo) => {
    const trimmedTitle = editingTitle.trim();

    if (trimmedTitle === todo.title) {
      cancelEditing();
      focusNewTodoField();

      return;
    }

    if (!trimmedTitle) {
      handleDelete(todo.id)
      .then(() => {
        cancelEditing();
      })
      .catch(() => {
        setError('Unable to delete a todo');
      })
      .finally(() => {
        focusNewTodoField();
      });

      return;
    }

    setError('');
    startProcessing(todo.id);

    updateTodo(todo.id, {
      title: trimmedTitle,
    })
      .then(updatedTodo => {
        setTodos(currentTodos =>
          currentTodos.map(currentTodo =>
            currentTodo.id === todo.id
              ? updatedTodo
              : currentTodo,
          ),
        );

        cancelEditing();
      })
      .catch(() => {
        setError('Unable to update a todo');
      })
      .finally(() => {
        stopProcessing(todo.id);
        focusNewTodoField();
      });
  };

  const handleEditKeyUp = (
    event: KeyboardEvent<HTMLInputElement>,
  ) => {
    if (event.key === 'Escape') {
      cancelEditing();
      focusNewTodoField();
    }
  };

  if (!USER_ID) {
    return <UserWarning />;
  }

 return (
  <div className="todoapp">
    <h1 className="todoapp__title">todos</h1>

    <div className="todoapp__content">

      <TodoHeader
        todos={todos}
        title={title}
        setTitle={setTitle}
        isAdding={isAdding}
        newTodoField={newTodoField}
        handleSubmit={handleSubmit}
        handleToggleAll={handleToggleAll}
      />

      <section
        className="todoapp__main"
        data-cy="TodoList"
        style={{
          display: todos.length || tempTodo ? 'block' : 'none',
        }}
      >
        {visibleTodos.map(todo => (
          <TodoItem
            key={todo.id}
            todo={todo}
            loading={loading}
            processingTodoIds={processingTodoIds}
            editingTodoId={editingTodoId}
            editingTitle={editingTitle}
            editField={editField}
            setEditingTitle={setEditingTitle}
            handleToggleTodo={handleToggleTodo}
            handleDelete={handleDelete}
            handleStartEditing={handleStartEditing}
            saveEditing={saveEditing}
            handleEditKeyUp={handleEditKeyUp}
          />
        ))}

        {tempTodo && (
          <TempTodo todo={tempTodo} />
        )}
      </section>

      {todos.length > 0 && (
        <TodoFooter
          activeTodos={activeTodos}
          filter={filter}
          setFilter={setFilter}
          todos={todos}
          handleClearCompleted={handleClearCompleted}
        />
      )}

      <ErrorNotification
        error={error}
        setError={setError}
      />
    </div>
  </div>
);
};
