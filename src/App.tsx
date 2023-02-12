/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useState } from 'react';
import { Errors } from './components/Errors';
import { TodoContent } from './components/TodoContent';
import { UserWarning } from './UserWarning';
import {
  getTodos, addTodo, deleteTodo, patchTodo,
} from './api/todos';
import { Todo } from './types/Todo';
import { Filter } from './types/Filter';
import { ErrorMessages } from './types/ErrorMessages';

const USER_ID = 6232;

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filteredTodos, setFilteredTodos] = useState<Todo[]>([]);
  const [error, setError] = useState<ErrorMessages | null>(null);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [isInputDisabled, setIsInputDisabled] = useState(false);
  const [loadingAll, setLoadingAll] = useState(false);

  const filterTodos = (filterBy: Filter) => {
    setFilteredTodos(
      todos.filter((todo) => {
        switch (filterBy) {
          case Filter.active:
            return todo.completed === false;

          case Filter.completed:
            return todo.completed === true;

          default:
            return todo;
        }
      }),
    );
  };

  const createTodo = async (title: string) => {
    setIsInputDisabled(true);

    const newTodo = {
      title,
      userId: USER_ID,
      completed: false,
    };

    setTempTodo({ ...newTodo, id: 0 });
    await addTodo(newTodo)
      .then((response) => {
        setTempTodo(null);

        setFilteredTodos((state) => [...state, response]);
      })
      .catch(() => {
        setError(ErrorMessages.addTodo);
      });

    setIsInputDisabled(false);
  };

  const removeTodo = async (id: number) => {
    await deleteTodo(id)
      .then(() => {
        setFilteredTodos(filteredTodos.filter((todo) => todo.id !== id));
      })
      .catch(() => {
        setError(ErrorMessages.deleteTodo);
      });
  };

  const updateTodo = async (todo: Todo, update: 'title' | 'complete') => {
    if (update === 'complete') {
      await patchTodo({ ...todo, completed: !todo.completed })
        .then((res) => {
          setFilteredTodos(
            filteredTodos.map((t) => {
              if (res.id === t.id) {
                return res;
              }

              return t;
            }),
          );
        })
        .catch(() => {
          setError(ErrorMessages.updateTodo);
        });
    }
  };

  const clearCompleted = () => {
    filteredTodos.forEach((todo) => {
      if (todo.completed) {
        removeTodo(todo.id);
      }
    });
  };

  const toggleAll = async () => {
    const isAllComplete = !filteredTodos?.every((t) => t.completed);

    await filteredTodos.forEach((todo) => {
      if (todo.completed !== isAllComplete) {
        patchTodo({ ...todo, completed: isAllComplete })
          .then((res) => res)
          .catch(() => {
            setError(ErrorMessages.updateTodo);
          });
      }
    });

    setFilteredTodos(
      filteredTodos.map((t) => ({ ...t, completed: isAllComplete })),
    );

    setLoadingAll(false);
  };

  useEffect(() => {
    getTodos(USER_ID)
      .then((result) => {
        setTodos(result);
        setFilteredTodos(result);
      })
      .catch(() => {
        setError(ErrorMessages.loadingTodos);
      });
  }, []);

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <TodoContent
        todos={filteredTodos}
        filterTodos={filterTodos}
        onError={(e: ErrorMessages | null) => setError(e)}
        createTodo={createTodo}
        tempTodo={tempTodo}
        isInputDisabled={isInputDisabled}
        deleteTodo={removeTodo}
        updateTodo={updateTodo}
        clearCompleted={clearCompleted}
        toggleAll={toggleAll}
        loadingAll={loadingAll}
        setLoadingAll={setLoadingAll}
      />

      {error && <Errors error={error} setError={setError} />}
    </div>
  );
};
