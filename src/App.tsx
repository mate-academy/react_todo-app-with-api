/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import { USER_ID } from './api/todos';
import cn from 'classnames';
import { Filter } from './Components/Filter/Filter';
import { TodoList } from './Components/TodoList/TodoList';
import { NewTodo } from './Components/NewTodo.tsx/NewTodo';
import { UserWarning } from './UserWarning';
import { Todo } from './Components/Todo/Todo';
import { ErrorNotification } from './Components/ErrorNotification';
import { useTodoApp } from './hooks/useTodoApp';

export const App: React.FC = () => {
  const {
    todos,
    allTodosCompleted,
    disabledInput,
    formFocus,
    filteredTodos,
    todosToLoad,
    tempTodo,
    activeTodosCount,
    selectedFilter,
    completedTodosAvailability,
    errorMessage,
    handleTodosCompletions,
    handleNewTodo,
    handleTodoDeletion,
    handleTodoStatusChange,
    handleSuccessTitleUpdate,
    handleFailedTitleUpdate,
    setSelectedFilter,
    handleCompletedTodosDeletion,
    handleErrorMessageRemoval,
  } = useTodoApp();

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          {todos.length > 0 && (
            <button
              type="button"
              className={cn('todoapp__toggle-all', {
                active: allTodosCompleted,
              })}
              data-cy="ToggleAllButton"
              onClick={handleTodosCompletions}
            />
          )}

          <NewTodo
            handleNewTodo={handleNewTodo}
            disableInput={disabledInput}
            formFocus={formFocus.current}
            setFormFocus={() => (formFocus.current = !formFocus.current)}
          />
        </header>
        {todos.length > 0 && (
          <TodoList
            todos={filteredTodos}
            handleTodoDeletion={handleTodoDeletion}
            activeTodos={todosToLoad}
            handleStatusChange={handleTodoStatusChange}
            handleSuccessTitleUpdate={handleSuccessTitleUpdate}
            handleFailedTitleUpdate={handleFailedTitleUpdate}
          />
        )}
        {tempTodo !== null && (
          <Todo
            completed={false}
            title={tempTodo.title}
            isActive={true}
            todoId={tempTodo.id}
            activeTodos={todosToLoad}
            handleStatusChange={handleTodoStatusChange}
            onSuccessTitleUpdate={handleSuccessTitleUpdate}
            onFailedTitleUpdate={handleFailedTitleUpdate}
          />
        )}

        {todos.length > 0 && (
          <footer className="todoapp__footer" data-cy="Footer">
            <span className="todo-count" data-cy="TodosCounter">
              {activeTodosCount} items left
            </span>

            <Filter
              filterValue={selectedFilter}
              onSelectFilter={setSelectedFilter}
            />

            <button
              type="button"
              className="todoapp__clear-completed"
              data-cy="ClearCompletedButton"
              onClick={handleCompletedTodosDeletion}
              disabled={!completedTodosAvailability}
            >
              Clear completed
            </button>
          </footer>
        )}
      </div>

      <ErrorNotification
        errorMessage={errorMessage}
        handleErrorRemoval={handleErrorMessageRemoval}
      />
    </div>
  );
};
