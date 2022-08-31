import React, {FormEvent, useEffect, useRef} from 'react';

interface Props {
  handlerSubmit: (event: FormEvent) => void,
  todoTitle: string,
  setTodoTitle: (todoTitle:string) => void,
}

export const InputForm: React.FC<Props> = (props) => {
  const { handlerSubmit, todoTitle, setTodoTitle } = props;
  const newTodoField = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // focus the element with `ref={newTodoField}`
    if (newTodoField.current) {
      newTodoField.current.focus();
    }
  }, []);

  return (
    <header className="todoapp__header">
      {/* eslint-disable-next-line jsx-a11y/control-has-associated-label */}
      <button
        data-cy="ToggleAllButton"
        type="button"
        className="todoapp__toggle-all active"
      />

      <form
        onSubmit={handlerSubmit}
      >
        <input
          data-cy="NewTodoField"
          type="text"
          ref={newTodoField}
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={todoTitle}
          onChange={event => (
            setTodoTitle(event.target.value)
          )}
        />
      </form>
    </header>
  );
};
