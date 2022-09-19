import {
  FC,
  FormEvent,
  useEffect,
  useRef, useState,
} from 'react';

interface Props {
  onAdd: (todoTitle: string) => void;
}

export const Form: FC<Props> = (props) => {
  const { onAdd } = props;

  const [title, setTitle] = useState('');
  const newTodoField = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (newTodoField.current) {
      newTodoField.current.focus();
    }
  }, []);

  const onSubmit = (event: FormEvent) => {
    event.preventDefault();
    onAdd(title);
    setTitle('');
  };

  return (
    <form
      onSubmit={onSubmit}
    >
      <input
        data-cy="NewTodoField"
        type="text"
        value={title}
        onChange={(event) => setTitle(event.target.value)}
        ref={newTodoField}
        className="todoapp__new-todo"
        placeholder="What needs to be done?"
      />
    </form>
  );
};
