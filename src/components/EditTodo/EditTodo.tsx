import React, { useState, useRef, useEffect } from 'react';

interface Props {
  title: string,
  handleActionTodo: (newTitle: string) => void,
}

export const EditTodo: React.FC<Props> = ({
  title,
  handleActionTodo,
}) => {
  const todoField = useRef<HTMLInputElement>(null);

  const [newTodoTitle, setNewTodoTitle] = useState(title);

  useEffect(() => {
    if (todoField.current) {
      todoField.current.focus();
    }
  }, []);

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        handleActionTodo(newTodoTitle);
      }}
    >
      <input
        ref={todoField}
        data-cy="NewTodoField"
        type="text"
        className="todo__title-field"
        placeholder="The empty Todo will be removed!"
        value={newTodoTitle}
        onChange={({ target }) => setNewTodoTitle(target.value)}
        onKeyUp={({ key }) => {
          if (key === 'Escape') {
            handleActionTodo(title);
          }
        }}
        onBlur={() => {
          handleActionTodo(newTodoTitle);
        }}
      />
    </form>
  );
};
