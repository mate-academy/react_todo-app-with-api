import React, {
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
// import { TodoData } from '../../api/todos';
import { ErrorTypes } from '../../types/ErrorTypes';
import { Todo } from '../../types/Todo';
// import { AuthContext } from '../Auth/AuthContext';
import { ProcessedContext } from '../ProcessedContext/ProcessedContext';

interface Props {
  onUpdate: (todoId: number, dataToUpdate: Partial<Todo>) => void,
  todoId: number,
  onEdit: (isEdit: boolean) => void,
}

export const UpdateTodoForm: React.FC<Props> = ({
  onUpdate,
  todoId,
  onEdit,
}) => {
  // const user = useContext(AuthContext);
  const { isAdding, setError } = useContext(ProcessedContext);
  const newTodoField = useRef<HTMLInputElement>(null);
  const [newTodoTitle, setNewTodoTitle] = useState('');

  useEffect(() => {
    if (newTodoField.current) {
      newTodoField.current.focus();
    }
  }, []);

  // useEffect(() => {
  //   if (newTodoField.current && !isAdding) {
  //     newTodoField.current.focus();
  //   }
  // }, [isAdding]);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(ErrorTypes.NONE);
    if (newTodoTitle.trim()) {
      const updatedTodo: Partial<Todo> = {
        title: newTodoTitle.trim(),
      };

      onUpdate(todoId, updatedTodo);
      onEdit(false);
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
