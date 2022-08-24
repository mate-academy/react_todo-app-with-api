import React, { useEffect, useRef, useState } from 'react';

type Props = {
  addNewTodo: (title: string) => void,
};

export const AddTodoForm:React.FC<Props> = React.memo((props) => {
  const { addNewTodo } = props;
  const newTodoField = useRef<HTMLInputElement>(null);
  const [todoTitle, setTodoTitle] = useState('');

  useEffect(() => {
    // focus the element with `ref={newTodoField}`
    if (newTodoField.current) {
      newTodoField.current.focus();
    }
  }, []);

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        addNewTodo(todoTitle);
        setTodoTitle('');
      }}
    >
      <input
        data-cy="NewTodoField"
        type="text"
        ref={newTodoField}
        className="todoapp__new-todo"
        placeholder="What needs to be done?"
        value={todoTitle}
        onChange={(event) => setTodoTitle(event.target.value)}
      />
    </form>
  );
});
