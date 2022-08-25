import React, {
  FC, FormEvent, useEffect, useRef, useState,
} from 'react';

interface Props {
  titleBefore: string;
  handlerUpdateTitle: (newTitle: string) => void;
  closeInput: () => void;
}

export const PatchForm: FC<Props> = React.memo((props) => {
  const { titleBefore, handlerUpdateTitle, closeInput } = props;
  const [todoTitle, setTodoTitle] = useState('');
  const newTodoField = useRef< HTMLInputElement >(null);

  useEffect(() => {
    // focus the element with `ref={newTodoField}`
    if (newTodoField.current) {
      newTodoField.current.focus();
    }

    setTodoTitle(titleBefore);
  }, []);

  const handleSubmitPutchTodo = (event: FormEvent) => {
    event.preventDefault();
    handlerUpdateTitle(todoTitle);
  };

  return (
    <form
      onSubmit={handleSubmitPutchTodo}
      onBlur={() => {
        closeInput();
        handlerUpdateTitle(todoTitle);
      }}
    >
      <input
        data-cy="NewTodoField"
        type="text"
        className="todoapp__new-todo"
        ref={newTodoField}
        value={todoTitle}
        onChange={(event) => setTodoTitle(event.target.value)}
      />
      <button type="submit" aria-label="Save" style={{ display: 'none' }} />
    </form>
  );
});
