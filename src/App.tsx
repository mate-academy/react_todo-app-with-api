import { FormEvent, useEffect, useMemo, useRef, useState } from 'react';
import cn from 'classnames';
import {
  updateTodo,
  deleteTodo,
  addTodo,
  getTodos,
  USER_ID,
} from './api/todos';
import { Todo } from './types/Todo';

import { FilterType } from './types/FilterType';
import { Header } from './components/Header';
import { TodoList } from './components/TodoList';
import { Footer } from './components/Footer';
import { ErrorMessageType } from './types/ErrorMessageType';
import { ErrorNotification } from './components/ErrorNotification';
import { TodoItem } from './components/TodoItem';

export const App: React.FC = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [query, setQuery] = useState<FilterType>(FilterType.All);
  const [selectedTitle, setSelectedTitle] = useState('');
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState('');
  const [selected, setSelected] = useState<number | null>(null);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [loadingTodosId, setLoadingTodosId] = useState<number[]>([]);
  const [errorMessage, setErrorMessage] = useState<ErrorMessageType>(
    ErrorMessageType.NONE,
  );
  const selectedRef = useRef<HTMLInputElement>(null);
  const isSavingRef = useRef(false);

  const completedTodo = todos.filter(todo => todo.completed);
  const notCompletedTodos = todos.filter(todo => !todo.completed);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const trimmedTitle = title.trim();

    if (!trimmedTitle) {
      setErrorMessage(ErrorMessageType.TITLE);
      setTitle('');
      inputRef.current?.focus();
      setIsSubmitting(false);

      return;
    }

    setIsSubmitting(true);
    const newTodo = {
      completed: false,
      title: trimmedTitle,
      userId: USER_ID,
    };

    setTempTodo({
      id: 0,
      userId: USER_ID,
      title: trimmedTitle,
      completed: false,
    });

    setTitle(trimmedTitle);

    addTodo(newTodo)
      .then(TodoToAdd => {
        setTodos(prev => [...prev, TodoToAdd]);
        setTempTodo(null);
        setTitle('');
      })
      .catch(() => {
        setTempTodo(null);
        setErrorMessage(ErrorMessageType.ADD);
      })
      .finally(() => {
        setIsSubmitting(false);
      });
  };

  const deleteTodoHandler = (id: number) => {
    setLoadingTodosId(prev => [...prev, id]);
    setIsSubmitting(true);

    deleteTodo(id)
      .then(() => {
        setTodos(prev => [...prev.filter(todo => todo.id !== id)]);
      })
      .catch(() => {
        setErrorMessage(ErrorMessageType.DELETE);
      })
      .finally(() => {
        setIsSubmitting(false);
        setLoadingTodosId([]);
      });
  };

  const handleDoubleClick = (todo: Todo) => {
    setSelectedTitle(todo.title.trim());
    setSelected(todo.id);
  };

  const clearCompleted = () => {
    const ids = completedTodo.map(todo => todo.id);

    setLoadingTodosId(prev => [...prev, ...ids]);

    async function deleteTodosAsync() {
      const promises = ids.map(i => deleteTodo(i));

      setIsSubmitting(true);

      try {
        const results = await Promise.allSettled(promises);

        const successIds: number[] = [];
        const failedIds: number[] = [];

        results.forEach((res, i) =>
          res.status === 'fulfilled'
            ? successIds.push(ids[i])
            : failedIds.push(ids[i]),
        );

        if (failedIds.length > 0) {
          setErrorMessage(ErrorMessageType.DELETE);
        }

        setTodos(prev => prev.filter(todo => !successIds.includes(todo.id)));
      } catch {
        setErrorMessage(ErrorMessageType.DELETE);
      } finally {
        setLoadingTodosId([]);
        setIsSubmitting(false);
      }
    }

    deleteTodosAsync();
  };

  useEffect(() => {
    setTimeout(() => {
      setErrorMessage(ErrorMessageType.NONE);
    }, 3000);
  }, [errorMessage]);

  const visibleTodos = useMemo(() => {
    return todos.filter(todo => {
      switch (query) {
        case FilterType.Active:
          return !todo.completed;
        case FilterType.Completed:
          return todo.completed;
        default:
          return true;
      }
    });
  }, [todos, query]);

  useEffect(() => {
    setLoading(true);
    setErrorMessage(ErrorMessageType.NONE);

    async function fetchTodos() {
      try {
        const todosFromServer = await getTodos();

        setTodos(todosFromServer);
      } catch {
        setErrorMessage(ErrorMessageType.LOAD);
      } finally {
        setLoading(false);
      }
    }

    fetchTodos();
  }, []);

  const handleToggle = (todo: Todo) => {
    const updatedTodo = { ...todo };

    updatedTodo.completed = !updatedTodo.completed;
    setLoadingTodosId(prev => [...prev, todo.id]);

    updateTodo(updatedTodo)
      .then(() => {
        setTodos(prev =>
          prev.map(t => (t.id === updatedTodo.id ? updatedTodo : t)),
        );
      })
      .catch(() => {
        setErrorMessage(ErrorMessageType.UPDATE);
        setTimeout(() => {
          setErrorMessage(ErrorMessageType.NONE);
        }, 3000);
      })
      .finally(() => {
        setLoadingTodosId([]);
      });
  };

  const handleToggleAll = () => {
    const todosToUpdate =
      notCompletedTodos.length === 0 ? todos : notCompletedTodos;

    setIsSubmitting(true);
    setLoadingTodosId(() => todosToUpdate.map(t => t.id));

    const updatedTodos = todosToUpdate.map(t => ({
      ...t,
      completed: !t.completed,
    }));

    async function handleToggleAllasync() {
      const promises = updatedTodos.map(todo => updateTodo(todo));
      const succesfull: Todo[] = [];
      const failed = [];

      try {
        const results = await Promise.allSettled(promises);

        results.forEach(r =>
          r.status === 'fulfilled'
            ? succesfull.push(r.value as Todo)
            : failed.push(r.reason),
        );

        setTodos(prev =>
          prev.map(prevItem => {
            const found = succesfull.find(el => el.id === prevItem.id);

            return found ? found : prevItem;
          }),
        );
      } catch {
        setErrorMessage(ErrorMessageType.UPDATE);
      } finally {
        setIsSubmitting(false);
        setLoadingTodosId([]);
      }
    }

    handleToggleAllasync();
  };

  const handleTodoChange = (
    todo: Todo,
    event?: React.FormEvent<HTMLFormElement>,
  ) => {
    if (isSavingRef.current) {
      return;
    }

    if (event) {
      event.preventDefault();
    }

    const trimmed = selectedTitle.trim();

    if (todo.title === trimmed) {
      setSelected(null);

      return;
    }

    if (trimmed.length === 0) {
      setLoadingTodosId(prev => [...prev, todo.id]);
      setIsSubmitting(true);

      deleteTodo(todo.id)
        .then(() => {
          setTodos(prev => [...prev.filter(t => t.id !== todo.id)]);
          setSelected(null);
        })
        .catch(() => {
          setErrorMessage(ErrorMessageType.DELETE);
        })
        .finally(() => {
          setIsSubmitting(false);
          setLoadingTodosId([]);
        });

      return;
    }

    const changedTodo = { ...todo, title: trimmed };

    setLoadingTodosId(prev => [...prev, todo.id]);
    setIsSubmitting(true);

    updateTodo(changedTodo)
      .then(() => {
        setTodos(prev =>
          prev.map(t => (t.id === changedTodo.id ? changedTodo : t)),
        );

        setSelected(null);
      })
      .catch(() => setErrorMessage(ErrorMessageType.UPDATE))
      .finally(() => {
        setLoadingTodosId([]);
        setIsSubmitting(false);
        isSavingRef.current = false;
      });
  };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>
      <div className="todoapp__content">
        <Header
          title={title}
          handleSubmit={handleSubmit}
          handleTitleChange={setTitle}
          notCompletedTodosCount={notCompletedTodos.length}
          isSubmitting={isSubmitting}
          loading={loading}
          inputRef={inputRef}
          handleToggleAll={handleToggleAll}
          todosLength={todos.length}
        />
        <TodoList
          todos={visibleTodos}
          loading={loading}
          selected={selected}
          handleDoubleClick={handleDoubleClick}
          isSubmitting={isSubmitting}
          selectedTitle={selectedTitle}
          setSelectedTitle={setSelectedTitle}
          deleteTodoHandler={deleteTodoHandler}
          loadingTodosId={loadingTodosId}
          handleToggle={handleToggle}
          setSelected={setSelected}
          selectedRef={selectedRef}
          handleTodoChange={handleTodoChange}
        ></TodoList>

        {tempTodo && (
          <>
            <div
              data-cy="TodoLoader"
              className={cn('modal overlay', {
                'is-active': false,
              })}
            >
              {/* eslint-disable-next-line max-len */}
              <div className="modal-background has-background-white-ter" />
              <div className="loader" />
            </div>
            <TodoItem
              key={tempTodo.id}
              todo={tempTodo}
              selected={selected}
              handleDoubleClick={handleDoubleClick}
              selectedTitle={selectedTitle}
              setSelectedTitle={setSelectedTitle}
              isSubmitting={isSubmitting}
              deleteTodoHandler={deleteTodoHandler}
              loadingTodosId={loadingTodosId}
              handleToggle={handleToggle}
              setSelected={setSelected}
              selectedRef={selectedRef}
              handleTodoChange={handleTodoChange}
            ></TodoItem>
          </>
        )}

        {todos.length && (
          <Footer
            notCompletedTodosCount={notCompletedTodos.length}
            query={query}
            setQuery={setQuery}
            clearCompleted={clearCompleted}
            completedTodoLength={completedTodo.length}
          ></Footer>
        )}
      </div>

      <ErrorNotification
        errorMessage={errorMessage}
        setErrorMessage={setErrorMessage}
      ></ErrorNotification>
    </div>
  );
};
