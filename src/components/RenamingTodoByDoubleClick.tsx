import {
  FC,
  FormEvent,
  useState,
  Dispatch,
  SetStateAction,
  KeyboardEvent,
} from 'react';

type Props = {
  oldValue: string;
  updateTitleTodo: (value: string) => void;
  setIsRenamingTodo: Dispatch<SetStateAction<boolean>>;
};

export const RenamingTodoByDoubleClick: FC<Props> = ({
  oldValue,
  updateTitleTodo,
  setIsRenamingTodo,
}) => {
  const [value, setValue] = useState(oldValue);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    updateTitleTodo(value);
  };

  const cancelEditing = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Escape') {
      setIsRenamingTodo(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        data-cy="NewTodoField"
        type="text"
        value={value}
        className="todoapp__new-todo renaming-todo"
        onChange={(e) => setValue(e.target.value)}
        placeholder="Empty todo will be deleted"
        onBlur={() => updateTitleTodo(value)}
        onKeyDown={(e) => cancelEditing(e)}
      />
    </form>
  );
};
