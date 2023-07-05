import {
  ChangeEvent,
  FC,
  useEffect,
  useRef,
  useState,
} from 'react';
import { TodoUpdate, Todo as TodoType } from '../types/Todo';

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
  const inputRef = useRef<HTMLInputElement>(null);
  const [value, setValue] = useState(todo.title);

  const handleInputChanges = (event: ChangeEvent<HTMLInputElement>) => {
    setValue(event.target.value);
  };

  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      const clickedElement = event.target as HTMLElement;

      if (!clickedElement.classList.contains('editInput')) {
        setIsEdit(false);
      }
    };

    document.addEventListener('click', handleClick);

    return () => {
      document.removeEventListener('click', handleClick);
    };
  }, []);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const handleSubmit = async (event: ChangeEvent<HTMLFormElement>) => {
    event.preventDefault();

    const trimedValue = value.trim();

    if (todo.title === value || !trimedValue) {
      return;
    }

    updateTodo(todo.id, { title: trimedValue });
    setIsEdit(false);
  };

  return (
    <form action="submit" onSubmit={handleSubmit}>
      <input
        className="editInput"
        type="text"
        value={value}
        ref={inputRef}
        onChange={handleInputChanges}
      />
    </form>
  );
};
