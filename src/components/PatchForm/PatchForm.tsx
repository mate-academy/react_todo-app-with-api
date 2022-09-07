import React, {
  FC, FormEvent, useEffect, useRef, useState,
} from 'react';

interface Props {
  titleBefore: string;
  handlerUpdateTitle: (newTitle: string, titleBefore: string) => void;
  closeInput: () => void;
}

export const PatchForm: FC<Props> = React.memo(
  ({ titleBefore, handlerUpdateTitle, closeInput }) => {
    const [todoTitle, setTodoTitle] = useState('');
    const newTodoField = useRef<HTMLInputElement>(null);

    const handelCloseInputUpdate = (event: KeyboardEvent) => {
      if (event.code === 'Escape') {
        closeInput();
      }
    };

    useEffect(() => {
      if (newTodoField.current) {
        newTodoField.current.focus();
      }

      setTodoTitle(titleBefore);

      window.addEventListener('keyup', handelCloseInputUpdate);

      return () => {
        window.removeEventListener('keyup', handelCloseInputUpdate);
      };
    }, []);

    const handleSubmitPatchTodo = (event: FormEvent) => {
      event.preventDefault();

      handlerUpdateTitle(todoTitle, titleBefore);
    };

    return (
      <form onSubmit={handleSubmitPatchTodo}>
        <input
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo todoapp__todo-update"
          ref={newTodoField}
          placeholder="Todo without name will be deleted"
          value={todoTitle}
          onChange={(event) => setTodoTitle(event.target.value)}
          onBlur={() => {
            handlerUpdateTitle(todoTitle, titleBefore);
            closeInput();
          }}
        />
        <button type="submit" aria-label="Save" style={{ display: 'none' }} />
      </form>
    );
  },
);
