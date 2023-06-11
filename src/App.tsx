/* eslint-disable jsx-a11y/control-has-associated-label */
import React, {
  FormEvent, useEffect, useMemo, useState,
} from 'react';
import { UserWarning } from './UserWarning';
import { TodoList } from './TodoList';
import { client } from './utils/fetchClient';
import { Todo } from './types/todo';
import { Notification } from './Notification';
import { TodoFooter } from './TodoFooter';
import { FilterType } from './types/filters';
import { TodoForm } from './TodoForm';

const USER_ID = 10603;

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filterType, setFilterType] = useState(FilterType.All);
  const [isHidden, setIsHidden] = useState(true);
  const [query, setQuery] = useState('');
  const [error, setError] = useState('');
  const [temporaryTodo, setTemporaryTodo] = useState<Todo | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [updatingTodoIds, setUpdatingTodoIds] = useState<number[]>([]);
  const [isToggleActive, setIsToggleActive] = useState<boolean>(
    todos.every(todo => todo.completed),
  );

  useEffect(() => {
    client.get<Todo[]>(`/todos?userId=${USER_ID}`)
      .then(setTodos).catch(() => {
        setError('Unable to load todos');
      }).finally(() => setTimeout(() => {
        setError('');
      }, 3000));
  }, []);

  const visibleTodos = useMemo(() => {
    let filteredTodos;

    switch (filterType) {
      case FilterType.Completed:
        return todos.filter(todo => todo.completed);
      case FilterType.Active:
        return todos.filter(todo => !todo.completed);
      default:
        filteredTodos = todos;
        break;
    }

    return filteredTodos;
  }, [filterType, todos]);

  const createTodo = async (event: FormEvent) => {
    event?.preventDefault();
    setIsLoading(true);
    setUpdatingTodoIds([0]);
    if (!query) {
      setError('Title can\'t be empty');
      setTimeout(() => {
        setError('');
      }, 3000);

      return;
    }

    const newTodo: Todo = {
      id: 0,
      title: query,
      userId: USER_ID,
      completed: false,
    };

    try {
      setTemporaryTodo(newTodo);

      const createdTodo = await client.post<Todo>('/todos', {
        title: query,
        completed: false,
        userId: USER_ID,
      });

      setTodos(prevTodos => [...prevTodos, createdTodo]);
    } catch {
      setError('Unable to add a todo');
      setIsHidden(false);
    } finally {
      setTimeout(() => {
        setError('');
      }, 3000);
      setTemporaryTodo(null);
      setIsHidden(true);
      setQuery('');
      setIsLoading(false);
      setUpdatingTodoIds([]);
    }
  };

  const handleTodoDelete = async (todoId: number) => {
    setIsLoading(true);
    setUpdatingTodoIds([todoId]);
    try {
      await client.delete(`/todos/${todoId}`);

      setTodos(currentTodos => currentTodos.filter(
        todo => todo.id !== todoId,
      ));
    } catch {
      setError('Unable to delete a todo');
      setIsHidden(false);
    } finally {
      setTimeout(() => {
        setError('');
      }, 3000);
      setIsHidden(true);
      setIsLoading(false);
      setUpdatingTodoIds([]);
    }
  };

  const clearCompleted = () => {
    const chosenTodos = todos.filter(todo => todo.completed);

    setUpdatingTodoIds(chosenTodos.map(todo => todo.id));

    const clearedTodos = chosenTodos.forEach(
      todo => client.delete(`/todos/${todo.id}`),
    );

    setTodos(todos.filter(todo => !chosenTodos.includes(todo)));

    setUpdatingTodoIds([]);

    return clearedTodos;
  };

  const foundCompletedTodo = useMemo(() => {
    return todos.find(todo => todo.completed);
  }, [todos, updatingTodoIds]);

  useEffect(() => {
    if (todos.find(todo => !todo.completed)) {
      setIsToggleActive(false);
    } else {
      setIsToggleActive(true);
    }
  }, [todos, updatingTodoIds]);

  const updateTodo = async (todoId: number, data: Todo) => {
    await client.patch(`/todos/${todoId}`, data);
  };

  const handleStatusChange = async (todoId: number) => {
    try {
      const chosenTodo = todos.find(todo => todo.id === todoId);

      if (chosenTodo) {
        setUpdatingTodoIds(prevIds => [...prevIds, todoId]);
        setIsLoading(true);

        const updatedTodo = { ...chosenTodo, completed: !chosenTodo.completed };

        await updateTodo(todoId, updatedTodo);

        const index = todos.indexOf(chosenTodo);

        todos[index] = updatedTodo;

        setTodos(todos);
      }
    } catch {
      setError('Unable to update a todo');
      setIsHidden(false);
      setTimeout(() => {
        setError('');
      }, 3000);
    } finally {
      setIsHidden(true);
      setIsLoading(false);
      setUpdatingTodoIds([]);
    }
  };

  const toggleAll = async () => {
    const activeTodos = todos.filter(todo => !todo.completed);

    try {
      setIsLoading(true);

      if (activeTodos.length) {
        activeTodos.forEach(todo => {
          const updatedTodo = { ...todo, completed: true };
          const index = todos.indexOf(todo);

          updateTodo(todo.id, updatedTodo);
          todos[index] = updatedTodo;
        });

        setTodos(todos);
        const activeTodoIds = activeTodos.map(todo => {
          return todo.id;
        });

        setUpdatingTodoIds(prevIds => [...prevIds, ...activeTodoIds]);
      } else {
        setIsLoading(true);

        todos.forEach(todo => {
          const updatedTodo = { ...todo, completed: false };
          const index = todos.indexOf(todo);

          updateTodo(todo.id, updatedTodo);
          todos[index] = updatedTodo;
        });

        setTodos(todos);
        const todoIds = todos.map(todo => {
          return todo.id;
        });

        setUpdatingTodoIds([...todoIds]);
      }
    } catch {
      setError('Unable to update todos');
      setIsHidden(false);
      setTimeout(() => {
        setError('');
      }, 3000);
    } finally {
      setIsHidden(true);
      setIsLoading(false);
      setUpdatingTodoIds([]);
    }
  };

  const handleTitleChange = async (todoId: number, changedTitle: string) => {
    try {
      const chosenTodo = todos.find(todo => todo.id === todoId);

      if (chosenTodo) {
        setUpdatingTodoIds(prevIds => [...prevIds, todoId]);
        setIsLoading(true);

        const updatedTodo = { ...chosenTodo, title: changedTitle };

        if (!changedTitle.length) {
          await client.delete(`/todos/${todoId}`);

          setTodos(todos.filter(todo => todo.id !== chosenTodo.id));
        } else {
          await updateTodo(todoId, updatedTodo);
          const index = todos.indexOf(chosenTodo);

          todos[index] = updatedTodo;
          setTodos(todos);
        }
      }
    } catch {
      setError('Unable to update a todo');
      setIsHidden(false);
      setTimeout(() => {
        setError('');
      }, 3000);
    } finally {
      setIsHidden(true);
      setIsLoading(false);
      setUpdatingTodoIds([]);
    }
  };

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">

          <button
            type="button"
            className={`todoapp__toggle-all ${isToggleActive ? 'active' : ''}`}
            onClick={toggleAll}
          />

          <TodoForm
            createTodo={createTodo}
            query={query}
            setQuery={setQuery}
            temporaryTodo={temporaryTodo}
          />

        </header>

        {todos.length > 0 && (
          <TodoList
            todos={visibleTodos}
            onDelete={handleTodoDelete}
            temporaryTodo={temporaryTodo}
            isLoading={isLoading}
            updatingTodoIds={updatingTodoIds}
            handleStatusChange={handleStatusChange}
            handleTitleChange={handleTitleChange}
          />
        )}

        {todos.length > 0 && (
          <TodoFooter
            todos={todos}
            filterType={filterType}
            setFilterType={setFilterType}
            foundCompletedTodo={foundCompletedTodo}
            clearCompleted={clearCompleted}
          />
        )}

      </div>

      <Notification
        isHidden={isHidden}
        setIsHidden={setIsHidden}
        error={error}
      />
    </div>
  );
};
