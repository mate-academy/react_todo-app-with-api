/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useRef, useState } from 'react';
import { UserWarning } from './UserWarning';
import {
  deleteTodos,
  getTodos,
  postTodos,
  toggleTodos,
  updateTitle,
  USER_ID,
} from './api/todos';
import { Todo } from './types/Todo';
import { Header } from './components/Header/Header';
import { TodoList } from './components/TodoList/TodoList';
import { Footer } from './components/Footer/Footer';
import { Notifications } from './components/Notifications/Notifications';
import { Filter } from './types/Filter';

export const App: React.FC = () => {
  const [allTodos, setAllTodos] = useState<Todo[]>([]);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);

  const [query, setQuery] = useState('');
  const [filterName, setFilterName] = useState<Filter>(Filter.all);
  const [errorMessage, setErrorMessage] = useState('');
  const [deletedTodoId, setDeletedTodoId] = useState<number | null>(null);

  const [isDisabled, setIsDisabled] = useState(false);
  const [isHover, setIsHover] = useState(false);
  const [updatingTodoId, setUpdatingTodoId] = useState<number | null>(null);
  const [isEditingId, setIsEditingId] = useState<number | null>(null);
  const [isTogglleAll, setIsToggleAll] = useState<boolean>(false);

  const inputRef = useRef<HTMLInputElement | null>(null);

  const deleteFromServer = async (id: number) => {
    return deleteTodos(id).catch(() => {
      setErrorMessage('Unable to delete a todo');
      throw Error('Unable to delete a todo');
    });
  };

  const handleDelete = async (id: number) => {
    setDeletedTodoId(id);

    try {
      await deleteFromServer(id);
      setAllTodos(prev => prev.filter(todo => todo.id !== id));
    } catch {
      setErrorMessage('Unable to delete a todo');
      // throw new Error();
    } finally {
      setDeletedTodoId(null);
      inputRef.current?.focus();
    }

    return;
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (query.trim().length === 0) {
      setErrorMessage('Title should not be empty');

      return;
    }

    setIsDisabled(true);

    const newTempTodo = {
      id: 0,
      title: query.trim(),
      userId: 2984,
      completed: false,
    };

    setTempTodo(newTempTodo);
    setIsDisabled(true);
    postTodos(query.trim())
      .then((newTodo: Todo) => {
        setQuery('');
        inputRef.current?.focus();
        setAllTodos(prevTodos => [...prevTodos, newTodo]);
      })
      .catch(() => {
        setErrorMessage('Unable to add a todo');
        setIsDisabled(true);
      })
      .finally(() => {
        setTempTodo(null);
        setIsDisabled(false);
        setTimeout(() => {
          inputRef.current?.focus();
        }, 0);
      });
  };

  const handleToggle = (updatedTodoId: number) => {
    event?.preventDefault();
    const toggleTodo = allTodos.find(todo => todo.id === updatedTodoId);
    const todoCompletedValue = toggleTodo?.completed;

    toggleTodos(updatedTodoId, !todoCompletedValue)
      .then(() => {
        setAllTodos(prevTodos =>
          prevTodos.map(todo =>
            todo.id === updatedTodoId
              ? { ...todo, completed: !todoCompletedValue }
              : todo,
          ),
        );
      })
      .catch(() => setErrorMessage('Unable to update a todo'))
      .finally(() => {
        setUpdatingTodoId(null);
        setIsToggleAll(false);
      });
  };

  const handleToggleAll = () => {
    if (allTodos.every(todo => todo.completed)) {
      allTodos.map(todo => handleToggle(todo.id));
    } else {
      allTodos.map(todo => {
        if (!todo.completed) {
          handleToggle(todo.id);
        }
      });
    }
  };

  const handleUpdateTitle = async (id: number, newTitle: string) => {
    if (newTitle.trim().length === 0) {
      try {
        await deleteFromServer(id);
        setAllTodos(prev => prev.filter(todo => todo.id !== id));
      } catch {
        setIsEditingId(id);
        setErrorMessage('Unable to delete a todo');
        throw Error();
      }

      return;
    }

    try {
      await updateTitle(id, newTitle);

      setAllTodos(prevTodos =>
        prevTodos.map(todo =>
          todo.id === id ? { ...todo, title: newTitle } : todo,
        ),
      );
    } catch {
      setIsEditingId(id);
      setErrorMessage('Unable to update a todo');
      throw Error('Unable to update a todo');
    }
  };

  const filteredTodos = allTodos.filter(todo => {
    switch (filterName) {
      case Filter.completed:
        return todo.completed;
      case Filter.active:
        return !todo.completed;
      default:
        return true;
    }
  });

  const handleClearCompleted = () => {
    allTodos.forEach(todo => {
      if (todo.completed) {
        handleDelete(todo.id);
      }
    });
  };

  const countOfNotCompletedTodos = () => {
    const filteredTodosNotCompleted = allTodos.filter(todo => !todo.completed);

    return filteredTodosNotCompleted.length;
  };

  const countOfCompletedTodos = () => {
    const filteredTodosCompleted = allTodos.filter(todo => todo.completed);

    return filteredTodosCompleted.length;
  };

  useEffect(() => {
    getTodos()
      .then(res => {
        setAllTodos(res);
        inputRef.current?.focus();
      })
      .catch(() => {
        setErrorMessage('Unable to load todos');
      });
  }, []);

  useEffect(() => {
    if (errorMessage) {
      const timeOutId = setTimeout(() => {
        setErrorMessage('');
      }, 3000);

      return () => clearTimeout(timeOutId);
    }
  }, [errorMessage]);

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          countOfCompletedTodos={countOfCompletedTodos}
          handleSubmit={handleSubmit}
          query={query}
          inputRef={inputRef}
          isDisabled={isDisabled}
          setQuery={setQuery}
          allTodos={allTodos}
          handleToggleAll={handleToggleAll}
          setIsToggleAll={setIsToggleAll}
        />

        <TodoList
          deletedTodoId={deletedTodoId}
          filteredTodos={filteredTodos}
          isHover={isHover}
          tempTodo={tempTodo}
          setIsHover={setIsHover}
          handleDelete={handleDelete}
          setUpdatingTodoId={setUpdatingTodoId}
          handleToggle={handleToggle}
          updatingTodoId={updatingTodoId}
          setIsEditingId={setIsEditingId}
          isEditingId={isEditingId}
          handleUpdateTitle={handleUpdateTitle}
          isTogglleAll={isTogglleAll}
        />

        {allTodos.length !== 0 && (
          <Footer
            countOfCompletedTodos={countOfCompletedTodos}
            filterName={filterName}
            handleClearCompleted={handleClearCompleted}
            setFilterName={setFilterName}
            countOfNotCompletedTodos={countOfNotCompletedTodos}
          />
        )}

        <Notifications
          errorMessage={errorMessage}
          setErrorMessage={setErrorMessage}
        />
      </div>
    </div>
  );
};
