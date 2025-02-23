import { FormEvent, useEffect, useRef, useState } from 'react';
import { Todo } from '../../types/Todo';

type Props = {
  todo: Todo;
  onTitleChange: (todo: Todo, newTitle: string) => void | Promise<void | Todo>;
};

export const FormTodoTitle: React.FC<Props> = ({ todo, onTitleChange }) => {
  const titleFieldRef = useRef<HTMLInputElement>(null);
  const titleField = titleFieldRef.current;

  const [newTitle, setNewTitle] = useState(todo.title);

  useEffect(() => {
    titleFieldRef.current?.focus();
  }, []);

  const handleTitleChange = () => {
    const trimmedTitle = newTitle.trim();

    if (trimmedTitle === todo.title) {
      return;
    }

    onTitleChange(todo, trimmedTitle)
      ?.then(() => {
        titleField?.blur();
      })
      .catch(() => {
        titleField?.focus();
      });
  };

  const submitHandle = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    handleTitleChange();
  };

  return (
    <form onSubmit={submitHandle}>
      <input
        ref={titleFieldRef}
        data-cy="TodoTitleField"
        type="text"
        className="todo__title-field"
        placeholder="Empty todo will be deleted"
        value={newTitle}
        onChange={e => {
          setNewTitle(e.target.value);
        }}
        onBlur={handleTitleChange}
      />
    </form>
  );
};
