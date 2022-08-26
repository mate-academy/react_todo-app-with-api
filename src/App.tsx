import React, {
  // AnchorHTMLAttributes,
  // DetailedHTMLProps,
  useCallback, useContext, useEffect, useMemo, useState,
} from 'react';
import cn from 'classnames';
import {
  createTodo, deleteTodo, getTodos, patchTodo,
} from './api/todos';
import { AuthContext } from './components/Auth/AuthContext';
import { FormCreateTodo } from './components/FormCreateTodo';
import {
  Todo, CreateTodoFragment, UpdateStatus, UpdateTitle,
} from './types/Todo';
import { PatchForm } from './components/PatchForm';

export const App: React.FC = () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const user = useContext(AuthContext);
  // const newTodoField = useRef<HTMLInputElement>(null);

  const [todos, setTodos] = useState<Todo[]>([]);

  const [isErrorLoadedNewTodo, setIsErrorLoadedNewTodo] = useState(false);
  const [isErrorDeletedTodo, setIsErrorDeletedTodo] = useState(false);
  const [isErrorUpdate, setIsErrorUpdate] = useState(false);
  const [isEmptyTitle, setIsEmptyTitle] = useState(false);

  const [isLoaded, setIsLoaded] = useState(false);
  const [selectId, setSelectId] = useState(0);
  const [openPachForm, setOpenPachForm] = useState(false);
  const [filter, setFilter] = useState('All');

  useEffect(() => {
    if (user) {
      getTodos(user.id)
        .then((res) => {
          setTodos(res);
        });
    }
  }, []);

  const completedTodos = useMemo(
    () => todos.filter(todo => todo.completed === true),
    [todos],
  );

  const activeTodos = useMemo(
    () => todos.filter(todo => todo.completed !== true),
    [todos],
  );

  let filtredTodos: Todo[] = todos;

  useMemo(
    () => {
      filtredTodos = filtredTodos.filter(todo => {
        if (filter === 'Completed') {
          return todo.completed === true;
        }

        if (filter === 'Active') {
          return todo.completed !== true;
        }

        return todo;
      });
    },
    [todos, filter, filtredTodos],
  );

  const handelFiltredTodos = (
    // event: DetailedHTMLProps<AnchorHTMLAttributes<HTMLAnchorElement>>,
    event: any,
  ) => {
    setFilter(event.target.textContent);
  };

  const handelCloseError = () => {
    setIsErrorLoadedNewTodo(false);
    setIsErrorDeletedTodo(false);
    setIsErrorUpdate(false);
    setIsEmptyTitle(false);
  };

  const handleChange = (todoID: number, completedTodo: boolean) => {
    const updateStatus: UpdateStatus = {
      completed: !completedTodo,
    };

    handelCloseError();

    setIsLoaded(true);

    setSelectId(todoID);

    patchTodo(todoID, updateStatus)
      .then(() => {
        const updateTodos = filtredTodos.map(todo => {
          if (todo.id === todoID) {
            return ({
              ...todo,
              completed: !todo.completed,
            });
          }

          return todo;
        });

        setTodos(updateTodos);
      })
      .catch(() => {
        setIsErrorUpdate(true);
        setTimeout(handelCloseError, 3000);
      })
      .finally(() => {
        setSelectId(0);
        setIsLoaded(false);
      });
  };

  const handelAllActiveReverse = () => {
    if (activeTodos.length > 0
      && completedTodos.length !== filtredTodos.length) {
      filtredTodos = filtredTodos.map(todo => {
        if (!todo.completed) {
          // console.log('completed firs');
          handleChange(todo.id, todo.completed);
        }

        // console.log('first');

        return ({
          ...todo,
          completed: true,
        });
      });
    }

    if (completedTodos.length === 0
      || completedTodos.length === filtredTodos.length
    ) {
      filtredTodos = filtredTodos.map(activeTodo => {
        handleChange(activeTodo.id, activeTodo.completed);
        // console.log('second');

        return ({
          ...activeTodo,
          completed: !activeTodo.completed,
        });
      });
    }
  };

  const handelCreateTodo = (newTitleTodo: string) => {
    if (!user) {
      return;
    }

    handelCloseError();

    const newTodo: CreateTodoFragment = {
      userId: user.id,
      title: newTitleTodo,
      completed: false,
    };

    if (newTodo.title.length < 1) {
      setTimeout(handelCloseError, 3000);
      setIsEmptyTitle(true);

      return;
    }

    createTodo(newTodo)
      .then((todo) => {
        setTodos((prev) => [...prev, todo]);
      })
      .catch(() => {
        setIsErrorLoadedNewTodo(true);
        setTimeout(handelCloseError, 3000);
      });
  };

  const handelDeleteTodo = (todoId: number) => {
    setIsLoaded(true);
    setSelectId(todoId);
    handelCloseError();
    deleteTodo(todoId)
      .then(() => {
        const filtered = filtredTodos.filter(item => item.id !== todoId);

        setTodos(filtered);
        setIsLoaded(false);
      })

      .catch(() => {
        setTimeout(handelCloseError, 3000);
        setIsErrorDeletedTodo(true);
      });
  };

  const handelClearAllComplered = () => {
    if (completedTodos.length > 0) {
      completedTodos.forEach(compTodo => handelDeleteTodo(compTodo.id));
      filtredTodos = filtredTodos.filter(todo => !todo.completed);
    }
  };

  const handelDubleClick = (event: MouseEvent, todoId: number) => {
    handelCloseError();
    if (event.detail === 2) {
      setOpenPachForm(true);
      setSelectId(todoId);
    }
  };

  const handlerUpdateTitle = (newTitle: string, titleBefore: string) => {
    if (newTitle.length === 0) {
      handelDeleteTodo(selectId);
      setOpenPachForm(false);
    }

    if (newTitle === titleBefore) {
      setOpenPachForm(false);

      return;
    }

    if (newTitle) {
      setIsLoaded(true);

      const updateTitle: UpdateTitle = {
        title: newTitle,
      };

      patchTodo(selectId, updateTitle)
        .then(() => {
          const updateTodos = filtredTodos.map(todo => {
            if (todo.id === selectId) {
              return ({
                ...todo,
                title: newTitle,
              });
            }

            return todo;
          });

          setTodos(updateTodos);
        })
        .catch(() => {
          setTimeout(handelCloseError, 3000);
          setIsErrorUpdate(true);
        })
        .finally(() => {
          setSelectId(0);
          setIsLoaded(false);
        });
    }

    setOpenPachForm(false);
  };

  const closeInput = useCallback(() => {
    setOpenPachForm(false);
  }, []);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">

          <button
            data-cy="ToggleAllButton"
            aria-label="Mute volume"
            type="button"
            className={cn(
              'todoapp__toggle-all',
              { active: activeTodos.length > 0 },
            )}
            onClick={handelAllActiveReverse}
          />

          <FormCreateTodo handelCreateTodo={handelCreateTodo} />
        </header>

        <section className="todoapp__main" data-cy="TodoList">
          {filtredTodos.map(todo => (
            <div
              data-cy="Todo"
              key={todo.id}
              className={
                cn('todo',
                  { completed: todo.completed })
              }
            >

              <label className="todo__status-label">
                <input
                  data-cy="TodoStatus"
                  type="checkbox"
                  className="todo__status"
                  checked={todo.completed}
                  onChange={() => handleChange(todo.id, todo.completed)}
                />
              </label>

              {openPachForm && selectId === todo.id
                ? (
                  <PatchForm
                    titleBefore={todo.title}
                    handlerUpdateTitle={handlerUpdateTitle}
                    closeInput={closeInput}
                  />
                )
                : (
                  <span
                    data-cy="TodoTitle"
                    className="todo__title"
                    role="button"
                    onClick={
                      // React.MouseEvent<HTMLButtonElement>
                      (event: any): void => (
                        handelDubleClick(event, todo.id)
                      )
                    }
                    tabIndex={0}
                    aria-hidden="true"
                  >
                    {todo.title}
                  </span>
                )}

              {isLoaded
                && selectId === todo.id
                && (
                  <div data-cy="TodoLoader" className="modal overlay is-active">
                    <div className="modal-background" />
                    <div className="loader" />
                  </div>
                )}

              {!openPachForm && (
                <button
                  type="button"
                  className="todo__remove"
                  data-cy="TodoDeleteButton"
                  onClick={() => handelDeleteTodo(todo.id)}
                >
                  ×
                </button>
              )}
            </div>
          ))}
        </section>

        {(todos.length > 0) && (
          <footer className="todoapp__footer" data-cy="Footer">
            <span className="todo-count" data-cy="todosCounter">
              {`${todos.length - completedTodos.length} items left`}
            </span>

            <nav className="filter" data-cy="Filter">
              <a
                data-cy="FilterLinkAll"
                href="#/"
                className={cn(
                  'filter__link',
                  { selected: filter === 'All' },
                )}
                onClick={handelFiltredTodos}
              >
                All
              </a>

              <a
                data-cy="FilterLinkActive"
                href="#/active"
                className={cn(
                  'filter__link',
                  { selected: filter === 'Active' },
                )}
                onClick={handelFiltredTodos}
              >
                Active
              </a>
              <a
                data-cy="FilterLinkCompleted"
                href="#/completed"
                className={cn(
                  'filter__link',
                  { selected: filter === 'Completed' },
                )}
                onClick={handelFiltredTodos}
              >
                Completed
              </a>
            </nav>

            {completedTodos.length > 0
         && (
           <button
             data-cy="ClearCompletedButton"
             type="button"
             className="todoapp__clear-completed"
             onClick={handelClearAllComplered}
           >
             Clear completed
           </button>
         )}
          </footer>
        )}
      </div>

      {(isErrorLoadedNewTodo
     || isErrorDeletedTodo
     || isErrorUpdate
     || isEmptyTitle)
     && (
       <div
         data-cy="ErrorNotification"
         className="notification is-danger is-light has-text-weight-normal"
       >
         <button
           data-cy="HideErrorButton"
           aria-label="Mute volume"
           type="button"
           className="delete"
           onClick={handelCloseError}
         />

         {isErrorLoadedNewTodo && 'Unable to add a todo'}
         {isErrorDeletedTodo && 'Unable to delete a todo'}
         {isErrorUpdate && 'Unable to update a todo'}
         {isEmptyTitle && "Title can't be empty"}
       </div>
     )}
    </div>
  );
};
