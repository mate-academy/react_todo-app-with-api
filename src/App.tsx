/* eslint-disable jsx-a11y/control-has-associated-label */
import classNames from 'classnames';
import React, {
  useCallback,
  useContext, useEffect, useMemo, useRef, useState,
} from 'react';
import { AuthContext } from './components/Auth/AuthContext';
import { Todo } from './types/Todo';
import { client } from './utils/fetchClient';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodo, setNewTodo] = useState('');
  const [selectedTodoId, setSelectedTodoId] = useState<number | null>(null);
  const [isAllActive, setisAllActive] = useState(false);
  const [filterBy, setfilterBy] = useState('');
  const [editTodo, setEditTodo] = useState(false);
  // eslint-disable-next-line max-len
  const [todoTitle, setTodoTitle] = useState(todos.find(todo => todo.id === selectedTodoId)?.title);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
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

        .then(res => setTodos(prev => [...prev, res]));
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
          .slice(prev.findIndex(todo => todo.id === res.id) + 1)]));
      setSelectedTodoId(null);
    }, [selectedTodoId],
  );
  
  // const updateTodoTitle = useCallback(() => {

  // }, []);

  const deleteTodo = useCallback((todoId: number) => {
    setSelectedTodoId(todoId);
    client.delete(`/todos/${todoId}`)
      .then(res => {
        if (res === 1) {
          setTodos(prev => prev.filter(todo => todo.id !== todoId));
          setSelectedTodoId(null);
        }
      });
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
    if (editTodoField.current) {
      editTodoField.current.focus();
    }
  }, []);

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
        <header className="todoapp__header">
          <button
            data-cy="ToggleAllButton"
            type="button"
            className="todoapp__toggle-all active"
            onClick={() => updateAllTodoStatus()}
          />

          <form onSubmit={(event) => {
            event.preventDefault();
            addTodo();
          }}
          >
            <input
              data-cy="NewTodoField"
              type="text"
              ref={newTodoField}
              className="todoapp__new-todo"
              placeholder="What needs to be done?"
              value={newTodo}
              onChange={(event) => setNewTodo(event.target.value)}
              onBlur={() => addTodo()}
            />
          </form>
        </header>

        <section className="todoapp__main" data-cy="TodoList">
          {visibleTodos.map(todo => (
            <div
              data-cy="Todo"
              className={classNames('todo', { completed: todo.completed })}
              key={todo.id}
            >
              <label className="todo__status-label">
                <input
                  data-cy="TodoStatus"
                  type="checkbox"
                  className="todo__status"
                  onChange={() => updateTodoStatus(todo.id, todo.completed)}
                />
              </label>

              <span
                data-cy="TodoTitle"
                className="todo__title"
                onDoubleClick={() => {
                  setSelectedTodoId(todo.id);
                  setEditTodo(true);
                }}
              >
                {(editTodo && todo.id === selectedTodoId)
                  ? (
                    <form>
                      <input
                        type="text"
                        ref={editTodoField}
                        className="todoapp__edit-todo"
                        value={todoTitle}
                        onChange={(event) => setTodoTitle(event.target.value)}
                      />
                    </form>
                  )
                  : todo.title}
              </span>
              <button
                type="button"
                className="todo__remove"
                data-cy="TodoDeleteButton"
                onClick={() => deleteTodo(todo.id)}
              >
                ×
              </button>

              <div data-cy="TodoLoader" className="modal overlay">
                <div className="modal-background has-background-white-ter" />
                <div className="loader" />
              </div>
            </div>
          ))}
        </section>

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
            className="todoapp__clear-completed"
            onClick={() => deleteCompletedTodos()}
          >
            Clear completed
          </button>
        </footer>
      </div>

      <div
        data-cy="ErrorNotification"
        className="notification is-danger is-light has-text-weight-normal"
      >
        <button
          data-cy="HideErrorButton"
          type="button"
          className="delete"
        />

        Unable to add a todo
        <br />
        Unable to delete a todo
        <br />
        Unable to update a todo
      </div>
    </div>
  );
};
