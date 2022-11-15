import React, {
  useContext,
  useEffect,
  useRef,
  useState,
  useCallback,
  useMemo,
} from 'react';
import {
  addTodo,
  deleteTodo,
  updateTodo,
  getTodos,
} from './api/todos';
import { AuthContext } from './components/Auth/AuthContext';
import { ErrorMessage } from './components/ErrorMessage';
import { FilterForTodos } from './components/FilterForTodos';
import { NewTodo } from './components/NewTodo';
import { TodosList } from './components/TodosList';
import { Todo } from './types/Todo';
import { TodoStatus } from './types/TodoStatus';

const emptyTodo: Todo = {
  id: 0,
  title: 'adding ...',
  userId: 0,
  completed: false,
};

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filterBy, setFilterBy] = useState<TodoStatus>(TodoStatus.ALL);
  const [visibleTodos, setVisibleTodos] = useState<Todo[]>([]);
  const [isError, setIsError] = useState(false);
  const [errorText, setErrorText] = useState('');
  const [tempTodo, setTempTodo] = useState<Todo>(emptyTodo);
  const [isTodoAdding, setIsTodoAdding] = useState(false);
  const [loadingTodosIds, setLoadingTodosIds] = useState<number[]>([0]);

  const user = useContext(AuthContext);
  const newTodoField = useRef<HTMLInputElement>(null);

  const loadTodos = useCallback(async () => {
    try {
      if (user) {
        const responseTodos = await getTodos(user.id);

        setTodos(responseTodos);
      }
    } catch (error) {
      setIsError(true);
      setErrorText('Unable to load todos');
    }
  }, []);

  useEffect(() => {
    if (newTodoField.current) {
      newTodoField.current.focus();
    }

    loadTodos();
  }, []);

  useEffect(() => {
    if (isError) {
      setTimeout(() => {
        setIsError(false);
      }, 3000);
    }
  }, [isError]);

  const loadTodo = useCallback(async (todoTitle: string) => {
    try {
      if (user) {
        setIsTodoAdding(true);

        setTempTodo(current => ({
          ...current,
          userId: user.id,
        }));

        const newTodo = {
          title: todoTitle,
          userId: user.id,
          completed: false,
        };

        await addTodo(newTodo);

        await loadTodos();
      }
    } catch (error) {
      setIsError(true);
      setErrorText('Unable to add a todo');
    } finally {
      setIsTodoAdding(false);
    }
  }, []);

  const removeTodo = useCallback(async (todoId: number) => {
    try {
      setLoadingTodosIds(current => [...current, todoId]);

      await deleteTodo(todoId);

      await loadTodos();

      setLoadingTodosIds(current => current.filter(id => id !== todoId));
    } catch (error) {
      setIsError(true);
      setErrorText('Unable to delete a todo');
    }
  }, []);

  const completedTodos = useMemo(
    () => (todos.filter(todo => todo.completed)), [todos],
  );

  const removeCompletedTodos = useCallback(() => {
    if (completedTodos.length) {
      completedTodos.forEach(todo => removeTodo(todo.id));
    }
  }, [completedTodos]);

  const editTodo = useCallback(async (
    todoId: number, fieldToChange: object,
  ) => {
    try {
      if (user) {
        setLoadingTodosIds(current => [...current, todoId]);

        await updateTodo(todoId, fieldToChange);

        await loadTodos();

        setLoadingTodosIds(current => current.filter(id => id !== todoId));
      }
    } catch (error) {
      setIsError(true);
      setErrorText('Unable to update a todo');
    }
  }, []);

  const toggleAllHadler = useCallback((isAllActive: boolean) => {
    if (isAllActive) {
      todos.map(todo => editTodo(todo.id, { completed: !todo.completed }));
    } else {
      todos.map(todo => {
        if (!todo.completed) {
          return editTodo(todo.id, { completed: !todo.completed });
        }

        return todo;
      });
    }
  }, [todos]);

  const filterTodos = useCallback((todosFromServer: Todo[]) => {
    return todosFromServer.filter(todo => {
      switch (filterBy) {
        case TodoStatus.ACTIVE:
          return !todo.completed;

        case TodoStatus.COMPLETED:
          return todo.completed;

        default:
          return todosFromServer;
      }
    });
  }, [filterBy]);

  useEffect(() => {
    const filteredTodos = filterTodos(todos);

    setVisibleTodos(filteredTodos);
  }, [todos, filterBy]);

  const isAllTodoActive = useMemo(() => {
    return todos.every(todo => todo.completed);
  }, [todos]);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <NewTodo
          addNewTodo={loadTodo}
          newTodoField={newTodoField}
          isTodoAdding={isTodoAdding}
          isAllTodoActive={isAllTodoActive}
          toggleAllHadler={toggleAllHadler}
        />

        {todos.length > 0 && (
          <>
            <TodosList
              removeTodo={removeTodo}
              todos={visibleTodos}
              isTodoAdding={isTodoAdding}
              tempTodo={tempTodo}
              editTodo={editTodo}
              loadingTodosIds={loadingTodosIds}
            />

            <FilterForTodos
              filterBy={filterBy}
              setFilterBy={setFilterBy}
              todos={todos}
              removeCompletedTodos={removeCompletedTodos}
            />
          </>
        )}

      </div>

      {isError && (
        <ErrorMessage
          isError={isError}
          errorText={errorText}
          onClose={() => setIsError(false)}
        />
      )}
    </div>
  );
};
