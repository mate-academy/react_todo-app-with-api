import { memo, useEffect, useRef } from 'react';
import { useTodoContext } from '../../../Context/Context';

export const TodoForm = memo(() => {
  const {
    todoTitle,
    handleInput,
    handleSubmitForm,
    isDisabled,
    tempTodo,
    renderedTodos,
  } = useTodoContext();
  const titleField = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (titleField.current) {
      titleField.current.focus();
    }
  }, [tempTodo, renderedTodos]);

  return (
    <form onSubmit={handleSubmitForm}>
      <input
        value={todoTitle}
        ref={titleField}
        data-cy="NewTodoField"
        type="text"
        className="todoapp__new-todo"
        placeholder="What needs to be done?"
        onChange={handleInput}
        disabled={isDisabled}
      />
    </form>
  );
});
