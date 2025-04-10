import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  addTodo,
  deleteTodo,
  getTodos,
  updateTodo,
  USER_ID,
} from './api/todos';
import { Todo } from './types/Todo';
import { FilterBy } from './types/FilterBy';
import { Errors } from './types/Errors';
import { TodoHeader } from './components/TodoHeader';
import { TodoList } from './components/TodoList';
import { TodoFooter } from './components/TodoFooter';
import { ErrorNotification } from './components/ErrorNotification';

const filterTodos = (todos: Todo[], filterBy: FilterBy) => {
  switch (filterBy) {
    case FilterBy.Active:
      return todos.filter(todo => !todo.completed);
    case FilterBy.Completed:
      return todos.filter(todo => todo.completed);
    case FilterBy.All:
    default:
      return todos;
  }
};

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filterBy, setFilterBy] = useState(FilterBy.All);
  const [errorMessage, setErrorMessage] = useState<string>(Errors.None);
  const [newTodoTitle, setNewTodoTitle] = useState('');
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [loadedTodoIds, setLoadedTodoIds] = useState<number[]>([]);

  const shouldFocusCreationForm = useRef<boolean>(false);

  const handleError = (message: Errors) => {
    setErrorMessage(message);
    setTimeout(() => setErrorMessage(Errors.None), 3000);
  };

  const withLoading = async (
    todoId: number,
    asyncCallback: () => Promise<void>,
    errorText: Errors,
    options: { focusAfter?: boolean } = {},
  ) => {
    setLoadedTodoIds(current => [...current, todoId]);

    try {
      await asyncCallback();
    } catch {
      handleError(errorText);
      throw new Error(errorText);
    } finally {
      setLoadedTodoIds(current => current.filter(id => id !== todoId));

      if (options.focusAfter) {
        shouldFocusCreationForm.current = true;
      }
    }
  };

  const updateTodoFields = async (
    todoId: number,
    fieldsToUpdate: Partial<Pick<Todo, 'title' | 'completed'>>,
  ) => {
    await updateTodo(todoId, fieldsToUpdate);

    setTodos(current =>
      current.map(todo =>
        todo.id === todoId ? { ...todo, ...fieldsToUpdate } : todo,
      ),
    );
  };

  const removeTodoById = async (todoId: number) => {
    await deleteTodo(todoId);

    setTodos(current => current.filter(todo => todo.id !== todoId));
  };

  const handleCreateTodo = async (title: string) => {
    if (!title.trim()) {
      handleError(Errors.EmptyTitle);

      return;
    }

    setIsLoading(true);

    const newTodo: Todo = {
      id: 0,
      userId: USER_ID,
      title: title.trim(),
      completed: false,
    };

    setTempTodo(newTodo);

    try {
      const todo = await addTodo(newTodo);

      setTodos(current => [...current, todo]);
      setNewTodoTitle('');
    } catch {
      handleError(Errors.Add);
    } finally {
      setTempTodo(null);
      setIsLoading(false);
      shouldFocusCreationForm.current = true;
    }
  };

  const handleDeleteTodo = (todoId: number) => {
    return withLoading(todoId, () => removeTodoById(todoId), Errors.Delete, {
      focusAfter: true,
    }).finally(() => {
      shouldFocusCreationForm.current = true;
    });
  };

  const handleToggleTodo = (todoId: number, completed: boolean) => {
    return withLoading(
      todoId,
      () => updateTodoFields(todoId, { completed }),
      Errors.Update,
    );
  };

  const handleUpdateTodoTitle = async (todoId: number, title: string) => {
    if (title.trim().length === 0) {
      try {
        await handleDeleteTodo(todoId);
      } catch (error) {}

      return;
    }

    return withLoading(
      todoId,
      () => updateTodoFields(todoId, { title: title.trim() }),
      Errors.Update,
    );
  };

  const handleClearCompleted = async () => {
    const completedTodos = todos.filter(todo => todo.completed);

    const results = await Promise.allSettled(
      completedTodos.map(todo => deleteTodo(todo.id)),
    );

    const failedIds = completedTodos
      .filter((_, i) => results[i].status === 'rejected')
      .map(todo => todo.id);

    setTodos(current =>
      current.filter(todo => !todo.completed || failedIds.includes(todo.id)),
    );

    if (failedIds.length > 0) {
      handleError(Errors.Delete);
    }

    shouldFocusCreationForm.current = true;
  };

  const handleToggleAll = async () => {
    const allCompleted = todos.every(todo => todo.completed);
    const todosToUpdate = todos.filter(todo => todo.completed === allCompleted);

    try {
      await Promise.all(
        todosToUpdate.map(todo =>
          updateTodo(todo.id, { completed: !allCompleted }),
        ),
      );

      setTodos(current =>
        current.map(todo => ({
          ...todo,
          completed: !allCompleted,
        })),
      );
    } catch {
      handleError(Errors.Update);
    }
  };

  const filteredTodos = useMemo(
    () => filterTodos(todos, filterBy),
    [todos, filterBy],
  );

  const activeTodosCount = todos.filter(todo => !todo.completed).length;

  useEffect(() => {
    getTodos()
      .then(setTodos)
      .catch(() => {
        handleError(Errors.Load);
      });
  }, []);

  useEffect(() => {
    shouldFocusCreationForm.current = false;
  }, []);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <TodoHeader
          todos={todos}
          newTodoTitle={newTodoTitle}
          setNewTodoTitle={setNewTodoTitle}
          createTodo={handleCreateTodo}
          isLoading={isLoading}
          handleToggleAll={handleToggleAll}
          shouldFocusCreationForm={shouldFocusCreationForm}
          errorMessage={errorMessage}
        />

        <TodoList
          todoFilter={filteredTodos}
          tempTodo={tempTodo}
          handleToggle={handleToggleTodo}
          handleDeleteTodo={handleDeleteTodo}
          handleUpdateTodoTitle={handleUpdateTodoTitle}
          loadedTodoIds={loadedTodoIds}
        />

        {todos.length > 0 && (
          <TodoFooter
            todos={todos}
            statusFilterTodo={filterBy}
            setStatusFilterTodo={setFilterBy}
            handleClearTodo={handleClearCompleted}
            activeTodosCount={activeTodosCount}
          />
        )}
      </div>

      <ErrorNotification
        errorMessage={errorMessage}
        onClearError={() => setErrorMessage(Errors.None)}
      />
    </div>
  );
};
