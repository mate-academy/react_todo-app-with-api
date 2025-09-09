/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { UserWarning } from './UserWarning';
import {
  addTodo,
  deleteTodo,
  getTodos,
  updateTodo,
  USER_ID,
} from './api/todos';
import { Todo } from './types/Todo';
import { FilterType } from './types/FilterType';
import { TodoList } from './components/TodoList';
import { TodoFooter } from './components/TodoFooter';
import { ErrorNotification } from './components/ErrorNotification';
import { TodoHeader } from './components/TodoHeader/TodoHeader';
import { TodoItem } from './components/TodoItem';
import { TodoError } from './types/TodoError';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [error, setError] = useState<TodoError | null>(null);
  const [filter, setFilter] = useState<FilterType>(FilterType.All);
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const [tempoTodo, setTempoTodo] = useState<Todo | null>(null);
  const [processingIds, setProcessingIds] = useState<number[]>([]);
  const [editingTodo, setEditingTodo] = useState<Todo | null>(null);
  const [newTitle, setNewTitle] = useState('');

  const addNewTodo = async (title: string) => {
    if (inputRef.current) {
      inputRef.current.disabled = true;
    }

    setTempoTodo({
      id: 0,
      title: title,
      completed: false,
      userId: USER_ID,
    });

    try {
      const createdTodo = await addTodo(title);

      setTodos(currentTodos => [...currentTodos, createdTodo]);
      setTempoTodo(null);

      return true;
    } catch {
      setError(TodoError.AddError);
      setTempoTodo(null);

      return false;
    } finally {
      if (inputRef.current) {
        inputRef.current.disabled = false;
      }
    }
  };

  const handleDeleteTodo = async (id: number) => {
    setProcessingIds(prev => [...prev, id]);

    try {
      await deleteTodo(id);

      setTodos(currentTodos => currentTodos.filter(todo => todo.id !== id));
    } catch {
      setError(TodoError.DeleteError);
    } finally {
      setProcessingIds([]);
      inputRef.current?.focus();
    }
  };

  const handleClearCompleted = async () => {
    const completedTodos = todos.filter(todo => todo.completed);

    setProcessingIds(completedTodos.map(todo => todo.id));

    try {
      await Promise.all(
        completedTodos.map(async todo => {
          try {
            await deleteTodo(todo.id);
            setTodos(prev => prev.filter(currTodo => todo.id !== currTodo.id));
          } catch {
            setError(TodoError.DeleteError);
          }
        }),
      );
    } finally {
      setProcessingIds([]);
      inputRef.current?.focus();
    }
  };

  const handleToggleTodo = async (todo: Todo) => {
    setProcessingIds(prev => [...prev, todo.id]);

    try {
      const toggledTodo = await updateTodo(todo.id, {
        completed: !todo.completed,
      });

      setTodos(currTodos =>
        currTodos.map(currTodo => {
          return currTodo.id === toggledTodo.id ? toggledTodo : currTodo;
        }),
      );
    } catch {
      setError(TodoError.UpdateError);
    } finally {
      setProcessingIds([]);
    }
  };

  const handleToggleAll = async () => {
    let todosToToggle = todos.filter(todo => !todo.completed);

    if (todosToToggle.length === 0) {
      setProcessingIds(todos.map(todo => todo.id));
      todosToToggle = [...todos];
    } else {
      setProcessingIds(todosToToggle.map(todo => todo.id));
    }

    try {
      await Promise.all(
        todosToToggle.map(async todo => {
          try {
            const toggledTodo = await updateTodo(todo.id, {
              completed: !todo.completed,
            });

            setTodos(prev =>
              prev.map(currTodo => {
                return currTodo.id === toggledTodo.id ? toggledTodo : currTodo;
              }),
            );
          } catch {
            setError(TodoError.UpdateError);
          }
        }),
      );
    } finally {
      setProcessingIds([]);
    }
  };

  const handleSubmit = async (todo: Todo) => {
    const normalizedTitle = newTitle.trim();

    if (todo.title === normalizedTitle) {
      return;
    }

    setProcessingIds(prev => [...prev, todo.id]);

    try {
      const editedTodo = await updateTodo(todo.id, {
        title: normalizedTitle,
      });

      setTodos(currTodos =>
        currTodos.map(currTodo =>
          currTodo.id === editedTodo.id ? editedTodo : currTodo,
        ),
      );
    } catch {
      setError(TodoError.UpdateError);

      return;
    } finally {
      setProcessingIds([]);
    }

    setEditingTodo(null);
    setNewTitle('');
  };

  const filteredTodos = useMemo(
    () =>
      todos.filter(todo => {
        switch (filter) {
          case FilterType.Active:
            return !todo.completed;
          case FilterType.Completed:
            return todo.completed;
          default:
            return true;
        }
      }),
    [todos, filter],
  );

  const loadTodos = async () => {
    inputRef.current?.focus();
    setError(null);
    setIsLoading(true);

    try {
      const fetchedTodos = await getTodos();

      setTodos(fetchedTodos);
    } catch {
      setError(TodoError.LoadError);
    } finally {
      setIsLoading(false);
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
          todos={todos}
          isLoading={isLoading}
          inputRef={inputRef}
          setError={setError}
          onAdd={addNewTodo}
          error={error}
          onToggleAll={handleToggleAll}
        />
        <TodoList
          todos={filteredTodos}
          onDelete={handleDeleteTodo}
          processingIds={processingIds}
          onToggle={handleToggleTodo}
          editingTodo={editingTodo}
          setEditingTodo={setEditingTodo}
          newTitle={newTitle}
          onTitleSubmit={handleSubmit}
          setError={setError}
          setNewTitle={setNewTitle}
        />
        {tempoTodo && (
          <TodoItem
            todo={tempoTodo}
            isTodoTemp={true}
            onDelete={handleDeleteTodo}
            processingIds={processingIds}
            onToggle={handleToggleTodo}
            editingTodo={editingTodo}
            setEditingTodo={setEditingTodo}
            onTitleSubmit={handleSubmit}
            setError={setError}
            newTitle={newTitle}
            setNewTitle={setNewTitle}
          />
        )}
        {todos.length > 0 && (
          <TodoFooter
            todos={todos}
            filter={filter}
            setFilter={setFilter}
            clearCompleted={handleClearCompleted}
          />
        )}
      </div>
      <ErrorNotification error={error} setError={setError} />
    </div>
  );
};
