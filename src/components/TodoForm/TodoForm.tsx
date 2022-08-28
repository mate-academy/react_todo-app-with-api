import React, { useRef, useEffect } from 'react';

interface Props {
  isLoadingSomeTodo: boolean,
  handleCreateNewTodo: () => void,
  newTodoTitle: string,
  setNewTodoTitle: (newTodoTitle: string) => void;
}

export const TodoForm: React.FC<Props> = ({
  isLoadingSomeTodo,
  handleCreateNewTodo,
  newTodoTitle,
  setNewTodoTitle,
}) => {
  const newTodoField = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (newTodoField.current && !isLoadingSomeTodo) {
      newTodoField.current.focus();
    }
  }, [isLoadingSomeTodo]);

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        handleCreateNewTodo();
      }}
    >
      <input
        data-cy="NewTodoField"
        type="text"
        ref={newTodoField}
        className="todoapp__new-todo"
        placeholder="What needs to be done?"
        value={newTodoTitle}
        onChange={({ target }) => setNewTodoTitle(target.value)}
        disabled={isLoadingSomeTodo}
      />
    </form>
  );
};
