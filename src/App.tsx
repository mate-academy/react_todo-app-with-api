import React, {
  useState, useEffect, useMemo, useCallback,
} from 'react';
import classNames from 'classnames';
import { Error } from './types/Errors';

import { UserWarning } from './UserWarning';
import { Todo } from './types/Todo';
import {
  getTodos,
  addTodo,
  deleteTodo,
  updateTodo,
} from './api/todos';
import { Loader } from './component/Loader/Loader';
import { TodoList } from './component/TodoList/TodoList';
import { Footer } from './component/Footer/Footer';
import { LoadType } from './types/LoadType';
import { Header } from './component/Header/Header';

const USER_ID = 6908;

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [typeOfLoad, setTypeOfLoad] = useState<LoadType>(LoadType.All);
  const [isLoading, setIsLoading] = useState(true);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [disableInput, setDisableInput] = useState(false);
  const [loadId, setLoadId] = useState<number[]>([]);

  const getTodosFromServer = async (userId: number) => {
    try {
      setIsLoading(true);
      const getTodo = await getTodos(userId);

      setTodos(getTodo);
    } catch {
      setErrorMessage(Error.Load);
    } finally {
      setIsLoading(false);
    }
  };

  const addNewTodo = useCallback(async (title: string) => {
    if (!title.trim()) {
      setErrorMessage('Title can not be empty');

      return;
    }

    setDisableInput(true);

    const newTodo = {
      title,
      userId: USER_ID,
      completed: false,
    };

    setTempTodo({ ...newTodo, id: 0 });

    try {
      const newTempTodo = await addTodo(newTodo);

      setTodos(prev => ([
        ...prev,
        newTempTodo,
      ]));
    } catch {
      setErrorMessage(Error.Add);
    } finally {
      setDisableInput(false);
      setTempTodo(null);
    }
  }, []);

  const deleteTodoById = useCallback(async (id: number) => {
    setLoadId(state => [...state, id]);
    try {
      await deleteTodo(id);
      setTodos(prev => prev.filter(todo => todo.id !== id));
    } catch {
      setErrorMessage(Error.Delete);
    }

    setLoadId(state => state.filter(el => el !== id));
  }, []);

  useEffect(() => {
    getTodosFromServer(USER_ID);
  }, []);

  const activeTodos = useMemo(() => {
    return todos.filter(({ completed }) => !completed).length;
  }, [todos]);

  const removeError = () => {
    setErrorMessage(Error.None);
  };

  const onlyCompleted = useMemo(
    () => todos.filter((todo) => todo.completed), [todos],
  );

  const deleteCompleted = useCallback(async () => {
    try {
      await Promise.all(onlyCompleted.map(({ id }) => deleteTodo(id)));
      setTodos(todos.filter(({ completed }) => !completed));
    } catch {
      setErrorMessage(Error.Delete);
    }
  }, [onlyCompleted, todos]);

  const handleUpdate = useCallback(async (id: number, data: Partial<Todo>) => {
    setLoadId(state => [...state, id]);

    try {
      await updateTodo(id, data);

      setTodos(state => state.map(todo => {
        if (todo.id === id) {
          return { ...todo, ...data };
        }

        return todo;
      }));
    } catch {
      setErrorMessage(Error.Update);
    } finally {
      setLoadId(state => state.filter(el => el !== id));
    }
  }, []);

  const handleToggleAll = useCallback(() => {
    const areAllDone = todos.every(todo => todo.completed);

    if (areAllDone) {
      todos.forEach(el => {
        handleUpdate(el.id, { completed: false });
      });
    } else {
      todos.filter(todo => !todo.completed).forEach(({ id }) => {
        handleUpdate(id, { completed: true });
      });
    }
  }, [todos]);

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">

        <Header
          addNewTodo={addNewTodo}
          disableInput={disableInput}
          handleEditAll={handleToggleAll}
        />

        {isLoading && (

          <Loader isLoading={isLoading} />
        )}

        {todos.length > 0 && (
          <>
            <TodoList
              todos={todos}
              typeOfLoad={typeOfLoad}
              tempTodo={tempTodo}
              onDelete={deleteTodoById}
              loadId={loadId}
              handleEdit={handleUpdate}
            />

            <Footer
              typeOfLoad={typeOfLoad}
              setTypeOfLoad={setTypeOfLoad}
              activeTodos={activeTodos}
              completedTodos={todos.length - activeTodos}
              deleteCompleted={deleteCompleted}
            />
          </>
        )}

      </div>

      <div className={classNames(
        'notification is-danger is-light has-text-weight-normal',
        { hidden: !errorMessage },
      )}
      >
        <button
          aria-label="all-active"
          type="button"
          className="delete"
          onClick={removeError}
        />

        {errorMessage}
      </div>
    </div>
  );
};
