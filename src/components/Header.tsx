import {
  useRef,
  useEffect,
  useContext,
} from 'react';
import { postTodo } from '../api/todos';
import { Todo } from '../types/Todo';
import { User } from '../types/User';
import { AuthContext } from './Auth/AuthContext';
import { DispatchContext, StateContext } from './StateContext';

interface Props {
  onAdd: (newTodo: Todo) => void;
}

export const Header: React.FC<Props> = (props) => {
  const { onAdd } = props;

  const newTodoField = useRef<HTMLInputElement>(null);

  const { id } = useContext(AuthContext) as User;
  const { todoTitle, isSavingTodo } = useContext(StateContext);
  const dispatch = useContext(DispatchContext);

  const handleKeyup = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' && todoTitle.trim()) {
      dispatch({ type: 'startSave', peyload: '' });
      postTodo({ title: todoTitle, userId: id, completed: false })
        .then((res) => onAdd(res))
        .finally(() => {
          dispatch({ type: 'setTitle', peyload: '' });
          dispatch({ type: 'finishSave', peyload: '' });
        });
    }
  };

  useEffect(() => {
    if (newTodoField.current) {
      newTodoField.current.focus();
    }
  }, [isSavingTodo]);

  return (
    <header className="todoapp__header">
      <button
        data-cy="ToggleAllButton"
        type="button"
        className="todoapp__toggle-all active"
        aria-label="ToggleAllButton"
      />

      <form onSubmit={(event) => event.preventDefault()}>
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
          onKeyUp={handleKeyup}
          disabled={isSavingTodo}
        />
      </form>
    </header>
  );
};
