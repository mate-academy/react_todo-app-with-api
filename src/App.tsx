/* eslint-disable jsx-a11y/control-has-associated-label */
import React, {
  FormEvent, useEffect, useMemo, useState,
} from 'react';
import { UserWarning } from './UserWarning';
import { Todo } from './types/Todo';
import {
  addTodo, deleteTodo, getTodos, updateTodo,
} from './api/todos';
import { Filter } from './types/Filter';
import { TodoInput } from './components/TodoInput';
import { TodoFooter } from './components/TodoFooter';
import { TodoList } from './components/TodoList';
import { Error } from './components/Error';
import { ErrorType } from './types/Error';

const USER_ID = 10822;

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filter, setFilter] = useState<Filter>(Filter.ALL);
  const [errorMessage, setErrorMessage] = useState('');
  const [inputValue, setInputValue] = useState('');
  const [inputIsDisabled, setInputIsDisabled] = useState(false);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);

  const areAllCompleted = todos.every(todo => todo.completed);
  const notCompletedTodosCount = todos.filter(todo => !todo.completed).length;
  const hasOneCompletedTodo = todos.some(todo => todo.completed);

  useEffect(() => {
    getTodos(USER_ID)
      .then(setTodos)
      .catch(error => setErrorMessage(error));
  }, []);

  const getFilteredTodos = useMemo(() => {
    return todos.filter(todo => {
      switch (filter) {
        case Filter.ACTIVE:
          return !todo.completed;
        case Filter.COMPLETED:
          return todo.completed;
        default:
          return true;
      }
    });
  }, [todos, filter]);

  const handleFormSubmit = (event :FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (tempTodo) {
      setInputIsDisabled(true);

      return;
    }

    if (!inputValue.trim()) {
      setErrorMessage(ErrorType.TODO_TITLE_IS_EMPTY);

      return;
    }

    const todoToAdd = {
      id: 0,
      userId: USER_ID,
      title: inputValue.trim(),
      completed: false,
    };

    setTempTodo(todoToAdd);

    addTodo(todoToAdd)
      .then(newTodo => {
        setTodos(currentTodos => [...currentTodos, newTodo]);
      })

      .catch(() => setErrorMessage(ErrorType.ADD))

      .finally(() => {
        setTempTodo(null);
        setInputValue('');
        setInputIsDisabled(false);
      });
  };

  const handleDeleteTodo = (todoId :number) => {
    deleteTodo(todoId)
      .then(() => setTodos(currentTodos => (
        currentTodos.filter(todo => todo.id !== todoId))))
      .catch(() => setErrorMessage(ErrorType.DELETE));
  };

  const toggleTodoStatus = (todoId :number) => {
    const todoToUpdate = todos.find(todo => todo.id === todoId);

    if (!todoToUpdate) {
      return;
    }

    const todoUpdated = {
      ...todoToUpdate, completed: !todoToUpdate.completed,
    };

    setIsUpdating(true);

    updateTodo(todoUpdated)
      .then(() => setTodos(currentTodos => (
        currentTodos.map(todo => (
          todo.id === todoId ? todoUpdated : todo)))))
      .catch(() => setErrorMessage(ErrorType.UPDATE))
      .finally(() => {
        setIsUpdating(false);
      });
  };

  const toggleAll = () => {
    setIsUpdating(true);

    const todosToUpdate = todos.map(todo => (
      { ...todo, completed: !areAllCompleted }
    ));

    Promise.all(todosToUpdate.map(todo => updateTodo(todo)))
      .then(updatedTodos => setTodos(updatedTodos))
      .catch(() => setErrorMessage(ErrorType.UPDATE))
      .finally(() => setIsUpdating(false));
  };

  const handleClearCompleted = () => {
    todos
      .filter(todo => todo.completed)
      .forEach(todo => handleDeleteTodo(todo.id));
  };

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <TodoInput
          handleFormSubmit={handleFormSubmit}
          inputValue={inputValue}
          setInputValue={setInputValue}
          inputIsDisabled={inputIsDisabled}
          areAllCompleted={areAllCompleted}
          toggleAll={toggleAll}
        />

        <TodoList
          todos={getFilteredTodos}
          setTodos={setTodos}
          handleDeleteTodo={handleDeleteTodo}
          toggleTodoStatus={toggleTodoStatus}
          isUpdating={isUpdating}
          setIsUpdating={setIsUpdating}
          setErrorMessage={setErrorMessage}
        />

        {todos.length > 0
          && (
            <TodoFooter
              filter={filter}
              setFilter={setFilter}
              itemsLeft={notCompletedTodosCount}
              hasOneCompletedTodo={hasOneCompletedTodo}
              handleClearCompleted={handleClearCompleted}
            />
          )}
      </div>

      {/* Add the 'hidden' class to hide the message smoothly */}
      {errorMessage && (
        <Error
          errorMessage={errorMessage}
          setErrorMessage={setErrorMessage}
        />
      )}
    </div>
  );
};
