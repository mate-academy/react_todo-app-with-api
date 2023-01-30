import React, {
  useContext, useEffect, useState, useMemo, useCallback,
} from 'react';
import { AuthContext } from './components/Auth/AuthContext';
import { TodoList } from './components/TodoList/TodoList';
import { Filter } from './components/Filter/Filter';
import { NewTodoField } from './components/NewTodoField/NewTodoField';
import { Todo } from './types/Todo';
import { Filters } from './types/Filters';
import { getTodos, updateTodo } from './api/todos';
import { ErrorNotification } from
  './components/ErrorNotification/ErrorNotification';
import { useAddingTodo } from './controllers/useAddingTodo';
import { useDeletingTodos } from './controllers/useDeletingTodos';
import { useError } from './controllers/useError';

export const App: React.FC = () => {
  const user = useContext(AuthContext);

  const [todos, setTodos] = useState<Todo[]>([]);
  const [selectedStatus, setSelectedStatus] = useState(Filters.All);
  const [loadingTodosIds, setLoadingTodosIds] = useState<number[]>([]);

  const [errorMessage, showError, hideError] = useError();

  useEffect(() => {
    if (user) {
      getTodos(user.id)
        .then(setTodos)
        .catch(() => showError('Cannot load todos'));
    }
  }, [user]);

  const activeTodosNumber = useMemo(() => (
    todos.filter(todo => !todo.completed).length
  ), [todos]);

  const visibleTodos = useMemo(() => {
    return todos.filter((todo) => {
      switch (selectedStatus) {
        case Filters.Active:
          return !todo.completed;

        case Filters.Completed:
          return todo.completed;

        case Filters.All:
        default:
          return todo;
      }
    });
  }, [todos, selectedStatus]);

  const completedTodosIds = useMemo(() => (
    todos
      .filter(todo => todo.completed)
      .map(todo => todo.id)
  ), [todos]);

  const isAllCompletedTodos = todos.length === completedTodosIds.length;

  const editTodo = useCallback(async (
    todoId: number,
    fieldsToUpdate: Partial<Pick<Todo, 'title' | 'completed'>>,
  ) => {
    setLoadingTodosIds((prevIds) => ([...prevIds, todoId]));

    try {
      await updateTodo(todoId, fieldsToUpdate);

      setTodos((prevTodos) => (prevTodos.map(
        todo => {
          const isUpdated = todo.id === todoId;

          return isUpdated
            ? Object.assign(todo, fieldsToUpdate)
            : todo;
        },
      )));
    } catch {
      showError('Unable to update a todo');
    } finally {
      setLoadingTodosIds((prevIds) => (prevIds.filter(
        todoIdToEdit => todoIdToEdit !== todoId,
      )));
    }
  }, []);

  const handleToggleAll = useCallback(() => {
    const desiredStatus = !isAllCompletedTodos;

    todos.forEach(async (todo) => {
      if (todo.completed !== desiredStatus) {
        await editTodo(todo.id, { completed: desiredStatus });
      }
    });
  }, [isAllCompletedTodos, todos]);

  const [isAddingTodo, temporaryNewTodo, addTodo] = useAddingTodo(
    {
      setTodos, showError,
    },
  );

  const [deleteTodo, removeCompleted] = useDeletingTodos(
    {
      setLoadingTodosIds, setTodos, showError, completedTodosIds,
    },
  );

  const shouldRenederTodos = temporaryNewTodo || todos.length > 0;

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <NewTodoField
          onAddTodo={addTodo}
          showError={showError}
          isAddingTodo={isAddingTodo}
          isAllCompletedTodos={isAllCompletedTodos}
          handleToggleAll={handleToggleAll}
        />

        {shouldRenederTodos && (
          <>
            <TodoList
              todos={visibleTodos}
              temporaryNewTodo={temporaryNewTodo}
              showError={showError}
              onDeleteTodo={deleteTodo}
              loadingTodosIds={loadingTodosIds}
              onUpdateTodo={editTodo}
            />

            <Filter
              activeTodosNumber={activeTodosNumber}
              removeCompleted={removeCompleted}
              selectedStatus={selectedStatus}
              setSelectedStatus={setSelectedStatus}
              completedTodosIds={completedTodosIds}
            />
          </>
        )}
      </div>

      {errorMessage && (
        <ErrorNotification
          message={errorMessage}
          hideMessage={hideError}
        />
      )}
    </div>
  );
};
