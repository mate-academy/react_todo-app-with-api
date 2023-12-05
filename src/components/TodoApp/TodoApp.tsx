import React, { useCallback, useContext, useEffect } from 'react';
import cn from 'classnames';
import { TodosContext } from '../../store/TodoProvider';
import { TodosFilter } from '../TodosFilter/TodosFilter';
import { TodoList } from '../TodoList/TodoList';
import { TodoForm } from '../TodoForm/TodoForm';
import {
  ActionType, ErrorMessage, FilterType,
} from '../../types/Todo';
import { removeTodo, updateTodo } from '../../api/todos';

export const TodoApp: React.FC = () => {
  const { state, dispatch } = useContext(TodosContext);

  const {
    todos, tempTodo, error, filterBy, processed,
  } = state;

  const toggleAllTodoItems = () => {
    const isCompleted = todos.every(todo => todo.completed);
    const neededTodos = todos.filter(todo => todo.completed === isCompleted);

    dispatch({
      type: ActionType.PROCESSED,
      payload: neededTodos.map(todo => todo.id),
    });

    neededTodos.forEach(todo => {
      updateTodo({ ...todo, completed: !isCompleted })
        .then(changedTodo => dispatch({
          type: ActionType.UPDATE,
          payload: changedTodo,
        }))
        .catch(() => dispatch({
          type: ActionType.ERROR,
          payload: ErrorMessage.UNABLE_UPDATE,
        }))
        .finally(() => {
          dispatch({
            type: ActionType.PROCESSED,
            payload: processed.filter(id => id !== todo.id),
          });
        });
    });
  };

  const removeCompletedTodoItems = () => {
    const completedTodosIds = todos
      .filter(todo => todo.completed)
      .map(todo => todo.id);

    dispatch({
      type: ActionType.PROCESSED,
      payload: completedTodosIds,
    });

    completedTodosIds.forEach(id => {
      removeTodo(id)
        .then(() => dispatch({
          type: ActionType.REMOVE,
          payload: id,
        }))
        .catch(() => dispatch({
          type: ActionType.ERROR,
          payload: ErrorMessage.UNABLE_DELETE,
        }));
    });
  };

  const setFilterType = (filter: FilterType) => {
    dispatch({ type: ActionType.FILTER, payload: filter });
  };

  const clearError = useCallback(() => {
    dispatch({ type: ActionType.ERROR, payload: '' });
  }, [dispatch]);

  const getFilteredTodos = () => {
    switch (filterBy) {
      case FilterType.ACTIVE:
        return todos.filter(item => !item.completed);
      case FilterType.COMPLETED:
        return todos.filter(item => item.completed);
      default:
        return todos;
    }
  };

  useEffect(() => {
    let timerId = 0;

    if (error) {
      timerId = window.setTimeout(() => {
        clearError();
      }, 3000);
    }

    return () => {
      window.clearTimeout(timerId);
    };
  }, [error, clearError]);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          {/* eslint-disable jsx-a11y/control-has-associated-label */}
          {todos.length > 0 && (
            <button
              type="button"
              className={cn('todoapp__toggle-all', {
                active: todos.every(item => item.completed),
              })}
              onClick={() => toggleAllTodoItems()}
              data-cy="ToggleAllButton"
            />
          )}

          <TodoForm />
        </header>

        <TodoList items={getFilteredTodos()} tempItem={tempTodo} />

        {todos.length > 0 && (
          <footer className="todoapp__footer" data-cy="Footer">
            <span className="todo-count" data-cy="TodosCounter">
              {`${todos.filter(item => !item.completed).length} items left`}
            </span>

            <TodosFilter onChange={setFilterType} />

            <button
              type="button"
              className="todoapp__clear-completed"
              onClick={removeCompletedTodoItems}
              disabled={!todos.some(item => item.completed)}
              data-cy="ClearCompletedButton"
            >
              Clear completed
            </button>
          </footer>
        )}
      </div>

      <div
        data-cy="ErrorNotification"
        className={cn(
          'notification is-danger is-light has-text-weight-normal', {
            hidden: !error,
          },
        )}
      >
        <button
          data-cy="HideErrorButton"
          type="button"
          className="delete"
          onClick={() => clearError()}
        />
        {error}
      </div>
    </div>
  );
};
