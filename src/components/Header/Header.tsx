import {
  memo, useCallback, useContext, useEffect, useMemo, useRef, useState,
} from 'react';
import cn from 'classnames';
import * as todoService from '../../api/todos';
import { StateContext, DispatchContext } from '../../store/store';
import { ActionType } from '../../types/ActionType';
import { ShowError } from '../../types/ShowErrors';
import { USER_ID } from '../../types/constants';

export const Header:React.FC = memo(() => {
  const [newTodoTitle, setNewTodoTitle] = useState<string>('');

  const { todos, loadingIDs } = useContext(StateContext);
  const dispatch = useContext(DispatchContext);

  const inputNewTitleRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (inputNewTitleRef.current && loadingIDs === null) {
      inputNewTitleRef.current.focus();
    }
  }, [newTodoTitle, loadingIDs]);

  const isAllCompleted = useMemo(
    () => todos.every(todo => todo.completed),
    [todos],
  );

  const isDisabled = useMemo(
    () => !(loadingIDs === null),
    [loadingIDs],
  );

  const isGreaterZero = useMemo(
    () => todos.length > 0,
    [todos],
  );

  const titleValue = useMemo(
    () => newTodoTitle ?? '',
    [newTodoTitle],
  );

  const handleChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setNewTodoTitle(event.target.value);
    },
    [],
  );

  const handleSubmitCreateTodo = useCallback(
    (event: React.FormEvent) => {
      event.preventDefault();

      const title = newTodoTitle.trim();

      if (!title) {
        dispatch({
          type: ActionType.SetError,
          payload: ShowError.createTodo,
        });

        return;
      }

      dispatch({ type: ActionType.SetLoadingIDs, payload: [0] });

      dispatch({
        type: ActionType.SetTempTodo,
        payload: {
          id: 0,
          title,
          userId: USER_ID,
          completed: false,
        },
      });

      todoService.createTodo({ title })
        .then(newTodo => {
          dispatch({ type: ActionType.Create, payload: newTodo });
          setNewTodoTitle('');
        })
        .catch(() => dispatch({
          type: ActionType.SetError,
          payload: ShowError.addTodo,
        }))
        .finally(() => {
          dispatch({ type: ActionType.ClearTempTodo });
          dispatch({ type: ActionType.ClearLoadingIDs });
        });
    }, [dispatch, newTodoTitle],
  );

  const toggleAll = useCallback(() => {
    const completedTodos = todos.filter(todo => todo.completed);
    const notCompletedTodos = todos.filter(todo => !todo.completed);
    const toggleAllTodos = isAllCompleted
      ? completedTodos
      : notCompletedTodos;
    const allTodosIds = toggleAllTodos.map(todo => todo.id);

    dispatch({
      type: ActionType.SetLoadingIDs,
      payload: allTodosIds,
    });

    Promise.all(
      toggleAllTodos
        .map(todo => todoService.updateTodo(
          todo.id, { ...todo, completed: !todo.completed },
        )
          .then(() => dispatch({
            type: ActionType.Toggle,
            payload: todo.id,
          }))
          .catch(() => dispatch({
            type: ActionType.SetError,
            payload: ShowError.updateTodo,
          }))),
    ).finally(() => {
      dispatch({ type: ActionType.ClearLoadingIDs });
    });
  }, [dispatch, isAllCompleted, todos]);

  return (
    <header className="todoapp__header">
      {isGreaterZero && (
        <button
          className={cn(
            'todoapp__toggle-all',
            { active: isAllCompleted },
          )}
          type="button"
          data-cy="ToggleAllButton"
          aria-label="toggle-all"
          onClick={toggleAll}
        />
      )}

      <form onSubmit={handleSubmitCreateTodo}>
        <input
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          ref={inputNewTitleRef}
          disabled={isDisabled}
          value={titleValue}
          onChange={handleChange}
        />
      </form>
    </header>
  );
});
