/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useState } from 'react';

import {
  createTodo,
  deleteTodoFromServer,
  getTodos,
  updateTodoComplete,
  updateTodoTitle,
  USER_ID,
} from './api/todos';
import { wait } from './utils/fetchClient';
import { filteringTodos } from './utils/queueTodos';
import { countItemsLeft } from './utils/countItemsLeft';
import { ErrorMsg } from './utils/ErrorMsg';
import { TodoFilter } from './utils/TodoFilter';
import { Todo } from './types/Todo';

import { UserWarning } from './UserWarning';
import { Header } from './components/Header';
import { TodoList } from './components/TodoList';
import { Footer } from './components/Footer';
import { ErrorNotification } from './components/ErrorNotification';

export const App: React.FC = () => {
  const [allTodos, setAllTodos] = useState<Todo[]>([]);
  const [filter, setFilter] = useState<TodoFilter>(TodoFilter.ALL);
  const [error, setError] = useState<string>('');
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);

  useEffect(() => {
    setError('');

    getTodos()
      .then(setAllTodos)
      .catch(() => {
        setError(ErrorMsg.LIST_LOAD_ERROR);
        wait(3000, true).then(() => setError(''));
      });
  }, []);

  if (!USER_ID) {
    return <UserWarning />;
  }

  const uncompletedTodos: Todo[] = allTodos.filter(todo => !todo.completed);
  const completedTodos: Todo[] = allTodos.filter(todo => todo.completed);
  const queuedTodos: Todo[] = filteringTodos(allTodos, filter);
  const itemsLeft: number = countItemsLeft(allTodos);

  const setLoading = (todoId: number, loadStatus: boolean) => {
    setAllTodos(currentTodos => {
      return currentTodos.map(todo =>
        todo.id === todoId ? { ...todo, loading: loadStatus } : todo,
      );
    });
  };

  const addTodo = (
    title: string,
    setTitle: React.Dispatch<React.SetStateAction<string>>,
  ) => {
    if (!title.trim().length) {
      setError(ErrorMsg.EMPTY_TITLE);
      wait(3000, true).then(() => setError(''));

      return;
    }

    setTempTodo({
      id: 0,
      title: title.trim(),
      userId: USER_ID,
      completed: false,
      loading: true,
    });

    createTodo(title.trim())
      .then(todo => {
        setTitle('');

        setAllTodos([...allTodos, todo]);
      })
      .catch(() => {
        setError(ErrorMsg.ADD_TODO_ERROR);
        wait(3000, true).then(() => setError(''));
      })
      .finally(() => {
        setTempTodo(null);
      });
  };

  const deleteTodo = (todoId: number, clearCompletedTodos?: boolean): void => {
    setLoading(todoId, true);

    deleteTodoFromServer(todoId)
      .then(() => {
        if (!clearCompletedTodos) {
          setAllTodos(allTodos.filter(todo => todo.id !== todoId));
        }
      })
      .catch(() => {
        setLoading(todoId, false);

        setError(ErrorMsg.DELETE_TODO_ERROR);
        wait(3000, true).then(() => setError(''));
      });
  };

  const changeTodoCompleteStatus = (todoId: number, status?: boolean): void => {
    const updatingTodo = allTodos.find(todo => todo.id === todoId);

    if (!updatingTodo) {
      return;
    }

    setLoading(todoId, true);

    updateTodoComplete(todoId, !updatingTodo.completed)
      .then(() => {
        setAllTodos(todos =>
          todos.map(todo => {
            if (todo.id === todoId) {
              const newTodo = todo;

              newTodo.completed = status ? status : !newTodo.completed;

              return newTodo;
            } else {
              return todo;
            }
          }),
        );
      })
      .catch(() => {
        setError(ErrorMsg.UPDATE_TODO_ERROR);
        wait(3000, true).then(() => setError(''));
      })
      .finally(() => {
        setLoading(todoId, false);
      });
  };

  const changeTodoTitle = (
    todoId: number,
    title: string,
  ): Promise<void> | undefined => {
    const updatingTodo = allTodos.find(todo => todo.id === todoId);

    if (!updatingTodo) {
      return;
    }

    if (title.length === 0) {
      setError(ErrorMsg.EMPTY_TITLE);
      wait(3000, true).then(() => setError(''));
    }

    setLoading(todoId, true);

    return new Promise(resolve => {
      updateTodoTitle(todoId, title).then(() => {
        setAllTodos(todos =>
          todos.map(todo => {
            if (todo.id === todoId) {
              const newTodo = todo;

              newTodo.title = title;

              return newTodo;
            } else {
              return todo;
            }
          }),
        );

        resolve().finally(() => {
          setLoading(todoId, false);
        });
      });
    });
  };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          addTodo={addTodo}
          completeTodo={changeTodoCompleteStatus}
          tempTodo={tempTodo}
          allTodos={allTodos}
          completedTodos={completedTodos}
          uncompletedTodos={uncompletedTodos}
        />

        <TodoList
          todos={queuedTodos}
          tempTodo={tempTodo}
          deleteTodo={deleteTodo}
          changeTodoCompleteStatus={changeTodoCompleteStatus}
          changeTodoTitle={changeTodoTitle}
        />

        {allTodos.length > 0 && (
          <Footer
            setError={setError}
            setFilter={setFilter}
            setAllTodos={setAllTodos}
            filter={filter}
            itemsLeft={itemsLeft}
            completedTodos={completedTodos}
          />
        )}
      </div>

      <ErrorNotification error={error} setError={setError} />
    </div>
  );
};
