/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useRef, useState } from 'react';
import classNames from 'classnames';

import { UserWarning } from './UserWarning';
import { Todo } from './types/Todo';
import { TodosList } from './components/TodosList';
import {
  addTodo, deleteTodo, getTodos, editTodo,
} from './api/todos';
import { TodoInfo } from './components/TodoInfo';
import { Footer } from './components/Footer';
import { ErrorArea } from './components/ErrorArea';

const USER_ID = 11414;

enum FilterMode {
  all,
  active,
  completed,
}

export const App: React.FC = () => {
  const [allTodos, setAllTodos] = useState<Todo[]>([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [filterMode, setFilterMode] = useState<FilterMode>(FilterMode.all);
  const [newTodoTitle, setNewTodoTitle] = useState('');
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [isInputDisabled, setIsInputDisabled] = useState(false);
  const [loadingTodosIds, setLoadingTodosIds] = useState<number[]>([]);
  const [doubleClickedTodoId, setDoubleClickedTodoId] = useState(-1);

  const titleInputRef = useRef<HTMLInputElement>(null);

  const activesCount = allTodos.filter(todo => !todo.completed).length;
  const existsCompleteTodo = allTodos.some(todo => todo.completed);
  let displayedTodos;

  switch (filterMode) {
    case FilterMode.all:
    default:
      displayedTodos = [...allTodos];
      break;
    case FilterMode.active:
      displayedTodos = allTodos.filter(todo => !todo.completed);
      break;
    case FilterMode.completed:
      displayedTodos = allTodos.filter(todo => todo.completed);
      break;
  }

  const countText = `${activesCount} items left`;
  const tempTodoExists = tempTodo !== null;
  const allClasses = classNames(
    'filter__link', { selected: filterMode === FilterMode.all },
  );
  const activeClasses = classNames(
    'filter__link', { selected: filterMode === FilterMode.active },
  );
  const completedClasses = classNames(
    'filter__link', { selected: filterMode === FilterMode.completed },
  );
  const toggleAllButtonClasses = classNames('todoapp__toggle-all', {
    active: allTodos.filter(todo => todo.completed).length === allTodos.length,
  });

  const handleClickCloseErrorMessage = () => setErrorMessage('');

  const showError = (message: string) => {
    setErrorMessage(message);
    setTimeout(handleClickCloseErrorMessage, 3000);
  };

  const onResponseSuccess = (todos: Todo[]) => {
    setAllTodos(todos);
    setErrorMessage('');
  };

  const handleClickAll = () => {
    getTodos(USER_ID)
      .then((todos) => {
        onResponseSuccess(todos);
      })
      .catch((error: Error) => {
        showError(error.message);
      })
      .finally(() => setFilterMode(FilterMode.all));
  };

  const handleClickActive = () => {
    getTodos(USER_ID)
      .then(todos => {
        onResponseSuccess(todos);
      })
      .catch((error: Error) => {
        showError(error.message);
      })
      .finally(() => setFilterMode(FilterMode.active));
  };

  const handleClickCompleted = () => {
    getTodos(USER_ID)
      .then(todos => {
        onResponseSuccess(todos);
      })
      .catch((error: Error) => {
        showError(error.message);
      })
      .finally(() => setFilterMode(FilterMode.completed));
  };

  const handleNewTodoSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const trimmedTodoTitle = newTodoTitle.trim();

    if (trimmedTodoTitle) {
      addTodo(USER_ID, trimmedTodoTitle)
        .then(response => {
          setNewTodoTitle('');
          setAllTodos(previosTodos => [...previosTodos, response]);
        })
        .catch(() => {
          showError('Unable to add a todo');
        })
        .finally(() => {
          setTempTodo(null);
          setIsInputDisabled(false);
        });

      setTempTodo({
        id: 0,
        title: trimmedTodoTitle,
        completed: false,
        userId: USER_ID,
      });
      setIsInputDisabled(true);
    } else {
      showError('Title should not be empty');
    }
  };

  const handleClickRemove = (todoId: number) => {
    deleteTodo(todoId)
      .then(() => {
        setAllTodos(
          oldTodos => oldTodos.filter(todo => todo.id !== todoId),
        );
      })
      .catch(() => showError('Unable to delete a todo'))
      .finally(() => setLoadingTodosIds(
        oldIds => oldIds.filter(id => id !== todoId),
      ));
    setLoadingTodosIds(oldIds => [...oldIds, todoId]);
  };

  const handleEditSubmit = (todoId: number, newTitle: string) => {
    const trimmedNewTitle = newTitle.trim();

    if (trimmedNewTitle) {
      setLoadingTodosIds(oldIds => [...oldIds, todoId]);

      const editedTodo = allTodos.find(todo => todo.id === todoId);

      if (editedTodo) {
        editTodo(USER_ID, { ...editedTodo, title: newTitle })
          .then(() => {
            editedTodo.title = newTitle;
            setDoubleClickedTodoId(-1);
          })
          .catch(() => {
            showError('Unable to update a todo');
          })
          .finally(() => {
            setLoadingTodosIds(
              oldIds => oldIds.filter(id => id !== todoId),
            );
          });
      }
    } else {
      handleClickRemove(todoId);
    }
  };

  const handleClickClearCompleted = () => {
    allTodos.forEach(todo => {
      if (todo.completed) {
        handleClickRemove(todo.id);
      }
    });
  };

  const handleLabelClick = (todoId: number) => {
    setLoadingTodosIds(oldTodos => [...oldTodos, todoId]);
    const clickedTodo = allTodos.find(todo => todo.id === todoId);

    if (clickedTodo) {
      const completedNeagtion = !clickedTodo.completed;

      editTodo(USER_ID, { ...clickedTodo, completed: completedNeagtion })
        .then(() => {
          clickedTodo.completed = completedNeagtion;
        })
        .catch(() => showError('Unable to update a todo'))
        .finally(() => setLoadingTodosIds(
          oldIds => oldIds.filter(id => id !== todoId),
        ));
    }
  };

  const handleTogleAllClick = () => {
    if (allTodos.length === allTodos.filter(todo => todo.completed).length) {
      allTodos.forEach(todo => handleLabelClick(todo.id));
    } else {
      allTodos.forEach(todo => {
        if (!todo.completed) {
          handleLabelClick(todo.id);
        }
      });
    }
  };

  const handleDoubleClick = (todoId: number, event: React.MouseEvent) => {
    if (event.detail === 2) {
      setDoubleClickedTodoId(todoId);
    }
  };

  useEffect(() => {
    handleClickAll();
  }, []);

  useEffect(() => {
    if (doubleClickedTodoId === -1) {
      titleInputRef.current?.focus();
    }
  }, [allTodos.length, errorMessage]);

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          {allTodos.length > 0 && (
            <button
              data-cy="ToggleAllButton"
              type="button"
              className={toggleAllButtonClasses}
              onClick={handleTogleAllClick}
            />
          )}

          <form onSubmit={event => handleNewTodoSubmit(event)}>
            <input
              type="text"
              data-cy="NewTodoField"
              className="todoapp__new-todo"
              placeholder="What needs to be done?"
              value={newTodoTitle}
              onChange={event => setNewTodoTitle(event.target.value)}
              disabled={isInputDisabled}
              ref={titleInputRef}
            />
          </form>
        </header>

        {(
          allTodos.length > 0
          || tempTodoExists
          || existsCompleteTodo
          || activesCount > 0
        ) && (

          <div className="todoapp__content">
            <TodosList
              todos={displayedTodos}
              onClickRemove={handleClickRemove}
              loadingTodosIds={loadingTodosIds}
              onClickLabel={handleLabelClick}
              onDoubleClick={handleDoubleClick}
              doubleClickedTodoId={doubleClickedTodoId}
              onSubmit={handleEditSubmit}
            />

            {tempTodoExists && <TodoInfo todo={tempTodo} />}

            <Footer
              countText={countText}
              allClasses={allClasses}
              onClickAll={handleClickAll}
              activeClasses={activeClasses}
              onClickActive={handleClickActive}
              completedClasses={completedClasses}
              onClickCompleted={handleClickCompleted}
              existsCompleteTodo={existsCompleteTodo}
              onClickClearCompleted={handleClickClearCompleted}
            />
          </div>
        )}
      </div>

      <ErrorArea
        onClick={handleClickCloseErrorMessage}
        errorMessage={errorMessage}
      />
    </div>
  );
};
