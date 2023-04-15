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
  const [loadingTodosIds, setLoadingTodosIds] = useState<number[]>([]);
  const [isInputDisabled, setIsInputDisabled] = useState<boolean>(false);
  const [error, setError] = useState<Errors>(Errors.NONE);

  const loadTodos = async () => {
    try {
      const loadedTodos = await TodoService.getByUserId(USER_ID);

      setTodos(loadedTodos);
    } catch (err) {
      setError(Errors.LOAD);
    }
  };

  useEffect(() => {
    loadTodos();
  }, []);

  const visibleTodos = useMemo(() => {
    return filterTodos(todos, todoStatus);
  }, [todos, todoStatus]);

  const numberOfRemainingTodos = useMemo(() => {
    return filterTodos(todos, TodoStatus.ACTIVE).length;
  }, [todos]);

  const addTodo = useCallback(async (todoData: Omit<Todo, 'id'>) => {
    setIsInputDisabled(true);
    const temporaryTodo = {
      id: 0,
      ...todoData,
    };

    try {
      setTempTodo(temporaryTodo);
      setLoadingTodosIds(currIds => [...currIds, temporaryTodo.id]);
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
    setLoadingTodosIds(currIds => [...currIds, ...todoIds]);

    try {
      await Promise.all(todoIds.map((todoId) => TodoService.delete(todoId)));

      setTodos(currTodos => currTodos.filter(
        (todo) => !todoIds.includes(todo.id),
      ));
    } catch (err) {
      setError(Errors.DELETE);
    } finally {
      setLoadingTodosIds([]);
    }
  }, []);

  const updateTodoData = useCallback(async (
    todoId: number,
    updatedTodo: Partial<Todo>,
  ) => {
    setLoadingTodosIds((currIds) => [...currIds, todoId]);

    try {
      await TodoService.update(todoId, updatedTodo);
      setTodos(currTodos => currTodos.map(todo => (
        todo.id === todoId
          ? { ...todo, ...updatedTodo }
          : todo)));
    } catch (err) {
      setError(Errors.UPDATE);
    } finally {
      setLoadingTodosIds(currIds => currIds.filter(id => id !== todoId));
    }
  }, []);

  const allCompleted = numberOfRemainingTodos === 0;

  const handleToggleAll = useCallback(async () => {
    if (allCompleted) {
      await Promise.all(
        todos.map(todo => TodoService
          .update(todo.id, { completed: false })),
      );

      setTodos(prevTodos => prevTodos
        .map(todo => ({ ...todo, completed: false })));
    } else {
      await Promise.all(
        todos.map(todo => {
          if (!todo.completed) {
            return TodoService
              .update(todo.id, { completed: true });
          }

          return todo;
        }),
      );

      setTodos(prevTodos => prevTodos
        .map(todo => ({ ...todo, completed: true })));
    }
  }, [todos, setTodos]);

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
          onError={setError}
        />

        <TodoList
          todos={visibleTodos}
          tempTodo={tempTodo}
          loadingTodosIds={loadingTodosIds}
          onTodoDelete={removeTodo}
          onTodoUpdate={updateTodoData}
        />

        {todos.length > 0 && (
          <TodoFilter
            todos={todos}
            todoStatus={todoStatus}
            setTodoStatus={setTodoStatus}
            numberOfRemainingTodos={numberOfRemainingTodos}
            onTodoDelete={removeTodo}
          />
        )}
      </div>

      <NotificationError
        error={error}
        onClose={setError}
      />
    </div>
  );
};
