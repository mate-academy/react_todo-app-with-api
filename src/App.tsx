/* eslint-disable jsx-a11y/control-has-associated-label */
import classNames from 'classnames';
import React, {
  useCallback,
  useContext, useEffect, useRef, useState,
} from 'react';
import { getTodos } from './api/todos';
import { AuthContext } from './components/Auth/AuthContext';
import { ErrorNotification } from './components/ErrorNotification';
import { Footer } from './components/Footer';
import { ItemBeforeAdding } from './components/ItemBeforeAdding';
import { TodoItem } from './components/TodoItem';
import { SortType } from './types/SortType';
import { Todo } from './types/Todo';
import { client } from './utils/fetchClient';

export const App: React.FC = () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const user = useContext(AuthContext);
  const newTodoField = useRef<HTMLInputElement>(null);

  const [todos, setTodos] = useState<Todo[]>([]);
  const [inputDataOfTodo, setInputDataOfTodo] = useState('');

  const [isLoading, setIsLoadind] = useState(false);

  const [errorMsgTodo, setErrorMsgTodo] = useState(false);

  const [sortType, setSortType] = useState(SortType.all);

  const [hideErrors, setHideErrors] = useState(true);
  const [hasLoadingTodoError, setHasLoadingTodoError] = useState(false);
  const [hasUpdateTodoError, setHasUpdateTodoError] = useState(false);
  const [hasDeleteTodoError, setHasDeleteTodoError] = useState(false);

  const [isRemoveOneTodoLoading, setIsRemoveOneTodoLoading] = useState(false);
  const [isRemovingAllDone, setIsRemovingAllDone] = useState(false);

  const closeErrors = useCallback(() => {
    setTimeout(() => setHideErrors(true), 3000);
  }, []);

  useEffect(() => {
    // focus the element with `ref={newTodoField}`
    // if (newTodoField.current) {
    //   newTodoField.current.focus();
    // }

    if (user) {
      getTodos(user.id)
        .then(res => setTodos(res.map(todo => ({
          id: todo.id,
          userId: todo.userId,
          title: todo.title,
          completed: todo.completed,
        }))))
        .catch(() => setHasLoadingTodoError(true));
    }
  }, [todos]);

  let preparedTodosToShow: Todo[] = [...todos];

  switch (sortType) {
    case SortType.completed:
      preparedTodosToShow = todos.filter(todo => todo.completed === true);
      break;

    case SortType.active:
      preparedTodosToShow = todos.filter(todo => todo.completed === false);
      break;

    case SortType.all:
    default:
      break;
  }

  const sortingTodos = useCallback((sort: SortType) => {
    setSortType(sort);
  }, []);

  const areAllCompleted = todos.every(todo => todo.completed === true);
  let countOfActiveTodo = 0;
  let countOfDoneTodo = 0;

  todos.forEach((item) => {
    if (!item.completed) {
      countOfActiveTodo += 1;
    } else {
      countOfDoneTodo += 1;
    }
  });

  const canAdd = user !== null && inputDataOfTodo !== '' && !isLoading;

  const addingTodoToList = (event: React.KeyboardEvent) => {
    if (
      event.key === 'Enter' && user && inputDataOfTodo === '') {
      setErrorMsgTodo(true);
      setHideErrors(false);
      closeErrors();
    } else if (
      event.key === 'Enter' && canAdd) {
      setIsLoadind(true);
      client.post<Todo>('/todos', {
        title: inputDataOfTodo,
        userId: user.id,
        completed: false,
      })
        .then(res => {
          const todoFromServer: Todo = {
            id: res.id,
            userId: res.userId,
            title: res.title,
            completed: res.completed,
          };

          setTodos(prev => [...prev, todoFromServer]);
        })
        .catch(() => {
          setHasLoadingTodoError(true);
          setHideErrors(false);
          closeErrors();
        })
        .finally(() => {
          setInputDataOfTodo('');
          setIsLoadind(false);
        });
    }
  };

  const updateAllTodos = () => {
    const listOfTodos = [...todos];

    listOfTodos.forEach(todo => (
      client.patch<Todo>(`/todos/${todo.id}`, {
        completed: !areAllCompleted,
      })
        .catch(() => setHasUpdateTodoError(true))));
  };

  const removeOneTodo = useCallback((id: number) => {
    setIsRemoveOneTodoLoading(true);
    client.delete<Todo>(`/todos/${id}`)
      .then(res => {
        setTodos(prev => prev
          .filter(prevTodo => prevTodo.id !== res.id));
      })
      .catch(() => {
        setHasDeleteTodoError(true);
        setHideErrors(false);
      })
      .finally(() => setIsRemoveOneTodoLoading(false));
  }, []);

  const removeAllDoneTodo = () => {
    todos.forEach(todo => {
      if (todo.completed) {
        setIsRemovingAllDone(true);
        client.delete(`/todos/${todo.id}`)
          .finally(() => setIsRemovingAllDone(false));
      }
    });
  };

  const toHideErrors = () => {
    setHideErrors(true);
  };

  const hasUpdateError = useCallback(() => setHasUpdateTodoError(true), []);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          <button
            data-cy="ToggleAllButton"
            type="button"
            className={classNames(
              'todoapp__toggle-all', { active: areAllCompleted },
            )}
            onClick={updateAllTodos}
          />

          <form
            onSubmit={(event) => event.preventDefault()}
          >
            <input
              data-cy="NewTodoField"
              type="text"
              ref={newTodoField}
              className="todoapp__new-todo bulma-loader-mixin"
              placeholder="What needs to be done?"
              value={inputDataOfTodo}
              onChange={(event) => {
                setInputDataOfTodo(event.target.value);
                setHideErrors(true);
              }}
              onKeyUp={addingTodoToList}
            />
          </form>
        </header>

        <section className="todoapp__main" data-cy="TodoList">
          {preparedTodosToShow.map(todo => (
            <TodoItem
              key={todo.id}
              todo={todo}
              removeOneTodo={removeOneTodo}
              hasUpdateError={hasUpdateError}
              isRemoving={isRemoveOneTodoLoading}
              isRemovingAll={isRemovingAllDone}
            />
          ))}

          {isLoading && <ItemBeforeAdding text={inputDataOfTodo} />}
        </section>

        {todos.length > 0 && (
          <Footer
            countOfActiveTodo={countOfActiveTodo}
            countOfDoneTodo={countOfDoneTodo}
            removeAllDoneTodo={removeAllDoneTodo}
            sortType={sortType}
            sortingTodos={sortingTodos}
          />
        )}
      </div>

      <ErrorNotification
        errorMsgTodo={errorMsgTodo}
        hasLoadingTodoError={hasLoadingTodoError}
        hasDeleteTodoError={hasDeleteTodoError}
        hasUpdateTodoError={hasUpdateTodoError}
        hideErrors={hideErrors}
        toHideErrors={toHideErrors}
      />
    </div>
  );
};
