/* eslint-disable max-len */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { UserWarning } from './UserWarning';
import {
  createTodo,
  deleteTodo,
  makeCompleted,
  updateTodo,
  getTodos,
  USER_ID,
} from './api/todos';

import { ErrorMessages, FilterStatus, Todo } from './types/Types';
import { TodoList } from './components/TodoList';
import { Footer } from './components/Footer';
import { ErrorNotifications } from './components/ErrorNotifications';
import {
  getCompletedTodos,
  getFilteredTodos,
  getHasCompletedTodos,
  getIsAllTodosCompleted,
  getTodosToToggle,
} from './utils/functions';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filter, setFilter] = useState<FilterStatus>('all');
  const [errorMessage, setErrorMessage] = useState<ErrorMessages>(
    ErrorMessages.empty,
  );
  const [title, setTitle] = useState('');
  const [isSubmiting, setIsSubmiting] = useState(false);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [deletingTodoIds, setDeletingTodoIds] = useState<number[]>([]);
  const [checkedTodoId, setCheckedTodoId] = useState<number[]>([]);
  const [editingTodoId, setEditingTodoId] = useState<number | null>(null);
  const [editedTitle, setEditedTitle] = useState('');

  const showError = (message: ErrorMessages) => {
    setErrorMessage(message);

    setTimeout(() => {
      setErrorMessage(ErrorMessages.empty);
    }, 3000);
  };

  const inputRef = useRef<HTMLInputElement>(null);

  const checkCompleteAll = getIsAllTodosCompleted(todos);

  const checkComplete = getHasCompletedTodos(todos);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorMessage(ErrorMessages.empty);

    const trimmedTitle = title.trim();

    if (!trimmedTitle) {
      showError(ErrorMessages.notBeEmpty);
      inputRef.current?.focus();

      return;
    }

    setIsSubmiting(true);
    setTempTodo({
      id: 0,
      title: trimmedTitle,
      userId: USER_ID,
      completed: false,
    });

    createTodo({
      title: trimmedTitle,
      userId: USER_ID,
      completed: false,
    })
      .then(newTodo => {
        setTodos(current => [...current, newTodo]);
        setTitle('');
      })
      .catch(() => {
        showError(ErrorMessages.addError);
      })
      .finally(() => {
        setIsSubmiting(false);
        setTempTodo(null);
      });
  };

  const handleDelete = (todoId: number) => {
    setDeletingTodoIds(current => [...current, todoId]);
    setErrorMessage(ErrorMessages.empty);

    deleteTodo(todoId)
      .then(() => {
        setTodos(current => current.filter(todo => todo.id !== todoId));
      })
      .catch(() => {
        showError(ErrorMessages.deleteError);
      })
      .finally(() => {
        setDeletingTodoIds(current => current.filter(id => id !== todoId));
        inputRef.current?.focus();
      });
  };

  const handleClearCompleted = () => {
    const completedTodos = getCompletedTodos(todos);

    if (completedTodos.length === 0) {
      return;
    }

    const completedIds = completedTodos.map(todo => todo.id);

    setErrorMessage(ErrorMessages.empty);
    setDeletingTodoIds(current => [...current, ...completedIds]);

    Promise.allSettled(completedTodos.map(todo => deleteTodo(todo.id)))
      .then(results => {
        const successfulIds = completedTodos
          .filter((_, index) => results[index].status === 'fulfilled')
          .map(todo => todo.id);

        const hasError = results.some(result => result.status === 'rejected');

        if (successfulIds.length > 0) {
          setTodos(current =>
            current.filter(todo => !successfulIds.includes(todo.id)),
          );
        }

        if (hasError) {
          showError(ErrorMessages.deleteError);
        }
      })
      .finally(() => {
        setDeletingTodoIds(current =>
          current.filter(id => !completedIds.includes(id)),
        );
        inputRef.current?.focus();
      });
  };

  const handleMakeChecked = (updatedTodo: Todo) => {
    setCheckedTodoId(current => [...current, updatedTodo.id]);

    const toggledTodo = {
      ...updatedTodo,
      completed: !updatedTodo.completed,
    };

    makeCompleted(toggledTodo)
      .then(() => {
        setTodos(currentTodo => {
          return currentTodo.map(todo =>
            todo.id === toggledTodo.id ? toggledTodo : todo,
          );
        });
      })
      .catch(() => {
        showError(ErrorMessages.updateError);
      })
      .finally(() => {
        setCheckedTodoId(current =>
          current.filter(id => id !== updatedTodo.id),
        );
      });
  };

  const handleStartEditing = (todo: Todo) => {
    setEditingTodoId(todo.id);
    setEditedTitle(todo.title);
    setErrorMessage(ErrorMessages.empty);
  };

  const handleCancelEditing = () => {
    setEditingTodoId(null);
    setEditedTitle('');
  };

  const handleSubmitEditing = (todo: Todo) => {
    if (editingTodoId !== todo.id) {
      return;
    }

    if (checkedTodoId.includes(todo.id) || deletingTodoIds.includes(todo.id)) {
      return;
    }

    const trimmedTitle = editedTitle.trim();

    if (trimmedTitle === todo.title) {
      handleCancelEditing();

      return;
    }

    if (!trimmedTitle) {
      setDeletingTodoIds(current => [...current, todo.id]);
      setErrorMessage(ErrorMessages.empty);

      deleteTodo(todo.id)
        .then(() => {
          setTodos(current =>
            current.filter(currentTodo => currentTodo.id !== todo.id),
          );
          handleCancelEditing();
        })
        .catch(() => {
          showError(ErrorMessages.deleteError);
        })
        .finally(() => {
          setDeletingTodoIds(current => current.filter(id => id !== todo.id));
        });

      return;
    }

    setCheckedTodoId(current => [...current, todo.id]);
    setErrorMessage(ErrorMessages.empty);

    updateTodo({ ...todo, title: trimmedTitle })
      .then(updatedTodo => {
        setTodos(current =>
          current.map(currentTodo =>
            currentTodo.id === todo.id ? updatedTodo : currentTodo,
          ),
        );
        handleCancelEditing();
      })
      .catch(() => {
        showError(ErrorMessages.updateError);
      })
      .finally(() => {
        setCheckedTodoId(current => current.filter(id => id !== todo.id));
      });
  };

  const switchCompleteAll = () => {
    const todosToToggle = getTodosToToggle(todos, checkCompleteAll);

    const toggledTodoIds = todosToToggle.map(todo => todo.id);

    setCheckedTodoId(current => [...current, ...toggledTodoIds]);

    Promise.allSettled(
      todosToToggle.map(todo =>
        makeCompleted({
          ...todo,
          completed: !checkCompleteAll,
        }),
      ),
    )
      .then(results => {
        const successfulIds = todosToToggle
          .filter((_, index) => results[index].status === 'fulfilled')
          .map(todo => todo.id);

        const hasError = results.some(result => result.status === 'rejected');

        if (successfulIds.length > 0) {
          setTodos(current =>
            current.map(todo =>
              successfulIds.includes(todo.id)
                ? { ...todo, completed: !checkCompleteAll }
                : todo,
            ),
          );
        }

        if (hasError) {
          showError(ErrorMessages.updateError);
        }
      })
      .finally(() => {
        setCheckedTodoId(current =>
          current.filter(id => !toggledTodoIds.includes(id)),
        );
      });
  };

  const filteredTodos = getFilteredTodos(todos, filter);

  useLayoutEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    setErrorMessage(ErrorMessages.empty);
    getTodos()
      .then(data => setTodos(data))
      .catch(() => showError(ErrorMessages.loadError));
  }, []);

  useLayoutEffect(() => {
    if (!isSubmiting) {
      inputRef.current?.focus();
    }
  }, [isSubmiting]);

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
              className={
                checkCompleteAll
                  ? 'todoapp__toggle-all active'
                  : 'todoapp__toggle-all'
              }
              data-cy="ToggleAllButton"
              onClick={switchCompleteAll}
            />
          )}

          <form onSubmit={handleSubmit}>
            <input
              autoFocus
              ref={inputRef}
              data-cy="NewTodoField"
              type="text"
              className="todoapp__new-todo"
              placeholder="What needs to be done?"
              value={title}
              onChange={event => setTitle(event.target.value)}
              disabled={isSubmiting}
            />
          </form>
        </header>

        <TodoList
          filteredTodos={filteredTodos}
          handleDelete={handleDelete}
          deletingTodoIds={deletingTodoIds}
          checkedTodoId={checkedTodoId}
          tempTodo={tempTodo}
          handleMakeChecked={handleMakeChecked}
          editingTodoId={editingTodoId}
          editedTitle={editedTitle}
          handleStartEditing={handleStartEditing}
          handleEditedTitleChange={setEditedTitle}
          handleCancelEditing={handleCancelEditing}
          handleSubmitEditing={handleSubmitEditing}
        />

        {todos.length > 0 && (
          <Footer
            todos={todos}
            filter={filter}
            setFilter={setFilter}
            checkComplete={checkComplete}
            handleClearCompleted={handleClearCompleted}
          />
        )}
      </div>

      <ErrorNotifications
        errorMessage={errorMessage}
        setErrorMessage={setErrorMessage}
      />
    </div>
  );
};
