/* eslint-disable jsx-a11y/control-has-associated-label */
import cn from 'classnames';
import { useEffect, useState } from 'react';
import { Todo } from '../types/Todo';

type Props = {
  userId: number;
  onSubmit: (todo: Todo) => Promise<void>,
  selectedTodo: Todo | null,
  todos: Todo[]
  myInputRef:React.RefObject<HTMLInputElement>
  setAllCompleted: () => void,
};

export const Header: React.FC<Props> = ({
  onSubmit,
  userId,
  selectedTodo,
  myInputRef,
  todos,
  setAllCompleted,
}) => {
  const [title, setTitle] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleToggle = () => {
    setAllCompleted();
  };

  const isAllCompleted = todos.every(todo => todo.completed);

  useEffect(() => {
    myInputRef.current?.focus();
  }, [title, myInputRef]);

  const reset = () => {
    setTitle('');
  };

  const handleSubmit = (event:React.FormEvent) => {
    event.preventDefault();

    setIsSubmitted(true);

    onSubmit({
      title: title.trim(),
      completed: false,
      userId,
      id: selectedTodo?.id || 0,
    })
      .then(reset)
      .catch(() => {
        myInputRef.current?.focus();
      })
      .finally(() => {
        setIsSubmitted(false);
      });
  };

  return (

    <header className="todoapp__header">
      {todos.length > 0 && (
        <button
          type="button"
          className={cn('todoapp__toggle-all', {
            active: isAllCompleted,
          })}
          data-cy="ToggleAllButton"
          onClick={handleToggle}
        />
      )}

      <form
        onSubmit={handleSubmit}
        onReset={reset}
      >
        <input
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          ref={myInputRef}
          value={title}
          onChange={(event) => setTitle(event.currentTarget.value)}
          disabled={isSubmitted}
        />
      </form>
    </header>
  );
};
