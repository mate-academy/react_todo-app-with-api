import React, {
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
  const [filtredTodos, setFiltredTodos] = useState<Todo[]>([]);
  const [isErrorLoadedNewTodo, setIsErrorLoadedNewTodo] = useState(false);
  const [isErrorDeletedTodo, setIsErrorDeletedTodo] = useState(false);
  const [isErrorUpdate, setIsErrorUpdate] = useState(false);
  const [checkedCompliteTodo, setCheckedCompliteTodo] = useState(false);
  const [isLoadedUpdate, setIsLoadedUpdate] = useState(false);
  const [selectId, setSelectId] = useState(0);
  const [openPachForm, setOpenPachForm] = useState(false);
  const [isEmptyTitle, setIsEmptyTitle] = useState(false);

  const [isSelectedAll, setIsSeSelectedAll] = useState(true);
  const [isSelectedActive, setIsSelectedActive] = useState(false);
  const [isSelectedComplited, setIsSelectedComplited] = useState(false);

  useEffect(() => {
    if (user) {
      getTodos(user.id)
        .then((res) => {
          setTodos(res);
          setFiltredTodos(res);
        });
    }
  }, []);

  const completedTodos = useMemo(
    () => todos.filter(todo => todo.completed === true),
    [todos],
  );

  let activeTodos = useMemo(
    () => todos.filter(todo => todo.completed !== true),
    [todos],
  );

  const handelCloseError = () => {
    setIsErrorLoadedNewTodo(false);
    setIsErrorDeletedTodo(false);
    setIsErrorUpdate(false);
    setIsEmptyTitle(false);
  };

  const handleChange = (todoID: number) => {
    const updateStatus: UpdateStatus = {
      completed: !checkedCompliteTodo,
    };

    handelCloseError();

    setCheckedCompliteTodo((prev) => !prev);

    setIsLoadedUpdate(true);

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
        setFiltredTodos(updateTodos);
      })
      .catch(() => {
        setIsErrorUpdate(true);
        setTimeout(handelCloseError, 3000);
      })
      .finally(() => {
        setSelectId(0);
        setIsLoadedUpdate(false);
      });
  };

  const handelAllActiveReverse = () => {
    if (activeTodos.length > 0) {
      activeTodos.forEach(activeTodo => handleChange(activeTodo.id));
      activeTodos = [];
    } else {
      todos.forEach(activeTodo => handleChange(activeTodo.id));
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
        setFiltredTodos((prev) => [...prev, todo]);
        setTodos((prev) => [...prev, todo]);
      })
      .catch(() => {
        setIsErrorLoadedNewTodo(true);
        setTimeout(handelCloseError, 3000);
      });
  };

  const handelDeleteTodo = (todoId: number) => {
    setIsLoadedUpdate(true);
    setSelectId(todoId);
    handelCloseError();
    deleteTodo(todoId)
      .then(() => {
        const filtered = filtredTodos.filter(item => item.id !== todoId);

        setTodos(filtered);
        setFiltredTodos(filtered);
        setIsLoadedUpdate(false);
      })

      .catch(() => {
        setTimeout(handelCloseError, 3000);
        setIsErrorDeletedTodo(true);
      });
  };

  const handelClearAllComplered = () => {
    if (completedTodos.length > 0) {
      completedTodos.forEach(compTodo => handelDeleteTodo(compTodo.id));
    }
  };

  const handelDubleClick = (event: MouseEvent, todoId: number) => {
    handelCloseError();
    if (event.detail === 2) {
      setOpenPachForm(true);
      setSelectId(todoId);
    }
  };

  const handlerUpdateTitle = (newTitle: string) => {
    if (newTitle) {
      setIsLoadedUpdate(true);

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
          setFiltredTodos(updateTodos);
        })
        .catch(() => {
          setTimeout(handelCloseError, 3000);
          setIsErrorUpdate(true);
        })
        .finally(() => {
          setSelectId(0);
          setIsLoadedUpdate(false);
        });
    }

    setOpenPachForm(false);
  };

  const closeInput = useCallback(() => {
    setOpenPachForm(false);
  }, []);

  const handelFiltredCompleted = () => {
    setFiltredTodos(completedTodos);
    setIsSelectedComplited(true);
    setIsSelectedActive(false);
    setIsSeSelectedAll(false);
  };

  const handelFiltredAll = () => {
    setFiltredTodos(todos);
    setIsSeSelectedAll(true);
    setIsSelectedComplited(false);
    setIsSelectedActive(false);
  };

  const handelFiltredActive = () => {
    setFiltredTodos(activeTodos);
    setIsSelectedActive(true);
    setIsSeSelectedAll(false);
    setIsSelectedComplited(false);
  };

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
                  checked={checkedCompliteTodo}
                  onChange={() => handleChange(todo.id)}
                />
              </label>

              {openPachForm
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

              {isLoadedUpdate
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

          {/* <div data-cy="Todo" className="todo completed">
            <label className="todo__status-label">
              <input
                data-cy="TodoStatus"
                type="checkbox"
                className="todo__status"
                defaultChecked
              />
            </label>

            <span data-cy="TodoTitle" className="todo__title">HTML</span>
            <button
              type="button"
              className="todo__remove"
              data-cy="TodoDeleteButton"
            >
              ×
            </button>

            <div data-cy="TodoLoader" className="modal overlay">
              <div className="modal-background" />
              <div className="loader" />
            </div>
          </div>

          <div data-cy="Todo" className="todo">
            <label className="todo__status-label">
              <input
                data-cy="TodoStatus"
                type="checkbox"
                className="todo__status"
              />
            </label>

            <span data-cy="TodoTitle" className="todo__title">CSS</span>

            <button
              type="button"
              className="todo__remove"
              data-cy="TodoDeleteButton"
            >
              ×
            </button>

            <div data-cy="TodoLoader" className="modal overlay">
              <div className="modal-background" />
              <div className="loader" />
            </div>
          </div>

          <div data-cy="Todo" className="todo">
            <label className="todo__status-label">
              <input
                data-cy="TodoStatus"
                type="checkbox"
                className="todo__status"
              />
            </label>

            <form>
              <input
                data-cy="TodoTitleField"
                type="text"
                className="todo__title-field"
                placeholder="Empty todo will be deleted"
                defaultValue="JS"
              />
            </form>

            <div data-cy="TodoLoader" className="modal overlay">
              <div className="modal-background" />
              <div className="loader" />
            </div>
          </div>

          <div data-cy="Todo" className="todo">
            <label className="todo__status-label">
              <input
                data-cy="TodoStatus"
                type="checkbox"
                className="todo__status"
              />
            </label>

            <span data-cy="TodoTitle" className="todo__title">React</span>
            <button
              type="button"
              className="todo__remove"
              data-cy="TodoDeleteButton"
            >
              ×
            </button>

            <div data-cy="TodoLoader" className="modal overlay">
              <div className="modal-background" />
              <div className="loader" />
            </div>
          </div>

          <div data-cy="Todo" className="todo">
            <label className="todo__status-label">
              <input
                data-cy="TodoStatus"
                type="checkbox"
                className="todo__status"
              />
            </label>

            <span data-cy="TodoTitle" className="todo__title">Redux</span>
            <button
              type="button"
              className="todo__remove"
              data-cy="TodoDeleteButton"
            >
              ×
            </button>

            <div data-cy="TodoLoader" className="modal overlay is-active">
              <div className="modal-background" />
              <div className="loader" />
            </div>
          </div> */}
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
                  { selected: isSelectedAll },
                )}
                onClick={handelFiltredAll}
              >
                All
              </a>

              <a
                data-cy="FilterLinkActive"
                href="#/active"
                className={cn(
                  'filter__link',
                  { selected: isSelectedActive },
                )}
                onClick={handelFiltredActive}
              >
                Active
              </a>
              <a
                data-cy="FilterLinkCompleted"
                href="#/completed"
                className={cn(
                  'filter__link',
                  { selected: isSelectedComplited },
                )}
                onClick={handelFiltredCompleted}
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
