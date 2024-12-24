import { FormEvent, useEffect, useRef, useState } from 'react';
import { addTodo, USER_ID } from '../api/todos';
import { Todo } from '../types/Todo';
import { pause } from '../utils/methods';

interface Props {
  onTempTodo?: (v: Todo | null) => void;
  onErrorMessage?: (v: string) => void;
  onLoader?: (v: boolean) => void;
  onTodos?: React.Dispatch<React.SetStateAction<Todo[]>>;
  titleTodo?: string;
}

export const NewTodoField: React.FC<Props> = ({
  onErrorMessage = () => {},
  onTempTodo = () => {},
  onLoader = () => {},
  onTodos = () => {},
}) => {
  const [title, setTitle] = useState('');
  const [disabled, setDisabled] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  });

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (title.trim()) {
      const newTodo = {
        title: title.trim(),
        userId: USER_ID,
        completed: false,
      };

      setDisabled(true);

      try {
        const tempTodo = { ...newTodo, id: 0 };

        onTempTodo(tempTodo);
        onLoader(true);
        await pause();

        const response = await addTodo(newTodo);

        onTodos(prev => [...prev, response]);

        setTitle('');
      } catch {
        onErrorMessage('Unable to add a todo');
      } finally {
        onTempTodo(null);
        onLoader(false);
        setDisabled(false);
        setTimeout(() => {
          inputRef.current?.focus();
        }, 0);
      }
    } else {
      onErrorMessage('Title should not be empty');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        data-cy="NewTodoField"
        type="text"
        className="todoapp__new-todo"
        placeholder="What needs to be done?"
        disabled={disabled}
        autoFocus
        value={title}
        ref={inputRef}
        onChange={e => setTitle(e.target.value)}
      />
    </form>
  );
};
