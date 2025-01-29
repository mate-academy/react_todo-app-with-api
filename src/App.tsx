import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Todo } from './types/Todo';
import { ErrorsType } from './types/Error';
import { Filter } from './types/Filter';
import {
  createTodo,
  getTodos,
  removeTodo,
  updateTodo,
  USER_ID,
} from './api/todos';
import { UserWarning } from './UserWarning';
import { getPreparedTodos } from './utils/GetPreparedTodos';
import { TodoHeader } from './components/TodoHeader';
import { TodoList } from './components/TodoList';
import { TodoFooter } from './components/TodoFooter';
import { TodoNotification } from './components/TodoNotification';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filterBy, setFilterBy] = useState(Filter.All);
  const [errorMessage, setErrorMessage] = useState<ErrorsType | null>(null);
  const [tempTodo, setTempTodo] = useState<Todo | null>();
  const [loadingIds, setLoadingIds] = useState<number[]>([]);
  const [isAddingLoading, setIsAddingLoading] = useState(false);

  const inputAddRef = useRef<HTMLInputElement>(null);

  const completedTodos = useMemo(
    () => todos.filter(todo => todo.completed),
    [todos],
  );
  const activeTodos = useMemo(
    () => todos.filter(todo => !todo.completed),
    [todos],
  );

  const isAllTodoCompleted = useMemo(() => {
    return completedTodos.length === todos.length;
  }, [completedTodos, todos]);

  const prepared = useMemo(() => {
    return getPreparedTodos(todos, filterBy);
  }, [todos, filterBy]);

  const loadTodos = async () => {
    try {
      const response = await getTodos();

      setTodos(response);
    } catch (error) {
      setErrorMessage(ErrorsType.LoadTodos);
    }
  };

  const addTodo = async (todoTitle: string): Promise<boolean> => {
    if (!todoTitle) {
      setErrorMessage(ErrorsType.EmptyTitle);

      return false;
    }

    setTempTodo({ id: 0, title: todoTitle, completed: false, userId: USER_ID });

    setIsAddingLoading(true);
    try {
      const newTodo = await createTodo({ title: todoTitle, completed: false });

      setTodos(prev => [...prev, newTodo]);

      return true;
    } catch (err) {
      setErrorMessage(ErrorsType.AddTodo);

      return false;
    } finally {
      setTempTodo(null);
      setIsAddingLoading(false);
    }
  };

  const onUpdateTodo = async (todoToUpdate: Todo): Promise<boolean> => {
    setLoadingIds(prev => [...prev, todoToUpdate.id]);

    try {
      const updatedTodo = await updateTodo(todoToUpdate);

      setTodos(prevTodoList =>
        prevTodoList.map(todo =>
          todo.id === updatedTodo.id ? updatedTodo : todo,
        ),
      );

      return true;
    } catch (err) {
      setErrorMessage(ErrorsType.UpdateTodo);

      return false;
    } finally {
      setLoadingIds(prev => prev.filter(todoId => todoId !== todoToUpdate.id));
    }
  };

  const deletTodo = async (id: number): Promise<boolean> => {
    setLoadingIds(prev => [...prev, id]);

    try {
      await removeTodo(id);

      setTodos(prev => prev.filter(todo => todo.id !== id));
      inputAddRef.current?.focus();

      return true;
    } catch (err) {
      setErrorMessage(ErrorsType.DeleteTodo);

      return false;
    } finally {
      setLoadingIds(prev => prev.filter(todoId => todoId !== id));
    }
  };

  const clearCompleted = async () => {
    completedTodos.forEach(todo => deletTodo(todo.id));
  };

  const handleToggleAllTodos = () => {
    if (activeTodos.length > 0) {
      activeTodos.forEach(todo => {
        onUpdateTodo({ ...todo, completed: true });
      });
    } else {
      todos.forEach(todo => {
        onUpdateTodo({ ...todo, completed: false });
      });
    }
  };

  useEffect(() => {
    loadTodos();
  }, []);

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <TodoHeader
          inputRef={inputAddRef}
          onAddTodo={addTodo}
          onToggleAllTodos={handleToggleAllTodos}
          isLoading={isAddingLoading}
          isAllTodoCompleted={isAllTodoCompleted}
          isTodoListNotEmpty={!!todos.length}
        />

        <TodoList
          preparedTodos={prepared}
          onRemoveTodo={deletTodo}
          loading={loadingIds}
          tempTodo={tempTodo}
          onUpdateTodo={onUpdateTodo}
        />

        {!!todos.length && (
          <TodoFooter
            filter={filterBy}
            setFilter={setFilterBy}
            todosLeft={activeTodos.length}
            completedTodos={completedTodos.length}
            onClearCompleted={clearCompleted}
          />
        )}
      </div>

      <TodoNotification
        errorMessage={errorMessage}
        onSetError={setErrorMessage}
      />
    </div>
  );
};
