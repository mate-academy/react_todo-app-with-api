import React, { useEffect, useState, useRef, useCallback } from 'react';
import { UserWarning } from './UserWarning';
import { USER_ID, getTodos, addTodo, deleteTodo, patchTodo } from './api/todos';
import { TodoList } from './components/TodoList';
import { Todo } from './types/Todo';
import { Error } from './types/Error';
import { Filter } from './types/Filter';
import { getFilteredTodos } from './FilterTodos';
import { TodoHeader } from './components/TodoHeader';
import { TodoFooter } from './components/TodoFooter';
import { ErrorNotification } from './components/ErrorNotification';
import { TodoItem } from './components/TodoItem';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [currentError, setCurrentError] = useState<Error | null>(null);
  const [currentFilter, setCurrentFilter] = useState<Filter>(Filter.All);
  const [newTodoTitle, setNewTodoTitle] = useState<string>('');
  const [isNewTodoLoading, setIsNewTodoLoading] = useState<boolean>(false);
  const [tempTodo, setTempTodo] = useState<null | Todo>(null);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const [todosIdBeingEdited, setTodosIdBeingEdited] = useState<number[]>([]);
  const [todoBeingUpdated, setTodoBeingUpdated] = useState<number | null>(null);

  const hasCompletedTodos = todos.some((todo: Todo) => todo.completed);

  const areAllTodosCompleted = todos.every((todo: Todo) => todo.completed);

  const activeTodosAmount = todos.filter(
    (todo: Todo) => !todo.completed,
  ).length;

  const todoInput = useRef<HTMLInputElement>(null);

  const handleSetCurrentError = (error: Error | null) => {
    setCurrentError(error);
  };

  const removeTodoFromEditingList = useCallback(
    (todo: Todo) => {
      const filteredIds = todosIdBeingEdited.filter(
        (currentTodoId: number) => currentTodoId !== todo.id,
      );

      setTodosIdBeingEdited(filteredIds);
    },
    [todosIdBeingEdited],
  );

  const addTodoToEditingList = useCallback((todo: Todo) => {
    setTodosIdBeingEdited(
      (currentTodosId: number[]) => [...currentTodosId, todo.id] as number[],
    );
  }, []);

  useEffect(() => {
    setCurrentError(null);

    getTodos()
      .then(setTodos)
      .catch(() => {
        handleSetCurrentError(Error.CannotLoad);
        setTimeout(() => handleSetCurrentError(null), 3000);
      });
  }, []);

  useEffect(() => {
    if (currentError) {
      setTimeout(() => setCurrentError(null), 3000);
    }
  }, [todos, currentError]);

  useEffect(() => {
    if (todoBeingUpdated === null) {
      todoInput.current?.focus();
    }
  }, [todos, currentError, todoBeingUpdated]);

  const deleteTodoById = useCallback(
    (id: number) => {
      if (isDeleting) {
        return;
      }

      setIsDeleting(false);

      return deleteTodo(id)
        .then(() =>
          setTodos((currentTodos: Todo[]) =>
            currentTodos.filter((todo: Todo) => todo.id !== id),
          ),
        )
        .catch(() => {
          handleSetCurrentError(Error.CannotDelete);
        })
        .finally(() => {
          setIsDeleting(false);
        });
    },
    [isDeleting],
  );

  const createTodo = useCallback(() => {
    const todoTitle = newTodoTitle?.trim();

    if (!todoTitle.length) {
      handleSetCurrentError(Error.EmptyTitle);
      setTimeout(() => handleSetCurrentError(null), 1000);

      return;
    }

    setTempTodo({
      id: 0,
      userId: USER_ID,
      title: newTodoTitle,
      completed: false,
    });

    setIsNewTodoLoading(true);

    addTodo(todoTitle)
      .then(newTodo => {
        setTodos(
          (currentTodos: Todo[]) => [...currentTodos, newTodo] as Todo[],
        );

        setNewTodoTitle('');
      })
      .catch(() => setCurrentError(Error.CannotAdd))
      .finally(() => {
        setTempTodo(null);
        setIsNewTodoLoading(false);
      });
  }, [newTodoTitle]);

  const updateTodoCompletionById = useCallback(
    (todo: Todo, newIsCompleted: boolean) => {
      addTodoToEditingList(todo);

      patchTodo(todo.id, todo.title, newIsCompleted)
        .then(() => {
          setTodos((currentTodos: Todo[]) =>
            currentTodos.map((currentTodo: Todo) => {
              if (currentTodo.id === todo.id) {
                return {
                  ...currentTodo,
                  completed: newIsCompleted,
                };
              }

              return currentTodo;
            }),
          );
        })
        .catch(() => setCurrentError(Error.CannotUpdate))
        .finally(() => {
          removeTodoFromEditingList(todo);
        });
    },
    [addTodoToEditingList, removeTodoFromEditingList],
  );

  const updateTodoTitle = useCallback(
    (todo: Todo, newTitle: string) => {
      setTodoBeingUpdated(todo.id);

      const trimmedTitle = newTitle.trim();

      if (trimmedTitle === todo.title) {
        return;
      }

      if (!trimmedTitle.length) {
        deleteTodoById(todo.id);

        return;
      }

      addTodoToEditingList(todo);

      patchTodo(todo.id, trimmedTitle, todo.completed)
        .then(() => {
          setTodos((currentTodos: Todo[]) =>
            currentTodos.map((currentTodo: Todo) => {
              if (currentTodo.id === todo.id) {
                return {
                  ...currentTodo,
                  title: trimmedTitle,
                };
              }

              return currentTodo;
            }),
          );

          setTodoBeingUpdated(null);
        })
        .catch(() => setCurrentError(Error.CannotUpdate))
        .finally(() => {
          removeTodoFromEditingList(todo);
        });
    },
    [addTodoToEditingList, deleteTodoById, removeTodoFromEditingList],
  );

  const updateAllTodosCompletion = useCallback(() => {
    if (areAllTodosCompleted) {
      for (const todo of todos) {
        updateTodoCompletionById(todo, false);
      }
    } else {
      for (const todo of todos) {
        if (!todo.completed) {
          updateTodoCompletionById(todo, true);
        }
      }
    }
  }, [areAllTodosCompleted, todos, updateTodoCompletionById]);

  const clearCompletedTodos = useCallback(() => {
    const completedTodos = todos.filter((todo: Todo) => todo.completed);

    for (const todo of completedTodos) {
      deleteTodoById(todo.id);
    }
  }, [deleteTodoById, todos]);

  const handleFilterChange = useCallback((filter: Filter) => {
    return () => setCurrentFilter(filter);
  }, []);

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <TodoHeader
          handleTitleChange={setNewTodoTitle}
          newTodoTitle={newTodoTitle}
          createTodo={createTodo}
          todoInput={todoInput}
          isNewTodoLoading={isNewTodoLoading}
          handleToggleAll={updateAllTodosCompletion}
          isToggleAllActive={areAllTodosCompleted}
          hasAnyTodos={!!todos.length}
        />

        {todos.length > 0 && (
          <TodoList
            todos={getFilteredTodos(todos, currentFilter)}
            handleDeleteTodo={isDeleting ? () => {} : deleteTodoById}
            handleChangeCompletion={updateTodoCompletionById}
            todosIdBeingEdited={todosIdBeingEdited}
            updateTodoTitle={updateTodoTitle}
            todoBeingUpdated={todoBeingUpdated}
          />
        )}

        {tempTodo && (
          <TodoItem
            todo={tempTodo}
            handleChangeCompletion={updateTodoCompletionById}
            handleDeleteTodo={deleteTodoById}
            isTemp={true}
            updateTodoTitle={updateTodoTitle}
            todoBeingUpdated={todoBeingUpdated}
          />
        )}

        {!!todos?.length && (
          <TodoFooter
            activeTodosAmount={activeTodosAmount}
            hasCompletedTodos={hasCompletedTodos}
            currentFilter={currentFilter}
            handleFilterChange={handleFilterChange}
            handleClearCompleted={clearCompletedTodos}
          />
        )}
      </div>
      <ErrorNotification
        currentError={currentError}
        setCurrentError={handleSetCurrentError}
      />
    </div>
  );
};
