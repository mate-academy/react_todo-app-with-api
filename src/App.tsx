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

  const completedTodos = todos.filter(todo => todo.completed);

  const [isAddingTodo, temporaryNewTodo, addTodo] = useAddingTodo(
    {
      setTodos, showError,
    },
  );

  const [deleteTodo, removeCompleted] = useDeletingTodos(
    {
      setLoadingTodosIds, setTodos, showError, completedTodos,
    },
  );

  const shouldRenederTodos = temporaryNewTodo || todos.length > 0;

  const editTodo = useCallback(
    (todoId: number, fieldsToUpdate: Todo) => {
      setLoadingTodosIds((prevIds) => ([...prevIds, todoId]));

      updateTodo(todoId, fieldsToUpdate)
        .then(() => setTodos((prevTodos) => (prevTodos.map(
          todo => {
            const isUpdated = todo.id === todoId;

            return isUpdated
              ? fieldsToUpdate
              : todo;
          },
        ))))
        .catch(() => showError('Unable to update a todo'))
        .finally(() => {
          setLoadingTodosIds((prevIds) => (prevIds.filter(
            todoIdToEdit => todoIdToEdit !== todoId,
          )));
        });
    }, [],
  );

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <NewTodoField
          onAddTodo={addTodo}
          showError={showError}
          isAddingTodo={isAddingTodo}
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
              completedTodos={completedTodos}
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
