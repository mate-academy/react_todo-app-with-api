import React, {
  FC, FormEvent, useEffect, useRef, useState,
} from 'react';

interface Props {
  titleBefore: string;
  handlerUpdateTitle: (newTitle: string, titleBefore: string) => void;
  closeInput: () => void;
}

export const PatchForm: FC<Props> = React.memo((props) => {
  const { titleBefore, handlerUpdateTitle, closeInput } = props;
  const [todoTitle, setTodoTitle] = useState('');
  const newTodoField = useRef< HTMLInputElement >(null);

  const handelCloseInputUpdate = (event: KeyboardEvent) => {
    if (event.code === 'Escape') {
      closeInput();
    }
  };

  useEffect(() => {
    // focus the element with `ref={newTodoField}`
    if (newTodoField.current) {
      newTodoField.current.focus();
    }

    setTodoTitle(titleBefore);

    window.addEventListener('keyup', handelCloseInputUpdate);

    return () => {
      window.removeEventListener('keyup', handelCloseInputUpdate);
    };
  }, []);

  const handleSubmitPutchTodo = (event: FormEvent) => {
    event.preventDefault();

    handlerUpdateTitle(todoTitle, titleBefore);
  };

  return (
    <form
      onSubmit={handleSubmitPutchTodo}
    >
      <input
        data-cy="NewTodoField"
        type="text"
        className="todoapp__new-todo"
        ref={newTodoField}
        value={todoTitle}
        onChange={(event) => setTodoTitle(event.target.value)}
        onBlur={() => {
          handlerUpdateTitle(todoTitle, titleBefore);
          closeInput();
        }}
      />
      <button
        type="submit"
        aria-label="Save"
        style={{ display: 'none' }}
      />
    </form>
  );
});
