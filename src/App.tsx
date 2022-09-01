/* eslint-disable jsx-a11y/control-has-associated-label */
import classNames from 'classnames';
import React, {
  useCallback,
  useContext, useEffect, useMemo, useRef, useState,
} from 'react';
import { AuthContext } from './components/Auth/AuthContext';
import { Header } from './components/header';
import { TodosList } from './components/TodosList';
import { Todo } from './types/Todo';
import { client } from './utils/fetchClient';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  // const [isLoading, setIsLoading] = useState(false);
  const [newTodo, setNewTodo] = useState('');
  const [selectedTodoId, setSelectedTodoId] = useState<number | null>(null);
  const [isAllActive, setisAllActive] = useState(false);
  const [filterBy, setfilterBy] = useState('');
  const [editTodo, setEditTodo] = useState(false);
  const [todoTitle, setTodoTitle] = useState('');
  const [unableAddTodo, setUnableAddTodo] = useState(false);
  const [unableDeleteTodo, setunableDeleteTodo] = useState(false);
  const [unableUpdateTodo, setUnableUpdateTodo] = useState(false);

  const user = useContext(AuthContext);
  const newTodoField = useRef<HTMLInputElement>(null);
  const editTodoField = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (user) {
      client.get<Todo[]>(`/todos?userId=${user.id}`)
        .then(setTodos);
    }
  }, []);

  const addTodo = useCallback(() => {
    if (user && newTodo.trim().length) {
      client.post<Todo>('/todos', {
        title: newTodo,
        userId: user?.id,
        completed: false,
      })
        .then(res => setTodos(prev => [...prev, res]))
        .catch(() => setUnableAddTodo(true));
    }

    setNewTodo('');
  }, [newTodo]);

  const updateAllTodoStatus = useCallback(() => {
    setisAllActive(!isAllActive);

    todos.map(todo => client.patch(`/todos/${todo.id}`, { completed: isAllActive }));

    setTodos(prev => prev.map(todo => ({
      ...todo,
      completed: isAllActive,
    })));
  }, [isAllActive, todos]);

  const updateTodoStatus = useCallback(
    (todoId: number, todoComleted: boolean) => {
      setSelectedTodoId(todoId);
      client.patch<Todo>(`/todos/${todoId}`, { completed: !todoComleted })
        .then(res => setTodos(prev => [...prev
          .slice(0, prev.findIndex(todo => todo.id === res.id)), res, ...prev
          .slice(prev.findIndex(todo => todo.id === res.id) + 1)]))
        .catch(() => setUnableUpdateTodo(true));
      setSelectedTodoId(null);
    }, [selectedTodoId],
  );

  const updateTodoTitle = useCallback((todoId: number) => {
    setSelectedTodoId(todoId);
    client.patch<Todo>(`/todos/${todoId}`, { title: todoTitle })
      .then(res => {
        setTodos(prev => [...prev.slice(0, prev
          .findIndex(todo => todo.id === res.id)), res, ...prev.slice(prev
          .findIndex(todo => todo.id === res.id) + 1)]);
      });
    setSelectedTodoId(null);
    setTodoTitle('');
    setEditTodo(false);
  }, [todoTitle]);

  const deleteTodo = useCallback((todoId: number) => {
    setSelectedTodoId(todoId);
    client.delete(`/todos/${todoId}`)
      .then(res => {
        if (res === 1) {
          setTodos(prev => prev.filter(todo => todo.id !== todoId));
          setSelectedTodoId(null);
        }
      })
      .catch(() => setunableDeleteTodo(true));
  }, []);

  const deleteCompletedTodos = useCallback(() => {
    todos.map(todo => (todo.completed ? client.delete(`/todos/${todo.id}`) : todo));
    setTodos(prev => prev.filter(todo => !todo.completed));
  }, [todos]);

  useEffect(() => {
    // focus the element with `ref={newTodoField}`
    if (newTodoField.current) {
      newTodoField.current.focus();
    }
  }, []);

  useEffect(() => {
    // focus the element with `ref={newTodoField}`
    if (editTodo) {
      editTodoField.current?.focus();
    }
  }, [editTodo]);

  const visibleTodos = useMemo(() => {
    return todos.filter(todo => {
      switch (filterBy) {
        case 'active':
          return !todo.completed;
        case 'completed':
          return todo.completed;
        default:
          return todo;
      }
    });
  }, [filterBy, todos]);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          addTodo={addTodo}
          updateAllTodoStatus={updateAllTodoStatus}
          newTodoField={newTodoField}
          newTodo={newTodo}
          setNewTodo={setNewTodo}
        />

        <TodosList
          visibleTodos={visibleTodos}
          updateTodoStatus={updateTodoStatus}
          setSelectedTodoId={setSelectedTodoId}
          setTodoTitle={setTodoTitle}
          setEditTodo={setEditTodo}
          editTodo={editTodo}
          selectedTodoId={selectedTodoId}
          updateTodoTitle={updateTodoTitle}
          deleteTodo={deleteTodo}
          editTodoField={editTodoField}
          todoTitle={todoTitle}
        />

        {todos.length > 0 && (
          <footer className="todoapp__footer" data-cy="Footer">
            <span className="todo-count" data-cy="todosCounter">
              {`${todos.filter(todo => todo.completed !== true).length} items left`}
            </span>

            <nav className="filter" data-cy="Filter">
              <a
                data-cy="FilterLinkAll"
                href="#/"
                className={classNames(
                  'filter__link',
                  { selected: filterBy === 'all' },
                )}
                onClick={() => setfilterBy('all')}
              >
                All
              </a>

              <a
                data-cy="FilterLinkActive"
                href="#/active"
                className={classNames(
                  'filter__link',
                  { selected: filterBy === 'active' },
                )}
                onClick={() => setfilterBy('active')}
              >
                Active
              </a>
              <a
                data-cy="FilterLinkCompleted"
                href="#/completed"
                className={classNames(
                  'filter__link',
                  { selected: filterBy === 'completed' },
                )}
                onClick={() => setfilterBy('completed')}
              >
                Completed
              </a>
            </nav>

            <button
              data-cy="ClearCompletedButton"
              type="button"
              className={classNames(
                'todoapp__clear-completed',
                { hidden: !todos.some(todo => todo.completed) },
              )}
              onClick={() => deleteCompletedTodos()}
              disabled={!todos.some(todo => todo.completed)}
            >
              Clear completed
            </button>
          </footer>
        )}
      </div>

      {
        (unableAddTodo || unableDeleteTodo || unableUpdateTodo) && (
          <div
            data-cy="ErrorNotification"
            className="notification is-danger is-light has-text-weight-normal"
          >
            <button
              data-cy="HideErrorButton"
              type="button"
              className="delete"
            />
            {unableAddTodo && 'Unable to add a todo'}
            {unableDeleteTodo && 'Unable to delete a todo'}
            {unableUpdateTodo && 'Unable to update a todo'}
          </div>
        )
      }
    </div>
  );
};
