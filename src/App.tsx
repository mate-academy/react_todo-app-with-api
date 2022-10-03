/* eslint-disable jsx-a11y/control-has-associated-label */
import React, {
  useContext, useEffect, useRef, useState, useMemo,
} from 'react';
import classNames from 'classnames';
import { AuthContext } from './components/Auth/AuthContext';
import { Error } from './components/Error';
import { Filter } from './components/Filter';

import {
  getTodos, createTodo, deleteTodo, updateTodo,
} from './api/todos';
import { Todo } from './types/Todo';

export const App: React.FC = () => {
  const user = useContext(AuthContext);
  const newTodoField = useRef<HTMLInputElement>(null);
  const changeTodoField = useRef<HTMLInputElement>(null);
  const [todos, setTodos] = useState<Todo[]>([]);
  const [sortFilter, setSortFilter] = useState('all');
  const [visibelTodos, setVisibelTodos] = useState<Todo[]>([...todos]);
  const [completedTodos, setCompletedTodos]
  = useState<Todo[]>([...todos].filter(todo => todo.completed));

  const [wantChangeTitle, setWantChangeTitle] = useState(-1);
  const [isError, setError] = useState(false);
  const [messageError, setMessageError] = useState('');
  const [newTodoTitle, setTitle] = useState('');
  const [changeTodoTitle, setChangeTitle] = useState('');
  const [activeTodoId, setActiveTodoId] = useState(0);
  // const [isOpenList, setOpenList] = useState(true);

  useEffect(() => {
    if (newTodoField.current) {
      newTodoField.current.focus();
    }

    if (user) {
      getTodos(user.id)
        .then(response => {
          setTodos(response);
        })
        .catch(() => {
          setError(true);
          setMessageError('Todos from server were not gotten');
        });
    }
  }, []);

  useMemo(() => {
    setVisibelTodos(() => (
      todos.filter(todo => {
        switch (sortFilter) {
          case 'active':
            return !todo.completed;

          case 'completed':
            return todo.completed;

          default:
            return true;
        }
      })));
  }, [todos, sortFilter, isError]);

  useMemo(() => {
    setCompletedTodos(() => todos.filter(todo => todo.completed));
  }, [todos]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!user) {
      return;
    }

    if (newTodoTitle.trim().length === 0) {
      setError(true);
      setMessageError('Title can\'t be empty');

      return;
    }

    setVisibelTodos(state => [...state, {
      id: 0,
      userId: user.id,
      title: newTodoTitle,
      completed: false,
    }]);

    try {
      const isAdding = await createTodo({
        userId: user.id,
        title: newTodoTitle,
        completed: false,
      });

      setTodos(state => [...state, isAdding]);
    } catch (errorFromServer) {
      setError(true);
      setMessageError('Unable to add a todo');
    }

    setTitle('');
  };

  const handleRemoveTodo = async (removeTodoID: number) => {
    setActiveTodoId(removeTodoID);

    try {
      await deleteTodo(removeTodoID);

      setTodos(state => state.filter(todo => todo.id !== removeTodoID));
    } catch (errorFromServer) {
      setError(true);
      setMessageError('Unable to delete a todo');
    } finally {
      setActiveTodoId(0);
    }
  };

  const handleRemoveComleted = () => {
    completedTodos.forEach((todoComleted) => handleRemoveTodo(todoComleted.id));
  };

  const handleUpdate = async (changeTodo:Todo) => {
    if (!changeTodo.id) {
      return;
    }

    try {
      await updateTodo(changeTodo.id, { completed: !changeTodo.completed });

      setTodos(state => [...state].map(todo => {
        if (todo.id === changeTodo.id) {
          // eslint-disable-next-line no-param-reassign
          todo.completed = !todo.completed;
        }

        return todo;
      }));
    } catch (errorFromServer) {
      setError(true);
      setMessageError('Unable to change a todo');
    }
  };

  const handlerUpdateAll = () => {
    todos.forEach(async changeTodo => {
      try {
        await updateTodo(
          changeTodo.id,
          { completed: completedTodos.length !== todos.length },
        );
        setTodos(state => [...state].map(todo => {
          const statusComleted = completedTodos.length !== todos.length;

          // eslint-disable-next-line no-param-reassign
          todo.completed = statusComleted;

          return todo;
        }));
      } catch (errorFromServer) {
        setError(true);
        setMessageError('Unable to change a todo');
      }
    });
  };

  useEffect(() => {
    if (changeTodoField.current) {
      changeTodoField.current.focus();
    }
  }, [wantChangeTitle]);

  const handleKey = async (
    event: React.KeyboardEvent<HTMLInputElement>,
    changeTodo: Todo,
  ) => {
    if (event.key === 'Escape') {
      setWantChangeTitle(-1);
      setChangeTitle('');
    }

    if (changeTodoTitle.trim().length === 0) {
      setError(true);
      setMessageError('Title can\'t be empty');

      return;
    }

    if (event.key === 'Enter') {
      try {
        await updateTodo(changeTodo.id, { title: changeTodoTitle });
        setTodos(state => [...state].map(todo => {
          if (todo.id === changeTodo.id) {
            // eslint-disable-next-line no-param-reassign
            todo.title = changeTodoTitle;
          }

          return todo;
        }));
      } catch (errorFromServer) {
        setError(true);
        setMessageError('Unable to update a Title');
      }

      setWantChangeTitle(-1);
      setChangeTitle('');
    }
  };

  const handleBlur = () => {
    setWantChangeTitle(-1);
  };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          {todos.length > 0
            && (
              <button
                data-cy="ToggleAllButton"
                type="button"
                className={classNames(
                  'todoapp__toggle-all',
                  { active: completedTodos.length === todos.length },
                )}
                onClick={handlerUpdateAll}
              />
            )}
          <form onSubmit={handleSubmit}>
            <input
              data-cy="NewTodoField"
              type="text"
              ref={newTodoField}
              className="todoapp__new-todo"
              placeholder="What needs to be done?"
              value={newTodoTitle}
              onChange={() => setTitle(newTodoField.current?.value || '')}
            />
          </form>
        </header>
        {todos.length > 0
          && (
            <>
              <section className="todoapp__main" data-cy="TodoList">
                {visibelTodos.map(todo => (
                  <div
                    data-cy="Todo"
                    key={todo.id}
                    className={classNames(
                      'todo',
                      { completed: todo.completed },
                    )}
                  >
                    <label className="todo__status-label">
                      <input
                        data-cy="TodoStatus"
                        type="checkbox"
                        className="todo__status"
                        checked={todo.completed}
                        onChange={() => handleUpdate(todo)}
                      />
                    </label>
                    {wantChangeTitle === todo.id
                      ? (
                        <form>
                          <input
                            data-cy="ChangeTodoField"
                            type="text"
                            ref={changeTodoField}
                            className="todoapp__new-todo"
                            placeholder="update title?"
                            value={changeTodoTitle}
                            onChange={() => setChangeTitle(
                              changeTodoField.current?.value || '',
                            )}
                            onBlur={handleBlur}
                            onKeyDown={event => handleKey(event, todo)}
                          />
                        </form>
                      )
                      : (
                        <>
                          <span
                            data-cy="TodoTitle"
                            className="todo__title"
                            onDoubleClick={() => {
                              setWantChangeTitle(todo.id);
                              setChangeTitle(todo.title);
                            }}
                          >
                            {todo.title}
                          </span>
                          <button
                            type="button"
                            className="todo__remove"
                            data-cy="TodoDeleteButton"
                            onClick={() => handleRemoveTodo(todo.id)}
                          >
                            ×
                          </button>
                        </>
                      )}
                    <div
                      data-cy="TodoLoader"
                      className={classNames(
                        'modal',
                        'overlay',
                        { 'is-active': todo.id === activeTodoId },
                      )}
                    >
                      <div className="
                      modal-background
                      has-background-white-ter"
                      />
                      <div className="loader" />
                    </div>
                  </div>
                ))}

              </section>

              <footer className="todoapp__footer" data-cy="Footer">
                <span className="todo-count" data-cy="todosCounter">
                  {`${todos.length - completedTodos.length} items left`}
                </span>

                <Filter
                  sortFilter={sortFilter}
                  setSortFilter={setSortFilter}
                />
                {completedTodos.length > 0
                  && (
                    <button
                      data-cy="ClearCompletedButton"
                      type="button"
                      className="todoapp__clear-completed"
                      onClick={handleRemoveComleted}
                    >
                      Clear completed
                    </button>
                  )}

              </footer>
            </>

          )}

      </div>

      <Error
        isError={isError}
        setError={setError}
        messageError={messageError}
      />

    </div>
  );
};
