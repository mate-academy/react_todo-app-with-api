/* eslint-disable jsx-a11y/control-has-associated-label */
import {
  useContext, useEffect, useMemo, useRef, useState,
} from 'react';
import classNames from 'classnames';
import { AuthContext } from './components/Auth/AuthContext';
import { TodoList } from './components/TodoList/TodoList';
import { Todo } from './types/Todo';
import {
  getTodos,
  addTodo,
  deleteTodo,
  updateTodoStatus,
  updateTodoTitle,
} from './api/todos';
import { Footer } from './components/Footer';
import { ErrorNotification } from './components/ErrorNotification';
import { FilterType } from './types/FilterType';
import { NewTodoField } from './components/NewTodoField';
import { TodoItem } from './components/TodoItem';
import { ErrorMessage } from './types/ErrorMessage';

const defaultTodo = {
  id: 0,
  userId: 0,
  title: '',
  completed: false,
};

export const App = (): JSX.Element | null => {
  const user = useContext(AuthContext);
  const newTodoField = useRef<HTMLInputElement>(null);
  const [todos, setTodos] = useState<Todo[]>([]);
  const [errorMessage, setErrorMessage]
    = useState<ErrorMessage>(ErrorMessage.None);
  const [filter, setFilter] = useState(FilterType.All);
  const [isAdding, setIsAdding] = useState(false);
  const [temporaryTodo, setTemporaryTodo] = useState(defaultTodo);
  const [completedIsRemoving, setCompletedIsRemoving] = useState(false);
  const [todosStatusIsChanging, setTodosStatusIsChanging] = useState(false);

  const numberOfTodos = useMemo(() => {
    return todos.filter((todo) => !todo.completed).length;
  }, [todos]);

  const numberOfCompleted = useMemo<number>(() => {
    return [...todos].filter((todo) => todo.completed).length;
  }, [todos]);

  const visibleTodos = useMemo<Todo[]>(() => {
    if (todos) {
      return [...todos].filter(todo => {
        switch (filter) {
          case FilterType.Active:
            return !todo.completed;

          case FilterType.Completed:
            return todo.completed;

          case FilterType.All:
          default:
            return true;
        }
      });
    }

    return [];
  }, [todos, filter]);

  const toggleAllIsActive = useMemo<boolean>(() => {
    return todos.filter((todo) => todo.completed).length === todos.length;
  }, [todos]);

  useEffect(() => {
    setErrorMessage(ErrorMessage.None);
    if (newTodoField.current) {
      newTodoField.current.focus();
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      getTodos(user.id)
        .then(result => setTodos(result))
        .catch(() => {
          setErrorMessage(ErrorMessage.CannotLoadTodos);
        });
    }

    setTodosStatusIsChanging(false);
  }, [todos]);

  useEffect(() => {
    setTimeout(() => setErrorMessage(ErrorMessage.None), 3000);
  }, [errorMessage]);

  if (!user) {
    return null;
  }

  const createTodo = (title: string) => {
    if (title.length === 0) {
      setErrorMessage(ErrorMessage.EmptyTitle);

      return;
    }

    setTemporaryTodo({
      ...temporaryTodo,
      title,
    });

    setIsAdding(true);

    addTodo(user.id, title)
      .catch(() => setErrorMessage(ErrorMessage.UnableToAdd))
      .finally(() => setIsAdding(false));
  };

  const removeTodoFromList = (todoId: number) => {
    return deleteTodo(todoId)
      .catch(() => setErrorMessage(ErrorMessage.UnableToDelete));
  };

  const removeCompleted = () => {
    setCompletedIsRemoving(true);
  };

  const toggleTodoStatus = (todoId: number, completed: boolean) => {
    return updateTodoStatus(todoId, completed)
      .catch(() => setErrorMessage(ErrorMessage.UnableToUpdate));
  };

  const toggleAllStatus = () => {
    setTodosStatusIsChanging(true);
  };

  const renameTodo = (todoId: number, title: string) => {
    return updateTodoTitle(todoId, title)
      .catch(() => setErrorMessage(ErrorMessage.UnableToUpdate));
  };

  const changeFilterType = (filterType: FilterType) => setFilter(filterType);

  const hideError = () => setErrorMessage(ErrorMessage.None);

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
              { active: toggleAllIsActive },
            )}
            onClick={toggleAllStatus}
          />

          <NewTodoField
            newTodoField={newTodoField}
            createTodo={createTodo}
            isAdding={isAdding}
          />
        </header>

        {(todos.length > 0 || isAdding) && (
          <>
            <TodoList
              todos={visibleTodos}
              deleteHandler={removeTodoFromList}
              completedIsRemoving={completedIsRemoving}
              toggleTodoStatus={toggleTodoStatus}
              todosStatusIsChanging={todosStatusIsChanging}
              toggleAllIsActive={toggleAllIsActive}
              renameTodo={renameTodo}
            />
            {isAdding && (
              <TodoItem
                todo={temporaryTodo}
                deleteHandler={removeTodoFromList}
                toggleTodoStatus={toggleTodoStatus}
                renameTodo={renameTodo}
              />
            )}
            <Footer
              filterBy={changeFilterType}
              todosQuantity={numberOfTodos}
              selectedFilter={filter}
              removeCompleted={removeCompleted}
              numberOfCompleted={numberOfCompleted}
            />
          </>
        )}
      </div>

      {errorMessage && (
        <ErrorNotification
          errorMessage={errorMessage}
          hideError={hideError}
        />
      )}
    </div>
  );
};
