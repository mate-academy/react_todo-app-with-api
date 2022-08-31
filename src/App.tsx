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

import { ErrorNotification } from './components/ErrorNotification';
import { FiltersTodos } from './components/FiltersTodos';
import { TodosList } from './components/TodosList';

export const App: React.FC = () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const user = useContext(AuthContext);

  const [filtredTodos, setFilteredTodos] = useState<Todo[]>([]);
  const [todos, setTodos] = useState<Todo[]>([]);
  const [typeError, setTypeError] = useState('');

  const [isLoaded, setIsLoaded] = useState(false);
  const [loadTodoId, setLoadTodoId] = useState<number[]>([]);
  const [selectId, setSelectId] = useState(0);
  const [openPachForm, setOpenPachForm] = useState(false);

  const [filter, setFilter] = useState('All');

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
    [filter, todos],
  );

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
        setLoadTodoId([]);
        setSelectId(0);
        setIsLoaded(false);
      });
  };

  const handelAllActiveReverse = () => {
    if (completedTodos.length > 0
      && completedTodos.length !== filtredTodos.length) {
      setLoadTodoId(activeTodos.map(todo => todo.id));
      activeTodos.forEach(todo => {
        if (!todo.completed) {
          handleChange(todo.id, todo.completed);
        }
      });
    }

    if (!completedTodos.length
      || completedTodos.length === filtredTodos.length
    ) {
      setLoadTodoId(filtredTodos.map(todo => todo.id));
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
      .finally(() => {
        setLoadTodoId([]);
        setIsLoaded(false);
      });
  }, [filtredTodos, todos]);

  const handelClearAllComplered = () => {
    if (completedTodos.length > 0) {
      setLoadTodoId(completedTodos.map(todo => todo.id));
      completedTodos.forEach((compTodo) => {
        handelDeleteTodo(compTodo.id);
      });
    }
  };

  const handelDoubleClick = (todoId: number) => {
    handelCloseError();
    setOpenPachForm(true);
    setSelectId(todoId);
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
            handelDoubleClick={handelDoubleClick}
            handelDeleteTodo={handelDeleteTodo}
            handelCreateTodo={handelCreateTodo}
            loadTodoId={loadTodoId}
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
