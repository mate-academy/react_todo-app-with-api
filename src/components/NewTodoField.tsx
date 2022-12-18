/* eslint-disable jsx-a11y/control-has-associated-label */

import { useEffect, useRef } from 'react';

type Props = {
  title: string,
  changeTitle: (value: string) => void,
  onSetTitleError?: (isError: boolean) => void,
  isAdding?: boolean,
  onSetIsEditing?: (isEdit: boolean) => void,
  onSubmit: () => void,
};

export const NewTodoField: React.FC<Props> = (
  {
    onSetTitleError,
    title,
    changeTitle,
    onSetIsEditing,
    isAdding,
    onSubmit,
  },
) => {
  const newTodoField = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (newTodoField.current) {
      newTodoField.current.focus();

      newTodoField.current.addEventListener('keydown', (event) => {
        if (event.code === 'Escape' && onSetIsEditing) {
          onSetIsEditing(false);
        }
      });
    }
  }, []);

  useEffect(() => {
    if (newTodoField.current) {
      newTodoField.current.focus();
    }
  });

  const addNewTodo = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (onSetIsEditing) {
      newTodoField.current?.blur();
    }

    onSubmit();
  };

  const handleChangeTitle = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    if (onSetTitleError) {
      onSetTitleError(false);
    }

    changeTitle(event.target.value);
  };

  return (
    <form
      onSubmit={addNewTodo}
    >
      <input
        data-cy="NewTodoField"
        type="text"
        ref={newTodoField}
        className="todoapp__new-todo"
        placeholder="What needs to be done?"
        value={title}
        onChange={handleChangeTitle}
        disabled={isAdding}
        onBlur={() => {
          if (onSetIsEditing) {
            onSubmit();
          }
        }}
      />
    </form>
  );
};
