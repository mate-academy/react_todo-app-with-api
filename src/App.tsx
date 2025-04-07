/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import * as todoApi from './api/todos';

import { Todo, FilterBy, ErrorType } from './types/Types';

import { TodoAppHeader } from './components/TodoAppHeader';
import { TodoList } from './components/TodoList';
import { TodoAppFooter } from './components/TodoAppFooter';
import { ErrorNotification } from './components/ErrorNotification';

function filterTodo(todos: Todo[], filterBy: FilterBy): Todo[] {
  switch (filterBy) {
    case FilterBy.Active:
      return todos.filter(todo => !todo.completed);
    case FilterBy.Completed:
      return todos.filter(todo => todo.completed);
    default:
      return todos;
  }
}

export const App: React.FC = () => {
  const [errorMessage, setErrorMessage] = useState<ErrorType>(ErrorType.NONE);
  const [todos, setTodos] = useState<Todo[]>([]);
  const [processings, setProcessings] = useState<number[]>([]);
  const [filterBy, setFilterBy] = useState(FilterBy.All);
  const [tempTodoTitle, setTempTodoTitle] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  const clearError = useCallback(() => setErrorMessage(ErrorType.NONE), []);

  const addTodo = async (newTodoTitle: string): Promise<void> => {
    clearError();
    setTempTodoTitle(newTodoTitle);

    try {
      const addedTodo = await todoApi.addTodo(newTodoTitle);

      setTodos(currentTodos => [...currentTodos, addedTodo]);
    } catch (error) {
      setErrorMessage(ErrorType.TODO_ADD);
      throw error;
    } finally {
      setTempTodoTitle('');
    }
  };

  const deleteTodo = async (idToDelete: number): Promise<void> => {
    try {
      await todoApi.deleteTodo(idToDelete);
      setTodos(currentTodos =>
        currentTodos.filter(todo => todo.id !== idToDelete),
      );
    } catch (error) {
      setErrorMessage(ErrorType.TODO_DELETE);
      throw error;
    }
  };

  const deleteAllCompleted = async () => {
    if (processings.length > 0) {
      setErrorMessage(ErrorType.TODO_PROCESSED);

      return;
    }

    const idsToDelete = todos
      .filter(todo => todo.completed)
      .map(todo => todo.id);

    setProcessings(idsToDelete);

    const deletePromises = idsToDelete.map(id => deleteTodo(id));

    try {
      await Promise.allSettled(deletePromises);
    } finally {
      setProcessings([]);
    }
  };

  const updateTodoAfterResponse = async (
    promise: Promise<Todo>,
  ): Promise<void> => {
    try {
      const updatedTodo = await promise;

      setTodos(currentTodos => {
        const updatedTodos = [...currentTodos];
        const todoId = currentTodos.findIndex(
          todo => todo.id === updatedTodo.id,
        );

        updatedTodos.splice(todoId, 1, updatedTodo);

        return updatedTodos;
      });
    } catch (error) {
      setErrorMessage(ErrorType.TODO_UPDATE);
      throw error;
    }
  };

  const renameTodo = (id: number, updatedTitle: string): Promise<void> => {
    if (!updatedTitle) {
      return deleteTodo(id);
    }

    const updatePromise = todoApi.updateTodo(id, updatedTitle);

    return updateTodoAfterResponse(updatePromise);
  };

  const toggleTodo = (id: number, completed: boolean): Promise<void> => {
    const updatePromise = todoApi.toggleTodo(id, completed);

    return updateTodoAfterResponse(updatePromise);
  };

  const toggleAll = async (completeAll: boolean) => {
    if (processings.length > 0) {
      setErrorMessage(ErrorType.TODO_PROCESSED);

      return;
    }

    const todosToToggle = todos.filter(todo => todo.completed !== completeAll);

    setProcessings(todos.map(todo => todo.id));

    const togglePromises = todosToToggle.map(todo =>
      todoApi.toggleTodo(todo.id, todo.completed),
    );

    try {
      const updatedTodos = await Promise.all(togglePromises);

      setTodos(currentTodos =>
        currentTodos.map(
          todo =>
            updatedTodos.find((updated: Todo) => updated.id === todo.id) ||
            todo,
        ),
      );
    } finally {
      setProcessings([]);
    }
  };

  const filteredTodos: Todo[] = useMemo(
    () => filterTodo(todos, filterBy),
    [todos, filterBy],
  );

  useEffect(() => {
    clearError();
    setIsLoading(true);
    todoApi
      .getTodos()
      .then(setTodos)
      .catch(() => setErrorMessage(ErrorType.TODO_LOAD))
      .finally(() => setIsLoading(false));
  }, [clearError]);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <TodoAppHeader
          hasAllCompleted={todos.every(todo => todo.completed)}
          todosLength={todos.length}
          onAdd={addTodo}
          onToggleAll={toggleAll}
          onError={() => setErrorMessage(ErrorType.TITLE_EMPTY)}
        />

        {isLoading ? (
          <p>Loading...</p>
        ) : (
          todos.length > 0 && (
            <>
              <TodoList
                todos={filteredTodos}
                processings={processings}
                tempTodoTitle={tempTodoTitle}
                onTodoRename={renameTodo}
                onTodoToggle={toggleTodo}
                onTodoRemove={deleteTodo}
              />

              <TodoAppFooter
                hasSomeCompleted={todos.some(todo => todo.completed)}
                activeTodosCount={todos.filter(todo => !todo.completed).length}
                currentFilter={filterBy}
                onfilterChange={setFilterBy}
                onClearCompleted={deleteAllCompleted}
              />
            </>
          )
        )}
      </div>

      <ErrorNotification errorMessage={errorMessage} clearError={clearError} />
    </div>
  );
};
