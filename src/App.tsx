import React, {
  useEffect,
  useState,
  useCallback,
  useMemo,
} from 'react';
import classNames from 'classnames';
import './App.scss';

import { UserWarning } from './UserWarning';
import { Todo } from './types/Todo';

import {
  getTodos,
  addTodo,
  deleteTodo,
  updateTodo,
} from './api/todos';
import { BASE_URL } from './utils/fetchClient';

import { ErrorType } from './types/ErrorType';
import { ErrorMessage } from './components/ErrorMessage';

import { TodoList, USER_ID } from './components/TodoList/TodoList';

import { defaultTodo } from './utils/constants';
import { FilterType } from './types/FilterType';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [addingTodoTitle, setAddingTodoTitle] = useState(defaultTodo.title);
  const [errorToShow, setErrorToShow] = useState<ErrorType>('none');
  const [todosToShow, setTodosToShow] = useState(todos);
  const [
    chosenFilter,
    setChosenFilter,
  ] = useState<FilterType | string>(FilterType.All);
  const [creating, setCreating] = useState(false);
  const [tempTodo, setTempTodo] = useState<Todo>(defaultTodo);
  const [processings, setProcessing] = useState<number[]>([]);

  useEffect(() => {
    getTodos(USER_ID)
      .then((todosFromServer) => setTodos(todosFromServer));
  }, []);

  useEffect(() => {
    const filteredTodos = todos.filter(todo => {
      switch (chosenFilter) {
        case FilterType.Active:
          return !todo.completed;
        case FilterType.Completed:
          return todo.completed;
        case FilterType.All:
        default:
          return todo;
      }
    });

    setTodosToShow(filteredTodos);
  }, [todos, chosenFilter]);

  const handleSetNewTitle = useCallback((
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const { target: { value } } = event;

    return setAddingTodoTitle(value);
  }, []);

  const getTodoById = (idFindBy: number) => {
    return todos.find(({ id }) => id === idFindBy) || defaultTodo;
  };

  const activeTodos = useMemo(() => todos
    .filter(todo => !todo.completed), [todos]);

  const completedTodos = useMemo(() => todos
    .filter(todo => todo.completed), [todos]);

  const activeTodosNumber = activeTodos.length;
  const areActiveTodos = activeTodosNumber > 0;
  const areCompletedTodos = completedTodos.length > 0;

  if (!USER_ID) {
    return <UserWarning />;
  }

  const handleSubmitNewTodo = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (addingTodoTitle === '') {
      setErrorToShow('emptyTitle');

      return null;
    }

    const newTodo = {
      id: 0,
      userId: USER_ID,
      title: addingTodoTitle,
      completed: false,
    };

    setTodos((prevTodos) => [...prevTodos, newTodo]);
    setCreating(true);
    setTempTodo(newTodo);

    processings.push(0);

    const response = addTodo(USER_ID, newTodo)
      .then((todo) => {
        setTempTodo(defaultTodo);
        setCreating(false);

        const processedTodo = getTodoById(0);

        processedTodo.id = todo.id;
      })
      .catch(() => setErrorToShow('add'));

    setAddingTodoTitle('');

    return response;
  };

  const handleFilterTodo = (
    event: React.MouseEvent<HTMLAnchorElement, MouseEvent>,
  ) => {
    event.preventDefault();

    const target = event.target as HTMLAnchorElement;
    const { href } = target;
    const hashIndex = href.indexOf('#');
    const tail = href.slice(hashIndex + 2);

    const filter = tail !== ''
      ? tail
      : 'all';

    setChosenFilter(filter);
  };

  const handleAllChecked = () => {
    return areActiveTodos
      ? activeTodos.map((activeTodo: Todo) => {
        setProcessing((prevState) => [...prevState, activeTodo.id]);

        const todosToSet = todos.map(todo => {
          return {
            ...todo,
            completed: true,
          };
        });

        setTodos(todosToSet);

        return updateTodo(activeTodo.id, { completed: areActiveTodos })
          .then()
          .catch(() => {
            return setErrorToShow('update');
          });
      })
      : completedTodos.map((completedTodo: Todo) => {
        setProcessing((prevState) => [...prevState, completedTodo.id]);

        const todosToSet = todos.map(todo => {
          return {
            ...todo,
            completed: false,
          };
        });

        setTodos(todosToSet);

        return updateTodo(completedTodo.id, { completed: areActiveTodos })
          .then()
          .catch(() => {
            return setErrorToShow('update');
          });
      });
  };

  const deleteById = (idToDelete: number) => {
    setTodos((prevTodos) => {
      const filtered = prevTodos.filter(todo => idToDelete !== todo.id);

      return filtered;
    });
  };

  const handleDeleteAllCompleted = () => {
    return completedTodos.map((completedTodo: Todo) => {
      setProcessing((prevState) => [...prevState, completedTodo.id]);
      deleteById(completedTodo.id);

      return deleteTodo(completedTodo.id).then().catch(() => {
        return setErrorToShow('delete');
      });
    });
  };

  const handleDeleteTodo = (idToDelete: number) => {
    setProcessing((prevState) => [...prevState, idToDelete]);
    deleteById(idToDelete);

    return deleteTodo(idToDelete).then().catch(() => {
      return setErrorToShow('delete');
    });
  };

  const handleUpdateTodo = (
    idToUpdate: number,
    dataToUpdate: string | boolean,
  ) => {
    setProcessing((prevState) => [...prevState, idToUpdate]);

    const todoToUpdate = getTodoById(idToUpdate);

    if (dataToUpdate === '') {
      return setErrorToShow('emptyTitle');
    }

    if (typeof dataToUpdate === 'string') {
      todoToUpdate.title = dataToUpdate;

      const todosToSet = todos
        .map((todo) => (todo.id !== idToUpdate ? todo : todoToUpdate));

      setTodos(todosToSet);

      return updateTodo(idToUpdate, { title: dataToUpdate })
        .catch(() => setErrorToShow('update'));
    }

    const todosToSet = todos
      .map((todo) => {
        if (todo.id === idToUpdate) {
          return {
            ...todo,
            completed: dataToUpdate,
          };
        }

        return todo;
      });

    setTodos(todosToSet);

    return updateTodo(idToUpdate, { completed: dataToUpdate })
      .then()
      .catch(() => setErrorToShow('update'));
  };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">

          <label htmlFor="todo-form">
            <button
              type="button"
              aria-label="Toggle All"
              className={
                classNames(
                  'todoapp__toggle-all',
                  { active: activeTodosNumber > 0 },
                )
              }
              onClick={handleAllChecked}
            />
          </label>

          <form
            id="todo-form"
            key="todo-form"
            action={BASE_URL}
            method="POST"
            onSubmit={handleSubmitNewTodo}
          >
            <input
              type="text"
              className="todoapp__new-todo"
              placeholder="What needs to be done?"
              value={addingTodoTitle}
              onChange={handleSetNewTitle}
            />
          </form>
        </header>

        <TodoList
          visibleTodos={todosToShow}
          deleteTodo={handleDeleteTodo}
          processings={processings}
          creating={creating}
          tempTodo={tempTodo}
          onUpdate={handleUpdateTodo}
        />

        {todos.length > 0 && (
          <footer className="todoapp__footer">
            <span className="todo-count">
              {activeTodosNumber}
              {' items left'}
            </span>

            <nav className="filter">
              <a
                href="#/"
                className={
                  classNames(
                    'filter__link',
                    { selected: chosenFilter === 'all' },
                  )
                }
                onClick={handleFilterTodo}
              >
                All
              </a>

              <a
                href="#/active"
                className={
                  classNames(
                    'filter__link',
                    { selected: chosenFilter === 'active' },
                  )
                }
                onClick={handleFilterTodo}
              >
                Active
              </a>

              <a
                href="#/completed"
                className={
                  classNames(
                    'filter__link',
                    { selected: chosenFilter === 'completed' },
                  )
                }
                onClick={handleFilterTodo}
              >
                Completed
              </a>
            </nav>

            <button
              type="button"
              className={
                classNames(
                  'todoapp__clear-completed',
                  { incomplete: !areCompletedTodos },
                )
              }
              onClick={handleDeleteAllCompleted}
            >
              Clear completed
            </button>

          </footer>
        )}

      </div>

      <ErrorMessage
        errorToShow={errorToShow}
        setErrorToShow={setErrorToShow}
      />
    </div>
  );
};
