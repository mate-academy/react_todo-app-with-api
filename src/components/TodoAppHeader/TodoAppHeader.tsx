import {
  ChangeEvent,
  FC,
  FormEvent,
  memo,
  useEffect,
  useRef,
} from 'react';
import cn from 'classnames';
import { TodoAppHeaderProps } from './TodoAppHeaderProps';

export const TodoAppHeader: FC<TodoAppHeaderProps> = memo(({
  todos,
  todoTitle,
  setTitle,
  handleUpdateAllStatus,
  isInputDisabled,
  setError,
  addTodo,
}) => {
  const formRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (formRef.current) {
      formRef.current.focus();
    }
  }, [todos]);

  const handleSubmit = (
    event: FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    if (!todoTitle.trim()) {
      setTitle('');
      setError('Title can\'t be empty');

      return;
    }

    addTodo(todoTitle);
  };

  const handleQueryChange = (
    event: ChangeEvent<HTMLInputElement>,
  ) => {
    setTitle(event.target.value);
  };

  const isAllTodoCompleted = todos.every(todo => todo.completed);

  return (
    <header className="todoapp__header">
      <button
        aria-label="toggle-all"
        type="button"
        className={cn('todoapp__toggle-all', {
          active: isAllTodoCompleted,
        })}
        onClick={handleUpdateAllStatus}
      />

      <form
        onSubmit={handleSubmit}
      >
        <input
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={todoTitle}
          onChange={handleQueryChange}
          disabled={isInputDisabled}
          ref={formRef}
        />
      </form>
    </header>
  );
});
