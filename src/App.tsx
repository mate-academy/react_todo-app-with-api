import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import {
  createTodo,
  deleteTodo,
  getTodos,
  updateTodo,
} from './api/todos';
import { AuthContext } from './components/Auth/AuthContext';
import { ErrorNotification }
  from './components/ErrorNotification/ErrorNotification';
import { FilterTodo } from './components/FilterTodos/FilterTodos';
import { NewTodo } from './components/NewTodo/NewTodo';
import { TodoList } from './components/TodoList/TodoList';
import { Errors } from './types/Errors';
import { GroupBy } from './types/GroupBy';
import { Todo } from './types/Todo';

export const App: React.FC = () => {
  const user = useContext(AuthContext);
  const [todos, setTodos] = useState<Todo[]>([]);
  const [visibleTodos, setVisibleTodos] = useState(todos);
  const [error, setError] = useState<Errors>(Errors.NONE);
  const [newTodoTitle, setNewTodoTitle] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  const loadTodos = async () => {
    try {
      setTodos(await getTodos(user?.id || 0));
    } catch {
      setError(Errors.URL);
    }
  };

  useEffect(() => {
    loadTodos();
  }, []);

  const filterTodos = useCallback((groupBy: string) => {
    setVisibleTodos(
      todos.filter(todo => {
        switch (groupBy) {
          case GroupBy.Active:
            return !todo.completed;
          case GroupBy.Completed:
            return todo.completed;

          default:
            return true;
        }
      }),
    );
  }, [todos]);

  const completedTodos = useMemo(() => (
    todos.filter(({ completed }) => completed)
  ), [todos]);

  const leftTodos = useMemo(() => (
    todos.filter(({ completed }) => !completed)
  ), [todos]);

  const addTodo = useCallback(async (todoTitle: string) => {
    setTodos((prevTodos) => (
      [...prevTodos, {
        userId: -1,
        id: 0,
        title: newTodoTitle,
        completed: false,
      }]
    ));
    setIsAdding(true);

    try {
      const newTodo = await createTodo(user?.id || 0, todoTitle);

      setTodos((prevTodos) => (
        [...prevTodos, newTodo]
      ));
    } catch {
      setError(Errors.ADD);
    } finally {
      setTodos((prevTodos) => (
        prevTodos.filter(todo => todo.id !== 0)
      ));
      setIsAdding(false);
    }
  }, [user, newTodoTitle]);

  const removeTodo = useCallback(async (todoId: number) => {
    try {
      await deleteTodo(todoId);

      setTodos(prevTodos => prevTodos.filter(({ id }) => id !== todoId));
    } catch {
      setError(Errors.DELETE);
      throw new Error('Unable to delete');
    } finally {
      setIsDeleting(false);
    }
  }, [todos]);

  const removeCompletedTodos = useCallback(async () => {
    setIsDeleting(true);
    try {
      completedTodos.forEach(({ id }) => removeTodo(id));
    } catch {
      setError(Errors.DELETE);
    }
  }, [todos]);

  const patchTodo = useCallback(async (todo: Todo, newTitle?: string) => {
    const { id: todoId, title, completed } = todo;
    const currentTodo = todo;

    try {
      if (newTitle) {
        await updateTodo(todoId, newTitle, completed);
        currentTodo.title = newTitle;
      } else {
        await updateTodo(todoId, title, !completed);
        currentTodo.completed = !currentTodo.completed;
      }

      setTodos((prevTodo) => [...prevTodo]);
    } catch {
      setError(Errors.UPDATE);
    } finally {
      setIsUpdating(false);
    }
  }, [todos]);

  const toggleAllTodos = useCallback(async () => {
    setIsUpdating(true);

    try {
      if (leftTodos.length > 0) {
        leftTodos.forEach(todo => patchTodo(todo));
      } else {
        completedTodos.forEach(todo => patchTodo(todo));
      }
    } catch {
      setError(Errors.UPDATE);
    }
  }, [todos]);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <NewTodo
          todos={todos}
          isAdding={isAdding}
          newTodoTitle={newTodoTitle}
          setNewTodoTitle={setNewTodoTitle}
          leftTodosLength={leftTodos.length}
          setError={setError}
          onAdd={addTodo}
          toggleAllTodos={toggleAllTodos}
        />

        {(todos.length > 0 || isAdding) && (
          <>
            <TodoList
              todos={visibleTodos}
              removeTodo={removeTodo}
              patchTodo={patchTodo}
              isAdding={isAdding}
              isDeleting={isDeleting}
              isUpdating={isUpdating}
              leftTodosLength={leftTodos.length}
            />
            <FilterTodo
              filterTodos={filterTodos}
              todos={todos}
              completedTodosLength={completedTodos.length}
              leftTodosLength={leftTodos.length}
              removeCompletedTodos={removeCompletedTodos}
            />
          </>
        )}
      </div>

      {error !== Errors.NONE
        && <ErrorNotification error={error} setError={setError} />}
    </div>
  );
};
