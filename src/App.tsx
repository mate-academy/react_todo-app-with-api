import React, { useEffect, useMemo, useState } from 'react';
import { Header } from './components/Header';
import { TodoList } from './components/TodoList';
import { Footer } from './components/Footer';
import { UserWarning } from './UserWarning';
import { Todo } from './types/Todo';
import {
  createTodo, deleteTodo, getTodos, updateTodo,
} from './api/todos';
import { ErrorNotification } from './components/ErrorNotification';
import { ErrorType } from './types/ErrorType';
import { FilterBy } from './types/FilterBy';

const USER_ID = 6481;

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [errorMessage, setErrorMessage] = useState(ErrorType.None);
  const [filterBy, setFilterBy] = useState(FilterBy.All);

  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [isInputActive, setIsInputActive] = useState(true);

  const [updatingIds, setUpdatingIds] = useState([0]);

  const getTodosFromServer = async () => {
    try {
      setErrorMessage(ErrorType.None);
      const todosFromServer = await getTodos(USER_ID);

      setTodos(todosFromServer);
    } catch (error) {
      setErrorMessage(ErrorType.Load);
    }
  };

  useEffect(() => {
    getTodosFromServer();
  }, []);

  const allTodosCount = todos.length;

  const activeTodosCount = useMemo(
    () => todos.filter(todo => !todo.completed).length,
    [todos],
  );

  const visibleTodos = useMemo(() => {
    switch (filterBy) {
      case FilterBy.Active:
        return todos.filter(todo => !todo.completed);

      case FilterBy.Completed:
        return todos.filter(todo => todo.completed);

      default:
        return todos;
    }
  }, [filterBy, todos]);

  const addTodo = (title: string) => {
    if (!title.trim()) {
      setErrorMessage(ErrorType.Title);

      return;
    }

    const createNewTodo = async () => {
      try {
        setErrorMessage(ErrorType.None);
        const newTodo = {
          userId: USER_ID,
          title,
          completed: false,
        };

        setIsInputActive(false);
        setTempTodo({ ...newTodo, id: 0 });
        const createdTodo = await createTodo(USER_ID, newTodo);

        setTodos(prevTodos => [...prevTodos, createdTodo]);
      } catch (error) {
        setErrorMessage(ErrorType.Add);
      } finally {
        setTempTodo(null);
        setIsInputActive(true);
      }
    };

    createNewTodo();
  };

  const removeTodo = async (id: number) => {
    try {
      setErrorMessage(ErrorType.None);
      setUpdatingIds(prev => [...prev, id]);
      await deleteTodo(USER_ID, id);

      setTodos(prevTodos => prevTodos.filter(todo => todo.id !== id));
    } catch (error) {
      setErrorMessage(ErrorType.Delete);
    } finally {
      setUpdatingIds([0]);
    }
  };

  const removeCompletedTodos = () => {
    todos.forEach(async (todo) => {
      if (todo.completed) {
        await removeTodo(todo.id);
      }
    });
  };

  const handleUpdate = async (id: number, data: boolean | string) => {
    try {
      setErrorMessage(ErrorType.None);
      setUpdatingIds(prev => [...prev, id]);
      if (typeof data === 'boolean') {
        await updateTodo(USER_ID, id, { completed: data });
      } else {
        await updateTodo(USER_ID, id, { title: data });
      }

      setTodos(prevTodos => prevTodos.map(todo => {
        if (todo.id === id) {
          const updatedTodo = typeof data === 'boolean' ? {
            ...todo,
            completed: data,
          } : {
            ...todo,
            title: data,
          };

          return updatedTodo;
        }

        return todo;
      }));
    } catch (error) {
      setErrorMessage(ErrorType.Update);
    } finally {
      setUpdatingIds([0]);
    }
  };

  const toggleAll = () => {
    let toggledTodos = todos;

    if (activeTodosCount) {
      toggledTodos = todos.filter(todo => !todo.completed);
    }

    toggledTodos.forEach(async (todo) => {
      await handleUpdate(todo.id, !todo.completed);
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
          isInputActive={isInputActive}
          hasActive={!!activeTodosCount}
          toggleAll={toggleAll}
        />

        {(!!allTodosCount || !!tempTodo) && (
          <>
            <TodoList
              todos={visibleTodos}
              tempTodo={tempTodo}
              handleUpdate={handleUpdate}
              removeTodo={removeTodo}
              updatingIds={updatingIds}
            />

            <Footer
              allTodosCount={allTodosCount}
              activeTodosCount={activeTodosCount}
              filterBy={filterBy}
              onFilterTodos={(status: FilterBy) => setFilterBy(status)}
              onClearCompleted={removeCompletedTodos}
            />
          </>
        )}
      </div>

      {!!errorMessage && (
        <ErrorNotification
          errorMessage={errorMessage}
          onCloseError={() => setErrorMessage(ErrorType.None)}
        />
      )}
    </div>
  );
};
