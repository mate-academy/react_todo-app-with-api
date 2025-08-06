import React, { FormEvent, useContext, useEffect, useRef } from 'react';
import { DispatchContext, StateContext } from './StateContext';
import classNames from 'classnames';
import { addTodo, updateTodo, USER_ID } from '../api/todos';
import { EnumedError } from '../types/EnumedError';

export const ToDoHeader = () => {
  const { toDoTitle, todos, tempTodo, focusOnInput } = useContext(StateContext);
  const dispatch = useContext(DispatchContext);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (focusOnInput) {
      inputRef.current?.focus();
    }
  }, [tempTodo, todos.length, focusOnInput]);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const trimmedToDoTitle = toDoTitle.trim();

    if (!trimmedToDoTitle) {
      dispatch({
        type: 'SHOW_ERROR',
        message: EnumedError.TitleEmpty,
      });

      return;
    }

    const newId = Date.now();
    const newTodo = {
      title: trimmedToDoTitle,
      completed: false,
      userId: USER_ID,
    };

    dispatch({
      type: 'LOADING_TODOS',
      id: [newId],
    });

    dispatch({
      type: 'SET_TEMPORARY_TODO',
      tempTodo: { id: newId, ...newTodo },
    });

    addTodo(newTodo)
      .then(addedTodo => {
        dispatch({
          type: 'ADD_TODO',
          newTodo: {
            ...addedTodo,
            editted: false,
          },
        });
      })
      .catch(() => {
        dispatch({
          type: 'SHOW_ERROR',
          message: EnumedError.AddError,
        });
      })
      .finally(() => {
        dispatch({
          type: 'SET_TEMPORARY_TODO',
          tempTodo: null,
        });
        dispatch({
          type: 'LOADING_TODOS',
          id: [],
        });
      });
  };

  const allTodosAreCompleted =
    todos.filter(todo => todo.completed).length === todos.length;

  const toggleTodos = async () => {
    let targetTodos: typeof todos;
    let loadingTodos: number[];

    if (allTodosAreCompleted) {
      targetTodos = todos;
      loadingTodos = todos.map(todo => todo.id);
    } else {
      targetTodos = todos.filter(todo => !todo.completed);
      loadingTodos = targetTodos.map(todo => todo.id);
    }

    dispatch({
      type: 'LOADING_TODOS',
      id: loadingTodos,
    });

    const results = await Promise.allSettled(
      targetTodos.map(todo =>
        updateTodo(todo.id, {
          completed: allTodosAreCompleted ? false : true,
        }),
      ),
    );

    const updatedTodos = todos.map(todo => {
      const idx = targetTodos.findIndex(t => t.id === todo.id);

      if (idx !== -1 && results[idx].status === 'fulfilled') {
        return {
          ...todo,
          completed: allTodosAreCompleted ? false : true,
        };
      }

      return todo;
    });

    if (results.some(res => res.status === 'rejected')) {
      dispatch({
        type: 'SHOW_ERROR',
        message: EnumedError.UpdateError,
      });

      dispatch({
        type: 'GET_TODOS',
        todos,
      });
    }

    dispatch({
      type: 'GET_TODOS',
      todos: updatedTodos,
    });

    dispatch({
      type: 'LOADING_TODOS',
      id: [],
    });
  };

  return (
    <header className="todoapp__header">
      {todos.length > 0 && (
        <button
          type="button"
          className={classNames('todoapp__toggle-all', {
            active: allTodosAreCompleted,
          })}
          data-cy="ToggleAllButton"
          onClick={() => toggleTodos()}
        />
      )}

      <form onSubmit={handleSubmit}>
        <input
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          disabled={tempTodo !== null}
          value={toDoTitle}
          ref={inputRef}
          onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
            dispatch({
              type: 'WRITE_NEW_TITLE',
              newTitle: event.target.value.toString(),
            });
          }}
          autoFocus
        />
      </form>
    </header>
  );
};
