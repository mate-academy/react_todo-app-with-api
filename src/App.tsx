/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useRef, useState } from 'react';
import cn from 'classnames';

import { UserWarning } from './UserWarning';
import {
  USER_ID,
  createTodo,
  deleteTodo,
  getTodos,
  updateTodos,
} from './api/todos';
import { Todo } from './types/Todo';
import { Header } from './components/Header/Header';
import { Footer } from './components/Footer/Footer';
import { TodoList } from './components/TodoList/TodoList';
import { Filter } from './types/Filter';
import { wait } from './utils/fetchClient';
import { getFilteredTodos } from './helper/getFilteredTodos';
import * as errors from './Errors/Errors';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filter, setFilter] = useState<Filter>(Filter.All);
  const [errorMessage, setErrorMessage] = useState('');
  const filteredTodos = getFilteredTodos(todos, filter);

  const [inputValue, setInputValue] = useState('');
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [loading, setLoading] = useState(false);
  const [addTodoId, setAddTodoId] = useState<number | null>(null);

  const allCompletedTodos = todos.every(todo => todo.completed);

  const titleField = useRef<HTMLInputElement>(null);

  const activeItems = todos.filter(({ completed }) => {
    return !completed;
  }).length;

  const completedItems = todos.filter(({ completed }) => {
    return completed;
  }).length;

  const createTodoHandler = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (inputValue.trim().length === 0) {
      setErrorMessage(errors.TITLE_EMPTY);

      wait(3000).then(() => setErrorMessage(''));

      return;
    }

    setLoading(true);
    setAddTodoId(0);

    setTempTodo({
      id: 0,
      title: inputValue.trim(),
      completed: false,
      userId: USER_ID,
    });

    const newTodo = {
      title: inputValue.trim(),
      completed: false,
      userId: USER_ID,
    };

    createTodo(newTodo)
      .then(todo => {
        setTodos(prevTodos => [...prevTodos, todo]);
        setInputValue('');
      })
      .catch(() => {
        setErrorMessage('Unable to add a todo');

        return wait(3000).then(() => setErrorMessage(''));
      })
      .finally(() => {
        setLoading(false);
        setAddTodoId(null);
        setTempTodo(null);
      });
  };

  const deleteTodoHandler = (targetId: number) => {
    setLoading(true);
    setAddTodoId(targetId);

    deleteTodo(targetId)
      .then(() => {
        setTodos((currentTodos: Todo[]) =>
          currentTodos.filter(item => item.id !== targetId),
        );
      })
      .catch(() => {
        setErrorMessage(errors.UNABLE_TO_DELETE);
        setAddTodoId(null);

        return wait(3000).then(() => setErrorMessage(''));
      })
      .finally(() => {
        setLoading(false);
        setAddTodoId(null);
      });
  };

  const deletedCheckedTodoHandler = () => {
    const completedTodos = todos.filter(({ completed }) => completed);

    completedTodos.forEach(({ id }) => deleteTodoHandler(id));
  };

  const toggleAllTodosHandler = () => {
    setLoading(true);

    Promise.all(
      todos.map(todo =>
        updateTodos({
          ...todo,
          completed: !allCompletedTodos,
        })
          .then(() => {
            setTodos(
              todos.map(previousTodo => ({
                ...previousTodo,
                completed: !allCompletedTodos,
              })),
            );
          })
          .catch(() => {
            setErrorMessage(errors.UNABLE_TO_UPDATE);

            return wait(3000).then(() => setErrorMessage(''));
          })
          .finally(() => {
            setLoading(false);
          }),
      ),
    );
  };

  const updateTodoTitleById = (currentTodo: Todo) => {
    const updateList = todos.map(todo => {
      if (todo.id === currentTodo.id) {
        return { ...todo, title: currentTodo.title };
      }

      return todo;
    });

    return updateList;
  };

  const updateCompletedTodoById = (todoId: number) => {
    const updatedList = todos.map(editedTodo => {
      const updatedTodo = { ...editedTodo };

      if (updatedTodo.id === todoId) {
        updatedTodo.completed = !updatedTodo.completed;
      }

      return updatedTodo;
    });

    setTodos(updatedList);
  };

  useEffect(() => {
    getTodos()
      .then(setTodos)
      .catch(() => {
        setErrorMessage(errors.UNABLE_TO_LOAD);

        return wait(3000).then(() => setErrorMessage(''));
      });
  }, []);

  useEffect(() => {
    if (titleField.current) {
      titleField.current.focus();
    }
  }, [tempTodo, todos]);

  const errorHandler = () => {
    setErrorMessage('');
  };

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          inputValue={inputValue}
          setInputValue={setInputValue}
          onSubmit={createTodoHandler}
          loading={loading}
          titleField={titleField}
          toggleAllTodosHandler={toggleAllTodosHandler}
          allCompletedTodos={allCompletedTodos}
        />

        {!!todos.length && (
          <>
            <TodoList
              todos={filteredTodos}
              tempTodo={tempTodo}
              addTodoId={addTodoId}
              deleteTodoHandler={deleteTodoHandler}
              updateTodoTitleById={updateTodoTitleById}
              updateCompletedTodoById={updateCompletedTodoById}
              setLoading={setLoading}
              setErrorMessage={setErrorMessage}
              setAddTodoId={setAddTodoId}
            />

            <Footer
              activeItems={activeItems}
              currentFilter={filter}
              setFilter={setFilter}
              completedItems={completedItems}
              deletedCheckedTodoHandler={deletedCheckedTodoHandler}
            />
          </>
        )}
      </div>

      <div
        data-cy="ErrorNotification"
        className={cn(
          'notification',
          'is-danger',
          'is-light',
          'has-text-weight-normal',
          { hidden: !errorMessage },
        )}
      >
        <button
          data-cy="HideErrorButton"
          type="button"
          className="delete"
          onClick={errorHandler}
        />
        {errorMessage}
      </div>
    </div>
  );
};
