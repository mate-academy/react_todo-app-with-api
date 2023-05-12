import { useEffect, useRef, useState } from 'react';
import { USER_ID } from '../../constants/userid';
import { Todo } from '../../types/Todo';
import { validateTitle } from '../../utils/validateTitle';

interface Props {
  onSetErrorMessage: React.Dispatch<React.SetStateAction<string>>
  uploadTodo: (
    addedTodo: Omit<Todo, 'id'>, temporaryTodo: Todo | null
  ) => Promise<void>
}

export const NewTodo: React.FC<Props> = ({
  onSetErrorMessage,
  uploadTodo,
}) => {
  const [title, setTitle] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialRender, setIsInitialRender] = useState<boolean>(true);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!isInitialRender && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isLoading, isInitialRender]);

  const handleInputTodo = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value);
  };

  const handleTodoAddition = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsLoading(true);

    const errorMessage = validateTitle(title);

    if (errorMessage) {
      setTitle('');
      onSetErrorMessage(errorMessage);
      setIsLoading(false);

      return;
    }

    const addedTodo = {
      userId: USER_ID,
      title: title.trim(),
      completed: false,
    };

    const temporaryTodo = {
      id: 0,
      userId: USER_ID,
      title: title.trim(),
      completed: false,
    };

    setTitle('');
    await uploadTodo(addedTodo, temporaryTodo);
    setIsInitialRender(false);
    setIsLoading(false);
  };

  return (
    <form
      action="#"
      method="POST"
      onSubmit={handleTodoAddition}
    >
      <input
        type="text"
        className="todoapp__new-todo"
        placeholder="What needs to be done?"
        value={title}
        onChange={handleInputTodo}
        disabled={isLoading}
        ref={inputRef}
      />
    </form>
  );
};
