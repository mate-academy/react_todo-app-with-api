/* eslint-disable jsx-a11y/control-has-associated-label */
import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { Header } from './components/header';
import { Main } from './components/main';
import { Footer } from './components/footer';
import { Notification } from './components/notification';
import { Todo } from './types/Todo';
import { USER_ID } from './utils/constants';
import { Filter } from './types/Filter';
import {
  getTodos,
  deleteTodo,
  updateTodoCompleted,
  updateTodoTitle,
} from './api/todos';

export const App = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [error, setError] = useState<string>('');
  const [filter, setFilter] = useState<string>(Filter.ALL);
  const [loadingID, setLoadingID] = useState<number[]>([]);
  const [comletedTodos, setCompletedTodos] = useState<Todo[]>([]);
  const [uncomletedTodoCount, setUncomletedTodoCount] = useState<number>(0);

  const visibleTodos = useMemo(() => {
    let filteredTodos: Todo[] = todos;

    if (filter === Filter.ACTIVE) {
      filteredTodos = todos.filter(todo => !todo.completed);
    }

    if (filter === Filter.COMPLETED) {
      filteredTodos = todos.filter(todo => todo.completed);
    }

    return filteredTodos || [];
  }, [filter, todos]);

  const loadTodos = useCallback(async () => {
    try {
      await getTodos(USER_ID)
        .then(res => setTodos(res));
    } catch {
      setError('can not load todo');
    }
  }, []);

  const handleDeleteTodo = useCallback(async (todoId: number) => {
    try {
      setLoadingID((prevIds => [...prevIds, todoId]));
      await deleteTodo(todoId);
      await loadTodos();
    } catch {
      setError('can not delete todo');
    }

    setLoadingID(prevIds => prevIds.filter(id => id !== todoId));
  }, [loadTodos]);

  const handleEditTodo = useCallback(
    async (
      newTitle: string,
      todoId: number,
      setEditInput: (input: string) => void,
      title: string,
    ) => {
      if (!newTitle) {
        handleDeleteTodo(todoId);

        return;
      }

      if (newTitle && newTitle.trim().length < 1) {
        setError('title can not be empty');
        setEditInput(title);

        return;
      }

      try {
        setLoadingID((prevIds => [...prevIds, todoId]));
        await updateTodoTitle(todoId, {
          title: newTitle,
        });
      } catch {
        setError('can not edit todo');
      }

      await loadTodos();
      setLoadingID(prevIds => prevIds.filter(id => id !== todoId));
    }, [handleDeleteTodo, loadTodos],
  );

  const handleUpdateTodoIsCompleted = useCallback(async (
    todoId: number,
    complitedCurrVal: boolean,
  ) => {
    try {
      setLoadingID((prevIds => [...prevIds, todoId]));
      await updateTodoCompleted(todoId, {
        completed: !complitedCurrVal,
      });
      await loadTodos();
    } catch {
      setError('can not update todo');
    }

    setLoadingID(prevIds => prevIds.filter(id => id !== todoId));
  }, [loadTodos]);

  const handleToggleAllComplited = useCallback(() => {
    const todosCurrValue = todos.every(todo => todo.completed === true);

    todos.forEach(todo => {
      handleUpdateTodoIsCompleted(todo.id, todosCurrValue);
    });
  }, [handleUpdateTodoIsCompleted, todos]);

  const handleSetTempTodo = useCallback((todo: Todo | null) => {
    setTempTodo(todo);
  }, []);

  const handleSetError = useCallback((errVal: string) => {
    setError(errVal);
  }, []);

  const HandleSelectFilter = useCallback((filterValue: string) => {
    setFilter(filterValue);
  }, []);

  const handleClearComplitedTodos = useCallback(() => {
    comletedTodos.map(todo => handleDeleteTodo(todo.id));
  }, [comletedTodos, handleDeleteTodo]);

  const updateTodos = (todo: Todo) => {
    setTempTodo(null);
    setTodos(prevTodos => [...prevTodos as Todo[], todo]);
  };

  useEffect(() => {
    loadTodos();
  }, [loadTodos]);

  useEffect(() => {
    setCompletedTodos(todos.filter(todoa => todoa.completed));
    setUncomletedTodoCount(todos.filter(todo => !todo.completed).length);
  }, [todos]);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          onError={handleSetError}
          onChange={handleSetTempTodo}
          userId={USER_ID}
          onUpdate={updateTodos}
          onToggle={handleToggleAllComplited}
          todos={todos}
        />

        {todos.length > 0 && (
          <>
            <Main
              todos={visibleTodos}
              tempTodo={tempTodo}
              onDelete={handleDeleteTodo}
              loadingID={loadingID}
              onUpdate={handleUpdateTodoIsCompleted}
              editTodo={handleEditTodo}
            />

            <Footer
              onSelect={HandleSelectFilter}
              selectedFilter={filter}
              comletedTodos={comletedTodos}
              onClear={handleClearComplitedTodos}
              countUncompletedTodos={uncomletedTodoCount}
            />
          </>
        )}
      </div>
      {error && (
        <Notification
          setError={handleSetError}
          errorText={error}
        />
      )}
    </div>
  );
};
