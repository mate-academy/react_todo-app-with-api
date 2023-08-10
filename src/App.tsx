/* eslint-disable max-len */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useState, useEffect } from 'react';
import { UserWarning } from './UserWarning';
import { Header } from './components/Header';
import { TodoList } from './components/TodoList';
import { Filter } from './components/Filter';
import { Notifications } from './components/Notifications';
import {
  addTodo, deleteTodo, getTodos, updateTodo,
} from './api/todos';

import { Todo } from './types/Todo';
import { ErrorText } from './types/ErrorText';
import { Filters } from './types/Filters';

const USER_ID = 11213;

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loadedTodos, setLoadingTodos] = useState<number[]>([]);
  const [errorMessage, setErrorMessage] = useState(ErrorText.Empty);
  const [selectedFilter, setSelectedFilter] = useState<Filters>(Filters.All);
  const [title, setTitle] = useState('');
  const [isDisabledInput, setIsDisabledInput] = useState(false);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [isFocusedHeader, setIsFocusedHeader] = useState(false);

  const filteredTodos = (filterChar: Filters) => {
    return todos.filter(todo => {
      switch (filterChar) {
        case Filters.All:
          return true;

        case Filters.Active:
          return todo.completed === false;

        case Filters.Completed:
          return todo.completed === true;

        default:
          return false;
      }
    });
  };

  const updateTodos = async (newTodos: Todo[]) => {
    const todoIds = newTodos.map(t => t.id);

    setLoadingTodos(currentLoading => [...currentLoading, ...todoIds]);
    setIsFocusedHeader(false);

    const promisedUpdatedTodos = newTodos.map(newTodo => {
      return updateTodo(newTodo.id, newTodo) as Promise<Todo>;
    });

    try {
      const gottedTodos: Todo[] = await Promise.all(promisedUpdatedTodos);

      setTodos(currentTodos => currentTodos.map(todo => {
        if (todoIds.includes(todo.id)) {
          const updatedTodo = gottedTodos.find(t => t.id === todo.id);

          return updatedTodo as Todo;
        }

        return todo;
      }));
    } catch {
      setErrorMessage(ErrorText.Update);
    } finally {
      setLoadingTodos([]);
    }
  };

  const deleteTodos = async (todoIds: number[]) => {
    setLoadingTodos(todoIds);
    setIsFocusedHeader(false);

    const promisedDeletedTodos = todoIds.map(id => {
      return deleteTodo(id);
    });

    try {
      await Promise.all(promisedDeletedTodos);

      setTodos(currentTodos => currentTodos.filter(t => !todoIds.includes(t.id)));
    } catch {
      setErrorMessage(ErrorText.Delete);
    } finally {
      setLoadingTodos([]);
    }
  };

  const addTodos = () => {
    const newTodo = {
      id: Math.max(...todos.map(t => t.id)) + 1,
      userId: USER_ID,
      title,
      completed: false,
    };

    setTempTodo({ ...newTodo, id: 0 });
    setLoadingTodos([0]);
    setIsDisabledInput(true);
    setIsFocusedHeader(true);

    addTodo(newTodo)
      .then(() => {
        setTodos(currentTodos => [...currentTodos, newTodo]);
        setTitle('');
      })
      .catch(() => {
        setErrorMessage(ErrorText.Add);
      })
      .finally(() => {
        setTempTodo(null);
        setLoadingTodos([]);
        setIsDisabledInput(false);
      });
  };

  useEffect(() => {
    getTodos(USER_ID)
      .then(setTodos)
      .catch(() => {
        setErrorMessage(ErrorText.Get);
      });
  }, []);

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          title={title}
          onSetTitle={setTitle}
          todos={todos}
          onAddTodos={addTodos}
          onSetErrorMessage={setErrorMessage}
          isDisabledInput={isDisabledInput}
          onUpdateTodos={updateTodos}
          onIsFocusedHeader={isFocusedHeader}
        />

        <TodoList
          todos={filteredTodos(selectedFilter)}
          loadingTodoId={loadedTodos}
          onDeleteTodo={deleteTodos}
          tempTodo={tempTodo}
          onUpdateTodos={updateTodos}
        />

        {todos.length > 0 && (
          <Filter
            todos={todos}
            selectedFilter={selectedFilter}
            onSetSelectedFilter={setSelectedFilter}
            onDeleteTodo={deleteTodos}
          />
        )}
      </div>

      <Notifications
        errorMessage={errorMessage}
        onSetErrorMessage={setErrorMessage}
      />
    </div>
  );
};
