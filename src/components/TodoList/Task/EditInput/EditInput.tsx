import { useTodo } from '../../../../context/TodoContext';
import { Todo } from '../../../../types/Todo';

type Props = {
  todo: Todo,
};

export const EditInput = ({ todo }: Props) => {
  const {
    todos,
    newTitle,
    isFocusedOnTask,
    closeTitleEdition,
    setNewTitle,
    todoTitleEdition,
  } = useTodo();

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (newTitle.trim() === todo.title) {
        closeTitleEdition(todos, todo.id);
      } else {
        todoTitleEdition(todo, newTitle, todos);
      }
    }

    if (e.key === 'Escape') {
      closeTitleEdition(todos, todo.id);
    }
  };

  const handleOnBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (newTitle.trim() === todo.title) {
      closeTitleEdition(todos, todo.id);
    } else {
      todoTitleEdition(todo, newTitle, todos);
    }
  };

  return (
    <form>
      <input
        data-cy="TodoTitleField"
        type="text"
        className="todo__title-field"
        placeholder="Empty todo will be deleted"
        value={newTitle}
        onChange={(e) => setNewTitle(e.target.value.trimStart())}
        onBlur={handleOnBlur}
        onKeyDown={handleKeyDown}
        ref={input => isFocusedOnTask && input && input.focus()}
      />
    </form>
  );
};
