import { useEffect, useState } from 'react';
import { Todo } from '../types/Todo';
import { StatusFilter } from '../services/EnumStatusFilter';

type Props = {
  todos: Todo[],
  title: string,
  userId: number,
  onSetTitle: (t: string) => void,
  onTitleError: (t: string) => void,
  onTempTodo: (t: Todo | null) => void,
  onAddTodo: (t: Todo) => Promise<void>,
  checkedAllTodos: (todo: Todo) => Promise<void>,
  setToggle: (s: string) => void,
  fieldTitle: React.MutableRefObject<HTMLInputElement | null>,
};

export const Header:React.FC<Props> = ({
  todos,
  title,
  userId,
  onSetTitle,
  onTitleError,
  onTempTodo,
  onAddTodo,
  checkedAllTodos,
  setToggle,
  fieldTitle,
}) => {
  const [disabledField, setDisabledField] = useState(false);

  useEffect(() => {
    if (fieldTitle.current) {
      fieldTitle.current.focus();
    }
  }, [disabledField, fieldTitle]);

  const handleAllCheckedTrue = (tods: Todo[]) => {
    tods.map((todo) => {
      setToggle(StatusFilter.COMPLETED);

      return (!todo.completed) && checkedAllTodos({ ...todo, completed: true })
        .finally(() => setToggle(''));
    });
  };

  const handleAllCheckedFalse = (tods: Todo[]) => {
    tods.map((todo) => {
      setToggle(StatusFilter.ACTIVE);

      return checkedAllTodos({ ...todo, completed: false })
        .finally(() => setToggle(''));
    });
  };

  const handleCheckeds = () => {
    return todos.every((todo) => todo.completed)
      ? handleAllCheckedFalse(todos)
      : handleAllCheckedTrue(todos);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      onTitleError('Title should not be empty');
      setTimeout(() => {
        onTitleError('');
      }, 3000);
    } else {
      const id = 0;
      const trimTitle = title.trim();
      const notComplete = false;

      const newTodo = {
        id,
        userId,
        title: trimTitle,
        completed: notComplete,
      };

      onTempTodo(newTodo);

      setDisabledField(true);
      onAddTodo(newTodo)
        .finally(() => {
          setDisabledField(false);
          onTempTodo(null);
        });
    }
  };

  return (
    <header className="todoapp__header">
      {todos.length > 0 && (
        <button
          aria-label="toggle-all"
          type="button"
          className={todos.every((todo) => todo.completed)
            ? 'todoapp__toggle-all active'
            : 'todoapp__toggle-all'}
          data-cy="ToggleAllButton"
          onClick={handleCheckeds}
        />
      )}

      {/* Add a todo on form submit */}
      <form
        onSubmit={handleSubmit}
      >
        <input
          data-cy="NewTodoField"
          type="text"
          ref={fieldTitle}
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={title}
          onChange={(e) => {
            onSetTitle(e.target.value);
          }}
          disabled={disabledField}
        />
      </form>
    </header>
  );
};
