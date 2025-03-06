import React, { useEffect, useRef, useState } from 'react';
import { USER_ID } from '../../api/todos';
import { Todo } from '../../types/Todo';

interface Props {
  todos: Todo[];
  onError: (error: string) => void;
  onAdd: (todo: Todo) => Promise<void>;
  onTempTodo: (todo: Todo | null) => void;
}

export const TodoForm: React.FC<Props> = ({
  todos,
  onError,
  onAdd,
  onTempTodo,
}) => {
  const [title, setTitle] = useState('');
  const [isDisabled, setIsDisabled] = useState(false);
  const refInput = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (refInput.current) {
      refInput.current.focus();
    }
  }, [todos, isDisabled]);

  const reset = () => {
    setTitle('');
    onTempTodo(null);
  };

  const handleOnSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (title.trim() === '') {
      onError('Title should not be empty');

      return;
    }

    setIsDisabled(true);

    const newTodo: Todo = {
      title: title.trim(),
      userId: USER_ID,
      id: 0,
      completed: false,
    };

    onTempTodo(newTodo);

    try {
      await onAdd(newTodo);
      reset();
    } catch {
      onError('Unable to add a todo');
    } finally {
      setIsDisabled(false);
    }
  };

  const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value);
  };

  return (
    <form onSubmit={handleOnSubmit}>
      <input
        data-cy="NewTodoField"
        type="text"
        className="todoapp__new-todo"
        placeholder="What needs to be done?"
        disabled={isDisabled}
        ref={refInput}
        value={title}
        onChange={handleTitleChange}
        autoFocus
      />
    </form>
  );
};
