import {
  FC,
  useState,
  useEffect,
  useMemo,
  useCallback,
} from 'react';
import { TodoService } from './api/todos';

import { Todo } from './types/Todo';
import { TodoStatus } from './types/TodoStatus';
import { filterTodos } from './utils/helpers';

import { AddingForm } from './components/AddingForm';
import { TodoList } from './components/TodoList';
import { TodoFilter } from './components/TodoFilter/TodoFilter';
import { NotificationError } from './components/NotificationError';
import { Errors } from './types/Errors';

const USER_ID = 6922;

export const App: FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [todoStatus, setTodoStatus] = useState<TodoStatus>(TodoStatus.ALL);
  const [loadingTodosId, setLoadingTodosId] = useState<number[]>([]);
  const [isInputDisabled, setIsInputDisabled] = useState<boolean>(false);
  const [error, setError] = useState<Errors>(Errors.NONE);

  const loadTodos = useCallback(async () => {
    try {
      const loadedTodos = await TodoService.get(USER_ID);

      setTodos(loadedTodos);
    } catch (err) {
      setError(Errors.LOAD);
    }
  }, []);

  useEffect(() => {
    loadTodos();
  }, []);

  const visibleTodos = useMemo(() => {
    return filterTodos(todos, todoStatus);
  }, [todos, todoStatus]);

  const numberOfRemainingTodos = filterTodos(todos, TodoStatus.ACTIVE).length;

  const addTodo = useCallback(async (todoData: Omit<Todo, 'id'>) => {
    setIsInputDisabled(true);
    const temporaryTodo = {
      id: 0,
      ...todoData,
    };

    try {
      setTempTodo(temporaryTodo);
      setLoadingTodosId(currId => [...currId, temporaryTodo.id]);
      const addedTodo = await TodoService.create(temporaryTodo);

      setTodos(prevTodos => [...prevTodos, addedTodo]);
    } catch (err) {
      setError(Errors.ADD);
    } finally {
      setTempTodo(null);
    }

    setIsInputDisabled(false);
  }, []);

  const removeTodo = useCallback(async (todoIds: number[]) => {
    setLoadingTodosId(currId => [...currId, ...todoIds]);

    try {
      await Promise.all(todoIds.map((todoId) => TodoService.delete(todoId)));

      setTodos(currTodos => currTodos.filter(
        (todo) => !todoIds.includes(todo.id),
      ));
    } catch (err) {
      setError(Errors.DELETE);
    } finally {
      setLoadingTodosId([]);
    }
  }, []);

  const updateTodoData = useCallback(async (
    todoId: number,
    updatedTodo: Partial<Todo>,
  ) => {
    setLoadingTodosId((currId) => [...currId, todoId]);

    try {
      await TodoService.update(todoId, updatedTodo);
      setTodos((currTodos) => currTodos.map(todo => (todo.id === todoId
        ? {
          ...todo,
          ...updatedTodo,
        }
        : todo)));
    } catch (err) {
      setError(Errors.UPDATE);
    } finally {
      setLoadingTodosId(currId => currId.filter(id => id !== todoId));
    }
  }, []);

  const allCompleted = numberOfRemainingTodos === 0;

  const handleToggleAll = useCallback(async () => {
    const notCompleted = todos.filter(({ completed }) => !completed);

    if (notCompleted.length === 0) {
      await Promise.all(
        todos.map(todo => {
          const updatedTodo = TodoService
            .update(todo.id, { completed: false });

          return updatedTodo;
        }),
      );

      setTodos(prevTodos => prevTodos
        .map(todo => ({ ...todo, completed: false })));
    } else {
      await Promise.all(
        todos.map(todo => {
          if (!todo.completed) {
            const updatedTodo = TodoService
              .update(todo.id, { completed: true });

            return updatedTodo;
          }

          return todo;
        }),
      );

      setTodos(prevTodos => prevTodos
        .map(todo => ({ ...todo, completed: true })));
    }
  }, [todos, setTodos, TodoService.update]);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <AddingForm
          isTodoListEmpty={!visibleTodos.length}
          userId={USER_ID}
          isInputDisabled={isInputDisabled}
          allCompleted={allCompleted}
          onSubmit={addTodo}
          onToggleAll={handleToggleAll}
          setError={setError}
        />

        <TodoList
          todos={visibleTodos}
          tempTodo={tempTodo}
          loadingTodosId={loadingTodosId}
          onTodoDelete={removeTodo}
          onTodoUpdate={updateTodoData}
        />

        {todos.length > 0 && (
          <TodoFilter
            todos={visibleTodos}
            todoStatus={todoStatus}
            setTodoStatus={setTodoStatus}
            numberOfRemainingTodos={numberOfRemainingTodos}
            onTodoDelete={removeTodo}
          />
        )}
      </div>

      <NotificationError
        error={error}
        setError={setError}
      />
    </div>
  );
};
