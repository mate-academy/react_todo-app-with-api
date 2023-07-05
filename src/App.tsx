/* eslint-disable jsx-a11y/control-has-associated-label */
import {
  FC,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { UserWarning } from './UserWarning';
import { Todo, UpdateTodoArgs } from './types/Todo';
import { TodoList } from './Components/TodoList';
import {
  createTodo,
  getTodos,
  deleteTodo,
  updateTodo,
} from './api/api.todos';
import { FilterOption } from './enums/FilterOption';
import { Footer } from './Components/Footer';
import { TodoNotification } from './Components/TodoNotification';
import { Header } from './Components/Header';

const USER_ID = 10898;

export const App: FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filterOption, setFilterOption] = useState(FilterOption.All);
  const [error, setError] = useState<string | null>(null);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [loadingItems, setLoadingItems] = useState<number[]>([]);
  const [isLoadingAddTodo, setIsLoadingAddTodo] = useState(false);

  const isAllCompleted = todos.every(todo => todo.completed);

  const visibleTodos = useMemo(() => {
    return todos.filter((todo) => {
      switch (filterOption) {
        case FilterOption.Active:
          return !todo.completed;

        case FilterOption.Completed:
          return todo.completed;

        default:
          return FilterOption.All;
      }
    });
  }, [filterOption, todos]);

  useEffect(() => {
    getTodos(USER_ID)
      .then((todosFromServer) => {
        setError(null);
        setTodos(todosFromServer);
      })
      .catch(() => {
        setError('Unable to upload todos');
      });
  }, []);

  useEffect(() => {
    let errorTimer: number;

    if (error) {
      errorTimer = window.setTimeout(() => {
        setError(null);
      }, 3000);
    }

    return () => {
      clearTimeout(errorTimer);
    };
  }, [error]);

  const addTodo = useCallback(async (title: string) => {
    setIsLoadingAddTodo(true);

    const newTodo = {
      id: 0,
      completed: false,
      title,
      userId: USER_ID,
    };

    setTempTodo({ ...newTodo });

    try {
      const createdTodo = await createTodo(newTodo);

      setTodos(prevTodos => [...prevTodos, createdTodo]);
    } catch (err) {
      setError('Unable to add a todo');
    } finally {
      setTempTodo(null);
      setIsLoadingAddTodo(false);
    }
  }, []);

  const removeTodo = useCallback((todoId: number) => {
    setLoadingItems(prevItems => [...prevItems, todoId]);

    deleteTodo(todoId)
      .then(() => {
        setTodos(prevTodos => prevTodos.filter(
          todo => todo.id !== todoId,
        ));
      })
      .catch(() => {
        setError('Unable to delete a todo');
      })
      .finally(() => {
        setLoadingItems(prevItems => prevItems.filter(
          id => id !== todoId,
        ));
      });
  }, []);

  const removeCompletedTodos = useCallback(() => {
    const completedTodos = todos.filter(todo => todo.completed);

    completedTodos.forEach(todo => removeTodo(todo.id));
  }, [removeTodo, todos]);

  const editTodo = useCallback(async (
    todoId: number,
    args: UpdateTodoArgs,
  ) => {
    setLoadingItems(prevItems => [...prevItems, todoId]);

    const updatedTodo: UpdateTodoArgs = { ...args };

    try {
      const response = await updateTodo(todoId, updatedTodo);

      if (!response) {
        return;
      }

      const updatedTodoData = response;

      setTodos(prevTodos => prevTodos.map(todo => (
        todo.id === todoId
          ? { ...todo, ...updatedTodoData }
          : todo
      )));
    } catch (err) {
      setError('Unable to update a todo');
    } finally {
      setLoadingItems(prevItems => prevItems.filter(id => id !== todoId));
    }
  }, []);

  const toggleTodosCompleted = useCallback(() => {
    if (!isAllCompleted) {
      todos.forEach(todo => {
        if (!todo.completed) {
          editTodo(
            todo.id,
            { completed: !isAllCompleted },
          );
        }
      });
    }

    if (isAllCompleted) {
      todos.forEach(todo => {
        editTodo(
          todo.id,
          { completed: !isAllCompleted },
        );
      });
    }
  }, [editTodo, isAllCompleted, todos]);

  if (!USER_ID) {
    return <UserWarning />;
  }

  const showListAndFooter = todos.length > 0 || tempTodo !== null;

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          addTodo={addTodo}
          setError={setError}
          toggleTodosCompleted={toggleTodosCompleted}
          isAllCompleted={isAllCompleted}
        />

        {showListAndFooter && (
          <>
            <TodoList
              todos={visibleTodos}
              tempTodo={tempTodo}
              removeTodo={removeTodo}
              editTodo={editTodo}
              loadingItems={loadingItems}
              isLoadingAddTodo={isLoadingAddTodo}
            />

            <Footer
              todos={visibleTodos}
              filterOption={filterOption}
              setFilterOption={setFilterOption}
              removeCompleted={removeCompletedTodos}
            />
          </>
        )}
      </div>

      <TodoNotification
        error={error}
        setError={setError}
      />
    </div>
  );
};
