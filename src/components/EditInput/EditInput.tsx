import React, {
  FormEvent, useContext, useEffect, useState,
} from 'react';
import { TodosContext } from '../TodosProvider';
import { Todo } from '../../types/Todo';

type Props = {
  todo: Todo,
  setEditedTodoId: (todoId: number) => void;
};
export const EditInput: React.FC<Props> = ({ todo, setEditedTodoId }) => {
  const { handleUpdate } = useContext(TodosContext);

  const [editedQuery, setEditedQuery] = useState('');

  useEffect(() => {
    setEditedQuery(todo.title);
  }, []);

  const handleQuery = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEditedQuery(event.target.value);
  };

  const handleOnFormSubmit = (event: FormEvent) => {
    event.preventDefault();
    handleUpdate(todo, editedQuery);
    setEditedTodoId(0);
  };

  const handleOnBlur = () => {
    handleUpdate(todo, editedQuery);
    setEditedTodoId(0);
  };

  const reset = (event: React.KeyboardEvent) => {
    if (event.key === 'Escape') {
      handleOnBlur();
    }
  };

  return (
    <form onSubmit={handleOnFormSubmit}>
      <input
        type="text"
        className="todo__title-field"
        placeholder="Empty todo will be deleted"
        value={editedQuery}
        onChange={handleQuery}
        /* eslint-disable-next-line jsx-a11y/no-autofocus */
        autoFocus
        onBlur={handleOnBlur}
        onKeyUp={reset}
      />
    </form>
  );
};
