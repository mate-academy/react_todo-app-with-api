/* eslint-disable jsx-a11y/control-has-associated-label */
import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import classNames from 'classnames';
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import { AuthContext } from './components/Auth/AuthContext';

import { getTodos, deleteTodo, updateTodoStatus } from './api/todos';
import { Todo } from './types/Todo';
import { TodosList } from './components/TodosList';
import { FilterBy } from './types/FilterBy';
import { FilterBar } from './components/FilterBar';
import { TodoAdd } from './components/TodoAdd';
import { Errors } from './components/Errors';
import { ErrorsType } from './types/ErrorsType';

import './styles/transition.css';

export const App: React.FC = () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const user = useContext(AuthContext);
  const newTodoField = useRef<HTMLInputElement>(null);

  const [newTodoTitle, setNewTodoTitle] = useState('');

  const [todosList, setTodoList] = useState<Todo[]>([]);

  // Errors
  const [errors, setErrors] = useState<ErrorsType[]>([]);

  // states
  const [isLoadingTodos, setIsLoadingTodos] = useState<number[]>([]);

  // Filter By
  const [filterBy, setFilterBy] = useState<FilterBy>(FilterBy.All);

  const leftTodos = useMemo(() => (
    todosList.filter(todo => todo.completed === false).length
  ), [todosList]);

  const isSelectAll = leftTodos === 0;

  const completedTodos = todosList.length - leftTodos;

  const filteredTodos = useMemo(() => {
    return todosList.filter(todo => {
      switch (filterBy) {
        case FilterBy.Active:
          return todo.completed === false;
        case FilterBy.Completed:
          return todo.completed === true;
        case FilterBy.All:
        default:
          return true;
      }
    });
  }, [filterBy, todosList]);

  const getTodosList = useCallback(async () => {
    if (user) {
      const response = await getTodos(user.id)
        .catch(() => {
          setErrors(currErrors => [
            ...currErrors,
            ErrorsType.Get,
          ]);
          setTimeout(() => {
            setErrors(currErrors => currErrors
              .filter(error => error !== ErrorsType.Get));
          }, 3000);
          throw new Error('Unable to get Todos from server');
        });

      setTodoList(response);
    } else {
      throw new Error('No user');
    }
  }, []);

  const clearError = useCallback(() => {
    setErrors([]);
  }, []);

  const deleteAllCompleted = useCallback(async () => {
    setIsLoadingTodos(currentLoadTodos => {
      const deletedTodos = todosList
        .filter(todo => todo.completed)
        .map(todo => todo.id);

      return [
        ...currentLoadTodos,
        ...deletedTodos,
      ];
    });

    try {
      await Promise.all(todosList.map((todo) => {
        if (todo.completed) {
          return deleteTodo(todo.id);
        }

        return null;
      }));

      await getTodosList();
    } catch {
      setErrors(currErrors => [
        ...currErrors,
        ErrorsType.Delete,
      ]);
      setTimeout(() => {
        setErrors(currErrors => currErrors
          .filter(error => error !== ErrorsType.Delete));
      }, 3000);
    }

    setIsLoadingTodos([]);
  }, [todosList]);

  const setCompletedAll = useCallback(async () => {
    setIsLoadingTodos(currentLoadTodos => {
      const uncompletedTodos = todosList
        .filter(todo => todo.completed === isSelectAll)
        .map(todo => todo.id);

      return [
        ...currentLoadTodos,
        ...uncompletedTodos,
      ];
    });

    try {
      await Promise.all(todosList.map(todo => {
        if (todo.completed === isSelectAll) {
          return updateTodoStatus(todo.id, todo.completed);
        }

        return null;
      }));

      await getTodosList();
    } catch {
      setErrors(currErrors => [
        ...currErrors,
        ErrorsType.Update,
      ]);
      setTimeout(() => {
        setErrors(currErrors => currErrors
          .filter(error => error !== ErrorsType.Update));
      }, 3000);
    }

    setIsLoadingTodos([]);
  }, [todosList]);

  useEffect(() => {
    // focus the element with `ref={newTodoField}`
    if (newTodoField.current) {
      newTodoField.current.focus();
    }

    getTodosList();
  }, []);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          <button
            data-cy="ToggleAllButton"
            type="button"
            className={classNames(
              'todoapp__toggle-all',
              {
                active: isSelectAll,
              },
            )}
            onClick={setCompletedAll}
          />

          <TodoAdd
            newTodoField={newTodoField}
            isLoadingTodos={isLoadingTodos}
            setErrors={setErrors}
            setIsLoadingTodos={setIsLoadingTodos}
            getTodosList={getTodosList}
            errors={errors}
            newTodoTitle={newTodoTitle}
            setNewTodoTitle={setNewTodoTitle}
          />
        </header>

        <TransitionGroup>
          <CSSTransition
            timeout={300}
            classNames="list-item"
          >
            <TodosList
              todos={filteredTodos}
              getTodosList={getTodosList}
              setErrors={setErrors}
              isLoadingTodos={isLoadingTodos}
              setIsLoadingTodos={setIsLoadingTodos}
              newTodoTitle={newTodoTitle}
            />
          </CSSTransition>
        </TransitionGroup>

        {todosList.length > 0
          && (
            <FilterBar
              leftTodos={leftTodos}
              filterBy={filterBy}
              setFilterBy={setFilterBy}
              completedTodos={completedTodos}
              deleteAllCompleted={deleteAllCompleted}
            />
          )}
      </div>

      {errors.length > 0 && (
        <Errors
          clearError={clearError}
          errors={errors}
        />
      )}
    </div>
  );
};
