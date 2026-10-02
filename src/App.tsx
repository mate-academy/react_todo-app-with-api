/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useState, useRef } from 'react';
import { UserWarning } from './UserWarning';
import { USER_ID } from './api/todos';
import { getTodos, createTodo, deleteTodo, updateTodo } from './api/todos';
import { Todo } from './types/Todo';
import { TodoItem } from './components/TodoItem';
import { Footer } from './components/Footer';
import { ErrorNotification } from './components/ErrorNotification';
import { ErrorMessage } from './utils/errors';
import { FilterType } from './utils/filter';
import { TodoNew } from './components/TodoNew';
// import { create } from 'cypress/types/lodash'; був від початку

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [filter, setFilter] = useState<FilterType>(FilterType.All);

  const [newTodoTitle, setNewTodoTitle] = useState('');
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const [processings, setProcessings] = useState<number[]>([]);
  const [editingTodoId, setEditingTodoId] = useState<number | null>(null);

  const inputRef = useRef<HTMLInputElement>(null);

  function loadTodos() {
    setErrorMessage('');

    getTodos()
      .then(setTodos)
      .catch(() => setErrorMessage(ErrorMessage.Load));
  }

  useEffect(loadTodos, []);

  useEffect(() => {
    if (!errorMessage) {
      return;
    }

    const timer = setTimeout(() => setErrorMessage(''), 3000);

    return () => clearTimeout(timer);
  }, [errorMessage]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const visibleTodos = todos.filter(todo => {
    switch (filter) {
      case FilterType.Active:
        return todo.completed === false;

      case FilterType.Completed:
        return todo.completed === true;

      case FilterType.All:
      default:
        return true;
    }
  });

  function addTodo(title: string) {
    if (!title.trim()) {
      setErrorMessage(ErrorMessage.Title);

      return;
    }

    setTempTodo({
      id: 0,
      title: title.trim(),
      completed: false,
      userId: USER_ID,
    });

    setIsLoading(true);

    createTodo({ title: title.trim(), userId: USER_ID })
      .then(newTodo => {
        setTodos(current => [...current, newTodo]);
        setTempTodo(null);
        setNewTodoTitle('');
      })
      .catch(() => {
        setErrorMessage(ErrorMessage.Add);
        setTempTodo(null);
      })
      .finally(() => {
        setIsLoading(false);
        setTimeout(() => {
          inputRef.current?.focus();
        }, 0);
      });
  }

  function handleDeleteTodo(todoId: number) {
    setProcessings(current => [...current, todoId]);

    deleteTodo(todoId)
      .then(() => {
        setTodos(currentTodos =>
          currentTodos.filter(todo => todo.id !== todoId),
        );
        setEditingTodoId(null);
      })
      .catch(() => {
        setErrorMessage(ErrorMessage.Delete);
      })
      .finally(() => {
        setProcessings(current =>
          current.filter(activeId => activeId !== todoId),
        );
        inputRef.current?.focus();
      });
  }

  function handleClearCompleted() {
    const completedTodos = todos.filter(todo => todo.completed);
    const completedIds = completedTodos.map(todo => todo.id);

    setProcessings(current => [...current, ...completedIds]);

    const deletePromises = completedTodos.map(todo =>
      deleteTodo(todo.id)
        .then(() => todo.id)
        .catch(() => {
          setErrorMessage(ErrorMessage.Delete);

          return null;
        }),
    );

    Promise.all(deletePromises)
      .then(resolvedIds => {
        const successfullyDeletedIds = resolvedIds.filter(
          (id): id is number => id !== null,
        );

        setTodos(currentTodos =>
          currentTodos.filter(
            todo => !successfullyDeletedIds.includes(todo.id),
          ),
        );
      })
      .finally(() => {
        setProcessings(current =>
          current.filter(id => !completedIds.includes(id)),
        );
        inputRef.current?.focus();
      });
  }

  function handleUpdateTodo(todoId: number, fieldsToUpdate: Partial<Todo>) {
    setProcessings(current => [...current, todoId]);

    updateTodo(todoId, fieldsToUpdate)
      .then(updatedTodo => {
        setTodos(currentTodos =>
          currentTodos.map(todo => (todo.id === todoId ? updatedTodo : todo)),
        );
        setEditingTodoId(null);
      })
      .catch(() => {
        setErrorMessage(ErrorMessage.Update);
      })
      .finally(() => {
        setProcessings(current =>
          current.filter(activeId => activeId !== todoId),
        );
      });
  }

  const isAllTodosCompleted =
    todos.length > 0 && todos.every(todo => todo.completed);

  function handleToggleAll() {
    const targetStatus = !isAllTodosCompleted;
    const todosToUpdate = todos.filter(todo => todo.completed !== targetStatus);

    if (todosToUpdate.length === 0) {
      return;
    }

    const idsToUpdate = todosToUpdate.map(todo => todo.id);

    setProcessings(current => [...current, ...idsToUpdate]);

    const updatePromises = todosToUpdate.map(todo =>
      updateTodo(todo.id, { completed: targetStatus }),
    );

    Promise.all(updatePromises)
      .then(() => {
        setTodos(currentTodos =>
          currentTodos.map(todo =>
            idsToUpdate.includes(todo.id)
              ? { ...todo, completed: targetStatus }
              : todo,
          ),
        );
      })
      .catch(() => {
        setErrorMessage(ErrorMessage.Update);
      })
      .finally(() => {
        setProcessings(current =>
          current.filter(id => !idsToUpdate.includes(id)),
        );
      });
  }

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          {todos.length > 0 && (
            <button
              type="button"
              className={`todoapp__toggle-all ${isAllTodosCompleted ? 'active' : ''}`}
              data-cy="ToggleAllButton"
              onClick={handleToggleAll}
            />
          )}

          <TodoNew
            title={newTodoTitle}
            setTitle={setNewTodoTitle}
            onAdd={addTodo}
            disabled={isLoading}
            inputRef={inputRef}
          />
        </header>
        {todos.length > 0 && (
          <>
            <section className="todoapp__main" data-cy="TodoList">
              {/* This is a completed todo */}

              {visibleTodos.map(todo => (
                <TodoItem
                  key={todo.id}
                  todo={todo}
                  isProcessed={processings.includes(todo.id)}
                  isEditing={editingTodoId === todo.id}
                  onDelete={() => handleDeleteTodo(todo.id)}
                  onUpdate={(fieldsToUpdate: Partial<Todo>) =>
                    handleUpdateTodo(todo.id, fieldsToUpdate)
                  }
                  onEdit={(id: number | null) => setEditingTodoId(id)}
                />
              ))}
              {tempTodo && (
                <TodoItem
                  todo={tempTodo}
                  isProcessed={true}
                  isEditing={false}
                  onUpdate={() => {}}
                  onEdit={() => {}}
                />
              )}
            </section>

            <Footer
              activeCount={todos.filter(t => !t.completed).length}
              completedCount={todos.filter(t => t.completed).length}
              filter={filter}
              setFilter={setFilter}
              onClearCompleted={handleClearCompleted}
            />
          </>
        )}
      </div>

      <ErrorNotification
        errorMessage={errorMessage}
        setErrorMessage={setErrorMessage}
      />
    </div>
  );
};
