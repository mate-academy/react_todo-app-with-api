import React, {
  useCallback,
  useContext,
  useEffect,
  useRef,
} from 'react';
import { ErrorText } from '../../types/ErrorText';
import { Todo } from '../../types/Todo';
import { AuthContext } from '../Auth/AuthContext';
import { AddNewTodoFormContext } from './AddNewTodoFormContext';

interface Props {
  onTodoAdd: (todoData: Omit<Todo, 'id'>) => void;
}

export const AddNewTodoForm: React.FC<Props> = React.memo(({
  onTodoAdd,
}) => {
  const newTodoField = useRef<HTMLInputElement>(null);
  const user = useContext(AuthContext);
  const {
    title,
    setTitle,
    setErrorText,
    isAdding,
  } = useContext(AddNewTodoFormContext);

  useEffect(() => {
    if (newTodoField.current) {
      newTodoField.current.focus();
    }
  }, [title]);

  const handleSubmit = useCallback(
    async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();

      const userId = user?.id;

      if (title.trim().length === 0) {
        setErrorText(ErrorText.Title);
      }

      if (!userId || title.trim().length === 0) {
        return;
      }

      await onTodoAdd({
        title,
        userId,
        completed: false,
      });

      setTitle('');
    }, [title],
  );

  return (
    <form onSubmit={handleSubmit}>
      <input
        disabled={isAdding}
        data-cy="NewTodoField"
        type="text"
        ref={newTodoField}
        className="todoapp__new-todo"
        placeholder="What needs to be done?"
        value={title}
        onChange={event => setTitle(event.target.value)}
      />
    </form>
  );
});
