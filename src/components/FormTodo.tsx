import { useEffect, useRef, useState } from 'react';
import { Todo } from '../types/Todo';

type Props = {
  onSubmit: (todo: Todo) => Promise<void>;
  userId: number;
  onError: (error: string) => void;
  onSubmitTempTodo: (todo: Todo | null) => void;
  processingIds: number[];
};

export const NewTodoForm: React.FC<Props> = ({
  onSubmit,
  userId,
  onError,
  onSubmitTempTodo,
  processingIds,
}) => {
  const [title, setTitle] = useState('');
  const [isSubmiting, setIsSubmiting] = useState(false);

  const titleField = useRef<HTMLInputElement>(null);

  useEffect(() => {
    titleField.current?.focus();
  }, [processingIds.length]);

  const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value);
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    const normalisedTitle = title.trim();

    if (!normalisedTitle) {
      onError('Title should not be empty');

      return;
    }

    setIsSubmiting(true);

    const tempTodo = { userId, completed: false, title: normalisedTitle };

    const newTodo = {
      userId,
      completed: false,
      title: normalisedTitle,
      id: +new Date(),
    };

    onSubmitTempTodo({
      id: 0,
      ...tempTodo,
    });
    onSubmit(newTodo)
      .then(() => {
        setTitle('');
      })
      .catch(() => {
        onError('Unable to add a todo');
      })
      .finally(() => {
        setIsSubmiting(false);
        onSubmitTempTodo(null);
      });
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        data-cy="NewTodoField"
        type="text"
        className="todoapp__new-todo"
        placeholder="What needs to be done?"
        value={title}
        onChange={handleTitleChange}
        ref={titleField}
        disabled={isSubmiting}
      />
    </form>
  );
};
