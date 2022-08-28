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
// import { PatchForm } from './components/PatchForm';
import { ErrorNotification } from './components/ErrorNotification';
import { FiltersTodos } from './components/FiltersTodos';
import { TodosList } from './components/TodosList';

export const App: React.FC = () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const user = useContext(AuthContext);
  // const newTodoField = useRef<HTMLInputElement>(null);

  // const [todos, setTodos] = useState<Todo[]>([]);
  const [filtredTodos, setFilteredTodos] = useState<Todo[]>([]);
  const [todos, setTodos] = useState<Todo[]>([]);
  const [typeError, setTypeError] = useState('');

  const [isLoaded, setIsLoaded] = useState(false);
  const [selectId, setSelectId] = useState(0);
  const [openPachForm, setOpenPachForm] = useState(false);
  // const [filter, setFilter] = useState('All');

  // const [reverse, setReverse] = useState(false);
  const [filter, setFilter] = useState('All');

  // let todos: Todo[] | [] = [];

  useEffect(() => {
    if (user) {
      getTodos(user.id)
        .then((res) => {
          setTodos(res);
          setFilteredTodos(res);
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

  useMemo(
    () => {
      const filtred = todos.filter(todo => {
        if (filter === 'Completed') {
          return todo.completed === true;
        }

        if (filter === 'Active') {
          return todo.completed !== true;
        }

        return todo;
      });

      setFilteredTodos(filtred);
    },
    [filter],
  );

  // const handelFiltredTodos = (
  //   // event: DetailedHTMLProps<AnchorHTMLAttributes<HTMLAnchorElement>>,
  //   event: any,
  // ) => {
  //   setFilter(event.target.textContent);
  // };

  const handelCloseError = useCallback(() => {
    setTypeError('');
  }, []);

  const handleChange = (todoID: number, completedTodo: boolean) => {
    const updateStatus: UpdateStatus = {
      completed: !completedTodo,
    };

    handelCloseError();

    setIsLoaded(true);

    setSelectId(todoID);

    patchTodo(todoID, updateStatus)
      .then(() => {
        setFilteredTodos((prev) => prev.map(todo => {
          if (todo.id === todoID) {
            return ({
              ...todo,
              completed: !todo.completed,
            });
          }

          return todo;
        }));
        setTodos((prev) => prev.map(todo => {
          if (todo.id === todoID) {
            return ({
              ...todo,
              completed: !todo.completed,
            });
          }

          return todo;
        }));
      })
      .catch(() => {
        setTypeError('ErrorUpdate');
        setTimeout(handelCloseError, 3000);
      })
      .finally(() => {
        setSelectId(0);
        setIsLoaded(false);
      });
  };

  // useEffect(() => {
  //   const promises: Promise<Todo>[] = [];

  //   todos.forEach(todo => {
  //     const updateStatus: UpdateStatus = {
  //       completed: todo.completed === reverse ? !reverse : reverse,
  //     };

  //     if (reverse !== todo.completed) {
  //       promises.push(patchTodo(todo.id, updateStatus));
  //     }
  //   });

  //   Promise.all(promises)
  //     .then(() => {
  //       // filtredTodos = filtredTodos.map((todo) => {
  //       //   if (reverse !== todo.completed) {
  //       //     return ({
  //       //       ...todo,
  //       //       completed: !reverse,
  //       //     });
  //       //   }

  //       //   return todo;
  //       // });
  //       getTodos(user.id)
  //         .then((res) => {
  //           setFilteredTodos(res);
  //         });
  //     });
  // }, [reverse]);

  const handelAllActiveReverse = () => {
    // setReverse(!reverse);

    if (completedTodos.length > 0
      && completedTodos.length !== filtredTodos.length) {
      activeTodos.forEach(todo => {
        if (!todo.completed) {
          handleChange(todo.id, todo.completed);
        }
      });
    }

    if (!completedTodos.length
      || completedTodos.length === filtredTodos.length
    ) {
      filtredTodos.forEach(activeTodo => {
        handleChange(activeTodo.id, activeTodo.completed);
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
      setTypeError('EmptyTitle');

      return;
    }

    createTodo(newTodo)
      .then((todo) => {
        setFilteredTodos((prev) => [...prev, todo]);
        setTodos((prev) => [...prev, todo]);
      })
      .catch(() => {
        setTypeError('ErrorLoadedNewTodo');
        setTimeout(handelCloseError, 3000);
      });
  };

  const handelDeleteTodo = useCallback((todoId: number) => {
    setIsLoaded(true);
    setSelectId(todoId);
    handelCloseError();

    return deleteTodo(todoId)
      .then(() => {
        setFilteredTodos((prev) => prev.filter(item => item.id !== todoId));
        setTodos((prev) => prev.filter(item => item.id !== todoId));
      })

      .catch(() => {
        setTimeout(handelCloseError, 3000);
        setTypeError('ErrorDeletedTodo');
      })
      .finally(() => setIsLoaded(false));
  }, [filtredTodos, todos]);

  const handelClearAllComplered = () => {
    if (completedTodos.length > 0) {
      completedTodos.forEach(compTodo => {
        handelDeleteTodo(compTodo.id);
      });
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

          setFilteredTodos(updateTodos);
        })
        .catch(() => {
          setTimeout(handelCloseError, 3000);
          setTypeError('ErrorUpdate');
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

          <TodosList
            filtredTodos={filtredTodos}
            selectId={selectId}
            isLoaded={isLoaded}
            openPachForm={openPachForm}
            handlerUpdateTitle={handlerUpdateTitle}
            closeInput={closeInput}
            handleChange={handleChange}
            handelDubleClick={handelDubleClick}
            handelDeleteTodo={handelDeleteTodo}
            handelCreateTodo={handelCreateTodo}
          />

        </section>

        { (todos.length > 0) && (
          <footer className="todoapp__footer" data-cy="Footer">

            <FiltersTodos
              todos={todos}
              completedTodos={completedTodos}
              handelClearAllComplered={handelClearAllComplered}
              filter={filter}
              setFilter={setFilter}
            />

          </footer>
        )}
      </div>

      <ErrorNotification
        typeError={typeError}
        handelCloseError={handelCloseError}
      />
    </div>
  );
};
