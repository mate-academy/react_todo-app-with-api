import React, { useEffect, useMemo, useState } from 'react';
import { Todo } from './types/Todo';
import { Error } from './types/Error';
import { FilterTodos } from './types/FilterTodos';
import {
  getTodos,
  createTodo,
  deleteTodo,
  updateTodo,
} from './api/todos';
import { UserWarning } from './UserWarning';
import { Header } from './components/Header';
import { TodoList } from './components/TodoList/TodoList';
import { Footer } from './components/Footer';
import { ErrorNotification } from './components/ErrorNotification';

const USER_ID = 6550;

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [errorMessage, setErrorMessage] = useState(Error.NONE);
  const [filterBy, setFilterBy] = useState(FilterTodos.ALL);
  const [activeInput, setActiveInput] = useState(true);

  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [idUpdating, setIdUpdating] = useState([0]);

  useEffect(() => {
    const getTodosFromServer = async () => {
      try {
        setErrorMessage(Error.NONE);
        const todosFromServer = await getTodos(USER_ID);

        setTodos(todosFromServer);
      } catch (error) {
        setErrorMessage(Error.LOAD);
      }
    };

    getTodosFromServer();
  }, []);

  const countTodos = todos.length;

  const activeTodos = useMemo(
    () => todos.filter(todo => !todo.completed).length,
    [todos],
  );

  const visibleTodos: Todo[] = useMemo(() => {
    switch (filterBy) {
      case FilterTodos.ACTIVE:
        return todos.filter(todo => !todo.completed);
      case FilterTodos.COMPLTED:
        return todos.filter(todo => todo.completed);
      default:
        return todos;
    }
  }, [todos, filterBy]);

  const addTodo = async (title: string) => {
    if (!title.trim()) {
      setErrorMessage(Error.TITLE);

      return;
    }

    try {
      setErrorMessage(Error.NONE);

      const newTodo = {
        userId: USER_ID,
        title,
        completed: false,
      };

      setActiveInput(false);
      setTempTodo({ ...newTodo, id: 0 });
      const createdTodo = await createTodo(USER_ID, newTodo);

      setTodos(prevTodos => [...prevTodos, createdTodo]);
    } catch (error) {
      setErrorMessage(Error.ADD);
    } finally {
      setTempTodo(null);
      setActiveInput(true);
    }
  };

  const removeTodo = async (id: number) => {
    try {
      setErrorMessage(Error.NONE);
      setIdUpdating(prevId => [...prevId, id]);

      await deleteTodo(USER_ID, id);

      setTodos(todos.filter(todo => todo.id !== id));
    } catch (error) {
      setErrorMessage(Error.DELETE);
    } finally {
      setIdUpdating([0]);
    }
  };

  const removeCompletedTodos = () => {
    todos.forEach(async (todo) => {
      if (todo.completed) {
        await removeTodo(todo.id);
      }
    });
  };

  const handleUpdate = async (
    id: number,
    data: { completed?: boolean, title?: string },
  ) => {
    try {
      setErrorMessage(Error.NONE);

      setIdUpdating(prevId => [...prevId, id]);
      await updateTodo(USER_ID, id, data);

      setTodos(prevTodos => prevTodos.map(todo => {
        if (todo.id === id) {
          const updatedTodo = 'completed' in data ? {
            ...todo,
            completed: data.completed,
          } : {
            ...todo,
            title: data.title,
          };

          return updatedTodo;
        }

        return todo;
      }));
    } catch {
      setErrorMessage(Error.UPDATE);
    } finally {
      setIdUpdating([0]);
    }
  };

  const toggleAll = () => {
    let toggleAllTodos = todos;

    if (activeTodos) {
      toggleAllTodos = toggleAllTodos.filter(todo => !todo.completed);
    }

    toggleAllTodos.forEach(async (todo) => {
      await handleUpdate(todo.id, { completed: !todo.completed });
    });
  };

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          addTodo={addTodo}
          isInputActive={activeInput}
          hasActive={!!activeTodos}
          hasTodos={!!countTodos}
          toggleAll={toggleAll}
        />

        {(!!countTodos || !!tempTodo) && (
          <>
            <TodoList
              todos={visibleTodos}
              tempTodo={tempTodo}
              removeTodo={removeTodo}
              idUpdating={idUpdating}
              handleUpdate={handleUpdate}
            />

            <Footer
              allTodos={countTodos}
              activeTodos={activeTodos}
              filterBy={filterBy}
              onFilterTodos={setFilterBy}
              onRemoveCompletedTodos={removeCompletedTodos}
            />
          </>
        )}

      </div>
      {!!errorMessage && (
        <ErrorNotification
          errorMessage={errorMessage}
          onCloseError={() => setErrorMessage(Error.NONE)}
        />
      )}
    </div>
  );
};
