/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useState, useEffect, useMemo } from 'react';
import classNames from 'classnames';
import { UserWarning } from './UserWarning';
import { TodoList } from './components/TodoList';
import { Footer } from './components/Footer';
import { ErrorMessage } from './components/ErrorMessage';
import { TempTodoItem } from './components/TempTodoItem';
import {
  deleteTodo,
  getTodos,
  patchTodo,
  postTodo,
} from './api/todos';
import {
  ErrorStatus,
  Filter,
  HandleTodoEdit,
  Todo,
} from './types';

const USER_ID = 11225;

export const App: React.FC = () => {
  const [allTodos, setAllTodos] = useState<Todo[]>([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [filter, setFilter] = useState(Filter.All);
  const [title, setTitle] = useState('');
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [idsToDelete, setIdsToDelete] = useState<number[]>([]);
  const [idsToToggle, setIdsToToggle] = useState<number[]>([]);
  const [todoOnEdit, setTodoOnEdit] = useState<Todo | null>(null);

  const areAllComplete = useMemo(() => {
    return allTodos.every(todo => todo.completed);
  }, [allTodos]);

  const areAllActive = useMemo(() => {
    return allTodos.every(todo => !todo.completed);
  }, [allTodos]);

  const completedTodos = useMemo(() => {
    return allTodos.filter(todo => todo.completed);
  }, [allTodos]);

  const activeTodos = useMemo(() => {
    return allTodos.filter(todo => !todo.completed);
  }, [allTodos]);

  const activeCount = useMemo(() => allTodos.reduce(
    (total, todo) => (todo.completed ? total : total + 1),
    0,
  ), [allTodos]);

  const filteredTodos = useMemo(() => allTodos.filter(todo => {
    switch (filter) {
      case Filter.Completed:
        return todo.completed;

      case Filter.Active:
        return !todo.completed;

      default:
        return true;
    }
  }), [allTodos, filter]);

  const showErrorMessage = (message: string): void => {
    setErrorMessage(message);

    setInterval(() => {
      setErrorMessage('');
    }, 3000);
  };

  const handleFormSubmit = (event: React.FormEvent, newTitle: string) => {
    event.preventDefault();

    if (!newTitle.trim()) {
      showErrorMessage(ErrorStatus.NoTitle);

      return;
    }

    const newTodo: Omit<Todo, 'id'> = {
      userId: USER_ID,
      completed: false,
      title,
    };

    setTempTodo({ ...newTodo, id: 0 });

    postTodo(USER_ID, newTodo)
      .then(todo => {
        setAllTodos(prevTodos => [...prevTodos, todo]);
        setTitle('');
      })
      .catch(() => setErrorMessage(ErrorStatus.Add))
      .finally(() => setTempTodo(null));
  };

  const handleDeleteTodo = (todoId: number) => {
    setIdsToDelete(prevIds => [...prevIds, todoId]);

    deleteTodo(USER_ID, todoId)
      .then(() => {
        setAllTodos(prevTodos => prevTodos.filter(
          ({ id }) => id !== todoId,
        ));
      })
      .catch(() => showErrorMessage(ErrorStatus.Delete))
      .finally(() => setIdsToDelete(
        prevIds => prevIds.filter(id => id !== todoId),
      ));
  };

  const handleClearCompleted = () => {
    setIdsToDelete(completedTodos.map(({ id }) => id));

    Promise.all(completedTodos.map(todo => {
      return handleDeleteTodo(todo.id);
    }))
      .then(() => {
        setAllTodos(
          prevTodos => prevTodos.filter(({ id }) => !idsToDelete.includes(id)),
        );
      })
      .catch(() => setErrorMessage(ErrorStatus.Delete));
  };

  const handleToggleTodo = (todo: Todo): void => {
    setIdsToToggle(prevIds => [...prevIds, todo.id]);

    patchTodo(USER_ID, { ...todo, completed: !todo.completed })
      .then(() => {
        setAllTodos(prevTodos => prevTodos.map(item => {
          if (item.id === todo.id) {
            return { ...item, completed: !todo.completed };
          }

          return item;
        }));
      })
      .catch(() => showErrorMessage(ErrorStatus.Update))
      .finally(() => setIdsToToggle(
        prevIds => prevIds.filter(id => id !== todo.id),
      ));
  };

  const handleToggleAll = () => {
    if (areAllComplete || areAllActive) {
      Promise.all(allTodos.map(todo => handleToggleTodo(todo)))
        .then(() => setAllTodos(prevTodos => {
          return prevTodos.map(
            todo => ({ ...todo, completed: !todo.completed }),
          );
        }))
        .catch(() => setErrorMessage(ErrorStatus.Update));
    } else {
      Promise.all(activeTodos.map(todo => handleToggleTodo(todo)))
        .then(() => setAllTodos(prevTodos => {
          return prevTodos.map(todo => {
            if (!todo.completed) {
              return { ...todo, completed: true };
            }

            return todo;
          });
        }))
        .catch(() => setErrorMessage(ErrorStatus.Update));
    }
  };

  const handleTodoEdit: HandleTodoEdit = (
    oldTodo,
    newTitle,
    setIsBeingUpdated,
  ) => {
    if (oldTodo.title === newTitle) {
      setTodoOnEdit(null);

      return;
    }

    setIsBeingUpdated(true);

    if (!newTitle.trim()) {
      handleDeleteTodo(oldTodo.id);

      return;
    }

    patchTodo(USER_ID, { ...oldTodo, title: newTitle })
      .then(() => {
        setAllTodos(prevTodos => prevTodos.map(item => {
          if (item.id === oldTodo.id) {
            return { ...item, title: newTitle };
          }

          return item;
        }));
      })
      .catch(() => showErrorMessage(ErrorStatus.Update))
      .finally(() => {
        setIsBeingUpdated(false);
        setTodoOnEdit(null);
      });
  };

  useEffect(() => {
    setErrorMessage('');

    getTodos(USER_ID)
      .then(setAllTodos)
      .catch(() => showErrorMessage(ErrorStatus.Load));
  }, []);

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          <button
            type="button"
            className={classNames('todoapp__toggle-all', {
              active: areAllComplete,
            })}
            onClick={handleToggleAll}
          />

          <form onSubmit={(event) => handleFormSubmit(event, title)}>
            <input
              disabled={tempTodo !== null}
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              type="text"
              className="todoapp__new-todo"
              placeholder="What needs to be done?"
            />
          </form>
        </header>

        {allTodos.length > 0 && (
          <TodoList
            todos={filteredTodos}
            onDelete={handleDeleteTodo}
            idsToDelete={idsToDelete}
            idsToToggle={idsToToggle}
            onToggle={handleToggleTodo}
            todoOnEdit={todoOnEdit}
            setTodoOnEdit={setTodoOnEdit}
            handleTodoEdit={handleTodoEdit}
          />
        ) }
        {tempTodo && <TempTodoItem todo={tempTodo} />}

        {/* Hide the footer if there are no todos */}
        {allTodos.length > 0 && (
          <Footer
            activeCount={activeCount}
            filter={filter}
            setFilter={setFilter}
            isClearBtnShown={completedTodos.length > 0}
            onClearAll={handleClearCompleted}
          />
        )}
      </div>

      <ErrorMessage
        message={errorMessage}
        setMessage={setErrorMessage}
      />
    </div>
  );
};
