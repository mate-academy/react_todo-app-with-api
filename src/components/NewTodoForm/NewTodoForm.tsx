import React, {
  useContext,
  useEffect,
  useRef,
} from 'react';
import { TodoData } from '../../api/todos';
import { ErrorTypes } from '../../types/ErrorTypes';
import { AuthContext } from '../Auth/AuthContext';
import { ProcessedContext } from '../ProcessedContext/ProcessedContext';

interface Props {
  onAdd: (todo: TodoData) => void,
  onTitleChange: (title: string) => void,
  newTitle: string,
}

export const NewTodoForm: React.FC<Props> = ({
  onAdd,
  onTitleChange,
  newTitle,
}) => {
  const user = useContext(AuthContext);
  const { isAdding, setError } = useContext(ProcessedContext);
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
    setError(ErrorTypes.NONE);
    if (newTitle.trim()) {
      const newTodo = {
        title: newTitle.trim(),
        completed: false,
        userId: user?.id,
      };

      onAdd(newTodo);
    } else {
      setError(ErrorTypes.EmptyTitle);
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        <input
          data-cy="NewTodoField"
          type="text"
          ref={newTodoField}
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={newTitle}
          onChange={(event) => {
            onTitleChange(event.target.value);
          }}
          disabled={isAdding}
        />
      </form>
    </>
  );
};
