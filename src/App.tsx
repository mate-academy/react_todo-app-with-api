/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useState } from 'react';
import cn from 'classnames';

import { UserWarning } from './UserWarning';
import { TodoHeader } from './components/TodoHeader';
import { TodoList } from './components/TodoList';
import { TodoFooter } from './components/TodoFooter';
import { Notification } from './components/Notification';

import { Todo } from './types/Todo';
import { FilterBy } from './types/FilterBy';
import { Errors } from './types/Errors';

import { client } from './utils/fetchClient';
import * as utils from './utils/utils';

const USER_ID = 11246;
const BASE_ADD_URL = '/todos';
const URL_GET = `?userId=${USER_ID}`;
const DELAY_ERROR = 3000;

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [hasTodoLoaderIds, setHasTodoLoaderIds] = useState<number[]>([]);
  const [filterBy, setFilterBy] = useState<FilterBy>(FilterBy.all);
  const [error, setError] = useState<Errors | null>(null);

  const addLoader = (id: number) => {
    setHasTodoLoaderIds(currentIds => [...currentIds, id]);
  };

  const deleteLoader = (id: number) => {
    setHasTodoLoaderIds(currentIds => [...currentIds].filter(
      hasLoaderId => hasLoaderId !== id,
    ));
  };

  const changeAndToggleTodo = (
    id: number,
    field: keyof Todo,
    value: Todo[typeof field],
  ) => {
    const indexOfMutableTodo = todos.findIndex(todo => todo.id === id);

    switch (field) {
      case 'completed':
        setTodos(currentTodos => {
          const copyTodos = [...currentTodos];

          copyTodos[indexOfMutableTodo].completed
            = !value;

          return copyTodos;
        });
        break;
      case 'title':
        setTodos(currentTodos => {
          const copyTodos = [...currentTodos];

          copyTodos[indexOfMutableTodo].title
            = `${value}`;

          return copyTodos;
        });
        break;
      default:
        break;
    }
  };

  const applyFilter = (filter: FilterBy) => {
    setFilterBy(filter);
  };

  const addTodo = async (title: string) => {
    if (title) {
      const newTodo = {
        title,
        userId: USER_ID,
        completed: false,
      };

      setHasTodoLoaderIds([0]);
      setTempTodo({
        ...newTodo,
        id: 0,
      });

      try {
        const addedTodo = await client.post<Todo>(BASE_ADD_URL, newTodo);

        setTodos(currentTodos => [
          ...currentTodos,
          addedTodo,
        ]);
      } catch (caughtError) {
        setError(Errors.add);
        throw caughtError;
      } finally {
        setTempTodo(null);
        setHasTodoLoaderIds([]);
      }
    } else {
      setError(Errors.emptyTitle);
    }
  };

  const deleteTodo = async (id: number) => {
    addLoader(id);

    try {
      await client.delete(`${BASE_ADD_URL}/${id}`);
      setTodos(currentTodos => {
        return [...currentTodos].filter(todo => todo.id !== id);
      });
    } catch (errorCought) {
      if (!error) {
        setError(Errors.delete);
      }
    } finally {
      deleteLoader(id);
    }
  };

  const toggleTodo = async (id: number, completed: boolean) => {
    addLoader(id);

    try {
      await client.patch(`/todos/${id}`, { completed: !completed });
      changeAndToggleTodo(id, 'completed', completed);
    } catch (e) {
      if (!error) {
        setError(Errors.update);
      }
    } finally {
      deleteLoader(id);
    }
  };

  const changeTodo = async (id: number, newTitle: string) => {
    setHasTodoLoaderIds(currentIds => [...currentIds, id]);

    if (!newTitle) {
      deleteTodo(id);
    }

    if (newTitle) {
      try {
        await client.patch(`/todos/${id}`, { title: newTitle });
        changeAndToggleTodo(id, 'title', newTitle);
      } catch (caughtError) {
        if (!error) {
          setError(Errors.update);
          throw caughtError;
        }
      } finally {
        deleteLoader(id);
      }
    }
  };

  const toggleAll = (isChecked: boolean) => {
    todos.forEach(todo => toggleTodo(todo.id, isChecked));
  };

  const clearCompleted = () => {
    const completedTodos
      = todos.filter(todo => todo.completed).map(todo => todo.id);

    completedTodos.forEach(completedTodo => deleteTodo(completedTodo));
  };

  const todosToRender = todos.filter(todo => {
    switch (filterBy) {
      case FilterBy.active:
        return !todo.completed;
      case FilterBy.completed:
        return todo.completed;
      default:
        return true;
    }
  });

  const completedTodos = utils.getCompletedTodos(todos);
  const activeTodos = utils.getActiveTodos(todos);
  const areAllTodosCompleted = activeTodos.length === 0;
  const areThereTodos = todos.length > 0;

  useEffect(() => {
    client.get<Todo[]>(BASE_ADD_URL + URL_GET)
      .then(dTodos => setTodos(dTodos))
      .catch(() => setError(Errors.load));
  }, []);

  useEffect(() => {
    if (error) {
      setTimeout(() => setError(null), DELAY_ERROR);
    }
  }, [error]);

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div
      className={cn(
        'todoapp',
        { 'has-error': error },
      )}
    >
      <h1 className="todoapp__title">todos</h1>
      <div className="todoapp__content">
        <TodoHeader
          onAddTodo={addTodo}
          areAllTodosCompleted={areAllTodosCompleted}
          activeTodos={activeTodos.length}
          areThereTodos={areThereTodos}
          toggleAll={toggleAll}
        />
        {todos.length > 0 && (
          <>
            <section className="todoapp__main">
              <TodoList
                todos={todosToRender}
                tempTodo={tempTodo}
                isActiveLoaderTodos={hasTodoLoaderIds}
                onDeleteTodo={id => deleteTodo(id)}
                onToggleTodo={(id, completed) => toggleTodo(id, completed)}
                onChangeTodo={(id, title) => changeTodo(id, title)}
              />
            </section>
            <TodoFooter
              onChangeFilter={applyFilter}
              filterSelected={filterBy}
              activeTodos={activeTodos.length}
              completedTodos={completedTodos.length}
              clearCompleted={clearCompleted}
            />
          </>
        )}
      </div>
      {error && (
        <Notification
          message={error}
          close={() => setError(null)}
        />
      )}
    </div>
  );
};
