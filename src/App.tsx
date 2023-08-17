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

import {
  getTodosFromServer,
  addTodoOnServer,
  deleteTodoFromServer,
  toggleTodoOnServer,
  changeTitleTodoOnServer,
} from './api/todos';
import * as utils from './utils/utils';

if (!process.env.REACT_APP_USER_ID) {
  throw new Error('API key is not defined');
}

const USER_ID: number = +process.env.REACT_APP_USER_ID;
const DELAY_ERROR = 3000;

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [todoLoaderIds, setTodoLoaderIds] = useState<number[]>([]);
  const [filterBy, setFilterBy] = useState<FilterBy>(FilterBy.all);
  const [error, setError] = useState<Errors | null>(null);

  const addLoader = (id: number) => {
    setTodoLoaderIds(currentIds => [...currentIds, id]);
  };

  const deleteLoader = (id: number) => {
    setTodoLoaderIds(currentIds => [...currentIds].filter(
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

  const setFilter = (filter: FilterBy) => {
    setFilterBy(filter);
  };

  const addTodo = async (title: string) => {
    if (title) {
      const newTodo = {
        title,
        userId: USER_ID,
        completed: false,
      };

      setTodoLoaderIds([0]);
      setTempTodo({
        ...newTodo,
        id: 0,
      });

      try {
        const addedTodo = await addTodoOnServer(newTodo);

        setTodos(currentTodos => [
          ...currentTodos,
          addedTodo,
        ]);
      } catch {
        setError(Errors.add);
        throw new Error();
      } finally {
        setTempTodo(null);
        setTodoLoaderIds([]);
      }
    } else {
      setError(Errors.emptyTitle);
    }
  };

  const deleteTodo = async (id: number) => {
    addLoader(id);

    try {
      await deleteTodoFromServer(id);
      setTodos(currentTodos => {
        return [...currentTodos].filter(todo => todo.id !== id);
      });
    } catch {
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
      await toggleTodoOnServer(id, !completed);
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
    setTodoLoaderIds(currentIds => [...currentIds, id]);

    if (!newTitle) {
      deleteTodo(id);
    }

    if (newTitle) {
      try {
        await changeTitleTodoOnServer(id, newTitle);
        changeAndToggleTodo(id, 'title', newTitle);
      } catch {
        if (!error) {
          setError(Errors.update);
          throw new Error();
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

  const onChangeOrder = async (
    todosList: Todo[],
  ) => {
    setTodos(todosList);
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
    getTodosFromServer(USER_ID)
      .then(setTodos)
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
                isActiveLoaderTodos={todoLoaderIds}
                onDeleteTodo={deleteTodo}
                onToggleTodo={toggleTodo}
                onChangeTodo={changeTodo}
                onChangeOrder={onChangeOrder}
              />
            </section>
            <TodoFooter
              onChangeFilter={setFilter}
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
