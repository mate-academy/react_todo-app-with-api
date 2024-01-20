import { memo, useContext, useMemo } from 'react';
import * as todoService from '../../api/todos';

import { DispatchContext, StateContext } from '../../store/store';
import { TodosFilter } from '../TodosFilter';
import { ActionType } from '../../types/ActionType';
import { ShowError } from '../../types/ShowErrors';

export const Footer:React.FC = memo(() => {
  const { todos } = useContext(StateContext);
  const dispatch = useContext(DispatchContext);

  const complitedTodoIDs = useMemo(
    () => todos
      .filter(todo => todo.completed)
      .map(todo => todo.id),
    [todos],
  );

  const activeTodoCounter = useMemo(
    () => todos.length - complitedTodoIDs.length,
    [todos, complitedTodoIDs],
  );

  const deleteComplitedTodos = () => {
    dispatch({
      type: ActionType.SetLoadingIDs,
      payload: complitedTodoIDs,
    });

    Promise.all(
      complitedTodoIDs
        .map(id => todoService.deleteTodo(id)
          .then(() => dispatch({
            type: ActionType.Delete,
            payload: id,
          }))
          .catch(() => dispatch({
            type: ActionType.SetError,
            payload: ShowError.deleteTodo,
          }))),
    ).finally(() => {
      dispatch({ type: ActionType.ClearLoadingIDs });
    });
  };

  const isEmptyTodos = useMemo(() => {
    return todos.length === 0;
  }, [todos]);

  return isEmptyTodos
    ? <></>
    : (
      <footer className="todoapp__footer" data-cy="Footer">
        <span className="todo-count" data-cy="TodosCounter">
          {`${activeTodoCounter} items left`}
        </span>

        <TodosFilter />

        <button
          type="button"
          className="todoapp__clear-completed"
          data-cy="ClearCompletedButton"
          disabled={!complitedTodoIDs.length}
          onClick={deleteComplitedTodos}
        >
          Clear completed
        </button>
      </footer>
    );
});
