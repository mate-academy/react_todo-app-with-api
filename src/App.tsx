import React, {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';

import {
  createTodo,
  getTodos,
  deleteTodo,
  USER_ID,
  updateTodo,
} from './api/todos';

import { Errors } from './types/Errors';
import { Filters } from './types/Filters';
import { Todo } from './types/Todo';

import Header from './Components/Header/Header';
import Footer from './Components/Footer/Footer';
import TodoList from './Components/TodoList/TodoList';
import Notification from './Components/Notification/Notification';

import { filterTodos } from './utils/filterTodos';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filter, setFilter] = useState(Filters.All);
  const [errorMessage, setErrorMessage] = useState<Errors | null>(null);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [loadingTodo, setLoadingTodo] = useState<number[]>([]);

  const fetchingTodos = async () => {
    try {
      const response = await getTodos(USER_ID);

      setTodos(response);
    } catch (error) {
      setErrorMessage(Errors.UPLOAD);
    }
  };

  useEffect(() => {
    fetchingTodos();
  }, []);

  const visibleTodos = useMemo(() => (
    filterTodos(filter, todos)
  ), [todos, filter]);

  const onChangeFilter = (value: Filters) => {
    if (value === filter) {
      return;
    }

    setFilter(value);
  };

  const completedTodos = useMemo(() => {
    return filterTodos(Filters.COMPLETED, todos);
  }, [todos]);

  const activeTodos = useMemo(() => {
    return filterTodos(Filters.ACTIVE, todos);
  }, [todos]);

  const addNewTodo = useCallback(async (value: string) => {
    if (!value.length) {
      setErrorMessage(Errors.EMPTY);

      return;
    }

    const newTodo = {
      userId: USER_ID,
      title: value,
      completed: false,
    };

    setTempTodo({ ...newTodo, id: 0 });
    try {
      const response = await createTodo(newTodo);

      setTodos(currentTodos => [...currentTodos, response]);
    } catch (error) {
      setErrorMessage(Errors.ADD);
    } finally {
      setTempTodo(null);
    }
  }, []);

  const removeTodo = useCallback(async (id: number): Promise<void> => {
    try {
      await deleteTodo(id);

      setTodos(currentTodos => currentTodos
        .filter(currTodo => currTodo.id !== id));
    } catch (error) {
      setErrorMessage(Errors.DEL);
    }
  }, []);

  const removeAllCompletedTodo = useCallback(() => {
    const delCompletedTodos = completedTodos
      .map(todo => removeTodo(todo.id));

    completedTodos.forEach(({ id }) => {
      setLoadingTodo(currId => ([...currId, id]));
    });

    Promise.all([...delCompletedTodos])
      .then(() => {
        setTodos(currTodos => currTodos.filter(todo => !todo.completed));
      }).finally(() => setLoadingTodo([]));
  }, [completedTodos]);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const changeTodo = useCallback(async (id: number, data: any) => {
    try {
      await updateTodo(id, data);

      setTodos(currTodos => currTodos
        .map(todo => {
          if (todo.id !== id) {
            return todo;
          }

          return { ...todo, ...data };
        }));
    } catch (error) {
      setErrorMessage(Errors.UPDATE);
    }
  }, []);

  const changeAllTodo = useCallback(async (completed: boolean) => {
    const todosForUpdate = completed ? activeTodos : completedTodos;

    todosForUpdate.forEach(({ id }) => {
      setLoadingTodo(currId => ([...currId, id]));
    });

    const updateTodos = todosForUpdate
      .map(todo => changeTodo(todo.id, { completed }));

    Promise.all([...updateTodos])
      .then(() => {
        setTodos(currTodos => currTodos
          .map(todo => {
            if (todo.completed === completed) {
              return todo;
            }

            return { ...todo, completed };
          }));
      }).finally(() => setLoadingTodo([]));
  }, [completedTodos, activeTodos, changeTodo]);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          todosLength={todos.length}
          completedTodosLength={completedTodos.length}
          addNewTodo={addNewTodo}
          changeAllTodo={changeAllTodo}
        />

        <section className="todoapp__main">
          <TodoList
            visibleTodos={visibleTodos}
            tempTodo={tempTodo}
            removeTodo={removeTodo}
            updateTodo={changeTodo}
            loadingTodo={loadingTodo}
          />
        </section>

        {!!todos.length && (
          <Footer
            filter={filter}
            onChangeFilter={onChangeFilter}
            completedTodosLength={completedTodos.length}
            todosLength={todos.length}
            removeAllCompletedTodo={removeAllCompletedTodo}
          />
        )}
      </div>

      <Notification
        errorMessage={errorMessage}
        onCloseError={() => setErrorMessage(null)}
      />
    </div>
  );
};
