/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useState, useRef } from 'react';
import { UserWarning } from './UserWarning';
import * as clientService from './api/todos';

import { Todo } from './types/Todo';
import { FilterQuery } from './types/FilterQuery';

import { Header } from './components/Header';
import { TodoList } from './components/TodoList';
import { Footer } from './components/Footer';
import { ErrorsHandler } from './components/ErrorsHandler';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [filteredTodos, setFilteredTodos] = useState(todos);
  const [activeFilterBtn, setActiveFilterBtn] = useState('all');
  const [title, setTitle] = useState('');
  const [isDisabled, setIsDisabled] = useState(false);
  const [loadingTodoId, setLoadingTodoId] = useState<number | null>(null);
  const [loadingTodoIds, setLoadingTodoIds] = useState<number[]>([]);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    inputRef.current?.focus();

    clientService
      .getTodos()
      .then(setTodos)
      .catch(() => {
        setErrorMessage('Unable to load todos');
      });
  }, []);

  useEffect(() => {
    if (!isDisabled && !tempTodo) {
      inputRef.current?.focus();
    }
  }, [isDisabled, tempTodo]);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    const trimmedTitle = title.trim();

    if (!trimmedTitle) {
      setErrorMessage('Title should not be empty');

      return;
    }

    const newTempTodo = {
      title: trimmedTitle,
      id: 0,
      userId: clientService.USER_ID,
      completed: false,
    };

    const newTodo: Omit<Todo, 'id'> = {
      title: trimmedTitle,
      userId: clientService.USER_ID,
      completed: false,
    };

    setIsDisabled(true);
    setTempTodo(newTempTodo);
    setLoadingTodoId(newTempTodo?.id);

    return clientService
      .addTodos(newTodo)
      .then(addedTodo => {
        setTodos(prevTodos => [...prevTodos, addedTodo]);
        setTitle('');
        setErrorMessage('');
      })
      .catch(() => setErrorMessage('Unable to add a todo'))
      .finally(() => {
        setIsDisabled(false);
        setTempTodo(null);
      });
  };

  const handleDeleteTodo = (id: number) => {
    setIsDisabled(true);
    setLoadingTodoId(id);

    return clientService
      .deleteTodos(id)
      .then(() => {
        setTodos(prevTodos => prevTodos.filter(todo => todo.id !== id));
      })
      .catch(() => setErrorMessage('Unable to delete a todo'))
      .finally(() => {
        setLoadingTodoId(null);
        setIsDisabled(false);
      });
  };

  const changeCompleted = (updatedTodo: Todo) => {
    setLoadingTodoId(updatedTodo.id);

    const toggledTodo = { ...updatedTodo, completed: !updatedTodo.completed };

    return clientService
      .updateTodos(toggledTodo)
      .then(() => {
        setTodos(prevTodos =>
          prevTodos.map(todo =>
            todo.id === toggledTodo.id ? toggledTodo : todo,
          ),
        );
      })
      .catch(() => setErrorMessage('Unable to update a todo'))
      .finally(() => setLoadingTodoId(null));
  };

  const handleChangeTitle = (updatedTodo: Todo): Promise<boolean> => {
    setLoadingTodoId(updatedTodo.id);

    return clientService
      .updateTodos(updatedTodo)
      .then(() => {
        setTodos(prevTodos =>
          prevTodos.map(todo =>
            todo.id === updatedTodo.id
              ? { ...todo, title: updatedTodo.title }
              : todo,
          ),
        );
        setErrorMessage('');

        return true;
      })
      .catch(() => {
        setErrorMessage('Unable to update a todo');

        return false;
      })
      .finally(() => setLoadingTodoId(null));
  };

  const handleToggleAll = () => {
    const allCompleted = todos.every(todo => todo.completed);

    const todosToUpdate = allCompleted
      ? todos
      : todos.filter(todo => !todo.completed);

    setLoadingTodoIds(todosToUpdate.map(todo => todo.id));

    const requests = todosToUpdate.map(todo => {
      const updatedTodo = { ...todo, completed: !allCompleted };

      return clientService
        .updateTodos(updatedTodo)
        .then(() => updatedTodo)
        .catch(() => {
          setErrorMessage(`Unable to update todo "${todo.title}"`);
          return null;
        });
    });

    return Promise.all(requests).then(results => {
      const successfulTodos = results.filter(Boolean) as Todo[];

      if (successfulTodos.length > 0) {
        setTodos(prevTodos =>
          prevTodos.map(
            todo => successfulTodos.find(t => t.id === todo.id) || todo,
          ),
        );
      }

      setLoadingTodoIds([]);
    });
  };


  const clearCompletedTodos = () => {
    const completedTodos = todos.filter(todo => todo.completed);

    setLoadingTodoIds(completedTodos.map(todo => todo.id));

    const deletePromises = completedTodos.map(todo =>
      clientService.deleteTodos(todo.id),
    );

    return Promise.allSettled(deletePromises).then(results => {
      const successfulIds = completedTodos
        .filter((_, index) => results[index].status === 'fulfilled')
        .map(todo => todo.id);

      const hasFailed = results.some(result => result.status === 'rejected');

      setTodos(prevTodos =>
        prevTodos.filter(todo => !successfulIds.includes(todo.id)),
      );

      if (hasFailed) {
        setErrorMessage('Unable to delete a todo');
      }

      setLoadingTodoIds([]);

      requestAnimationFrame(() => {
        inputRef.current?.focus();
      });
    });
  };

  const handleQueryChange = (value: string) => {
    setTitle(value);
  };

  const handleChangeFilter = (value: string) => {
    setActiveFilterBtn(value);
  };

  const handleDeleteErrorMsg = () => {
    setErrorMessage('');
  };

  useEffect(() => {
    if (errorMessage) {
      const timer = setTimeout(() => {
        setErrorMessage('');
      }, 3000);

      return () => {
        clearTimeout(timer);
      };
    }

    return () => {};
  }, [errorMessage]);

  useEffect(() => {
    setFilteredTodos(
      todos.filter(todo => {
        switch (activeFilterBtn) {
          case FilterQuery.All:
            return true;
          case FilterQuery.Active:
            return !todo.completed;
          case FilterQuery.Completed:
            return todo.completed;
          default:
            return false;
        }
      }),
    );
  }, [todos, activeFilterBtn]);

  if (!clientService.USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          todos={todos}
          title={title}
          inputRef={inputRef}
          isDisabled={isDisabled}
          handleToggleAll={handleToggleAll}
          handleQueryChange={handleQueryChange}
          handleSubmit={handleSubmit}
        />

        <TodoList
          todos={filteredTodos}
          loadingTodoId={loadingTodoId}
          loadingTodoIds={loadingTodoIds}
          tempTodo={tempTodo}
          handleDeleteTodo={handleDeleteTodo}
          changeCompleted={changeCompleted}
          handleChangeTitle={handleChangeTitle}
        />

        {todos.length !== 0 && (
          <Footer
            todos={todos}
            activeBtn={activeFilterBtn}
            handleChangeFilter={handleChangeFilter}
            clearCompletedTodos={clearCompletedTodos}
          />
        )}
      </div>

      <ErrorsHandler
        errorMessage={errorMessage}
        handleDeleteErrorMsg={handleDeleteErrorMsg}
      />
    </div>
  );
};
