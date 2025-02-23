/* eslint-disable no-console */
/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useMemo, useState } from 'react';
import { UserWarning } from './UserWarning';
import { USER_ID, deleteTodo, getTodos, updateTodo } from './api/todos';
import { TodoHeader } from './components/TodoHeader';
import { TodoMain } from './components/TodoMain';
import { TodoFooter } from './components/TodoFooter';
// eslint-disable-next-line max-len
import { ErrorNotification } from './components/ErrorNotification/ErrorNotification';
import { Todo } from './types/Todo';
import { FilterOptions } from './types/FilterOptions';
import { ErrorMessage } from './types/ErrorMessage';

function filterTodos(todos: Todo[], option: FilterOptions) {
  if (option === FilterOptions.FilterByAllButton) {
    return todos;
  }

  return todos.filter(todo => Number(todo.completed) === option);
}

export const App: React.FC = () => {
  // #region States
  const [todos, setTodos] = useState<Todo[]>([]);
  const [errorMessage, setErrorMessage] = useState<ErrorMessage>(
    ErrorMessage.NoErrors,
  );
  const [selectedOption, setSelectedOption] = useState<FilterOptions>(
    FilterOptions.FilterByAllButton,
  );
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [isDataInProceeding, setIsDataInProceeding] = useState(false);
  const [selectedTodoIds, setSelectedTodoIds] = useState<number[]>([]);
  const [isTodoTitleEditing, setIsTodoTitleEditing] = useState(false);
  // #endregion

  const filteredTodos = useMemo(() => {
    return filterTodos(todos, selectedOption);
  }, [todos, selectedOption]);

  // #region creatingNewTodo
  const handleNewTodo = (newTodo: Todo) => {
    setTodos(currentTodos => {
      return [...currentTodos, newTodo];
    });
  };

  const handleSetTempTodo = (newTempTodo: Todo | null) => {
    setTempTodo(newTempTodo);
    if (newTempTodo) {
      setSelectedTodoIds(currSelectedTodoIds => [
        ...currSelectedTodoIds,
        newTempTodo.id,
      ]);
    }
  };
  // #endregion

  const handleFiltrationOption = (option: FilterOptions) => {
    setIsTodoTitleEditing(false);
    setSelectedOption(option);
  };

  const handleSetDataLoadingStatus = (status: boolean) => {
    setIsDataInProceeding(status);
  };

  const handleError = (message: ErrorMessage) => {
    setErrorMessage(message);
    setTimeout(() => {
      setErrorMessage(ErrorMessage.NoErrors);
    }, 3000);
  };

  const handleDoubleClickOnTodoField = (todoId: number) => {
    if (!isTodoTitleEditing) {
      setIsTodoTitleEditing(true);
      setSelectedTodoIds([todoId]);
    }
  };

  // #region TodoDeletion
  const handleDeletionTodo = async (todoId: number) => {
    setIsDataInProceeding(true);
    setSelectedTodoIds(currSelectedTodoIds => [...currSelectedTodoIds, todoId]);

    try {
      await deleteTodo(todoId);
      setTodos(currentTodos => currentTodos.filter(todo => todo.id !== todoId));
      setSelectedTodoIds([]);
    } catch {
      handleError(ErrorMessage.OnDeletionTodo);
      throw Error(ErrorMessage.OnDeletionTodo);
    } finally {
      setIsDataInProceeding(false);
    }
  };

  const handleDeleteCompletedTodos = async () => {
    const completedTodos = todos.filter(todo => todo.completed === true);

    await Promise.allSettled(
      completedTodos.map(completedTodo => handleDeletionTodo(completedTodo.id)),
    );
  };
  // #endregion

  // #region UpdatingTodos
  const handleChangeTodo = async (todoToUpdate: Todo) => {
    setIsDataInProceeding(true);
    setSelectedTodoIds(currSelectedTodoIds => [
      ...currSelectedTodoIds,
      todoToUpdate.id,
    ]);

    try {
      const updatedTodo = await updateTodo(todoToUpdate);

      setTodos(currentTodos => {
        const newTodos = [...currentTodos];
        const indexOfTodoToUpdate = currentTodos.findIndex(
          todo => todo.id === todoToUpdate.id,
        );

        newTodos.splice(indexOfTodoToUpdate, 1, updatedTodo);

        return newTodos;
      });
      setSelectedTodoIds([]);
    } catch {
      handleError(ErrorMessage.OnUpdatingTodo);
      throw Error(ErrorMessage.OnUpdatingTodo);
    } finally {
      setIsDataInProceeding(false);
    }
  };

  // #region TodoStatusTogglers
  const handleToggleTodoStatus = (todoId: number) => {
    const todoWithStatusToUpdate = {
      ...(todos.find(todo => todo.id === todoId) as Todo),
    };

    todoWithStatusToUpdate.completed = !todoWithStatusToUpdate.completed;

    handleChangeTodo(todoWithStatusToUpdate);
  };

  const handleToggleAllTodosStatuses = async () => {
    if (todos.some(todo => todo.completed === false)) {
      const uncompletedTodos = todos.filter(todo => todo.completed === false);

      await Promise.allSettled(
        uncompletedTodos.map(uncompletedTodo =>
          handleToggleTodoStatus(uncompletedTodo.id),
        ),
      );
    } else {
      await Promise.allSettled(
        todos.map(todo => handleToggleTodoStatus(todo.id)),
      );
    }
  };
  // #endregion
  // #endregion

  useEffect(() => {
    getTodos()
      .then(setTodos)
      .catch(() => {
        handleError(ErrorMessage.OnLoadingTodos);
      });
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
          isTodoTitleEditing={isTodoTitleEditing}
          isDataInProceeding={isDataInProceeding}
          toggleAllTodoStatuses={handleToggleAllTodosStatuses}
          handleSetDataLoadingStatus={handleSetDataLoadingStatus}
          addTempTodo={handleSetTempTodo}
          updateTodoList={handleNewTodo}
          onError={handleError}
        />

        <TodoMain
          todos={filteredTodos}
          isTodoTitleEditing={isTodoTitleEditing}
          selectedTodoIds={selectedTodoIds}
          tempTodo={tempTodo}
          isDataInProceeding={isDataInProceeding}
          onTodoTitleEdit={handleDoubleClickOnTodoField}
          changeEditingStatus={setIsTodoTitleEditing}
          onUpdate={handleChangeTodo}
          onDelete={handleDeletionTodo}
          toggleStatus={handleToggleTodoStatus}
        />

        {todos.length > 0 && (
          <TodoFooter
            todos={todos}
            selectedOption={selectedOption}
            deleteCompletedTodos={handleDeleteCompletedTodos}
            selectOption={handleFiltrationOption}
          />
        )}
      </div>

      <ErrorNotification
        errorMessage={errorMessage}
        onClose={setErrorMessage}
      />
    </div>
  );
};
