import React, {
  useContext, useEffect, useRef, useState,
} from 'react';
import { changeTodoStatus, getTodos } from './api/todos';
import { AuthContext } from './components/Auth/AuthContext';
import Error from './components/Error/Error';
import { ErrorContext } from './components/Error/ErrorContext';
import { TodoContext } from './components/Todo/TodoContext';
import TodoFooter from './components/Todo/TodoFooter/TodoFooter';
import TodoForm from './components/Todo/TodoForm';
import TodoList from './components/Todo/TodoList/TodoList';
import { ErrorContextType } from './types/ErrorContextType';
import { FilterTypes } from './types/FilterTypes';
import { Todo } from './types/Todo';
import { TodoContextType } from './types/TodoContextType';

export const App: React.FC = () => {
  const user = useContext(AuthContext);
  const newTodoField = useRef<HTMLInputElement>(null);
  const {
    todos,
    setTodos,
    visibleTodos,
    setVisibleTodos,
  } = useContext(TodoContext) as TodoContextType;
  const { setIsError, setErrorText }
  = useContext(ErrorContext) as ErrorContextType;
  const [isAdding, setIsAdding] = useState(false);
  const [selectedClass, setSelectedClass] = useState(FilterTypes.All);

  useEffect(() => {
    if (newTodoField.current) {
      newTodoField.current.focus();
    }
  }, []);

  const getTodosFromServer = async () => {
    if (!user) {
      return;
    }

    try {
      const result = await getTodos(user.id);

      setTodos(result);
    } catch {
      setIsError(true);
      setErrorText('Unable to load todos');
    }
  };

  const changeAllTodosStatus = async () => {
    try {
      visibleTodos.map(async (todo) => {
        await changeTodoStatus(todo.id, { completed: !todo.completed });

        setVisibleTodos(
          todos.map((one: Todo) => {
            return {
              ...one,
              completed: !one.completed,
            };
          }),
        );
      });
    } catch (error) {
      setIsError(true);
      setErrorText('Unable to update todos');
    }
  };

  useEffect(() => {
    getTodosFromServer();
  }, [visibleTodos]);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>
      <div className="todoapp__content">
        <header className="todoapp__header">
          <button
            data-cy="ToggleAllButton"
            aria-label="Add todo"
            type="button"
            className="todoapp__toggle-all active"
            onClick={changeAllTodosStatus}
          />
          <TodoForm
            newTodoField={newTodoField}
            setIsAdding={setIsAdding}
            isAdding={isAdding}
          />
        </header>
        {todos
        && (
          <TodoList
            selectedClass={selectedClass}
          />
        )}
        {!!todos.length
        && (
          <TodoFooter
            selectedClass={selectedClass}
            setSelectedClass={setSelectedClass}
          />
        )}
      </div>
      <Error />
    </div>
  );
};
