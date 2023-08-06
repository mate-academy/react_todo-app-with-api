/* eslint-disable jsx-a11y/control-has-associated-label */
import React, {
  useState,
  useEffect,
  useMemo,
  useCallback,
} from 'react';
import classNames from 'classnames';
import { UserWarning } from './UserWarning';
import { TodoItem } from './components/TodoItem';
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

  const handleFormSubmit = useCallback((
    event: React.FormEvent,
    newTitle: string,
  ) => {
    event.preventDefault();

    if (!newTitle.trim()) {
      setErrorMessage(ErrorStatus.NoTitle);

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
  }, [title]);

  const handleDeleteTodo = useCallback((todoId: number) => {
    setIdsToDelete(prevIds => [...prevIds, todoId]);

    deleteTodo(USER_ID, todoId)
      .then(() => {
        setAllTodos(prevTodos => prevTodos.filter(
          ({ id }) => id !== todoId,
        ));
      })
      .catch(() => setErrorMessage(ErrorStatus.Delete))
      .finally(() => setIdsToDelete(
        prevIds => prevIds.filter(id => id !== todoId),
      ));
  }, []);

  const handleClearCompleted = useCallback(() => {
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
  }, [completedTodos]);

  const handleToggleTodo = useCallback((todo: Todo): void => {
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
      .catch(() => setErrorMessage(ErrorStatus.Update))
      .finally(() => setIdsToToggle(
        prevIds => prevIds.filter(id => id !== todo.id),
      ));
  }, []);

  const handleToggleAll = useCallback(() => {
    Promise.all(activeTodos.map(todo => handleToggleTodo(todo)))
      .then(() => setAllTodos(prevTodos => {
        return prevTodos.map(todo => {
          return { ...todo, completed: !areAllComplete };
        });
      }))
      .catch(() => setErrorMessage(ErrorStatus.Update));
  }, [activeTodos]);

  const handleTodoEdit: HandleTodoEdit = useCallback((
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
      .catch(() => setErrorMessage(ErrorStatus.Update))
      .finally(() => {
        setIsBeingUpdated(false);
        setTodoOnEdit(null);
      });
  }, []);

  useEffect(() => {
    setErrorMessage('');

    getTodos(USER_ID)
      .then(setAllTodos)
      .catch(() => setErrorMessage(ErrorStatus.Load));
  }, []);

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
              type="button"
              className={classNames('todoapp__toggle-all', {
                active: areAllComplete,
              })}
              onClick={handleToggleAll}
            />
          )}

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
          <section className="todoapp__main">
            {filteredTodos.map(todo => (
              <TodoItem
                key={todo.id}
                todo={todo}
                onDelete={handleDeleteTodo}
                idsToDelete={idsToDelete}
                idsToToggle={idsToToggle}
                onToggle={handleToggleTodo}
                todoOnEdit={todoOnEdit}
                setTodoOnEdit={setTodoOnEdit}
                handleTodoEdit={handleTodoEdit}
              />
            ))}
          </section>
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
