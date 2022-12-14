import React, {
  useContext,
  useEffect,
  useRef,
} from 'react';

import { ErrorContext } from '../Error/ErrorContext';
import { AuthContext } from '../Auth/AuthContext';

import { Errors } from '../../types/Errors';
import { Todo } from '../../types/Todo';

interface Props {
  title: string;
  setTitle: React.Dispatch<React.SetStateAction<string>>;
  onSubmit: (todoData: Omit<Todo, 'id'>) => Promise<void>;
}

export const NewTodoForm: React.FC<Props> = (props) => {
  const {
    title,
    setTitle,
    onSubmit,
  } = props;

  const user = useContext(AuthContext);
  const {
    setCurrentError,
    setHasError,
    isAdding,
  } = useContext(ErrorContext);

  const newTodoField = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (newTodoField.current) {
      newTodoField.current.focus();
    }
  }, []);

  useEffect(() => {
    if (newTodoField.current && !isAdding) {
      newTodoField.current.focus();
    }
  }, [isAdding]);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!title.trim()) {
      setCurrentError(Errors.Title);
      setHasError(true);
    }

    const userId = user?.id;

    if (!title || !userId) {
      return;
    }

    onSubmit({
      title,
      userId,
      completed: false,
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        data-cy="NewTodoField"
        type="text"
        ref={newTodoField}
        className="todoapp__new-todo"
        placeholder="What needs to be done?"
        value={title}
        onChange={(event) => setTitle(event.target.value)}
        disabled={isAdding}
      />
    </form>
  );
};
