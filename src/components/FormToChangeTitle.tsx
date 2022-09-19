import {
  FC,
  FormEvent,
  useEffect,
  useRef, useState,
} from 'react';

interface Props {
  prevTitle: string;
  handleTitleChange: (newTitle: string, oldTitle: string) => void;
  closeInput: () => void;
}

export const FormToChangeTitle: FC<Props> = (props) => {
  const { prevTitle, handleTitleChange, closeInput } = props;

  const [newtitle, setNewTitle] = useState('');
  const newTodoField = useRef<HTMLInputElement>(null);

  const handleCloseInput = (event: KeyboardEvent) => {
    if (event.code === 'Escape') {
      closeInput();
    }
  };

  useEffect(() => {
    if (newTodoField.current) {
      newTodoField.current.focus();
    }

    setNewTitle(prevTitle);

    window.addEventListener('keyup', handleCloseInput);

    return () => {
      window.removeEventListener('keyup', handleCloseInput);
    };
  }, []);

  const onSubmitChangeTitle = (event: FormEvent) => {
    event.preventDefault();
    handleTitleChange(newtitle, prevTitle);
  };

  return (
    <form
      onSubmit={onSubmitChangeTitle}
    >
      <input
        data-cy="NewTodoField"
        type="text"
        value={newtitle}
        onChange={(event) => setNewTitle(event.target.value)}
        onBlur={() => {
          handleTitleChange(newtitle, prevTitle);
          closeInput();
        }}
        ref={newTodoField}
        className="todoapp__new-todo todoapp__todo-update"
        placeholder="Todo without name will be deleted"
      />
    </form>
  );
};
