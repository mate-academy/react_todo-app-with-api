import {
  memo, useContext, useEffect, useMemo, useRef, useState,
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

  const completedAll = useMemo(
    () => todos.every(todo => todo.completed),
    [todos],
  );

  useEffect(() => {
    if (inputNewTitleRef.current && loadingIDs === null) {
      inputNewTitleRef.current.focus();
    }
  }, [newTodoTitle, loadingIDs]);

  const handleChangeNewTodoTitle = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setNewTodoTitle(event.target.value);
  };

  const handleSubmitCreateTodo = (event: React.FormEvent) => {
    event.preventDefault();

    const title = newTodoTitle.trim();

    if (!title) {
      dispatch({
        type: ActionType.SetError,
        payload: ShowError.createTodo,
      });

      return;
    }

    // dispatch({ type: ActionType.SetIsLoading });
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
        // dispatch({ type: ActionType.ClearIsLoading });
      });
  };

  return (
    <header className="todoapp__header">
      <button
        className={cn(
          'todoapp__toggle-all',
          { active: completedAll },
        )}
        type="button"
        data-cy="ToggleAllButton"
        aria-label="toggle-all"
      />

      <form onSubmit={handleSubmitCreateTodo}>
        <input
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          ref={inputNewTitleRef}
          disabled={!(loadingIDs === null)}
          value={newTodoTitle ?? ''}
          onChange={handleChangeNewTodoTitle}
        />
      </form>
    </header>
  );
});
