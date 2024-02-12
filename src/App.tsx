/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useState } from 'react';
import { UserWarning } from './UserWarning';
import {
  deleteTodo, getTodos, postTodo,
  patchTodoCompleted,
  patchTodoTitle,
} from './api/todos';
import { Todo } from './types/Todo';
import { TodoList } from './components/TodoList';
import { NewTodo } from './components/NewTodo';
import { Error } from './components/Error';
import { Errors } from './types/ErrorTypes';

const USER_ID = 12078;

function filterTodos(todos: Todo[], todosActivityFilter: string) {
  let resultTodos = [...todos];

  switch (todosActivityFilter) {
    case 'Completed':
      resultTodos = resultTodos.filter(todo => todo.completed);
      break;
    case 'Active':
      resultTodos = resultTodos.filter(todo => !todo.completed);
      break;
    default:
      break;
  }

  return resultTodos;
}

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loadingDone, setLoadingDone] = useState(false);
  const [todosActivityFilter, setTodosActivityFilter] = useState('All');
  const [errorMessage, setErrorMessage] = useState<Errors | null>(null);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [isLoadingList, setIsLoadingList] = useState<number[]>([]);

  useEffect(() => {
    getTodos(USER_ID)
      .then(setTodos)
      .catch(() => setErrorMessage(Errors.LOAD));
    setLoadingDone(true);
  }, []);

  const initTempTodo = (todo: Todo) => {
    setTempTodo(todo);
  };

  const clearTempTodo = () => {
    setTempTodo(null);
  };

  const onAdd = (todo: Todo) => {
    initTempTodo(todo);

    postTodo(todo.title, todo.userId, todo.completed)
      .then((newTodo: Todo) => {
        setTodos(prev => [...prev, newTodo]);
      })
      .catch(() => setErrorMessage(Errors.ADD))
      .finally(() => clearTempTodo());
  };

  const onCompletionChange = (todoId: number, completed: boolean) => {
    setIsLoadingList(prev => [...prev, todoId]);

    patchTodoCompleted(todoId, completed)
      .then((patchedTodo) => setTodos(prevTodos => prevTodos
        .map(todo => {
          return todo.id === patchedTodo.id
            ? { ...todo, completed: patchedTodo.completed }
            : { ...todo };
        })))
      .catch(() => setErrorMessage(Errors.UPDATE))
      .finally(() => setIsLoadingList(prev => prev
        .filter(id => id !== todoId)));
  };

  const onRemoveTodo = (todoId: number) => {
    setIsLoadingList(prev => [...prev, todoId]);
    deleteTodo(todoId)
      .then(() => {
        setTodos(prevTodos => prevTodos.filter(todo => todo.id !== todoId));
      })
      .catch(() => setErrorMessage(Errors.DELETE))
      .finally(() => setIsLoadingList(prev => prev
        .filter(id => id !== todoId)));
  };

  const onClearCompleted = () => {
    todos.filter(todo => todo.completed).forEach(todo => {
      onRemoveTodo(todo.id);
    });
  };

  const onTodoEdited = (todoId: number, newTitle: string) => {
    setIsLoadingList(prev => [...prev, todoId]);

    patchTodoTitle(todoId, newTitle)
      .then((patchedTodo) => setTodos(prevTodos => prevTodos
        .map(todo => {
          return todo.id === patchedTodo.id
            ? { ...todo, title: patchedTodo.title }
            : { ...todo };
        })))
      .catch(() => setErrorMessage(Errors.UPDATE))
      .finally(() => setIsLoadingList(prev => prev
        .filter(id => id !== todoId)));
  };

  const setActivityFilter = (filterValue: string) => {
    setTodosActivityFilter(filterValue);
  };

  const setAllTodosStatus = (isActive: boolean) => {
    todos
      .filter(todo => todo.completed !== isActive)
      .forEach(todo => onCompletionChange(todo.id, isActive));
  };

  const setErrorMsg = (errorMsg: Errors | null) => {
    setErrorMessage(errorMsg);
  };

  const isCompletedTodo = todos.some(todo => todo.completed);
  const itemsLeft = todos.filter(todo => !todo.completed).length;
  const noItems = (todos.length === 0);

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          {/* this buttons is active only if there are some active todos */}
          <button
            type="button"
            className={`todoapp__toggle-all ${itemsLeft === 0 ? 'active' : ''}`}
            data-cy="ToggleAllButton"
            onClick={() => setAllTodosStatus(itemsLeft !== 0)}
          />
          <NewTodo
            onAdd={onAdd}
            userId={USER_ID}
            setErrorMsg={setErrorMsg}
            todos={todos}
          />
        </header>

        <section className="todoapp__main" data-cy="TodoList">
          {loadingDone && (
            <TodoList
              todos={filterTodos(todos, todosActivityFilter)}
              onCompletionChange={onCompletionChange}
              onRemoveTodo={onRemoveTodo}
              onTodoEdited={onTodoEdited}
              setErrorMsg={setErrorMsg}
              tempTodo={tempTodo}
              isLoadingList={isLoadingList}
            />
          )}
        </section>

        {/* Hide the footer if there are no todos */}
        {!noItems
        && (
          <footer className="todoapp__footer" data-cy="Footer">
            <span className="todo-count" data-cy="TodosCounter">
              {itemsLeft}
              {' '}
              items left
            </span>

            {/* Active filter should have a 'selected' class */}
            <nav className="filter" data-cy="Filter">
              <a
                href="#/"
                className={`filter__link ${todosActivityFilter === 'All' ? 'selected' : ''}`}
                data-cy="FilterLinkAll"
                onClick={() => setActivityFilter('All')}
              >
                All
              </a>

              <a
                href="#/active"
                className={`filter__link ${todosActivityFilter === 'Active' ? 'selected' : ''}`}
                data-cy="FilterLinkActive"
                onClick={() => setActivityFilter('Active')}
              >
                Active
              </a>

              <a
                href="#/completed"
                className={`filter__link ${todosActivityFilter === 'Completed' ? 'selected' : ''}`}
                data-cy="FilterLinkCompleted"
                onClick={() => setActivityFilter('Completed')}
              >
                Completed
              </a>
            </nav>

            <button
              type="button"
              className="todoapp__clear-completed"
              data-cy="ClearCompletedButton"
              onClick={onClearCompleted}
              disabled={!isCompletedTodo}
            >
              Clear completed
            </button>
          </footer>
        )}
      </div>
      <Error
        errorMessage={errorMessage}
        setErrorMsg={setErrorMsg}
      />
    </div>
  );
};
