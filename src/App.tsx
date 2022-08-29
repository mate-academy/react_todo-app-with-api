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
  const [todos, setTodos] = useState<Todo[] | null>([]);
  const [filterBy, setFilterBy] = useState('all');
  const [isLoading, setIsLoading] = useState(false);
  const [isAllActive, setIsAllActive] = useState(false);
  const [selectedTodoId, setSelectedTodoId] = useState<number | null>(null);
  const [newTodoTitle, setNewTodoTitle] = useState('');
  const [isUnableToAdd, setIsUnableToAdd] = useState(false);
  const [isUnableToDelete, setIsUnableToDelete] = useState(false);
  const [isUnableToUpdate, setIsUnableToUpdate] = useState(false);
  const [isTitleCanBeEmpty, setIsTitleCanBeEmpty] = useState(false);
  const [isPatch, setIsPatch] = useState(false);
  const [patchTitle, setPatchTitle] = useState('');

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const user = useContext(AuthContext);
  const newTodoField = useRef<HTMLInputElement>(null);
  const updateTodoField = useRef<HTMLInputElement>(null);

  useEffect(() => {
    client.get<Todo[]>(`/todos?userId=${user?.id}`)
      .then(setTodos);
  }, [todos]);

  useEffect(() => {
    // focus the element with `ref={newTodoField}`
    if (updateTodoField.current) {
      updateTodoField.current.focus();
    }
  }, [updateTodoField]);

  useEffect(() => {
    // focus the element with `ref={newTodoField}`
    if (newTodoField.current) {
      newTodoField.current.focus();
    }
  }, [newTodoField]);

  const onAdd = useCallback((title: string) => {
    return client.post('/todos', {
      title,
      userId: user?.id,
      completed: false,
    });
  }, []);

  const onCloseErrorMessageHandler = useCallback(() => {
    setIsUnableToUpdate(false);
    setIsUnableToAdd(false);
    setIsUnableToDelete(false);
    setIsTitleCanBeEmpty(false);
  }, []);

  const onActiveOrCompletedSetHandler = useCallback((todo: Todo) => {
    setSelectedTodoId(todo.id);
    setIsLoading(true);
    client.patch(`/todos/${todo.id}`, { completed: !todo.completed })
      .finally(() => {
        setSelectedTodoId(null);
        setIsLoading(false);
      }).catch(() => setIsUnableToUpdate(true));
  }, []);

  const onDeleteTodoHandler = useCallback((todo: Todo) => {
    setSelectedTodoId(todo.id);
    setIsLoading(true);
    client.delete(`/todos/${todo.id}`)
      .finally(() => {
        setSelectedTodoId(null);
        setIsLoading(false);
      }).catch(() => setIsUnableToDelete(true));
  }, []);

  const onSetAllActiveOrCompletedHandler = useCallback(() => {
    setIsAllActive(!isAllActive);
    setIsLoading(true);

    todos?.map(todo => client.patch(`/todos/${todo.id}`, { completed: isAllActive }).finally(() => setIsLoading(false)));
  }, [isAllActive]);

  const visibleTodos = useMemo(() => {
    const visibleTodosArr = todos
      ? [...todos]
      : [];

    return visibleTodosArr.filter(todo => {
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
            onClick={() => {
              onSetAllActiveOrCompletedHandler();
            }}
          />

          <form
            onSubmit={(event) => {
              event.preventDefault();
              if (newTodoTitle.trim() !== '') {
                onAdd(newTodoTitle).catch(() => setIsUnableToAdd(true));
              } else {
                setIsTitleCanBeEmpty(true);
                setTimeout(() => setIsTitleCanBeEmpty(false), 1500);
              }

              setNewTodoTitle('');
            }}
          >
            <input
              data-cy="NewTodoField"
              type="text"
              ref={newTodoField}
              className="todoapp__new-todo"
              placeholder="What needs to be done?"
              value={newTodoTitle}
              onChange={(ev) => {
                setNewTodoTitle(ev.target.value);
              }}
            />
          </form>
        </header>

        <section className="todoapp__main" data-cy="TodoList">
          {visibleTodos.map(todo => {
            return (
              <div
                data-cy="Todo"
                className={classNames(
                  'todo',
                  { 'todo completed': todo.completed },
                )}
                key={todo.id}
                onDoubleClick={() => {
                  setSelectedTodoId(todo.id);
                  setIsPatch(!isPatch);
                  setPatchTitle(todo.title);
                  setSelectedTodoId(todo.id);
                }}
              >
                <label className="todo__status-label">
                  <input
                    data-cy="TodoStatus"
                    type="checkbox"
                    className="todo__status"
                    onChange={() => {
                      onActiveOrCompletedSetHandler(todo);
                    }}
                  />
                </label>

                <span data-cy="TodoTitle" className="todo__title">
                  {isPatch && selectedTodoId === todo.id
                    ? (
                      <form
                        onSubmit={(event) => {
                          event.preventDefault();
                          if (patchTitle === '') {
                            setIsTitleCanBeEmpty(true);
                            setTimeout(() => setIsTitleCanBeEmpty(false), 1500);
                          } else {
                            client.patch(`/todos/${todos?.find(task => task.id === selectedTodoId)?.id}`, { title: patchTitle }).catch(() => setIsUnableToUpdate(true));
                          }

                          setTimeout(() => setIsPatch(false), 1500);
                        }}
                      >
                        <input
                          type="text"
                          className="todoapp__edit-todo"
                          value={patchTitle}
                          onChange={(ev) => {
                            setPatchTitle(ev.target.value);
                          }}
                        />
                      </form>
                    )
                    : todo.title}
                </span>
                {!isPatch && (
                  <button
                    type="button"
                    className="todo__remove"
                    data-cy="TodoDeleteButton"
                    onClick={() => {
                      onDeleteTodoHandler(todo);
                    }}
                  >
                    ×
                  </button>
                )}

                {selectedTodoId === todo.id && (
                  <div
                    data-cy="TodoLoader"
                    className={classNames(
                      'modal overlay',
                      { 'modal overlay is-active': isLoading },
                    )}
                  >
                    <div className="modal-background
                      has-background-white-ter"
                    />
                    <div className="loader" />
                  </div>
                )}
              </div>
            );
          })}

        </section>

        {todos?.length !== 0 && (
          <footer className="todoapp__footer" data-cy="Footer">
            <span className="todo-count" data-cy="todosCounter">
              {`${todos?.filter(todo => !todo.completed).length} items left`}
            </span>

            <nav className="filter" data-cy="Filter">
              <a
                data-cy="FilterLinkAll"
                href="#/"
                className={classNames(
                  'filter__link',
                  { selected: filterBy === 'all' },
                )}
                onClick={() => setFilterBy('all')}
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
                onClick={() => setFilterBy('active')}
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
                onClick={() => setFilterBy('completed')}
              >
                Completed
              </a>
            </nav>

            <button
              data-cy="ClearCompletedButton"
              type="button"
              className="todoapp__clear-completed"
              disabled={todos?.some(todo => !todo.completed)}
            >
              Clear completed
            </button>
          </footer>
        )}
      </div>

      {
        (isUnableToAdd
          || isUnableToDelete
          || isUnableToUpdate
          || isTitleCanBeEmpty
        ) && (
          <div
            data-cy="ErrorNotification"
            className="notification is-danger is-light has-text-weight-normal"
          >
            <button
              data-cy="HideErrorButton"
              type="button"
              className="delete"
              onClick={() => {
                onCloseErrorMessageHandler();
              }}
            />
            {isUnableToAdd && 'Unable to add a todo'}
            {isUnableToDelete && 'Unable to delete a todo'}
            {isUnableToUpdate && 'Unable to update a todo'}
            {isTitleCanBeEmpty && 'Title can\'t be empty'}
          </div>
        )
      }
    </div>
  );
};
