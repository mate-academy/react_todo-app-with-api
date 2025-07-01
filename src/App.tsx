/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/indent */
/* eslint-disable no-console */
/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
/* eslint-disable-next-line import/no-extraneous-dependencies */
import React, { useEffect, useMemo, useRef, useState } from 'react';
import classNames from 'classnames';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import PropTypes from 'prop-types';
import { UserWarning } from './UserWarning';
import {
  addTodos,
  deleteTodos,
  getTodos,
  patchTodos,
  USER_ID,
} from './api/todos';
import { AddTodo, Todo } from './types/Todo';
import { ErrorNotification } from './components/ErrorNotification';
import { Header } from './components/Header';
import { Main } from './components/Main';
import { Footer } from './components/Footer';
import useError from './hooks/UseError';

import { FilteredValue } from './types/FilteredValue';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const { errorMessage, setErrorMessage } = useError();
  const [filter, setFilter] = useState<FilteredValue>(FilteredValue.All);
  const [isDisableBtn, setIsDisableBtn] = useState(true);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [inputValue, setInputValue] = useState('');
  const [deletingTodoId, setDeletingTodoId] = useState<number[]>([]);
  const [loadingTodoId, setLoadingTodoId] = useState<number[]>([]);
  const [editingTodoId, setEditingTodoId] = useState<number | null>(null);
  const [editingTitle, setEditingTitle] = useState('');

  useEffect(() => {
    getTodos()
      .then(data => {
        setTodos(data);
        setErrorMessage('');
      })
      .catch(() => setErrorMessage('Unable to load todos'));
  }, []);

  useEffect(() => {
    setIsDisableBtn(!todos.some(item => item.completed));
  }, [todos]);

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!tempTodo) {
      inputRef.current?.focus();
    }
  }, [tempTodo]);

  const handleAdd = (newTodo: AddTodo) => {
    const temp = {
      id: 0,
      ...newTodo,
    };

    setErrorMessage('');
    addTodos(newTodo)
      .then((createTodo: Todo) => {
        setTodos(prevTodos => [...prevTodos, createTodo]);
        setTempTodo(null);
        setInputValue('');
      })
      .catch(() => {
        setErrorMessage('Unable to add a todo');
        setTempTodo(null);
      });

    setTempTodo(temp);
  };

  const handleDelete = (id: number) => {
    setDeletingTodoId(prev => [...prev, id]);

    deleteTodos(id)
      .then(() => {
        setTodos(prev => prev.filter(todo => todo.id !== id));
        setDeletingTodoId(prev => prev.filter(todoId => todoId !== id));
        inputRef.current?.focus();
      })
      .catch(() => {
        setErrorMessage('Unable to delete a todo');
      });
  };

  const filtredItems = useMemo(() => {
    const filtered = todos.filter(todo => {
      switch (filter) {
        case FilteredValue.Active:
          return !todo.completed;
        case FilteredValue.Completed:
          return todo.completed;
        default:
          return true;
      }
    });

    return tempTodo ? [...filtered, tempTodo] : filtered;
  }, [todos, filter, tempTodo]);

  const activeTodos = todos.filter(todo => !todo.completed);

  const handleComletedDelete = async () => {
    const completed = filtredItems.filter(todo => todo.completed);

    if (completed.length === 0) {
      return;
    }

    setErrorMessage('');

    await Promise.all(completed.map(todo => handleDelete(todo.id)));
  };

  const handleToggle = (id: number) => {
    const todo = todos.find(item => item.id === id);

    if (!todo) {
      return;
    }

    setLoadingTodoId(prev => [...prev, id]);

    patchTodos({
      id: todo.id,
      completed: !todo.completed,
    })
      .then(updateTodo => {
        setTodos(prev =>
          prev.map(t =>
            t.id === updateTodo.id
              ? { ...t, completed: updateTodo.completed }
              : t,
          ),
        );
        setErrorMessage('');
      })
      .catch(() => setErrorMessage('Unable to update a todo'))
      .finally(() => {
        setLoadingTodoId(prev => prev.filter(todoId => todoId !== id));
      });
  };

  const handleAllActive = () => {
    const activeTodo: Todo[] = todos.filter(todo => !todo.completed);

    if (activeTodo.length > 0) {
      activeTodo.forEach(todo => {
        handleToggle(todo.id);
      });
    } else {
      todos.forEach(todo => {
        handleToggle(todo.id);
      });
    }
  };

  const startEditing = (id: number | null, currentTitle: string) => {
    setEditingTodoId(id);
    setEditingTitle(currentTitle);
  };

  const saveTitle = (id: number) => {
    const todo = todos.find(t => t.id === id);

    if (!todo || todo.title === editingTitle.trim()) {
      setEditingTodoId(null);

      return;
    }

    setLoadingTodoId(prev => [...prev, id]);

    if (editingTitle === '') {
      handleDelete(id);
    } else {
      patchTodos({
        id,
        title: editingTitle.trim(),
      })
        .then(updateTodo => {
          setTodos(prev =>
            prev.map(t =>
              t.id === updateTodo.id ? { ...t, title: updateTodo.title } : t,
            ),
          );
          setErrorMessage('');
          startEditing(null, '');
          setLoadingTodoId([]);
        })
        .catch(() => setErrorMessage('Unable to update a todo'))
        .finally(() => {
          setLoadingTodoId(prev => prev.filter(todoId => todoId !== id));
        });
    }
  };

  return USER_ID !== 2564 ? (
    <UserWarning />
  ) : (
    <div className="todoapp">
      <h1
        className={classNames('todoapp__title', {
          'todoapp__title--disabled': todos.length === 0,
        })}
      >
        todos
      </h1>

      <div className="todoapp__content">
        <Header
          handle={handleAllActive}
          handleAdd={handleAdd}
          setErrorMessage={setErrorMessage}
          tempTodo={tempTodo}
          inputValue={inputValue}
          setInputValue={setInputValue}
          inputRef={inputRef}
          todos={todos}
        />
        <Main
          filtredItems={filtredItems}
          handleToggle={handleToggle}
          handleDelete={handleDelete}
          tempTodo={tempTodo}
          deletingTodoId={deletingTodoId}
          loadingTodoId={loadingTodoId}
          startEditing={startEditing}
          saveTitle={saveTitle}
          editingTodoId={editingTodoId}
          setEditingTitle={setEditingTitle}
          editingTitle={editingTitle}
        />

        {todos.length !== 0 && (
          <Footer
            isDisableBtn={isDisableBtn}
            activeTodos={activeTodos}
            setFilter={setFilter}
            filter={filter}
            handleComletedDelete={handleComletedDelete}
          />
        )}
      </div>

      <ErrorNotification message={errorMessage} />
    </div>
  );
};

App.propTypes = {};
