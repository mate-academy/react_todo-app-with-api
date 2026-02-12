/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
//#region Imports
import React, { useEffect, useRef, useState } from 'react';
import { UserWarning } from './UserWarning';
import { getTodos, USER_ID } from './api/todos';
import { Todo } from './types/Todo';
import { FilterType } from './types/FilterType';
import { ErrorMessage } from './types/ErrorMessage';
import { Header } from './components/Header';
import { TodoList } from './components/TodoList';
import { Footer } from './components/Footer';
import { ErrorNotification } from './components/ErrorNotification';
import { useVisibleTodos } from './hooks/useVisibleTodos';
import { useTodoStats } from './hooks/useTodoStats';
import * as todoService from './api/todos';
//#endregion

export const App: React.FC = () => {
  //#region States
  const [todos, setTodos] = useState<Todo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<ErrorMessage | null>(null);
  const [filter, setFilter] = useState<FilterType>(FilterType.All);

  const [newTitle, setNewTitle] = useState('');
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [deleteIds, setDeleteIds] = useState<number[]>([]);

  const [loadingIds, setLoadingIds] = useState<number[]>([]);
  //#endregion
  //#region Refs
  const newTodoRef = useRef<HTMLInputElement>(null);
  //#endregion
  //#region Values
  const visibleTodos = useVisibleTodos(todos, filter);
  const { allComplete, activeCount, hasCompleted } = useTodoStats(todos);

  //#endregion
  //#region Effects
  useEffect(() => {
    setIsLoading(true);
    setError(null);
    newTodoRef.current?.focus();

    getTodos()
      .then(setTodos)
      .catch(() => {
        setError(ErrorMessage.LOAD_TODOS);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  useEffect(() => {
    if (!isAdding && deleteIds.length === 0) {
      newTodoRef.current?.focus();
    }
  }, [isAdding, deleteIds]);
  //#endregion
  //#region Conditionals
  if (!USER_ID) {
    return <UserWarning />;
  }

  //#endregion
  //#region handles
  function handleAddTodo() {
    setError(null);

    const trimmed = newTitle.trim();

    if (!trimmed) {
      setError(ErrorMessage.EMPTY_TITLE);

      return;
    }

    const temp: Todo = {
      id: 0,
      userId: USER_ID,
      title: trimmed,
      completed: false,
    };

    setTempTodo(temp);
    setIsAdding(true);

    todoService
      .createTodo(trimmed)
      .then(newTodo => {
        setTodos(current => [...current, newTodo]);
        setNewTitle('');
      })
      .catch(() => {
        setError(ErrorMessage.ADD_TODO);
      })
      .finally(() => {
        setTempTodo(null);
        setIsAdding(false);
      });
  }

  function handleDeleteTodo(id: number) {
    setError(null);

    setDeleteIds(current => [...current, id]);

    todoService
      .deleteTodo(id)
      .then(() => {
        setTodos(current => current.filter(todo => todo.id !== id));
      })
      .catch(() => {
        setError(ErrorMessage.DELETE_TODO);
      })
      .finally(() => {
        setDeleteIds(current => current.filter(todoId => todoId !== id));
      });
  }

  function handleClearCompleted() {
    setError(null);

    const completedTodos = todos.filter(todo => todo.completed);
    const completedIds = completedTodos.map(todo => todo.id);

    if (completedIds.length === 0) {
      return;
    }

    setDeleteIds(current => [...current, ...completedIds]);

    const deletePromises = completedIds.map(id =>
      todoService
        .deleteTodo(id)
        .then(() => {
          setTodos(current => current.filter(todo => todo.id !== id));
        })
        .catch(() => {
          setError(ErrorMessage.DELETE_TODO);
        })
        .finally(() => {
          setDeleteIds(current => current.filter(todoId => todoId !== id));
        }),
    );

    Promise.all(deletePromises);
  }

  const handleToggle = (id: number, completed: boolean) => {
    setError(null);
    setLoadingIds(prev => [...prev, id]);

    todoService
      .updateTodo(id, { completed })
      .then(updatedTodo => {
        setTodos(prev =>
          prev.map(todo => (todo.id === id ? updatedTodo : todo)),
        );
      })
      .catch(() => {
        setError(ErrorMessage.UPDATE_TODO);
      })
      .finally(() => {
        setLoadingIds(prev => prev.filter(todoId => todoId !== id));
      });
  };

  function handleToggleAll() {
    const newStatus = !allComplete;
    const todosToUpdate = todos.filter(todo => todo.completed !== newStatus);

    todosToUpdate.forEach(todo => {
      setLoadingIds(prev => [...prev, todo.id]);
      todoService
        .updateTodo(todo.id, { completed: newStatus })
        .then(() => {
          setTodos(prev =>
            prev.map(checkedTodo =>
              checkedTodo.id === todo.id
                ? { ...checkedTodo, completed: newStatus }
                : checkedTodo,
            ),
          );
        })
        .catch(() => setError(ErrorMessage.UPDATE_TODO))
        .finally(() => {
          setLoadingIds(prev => prev.filter(todoId => todoId !== todo.id));
        });
    });
  }

  const handleUpdatetodoTitle = (id: number, title: string) => {
    setError(null);
    setLoadingIds(prev => [...prev, id]);

    return todoService
      .updateTodo(id, { title })
      .then(updateTodo => {
        setTodos(prev =>
          prev.map(todo => (todo.id === id ? updateTodo : todo)),
        );
      })
      .catch(() => {
        setError(ErrorMessage.UPDATE_TODO);
        throw new Error('UPDATE_FAILED');
      })
      .finally(() => {
        setLoadingIds(prev => prev.filter(todoId => todoId !== id));
      });
  };
  //#endregion

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          allComplete={allComplete}
          newTodoRef={newTodoRef}
          newTitle={newTitle}
          onTitleChange={setNewTitle}
          onSubmit={handleAddTodo}
          isAdding={isAdding}
          onToggleAll={handleToggleAll}
          loadingIds={loadingIds}
          totalTodos={todos.length}
        />

        <TodoList
          todos={visibleTodos}
          isLoading={isLoading}
          deleteIds={deleteIds}
          onDelete={handleDeleteTodo}
          tempTodo={tempTodo}
          onToggle={handleToggle}
          loadingIds={loadingIds}
          onUpdate={handleUpdatetodoTitle}
        />

        {todos.length > 0 && (
          <Footer
            activeCount={activeCount}
            filter={filter}
            hasCompleted={hasCompleted}
            setFilter={setFilter}
            onClearCompleted={handleClearCompleted}
          />
        )}
      </div>

      <ErrorNotification error={error} setError={setError} />
    </div>
  );
};
