/* eslint-disable max-len */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useMemo, useState } from 'react';
import { UserWarning } from './UserWarning';
import * as postService from './api/todos';
import { Todo } from './types/Todo';
import classNames from 'classnames';
import { Errors } from './types/Errors';
import { Filter } from './types/Filters';
import { FooterComponent } from './components/Footer';
import { NewTodoField } from './components/NewTodoField';
import { TodoList } from './components/TodoList';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<string | null>(null);
  const [currentTitle, setCurrentTitle] = useState<string>('');
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [completedTodos, setCompletedTodos] = useState<number[] | null>(null);
  const [checkResponceAdd, setCheckResponceAdd] = useState(false);

  useEffect(() => {
    postService
      .getTodos(postService.USER_ID)
      .then(response => {
        setTodos(response);
      })
      .catch(() => setError(Errors.Loading));
  }, []);

  useEffect(() => {
    if (!error) {
      return;
    }

    setTimeout(() => {
      setError(null);
    }, 3000);

    const timer = window.setTimeout(() => {
      setError(null);
    }, 3000);

    window.clearTimeout(timer);
  }, [error]);

  function updateTodo({ id, userId, title, completed }: Todo) {
    return postService
      .updateTodo({ id, userId, title, completed })
      .then(updatedTodo => {
        setTodos(currentTodos => {
          const newTodos = [...currentTodos];
          const index = newTodos.findIndex(todo => todo.id === updatedTodo.id);

          newTodos.splice(index, 1, updatedTodo);

          return newTodos;
        });
      })
      .catch(() => {
        setError(Errors.Updateing);
        throw new Error();
      });
  }

  async function toggleAll(list: Todo[]) {
    const completeIds = list.map(item => item.id);

    setCompletedTodos(completeIds);

    try {
      await Promise.all(list.map(todo => updateTodo(todo)));
    } finally {
      setCompletedTodos(null);
    }
  }

  function addTodo({ title, userId, completed }: Todo) {
    const temp = {
      id: Date.now(),
      userId,
      title,
      completed,
    };

    setTempTodo(temp);
    setCheckResponceAdd(true);

    postService
      .addTodo({ title, userId, completed })
      .then(newTodo => {
        setTodos(currentTodos => [...currentTodos, newTodo]);
        setTempTodo(null);
        setCurrentTitle('');
      })
      .catch(() => {
        setError(Errors.Adding);
        setTempTodo(null);
      })
      .finally(() => {
        setCheckResponceAdd(false);
      });
  }

  function deleteTodo(postId: number) {
    return postService
      .deleteTodo(postId)
      .then(() => {
        setTodos(curretTodos => curretTodos.filter(post => post.id !== postId));
      })
      .catch(() => {
        setError(Errors.Deleting);
        throw new Error('Delete failed');
      });
  }

  async function completeDelete(list: Todo[]) {
    const completedArr: number[] = list.map(item => item.id);

    setCompletedTodos(completedArr);

    setCheckResponceAdd(true);

    try {
      await Promise.all(completedArr.map(id => deleteTodo(id)));
    } finally {
      setCompletedTodos(null);

      setCheckResponceAdd(false);
    }
  }

  const visibleTodos = useMemo(() => {
    return todos.filter(todo => {
      switch (filter) {
        case Filter.Active:
          return !todo.completed;
        case Filter.Completed:
          return todo.completed;
        default:
          return true;
      }
    });
  }, [filter, todos]);

  if (!postService.USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          {/* this button should have `active` class only if all todos are completed */}
          <NewTodoField
            todos={todos}
            onAdd={addTodo}
            title={currentTitle}
            onChange={setCurrentTitle}
            onError={setError}
            checkResponceAdd={checkResponceAdd}
            onToggleAll={toggleAll}
          />
        </header>

        <TodoList
          todos={todos}
          visibleTodos={visibleTodos}
          onUpdate={toggleAll}
          onDelete={completeDelete}
          tempTodo={tempTodo}
          completedTodos={completedTodos}
        />

        {todos.length > 0 && (
          <FooterComponent
            todos={todos}
            filter={filter}
            onFilter={setFilter}
            onDelete={completeDelete}
          />
        )}
      </div>

      {/* DON'T use conditional rendering to hide the notification */}
      {/* Add the 'hidden' class to hide the message smoothly */}
      <div
        data-cy="ErrorNotification"
        className={classNames(
          'notification is-danger is-light has-text-weight-normal',
          { hidden: !error },
        )}
      >
        <button
          data-cy="HideErrorButton"
          type="button"
          className="delete"
          onClick={() => setError(null)}
        />
        {error}
      </div>
    </div>
  );
};
