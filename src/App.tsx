import { FC, useCallback, useEffect, useMemo, useState } from 'react';
import {
  getTodos,
  addTodo,
  deleteTodo,
  USER_ID,
  toggleTodo,
  updateTodoTitle,
} from './api/todos';
import { Todo } from './types/Todo';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { ErrorNotification } from './components/ErrorNotification';
import { FilterStates, ErrorMessages } from './types/enums';
import { TodoItem } from './components/TodoItem';

export const App: FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [error, setError] = useState<ErrorMessages>(ErrorMessages.DEFAULT);
  const [filter, setFilter] = useState(FilterStates.ALL);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [title, setTitle] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [isEditingId, setIsEditingId] = useState<number | null>(null);

  const trimmedTitle = title.trim();

  const fetchTodos = async () => {
    try {
      const data = await getTodos();

      setTodos(data);
    } catch (err) {
      setError(ErrorMessages.LOAD_TODOS);
      const timer = setTimeout(() => setError(ErrorMessages.DEFAULT), 3000);

      return () => clearTimeout(timer);
    }
  };

  const handleAddTodo = useCallback(async (): Promise<void> => {
    if (trimmedTitle === '') {
      setError(ErrorMessages.NAMING_TODOS);
    }

    setIsAdding(true);

    try {
      const newTempTodo: Todo = {
        id: 0,
        userId: USER_ID,
        title,
        completed: false,
      };

      setTempTodo(newTempTodo);

      const newTodo = await addTodo(trimmedTitle);

      setTodos(prevTodos => [...prevTodos, newTodo]);
      setTempTodo(null);
      setTitle('');
    } catch {
      setError(ErrorMessages.ADDING_TODOS);
      setTempTodo(null);
    } finally {
      setIsAdding(false);
      setTimeout(() => {
        const input =
          document.querySelector<HTMLInputElement>('.todoapp__new-todo');

        input?.focus();
      }, 100);
    }
  }, [title]);

  const handleDeleteTodo = useCallback(
    async (todoId: number): Promise<void> => {
      try {
        await deleteTodo(todoId);
        setTodos(prevTodos => prevTodos.filter(todo => todo.id !== todoId));
      } catch {
        setError(ErrorMessages.DELETING_TODOS);
      } finally {
        const input =
          document.querySelector<HTMLInputElement>('.todoapp__new-todo');

        input?.focus();
      }
    },
    [],
  );

  const handleToggleTodoStatus = useCallback(
    async (todoId: number, completed: boolean): Promise<void> => {
      try {
        await toggleTodo(todoId, completed);
        setTodos(prevTodos =>
          prevTodos.map(todo =>
            todo.id === todoId ? { ...todo, completed } : todo,
          ),
        );
      } catch {
        setError(ErrorMessages.UPDATE_TODOS);
      }
    },
    [],
  );

  const handleUpdateTodoTitle = useCallback(
    async (todoId: number, newTitle: string): Promise<void> => {
      const existingTodo = todos.find(todo => todo.id === todoId);
      const newTitleTrimmed = newTitle.trim();

      if (!existingTodo) {
        return;
      }

      if (newTitleTrimmed === existingTodo.title) {
        setIsEditingId(null);

        return;
      }

      if (newTitleTrimmed === '') {
        try {
          await deleteTodo(todoId);
          setTodos(prevTodos => prevTodos.filter(todo => todo.id !== todoId));
          setIsEditingId(null);
        } catch {
          setError(ErrorMessages.DELETING_TODOS);
        }

        return;
      }

      try {
        await updateTodoTitle(todoId, newTitle);
        setTodos(prevTodos =>
          prevTodos.map(todo =>
            todo.id === todoId ? { ...todo, title: newTitle } : todo,
          ),
        );
        setIsEditingId(null);
      } catch {
        setError(ErrorMessages.UPDATE_TODOS);
      }
    },
    [todos],
  );

  const handleDoubleClick = useCallback((todoId: number) => {
    setIsEditingId(todoId);
  }, []);

  const filteredTodos = useMemo(() => {
    return todos.filter(todo => {
      switch (filter) {
        case FilterStates.ACTIVE:
          return !todo.completed;
        case FilterStates.COMPLETED:
          return todo.completed;
        default:
          return true;
      }
    });
  }, [todos, filter]);

  const hasTodos = todos.length > 0;
  const allCompleted = todos.length > 0 && todos.every(todo => todo.completed);

  const handleToggleAllTodos = useCallback(async () => {
    const newCompletedState = !allCompleted;

    try {
      const updatePromises = todos.map(async todo => {
        if (todo.completed !== newCompletedState) {
          await toggleTodo(todo.id, newCompletedState);

          return { ...todo, completed: newCompletedState };
        }

        return todo;
      });

      const updatedTodos = await Promise.all(updatePromises);

      setTodos(updatedTodos);
    } catch {
      setError(ErrorMessages.UPDATE_TODOS);
      const timer = setTimeout(() => setError(ErrorMessages.DEFAULT), 3000);

      return () => clearTimeout(timer);
    }
  }, [todos, allCompleted]);

  const handleClearCompleted = useCallback(async (): Promise<void> => {
    const completedTodos = todos.filter(todo => todo.completed);

    try {
      const deletionResults = await Promise.allSettled(
        completedTodos.map(todo => handleDeleteTodo(todo.id)),
      );

      const hasErrors = deletionResults.some(
        result => result.status === 'rejected',
      );

      if (hasErrors) {
        setError(ErrorMessages.DELETING_SOME_TODOS);
      }
    } catch {
      setError(ErrorMessages.CLEAR_COMPLETED_TODOS);
    }
  }, [handleDeleteTodo, todos]);

  const handleHideError = () => {
    setError(ErrorMessages.DEFAULT);
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  useEffect(() => {
    if (error) {
      const timeout = setTimeout(() => {
        setError(ErrorMessages.DEFAULT);
      }, 3000);

      return () => clearTimeout(timeout);
    }
  }, [error, ErrorMessages]);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>
      <div className="todoapp__content">
        <Header
          allCompleted={allCompleted}
          onAddTodo={handleAddTodo}
          onToggleAllTodos={handleToggleAllTodos}
          title={title}
          setTitle={setTitle}
          todoCount={todos.length}
          isAdding={isAdding}
          setError={setError}
        />

        {hasTodos &&
          filteredTodos.map(todo => (
            <TodoItem
              key={todo.id}
              todo={todo}
              onDelete={handleDeleteTodo}
              onToggleStatus={handleToggleTodoStatus}
              onUpdateTitle={handleUpdateTodoTitle}
              setError={setError}
              isEditing={isEditingId === todo.id}
              setIsEditing={setIsEditingId}
              onDoubleClick={() => handleDoubleClick(todo.id)}
              error={error}
            />
          ))}

        {tempTodo && (
          <TodoItem
            todo={tempTodo}
            onDelete={handleDeleteTodo}
            onToggleStatus={handleToggleTodoStatus}
            onUpdateTitle={handleUpdateTodoTitle}
            setError={setError}
            isAdding={isAdding}
            error={error}
          />
        )}

        {hasTodos && (
          <Footer
            todos={todos}
            filter={filter}
            setFilter={setFilter}
            onClearCompleted={handleClearCompleted}
          />
        )}
      </div>
      <ErrorNotification error={error} onHideError={handleHideError} />
    </div>
  );
};
