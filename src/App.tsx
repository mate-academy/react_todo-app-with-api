/* eslint-disable jsx-a11y/control-has-associated-label */
import React, {
  useContext, useEffect, useMemo, useRef, useState,
} from 'react';
import classNames from 'classnames';
import { AuthContext } from './components/Auth/AuthContext';
import { Error } from './components/Error';
import { Filter } from './components/Filter';
import { TodoItem } from './components/TodoItem';
import { HeaderInputForm } from './components/HeaderInputForm';

import {
  getTodos, createTodo, deleteTodo, updateTodo,
} from './api/todos';
import { Todo } from './types/Todo';
import { SortFilter } from './types/SortFilter';
import { KeySubmit } from './types/KeySubmit';
import { MessageError } from './types/MessageError';

export const App: React.FC = () => {
  const user = useContext(AuthContext);
  const newTodoField = useRef<HTMLInputElement>(null);
  const [todos, setTodos] = useState<Todo[]>([]);
  const [sortFilter, setSortFilter] = useState(SortFilter.all);
  const [visibelTodos, setVisibelTodos] = useState<Todo[]>([...todos]);
  const [completedTodos, setCompletedTodos]
    = useState<Todo[]>([...todos].filter(todo => todo.completed));

  const [wantChangeTitle, setWantChangeTitle] = useState(-1);
  const [isError, setError] = useState(false);
  const [messageError, setMessageError] = useState('');
  const [newTodoTitle, setTitle] = useState('');
  const [changeTodoTitle, setChangeTitle] = useState('');
  const [activeTodoId, setActiveTodoId] = useState([0]);

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
          setMessageError(MessageError.ErrorServerOnStart);
        });
    }
  }, []);

  useMemo(() => {
    setVisibelTodos(() => (
      todos.filter(todo => {
        switch (sortFilter) {
          case SortFilter.active:
            return !todo.completed;

          case SortFilter.completed:
            return todo.completed;

          default:
            return true;
        }
      })));
  }, [todos, sortFilter]);

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
      setMessageError(MessageError.ErrorEmptyTitle);

      return;
    }

    setVisibelTodos(visibleTodos => [...visibleTodos, {
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

      setTodos(PrevTodos => [...PrevTodos, isAdding]);
    } catch (errorFromServer) {
      setError(true);
      setMessageError('Unable to add a todo');
    } finally {
      setVisibelTodos(visibleTodos => visibleTodos
        .filter(todo => todo.id !== 0));
    }

    setTitle('');
  };

  const handleRemoveTodo = async (removeTodoID: number) => {
    setActiveTodoId(idActive => [...idActive, removeTodoID]);

    try {
      await deleteTodo({ id: removeTodoID });

      setTodos(Prevtodos => Prevtodos.filter(todo => todo.id !== removeTodoID));
    } catch (errorFromServer) {
      setError(true);
      setMessageError(MessageError.ErrorServerWhileDelete);
    } finally {
      setActiveTodoId(idActive => idActive.filter(id => id !== removeTodoID));
    }
  };

  const handleRemoveComleted = () => {
    completedTodos.forEach((todoComleted) => handleRemoveTodo(todoComleted.id));
  };

  const handleUpdate = async (changeTodo: Todo) => {
    if (!changeTodo.id) {
      return;
    }

    try {
      setActiveTodoId(idActive => [...idActive, changeTodo.id]);
      await updateTodo(changeTodo.id, { completed: !changeTodo.completed });

      setTodos(Prevtodos => [...Prevtodos].map(todo => {
        if (todo.id === changeTodo.id) {
          // eslint-disable-next-line no-param-reassign
          todo.completed = !todo.completed;
        }

        return todo;
      }));
    } catch (errorFromServer) {
      setError(true);
      setMessageError(MessageError.ErrorServerWhileUpdate);
    } finally {
      setActiveTodoId(idActive => idActive.filter(id => id !== changeTodo.id));
    }
  };

  const handleUpdateAll = () => {
    todos.forEach(async changeTodo => {
      try {
        setActiveTodoId(idActive => [...idActive, changeTodo.id]);
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
        setMessageError(MessageError.ErrorServerWhileUpdate);
      } finally {
        setActiveTodoId(idActive => idActive
          .filter(id => id !== changeTodo.id));
      }
    });
  };

  const handleKeyChangeTitle = async (
    event: React.KeyboardEvent<HTMLInputElement>,
    changeTodo: Todo,
  ) => {
    if (changeTodoTitle.length > 0 && changeTodoTitle.trim().length === 0) {
      setError(true);
      setMessageError('Title can\'t be empty');

      return;
    }

    switch (event.key) {
      case KeySubmit.Enter:
        if (changeTodoTitle === '') {
          handleRemoveTodo(changeTodo.id);

          return;
        }

        try {
          setActiveTodoId(idActive => [...idActive, changeTodo.id]);
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
          setMessageError(MessageError.ErrorServerWhileUpdate);
        } finally {
          setActiveTodoId(idActive => idActive
            .filter(id => id !== changeTodo.id));
          setWantChangeTitle(-1);
          setChangeTitle('');
        }

        break;

      case KeySubmit.Escape:
        setWantChangeTitle(-1);
        setChangeTitle('');

        break;

      default:
        break;
    }
  };

  const handleChangeSortFilter = (sort: SortFilter) => {
    if (sortFilter !== sort) {
      setSortFilter(sort);
    }
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
                onClick={handleUpdateAll}
              />
            )}
          <HeaderInputForm
            handleSubmit={handleSubmit}
            newTodoTitle={newTodoTitle}
            setTitle={setTitle}
          />
        </header>
        {todos.length > 0
          && (
            <>
              <section className="todoapp__main" data-cy="TodoList">
                {visibelTodos.map(todo => (
                  <TodoItem
                    key={todo.id}
                    todo={todo}
                    handleUpdate={handleUpdate}
                    wantChangeTitle={wantChangeTitle}
                    setWantChangeTitle={setWantChangeTitle}
                    changeTodoTitle={changeTodoTitle}
                    setChangeTitle={setChangeTitle}
                    handleKeyChangeTitle={handleKeyChangeTitle}
                    handleRemoveTodo={handleRemoveTodo}
                    activeTodoId={activeTodoId}
                  />
                ))}

              </section>

              <footer className="todoapp__footer" data-cy="Footer">
                <span className="todo-count" data-cy="todosCounter">
                  {`${todos.length - completedTodos.length} items left`}
                </span>

                <Filter
                  sortFilter={sortFilter}
                  handleChangeSortFilter={handleChangeSortFilter}
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
