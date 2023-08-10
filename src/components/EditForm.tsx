import {
  ChangeEvent,
  FC,
  KeyboardEventHandler,
  useState,
} from 'react';
import { Input } from '@mui/material';
import { TodoUpdate, Todo as TodoType } from '../types/Todo';
import { useClickOutsideComponent } from '../hooks/useClickOutside';

type EProps = {
  todo: TodoType;
  updateTodo: (id: number, newValues: TodoUpdate) => void;
  setIsEdit: (value: boolean) => void;
};

export const EditForm: FC<EProps> = ({
  todo,
  updateTodo,
  setIsEdit,
}) => {
  const [value, setValue] = useState('');
  const inputRef = useClickOutsideComponent<HTMLInputElement>(
    setIsEdit,
  );

  const handleInputChanges = (event: ChangeEvent<HTMLInputElement>) => {
    setValue(event.target.value);
  };

  const handleSubmit = async (event: ChangeEvent<HTMLFormElement>) => {
    event.preventDefault();

    const trimedValue = value.trim();

    if (todo.title === value || !trimedValue) {
      return;
    }

    updateTodo(todo.id, { title: trimedValue });
    setIsEdit(false);
  };

  type KeyEvent = KeyboardEventHandler<HTMLInputElement | HTMLTextAreaElement>;
  const handleEscape: KeyEvent = (
    event,
  ) => {
    if (event.key === 'Esc') {
      setIsEdit(false);
    }
  };

  return (
    <form action="submit" onSubmit={handleSubmit}>
      <Input
        onChange={handleInputChanges}
        onKeyDown={handleEscape}
        className="editInput"
        type="text"
        value={value}
        ref={inputRef}
        placeholder="Enter new title"
        autoFocus
        fullWidth
      />
    </form>
  );
};
