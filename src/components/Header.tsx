import classNames from 'classnames';
import {
  useRef,
  useEffect,
  useContext,
} from 'react';
import { postTodo } from '../api/todos';
import { Todo } from '../types/Todo';
import { User } from '../types/User';
import { useHideError, useShowError } from '../utils/hooks';
import { AuthContext } from './Auth/AuthContext';
import { DispatchContext, StateContext } from './StateContext';

interface Props {
  onAdd: (newTodo: Todo) => void;
  onToggleCompletedAll: () => void;
  isAllCompleted: boolean;
  hasTodos: boolean;
}

export const Header: React.FC<Props> = (props) => {
  const {
    onAdd,
    isAllCompleted,
    onToggleCompletedAll,
    hasTodos,
  } = props;

  const newTodoField = useRef<HTMLInputElement>(null);

  const { id } = useContext(AuthContext) as User;
  const { todoTitle, isSavingTodo } = useContext(StateContext);
  const dispatch = useContext(DispatchContext);

  const showError = useShowError();
  const hideError = useHideError();

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    hideError();

    if (!todoTitle.trim()) {
      showError('Title can\'t be empty');

      return;
    }

    dispatch({ type: 'startCreate', peyload: '' });
    postTodo({ title: todoTitle, userId: id, completed: false })
      .then((res) => onAdd(res))
      .catch(() => showError('Unable to add a todo'))
      .finally(() => {
        dispatch({ type: 'setTitle', peyload: '' });
        dispatch({ type: 'finishCreate', peyload: '' });
      });
  };

  useEffect(() => {
    if (newTodoField.current) {
      newTodoField.current.focus();
    }
  }, [isSavingTodo]);

  return (
    <header className="todoapp__header">
      {hasTodos && (
        <button
          data-cy="ToggleAllButton"
          type="button"
          className={classNames(
            'todoapp__toggle-all',
            { active: isAllCompleted },
          )}
          aria-label="ToggleAllButton"
          onClick={onToggleCompletedAll}
        />
      )}

      <form onSubmit={handleSubmit}>
        <input
          data-cy="NewTodoField"
          type="text"
          ref={newTodoField}
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={todoTitle}
          onChange={(event) => dispatch(
            { type: 'setTitle', peyload: event.target.value },
          )}
          disabled={isSavingTodo}
        />
      </form>
    </header>
  );
};
