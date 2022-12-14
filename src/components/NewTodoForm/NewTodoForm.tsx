import React, {
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import { TodoData } from '../../api/todos';
import { ErrorTypes } from '../../types/ErrorTypes';
import { AuthContext } from '../Auth/AuthContext';
import { ErrorContext } from '../ErrorContext/ErrorContext';

interface Props {
  onAdd: (todo: TodoData) => void,
}

export const NewTodoForm: React.FC<Props> = ({
  onAdd,
}) => {
  const user = useContext(AuthContext);
  const { isAdding, setError } = useContext(ErrorContext);
  const newTodoField = useRef<HTMLInputElement>(null);
  const [newTodoTitle, setNewTodoTitle] = useState('');

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
    if (newTodoTitle.trim()) {
      const newTodo = {
        title: newTodoTitle.trim(),
        completed: false,
        userId: user?.id,
      };

      onAdd(newTodo);
      setNewTodoTitle('');
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
          value={newTodoTitle}
          onChange={(event) => {
            setNewTodoTitle(event.target.value);
          }}
          disabled={isAdding}
        />
      </form>
    </>
  );
};
