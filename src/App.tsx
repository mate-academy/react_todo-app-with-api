/* eslint-disable jsx-a11y/control-has-associated-label */
import React, {
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import {
  getTodos,
  addTodo,
  deleteTodo,
  toggleTodo,
} from './api/todos';
import { AuthContext } from './components/Auth/AuthContext';
import { ErrorNotification }
  from './components/ErrorNotification/ErrorNotifications';
import { NewTodoField } from './components/NewTodoField/NewTodoField';
import { TodoList } from './components/TodoList/TodoList';
import { TodosFilter } from './components/TodoFilter/TodoFilter';
import { Todo } from './types/Todo';
import { FilteringMethod } from './types/FilteringMethod';

import './App.scss';

export const App: React.FC = () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars

  const user = useContext(AuthContext);
  const newTodoField = useRef<HTMLInputElement>(null);
  const [todos, setTodos] = useState<Todo[]>([]);
  const [visibleTodos, setVisibleTodos] = useState<Todo[]>(todos);
  const [selectedIDs, setSelectedIDs] = useState<number[]>([]);
  const [hasError, setHasError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [todoStatus, setTodoStatus]
    = useState<FilteringMethod>(FilteringMethod.All);
  const [isAdding, setIsAdding] = useState(false);
  const [isAllTodosCompleted, setIsAllTodosCompleted] = useState(false);
  const [todoTemplate, setTodoTemplate] = useState({
    id: 0,
    userId: 0,
    title: '',
    completed: false,
  });

  const getTodosFromsServer = useCallback(async () => {
    try {
      if (user) {
        const todosFromServer = await getTodos(user.id);

        setTodos(todosFromServer);
      }
    } catch (err) {
      setHasError(true);

      setTimeout(() => {
        setHasError(false);
      }, 3000);
    }
  }, []);

  const addNewTodo = async (todoTitle: string) => {
    try {
      setIsAdding(true);

      if (user) {
        setTodoTemplate(curr => ({
          ...curr,
          userId: user.id,
          title: todoTitle,
        }));

        const addedTodo = await addTodo({
          title: todoTitle,
          userId: user.id,
          completed: false,
        });

        setIsAdding(false);

        setTodos(curr => [...curr, addedTodo]);
      }

      if (newTodoField.current) {
        newTodoField.current.focus();
      }
    } catch (error) {
      setHasError(true);
      setErrorMessage('Unable to add a todo');
    }
  };

  const handleDeleteTodo = useCallback(async (id: number) => {
    try {
      setSelectedIDs(current => [...current, id]);
      await deleteTodo(id);

      setTodos(curr => curr.filter(todo => todo.id !== id));

      setSelectedIDs([]);
    } catch (error) {
      setHasError(true);
      setErrorMessage('Unable to delete a todo');
    }
  }, []);

  const removeAllCompleted = async () => {
    try {
      setSelectedIDs(todos
        .filter(todo => todo.completed)
        .map(todo => todo.id));

      await Promise.all(todos.map(todo => {
        return todo.completed ? handleDeleteTodo(todo.id) : null;
      }));
    } catch (error) {
      setHasError(true);
      setErrorMessage('Unable to delete todo');
    }
  };

  const handleEditTodo
  = useCallback(async (todoId: number, data: Partial<Todo>) => {
    try {
      setSelectedIDs(currentId => [...currentId, todoId]);

      await toggleTodo(todoId, data);
      await getTodosFromsServer();

      setSelectedIDs([]);
    } catch (error) {
      setHasError(true);
      setErrorMessage('Unable to update a todo');
    }
  }, []);

  const changeAllToCompleted = async () => {
    try {
      const idsToComplete = todos
        .filter(todo => !todo.completed)
        .map(todo => todo.id);

      setSelectedIDs(idsToComplete);

      if (idsToComplete.length === 0) {
        setSelectedIDs(todos.map(todo => todo.id));

        await Promise.all(todos
          .map(todo => handleEditTodo(todo.id, { completed: false })));
      } else {
        await Promise.all(todos.map(todo => {
          return !todo.completed
            ? handleEditTodo(todo.id, { completed: true }) : null;
        }));
      }

      setSelectedIDs([]);
    } catch (error) {
      setHasError(true);
      setErrorMessage('Unable to update a todo');
    }
  };

  const handleErrorClose = () => setHasError(false);
  const handleStatusSelect = useCallback((status: FilteringMethod) => {
    setTodoStatus(status);
  }, []);

  useEffect(() => {
    getTodosFromsServer();
  }, []);

  useEffect(() => {
    // focus the element with `ref={newTodoField}`
    if (newTodoField.current) {
      newTodoField.current.focus();
    }

    setIsAllTodosCompleted(todos.every(todo => todo.completed));
  }, [todos]);

  useEffect(() => {
    let todosCopy = [...todos];

    if (todoStatus !== FilteringMethod.All) {
      todosCopy = todosCopy.filter(todo => {
        switch (todoStatus) {
          case FilteringMethod.Active:
            return !todo.completed;

          case FilteringMethod.Completed:
            return todo.completed;

          default:
            return true;
        }
      });
    }

    setVisibleTodos(todosCopy);
  }, [todos, todoStatus]);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <NewTodoField
          newTodoField={newTodoField}
          isAdding={isAdding}
          addNewTodo={addNewTodo}
          setErrorMessage={setErrorMessage}
          setHasError={setHasError}
          changeAllToCompleted={changeAllToCompleted}
          isAllTodosCompleted={isAllTodosCompleted}
        />

        {todos.length > 0 && (
          <>
            <TodoList
              visibleTodos={visibleTodos}
              todoTemplate={todoTemplate}
              isAdding={isAdding}
              selectedIDs={selectedIDs}
              handleDeleteTodo={handleDeleteTodo}
              handleEditTodo={handleEditTodo}
            />

            <TodosFilter
              todos={todos}
              filteringMethod={todoStatus}
              handleStatusSelect={handleStatusSelect}
              removeAllCompleted={removeAllCompleted}
            />
          </>
        )}

      </div>

      <ErrorNotification
        hasError={hasError}
        setHasError={setHasError}
        errorMessage={errorMessage}
        handleErrorClose={handleErrorClose}
      />
    </div>
  );
};
