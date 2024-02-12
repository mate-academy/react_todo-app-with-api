import { useCallback, useEffect, useState } from 'react';
import { Todo } from '../../types/Todo';
import { useTodoContext } from '../../context/TodoContext';

export const TodoEditItem = ({ todo, closeEditForm }: {
  todo: Todo; closeEditForm: () => void
}) => {
  const [titleVal, setTitleVal] = useState(todo.title);
  const { updateTodo, removeTodo } = useTodoContext();

  const handleKeyUp = (e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      closeEditForm();
    }
  };

  const handleSubmit = useCallback((
    e: React.FormEvent<HTMLFormElement>
    | React.FocusEvent<HTMLInputElement, Element>,
  ) => {
    e.preventDefault();
    if (todo.title === titleVal) {
      closeEditForm();

      return;
    }

    if (titleVal === '') {
      removeTodo(todo.id);

      return;
    }

    updateTodo(todo.id, { title: titleVal }).then(() => {
      closeEditForm();
    });
  }, [closeEditForm, removeTodo, updateTodo, titleVal, todo.id, todo.title]);

  useEffect(() => {
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keyup', handleKeyUp);
    };
  });

  return (
    <form onSubmit={handleSubmit}>
      <input
        // eslint-disable-next-line jsx-a11y/no-autofocus
        autoFocus
        type="text"
        className="todo__title-field"
        placeholder="Empty todo will be deleted"
        value={titleVal}
        onChange={(e) => setTitleVal(e.target.value)}
        onBlur={handleSubmit}
      />
    </form>
  );
};
