/* eslint-disable jsx-a11y/control-has-associated-label */
import React from 'react';
import cn from 'classnames';
import { UserWarning } from './UserWarning';
import { TodoFilter } from './components/TodoFilter';
import { TodoList } from './components/TodoList';
import { TodoForm } from './components/TodoForm';
import { TContext, useTodoContext } from './components/TodoContext';
import { SortTypes, Todo } from './types/Todo';

const USER_ID = 11550;

export const App: React.FC = () => {
  // const [isDeleting, setIsDeleting] = useState<boolean>(false);

  const {
    todos,
    // addTodo,
    hasError,
    setHasError,
    sortType,
    setSortType,
    handleToggleAllStatus,
    // isToggledAll,
    setIsToggledAll,
  } = useTodoContext() as TContext;

  const handleSorting = (type: string) => setSortType(type as SortTypes);

  const sortedTodos: {
    all: Todo[];
    completed: Todo[];
    active: Todo[];
  } = {
    all: todos || [],
    completed: (todos || []).filter((todo: Todo) => todo.completed),
    active: (todos || []).filter((todo: Todo) => !todo.completed),
  };

  if (!USER_ID) {
    return <UserWarning />;
  }

  const isAllCompleted = todos.every((todo) => todo.completed === true);
  // const isAllNotCompleted = todos.every((todo) => todo.completed === false);

  const toggleAll = () => {
    if (isAllCompleted) {
      handleToggleAllStatus();
      setIsToggledAll(true);
      setTimeout(() => setIsToggledAll(false), 500);
    }
  };

  // const deleteCompleted = (todoIds: number[]) => {
  //   setIsDeleting(true);

  //   return todoIds.map((todoId) => deleteTodo(todoId)
  //     .then(() => getTodos(USER_ID))
  //     .then((res) => {
  //       setTodos(res);
  //       setIsDeleting(false);
  //     })
  //     .catch(() => {
  //       handleError('Unable to delete a todo');
  //     });
  //   )
  // };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          {/* this buttons is active only if there are some active todos */}
          <button
            type="button"
            className={cn('todoapp__toggle-all',
              {
                // eslint-disable-next-line quote-props
                'active': (isAllCompleted),
              })}
            onClick={toggleAll}
            data-cy="ToggleAllButton"
          />

          {/* Add a todo on form submit */}
          <TodoForm />
        </header>

        <TodoList todos={sortedTodos[sortType]} />

        {/* Hide the footer if there are no todos */}
        {(todos.length > 0) && (
          <footer className="todoapp__footer" data-cy="Footer">
            <span className="todo-count" data-cy="TodosCounter">
              {`${sortedTodos.active.length} items left`}
              {/* items left */}
            </span>

            {/* Active filter should have a 'selected' class */}
            <TodoFilter sortType={sortType} handleSort={handleSorting} />

            {/* don't show this button if there are no completed todos */}
            {(todos.some(todo => todo.completed === true)) && (
              <button
                type="button"
                className="todoapp__clear-completed"
                data-cy="ClearCompletedButton"
                // onClick={deleteCompleted((todos.filter(todo.id => todo.completed === true))}
              >
                Clear completed
              </button>
            )}
          </footer>
        )}
      </div>

      {/* Notification is shown in case of any error */}
      {/* Add the 'hidden' class to hide the message smoothly */}
      <div
        data-cy="ErrorNotification"
        className={`notification is-danger is-light has-text-weight-normal ${hasError === null ? 'hidden' : ''}`}
      >

        <button
          data-cy="HideErrorButton"
          type="button"
          className="delete"
          onClick={() => setHasError(null)}
        />
        {hasError}
        {/* <br />
          Title should not be empty
          <br />
          Unable to add a todo
          <br />
          Unable to delete a todo
          <br />
          Unable to update a todo */}

      </div>
    </div>
  );
};
