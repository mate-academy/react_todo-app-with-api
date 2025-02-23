import React, { useEffect, useRef, useState } from 'react';
import { Todo } from '../../types/Todo';

interface Props {
  handleChangeTodo: <T>(
    callback: (id: T) => Promise<void[]>,
    valueToCall: T,
  ) => void;
  todo: Todo;
  setIsEditing: (state: boolean) => void;
  onUpdateTodo: (todo: Todo[]) => Promise<void[]>;
  onDeleteTodo: (id: number[]) => Promise<void[]>;
}

export const EditTodoTitle: React.FC<Props> = ({
  onDeleteTodo,
  handleChangeTodo,
  todo,
  setIsEditing,
  onUpdateTodo,
}) => {
  const [titleName, setTitleName] = useState(todo.title);

  const handleChangeTitle = (newTitle: string) => {
    setTitleName(newTitle);
  };

  const inputField = useRef<HTMLInputElement | null>(null);

  const checkPressedKey = (key: string) => {
    if (key === 'Escape') {
      handleChangeTitle(todo.title);
      setIsEditing(false);
    }
  };

  const handleSubmit = (event?: React.FormEvent<HTMLFormElement>) => {
    if (event) {
      event.preventDefault();
    }

    const normalizedTitleName = titleName.trim();

    if (normalizedTitleName === todo.title) {
      setIsEditing(false);

      return;
    }

    if (!normalizedTitleName) {
      handleChangeTodo(onDeleteTodo, [todo.id]);

      return;
    }

    onUpdateTodo([
      {
        ...todo,
        title: titleName.trim(),
      },
    ])
      .then(() => setIsEditing(false))
      .finally(() => inputField.current?.focus());
  };

  useEffect(() => {
    inputField.current?.focus();
  }, [todo]);

  return (
    <form onSubmit={handleSubmit}>
      <input
        ref={inputField}
        data-cy="TodoTitleField"
        type="text"
        className="todo__title-field"
        placeholder="Empty todo will be deleted"
        value={titleName}
        onChange={event => handleChangeTitle(event.target.value)}
        onBlur={() => {
          handleSubmit();
        }}
        onKeyUp={event => checkPressedKey(event.key)}
      />
    </form>
  );
};
