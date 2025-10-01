import {
  FC,
  FormEvent,
  KeyboardEvent,
  useEffect,
  useRef,
  useState,
} from 'react';

type Props = {
  title: string;
  todoId: number;
  setIsEditing: (isEditing: boolean) => void;
  editTodoTitle?: (todoId: number, title: string) => void;
  onDeleteTodo?: (id: number) => void;
};

const TodoEditForm: FC<Props> = ({
  title,
  todoId,
  setIsEditing,
  editTodoTitle,
  onDeleteTodo,
}) => {
  const [query, setQuery] = useState(title);
  const editingInput = useRef<HTMLInputElement | null>(null);

  const onEscKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Escape') {
      setIsEditing(false);
    }
  };

  const onInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
  };

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();

    const trimmedQuery = query.trim();

    if (trimmedQuery === '') {
      const response = await onDeleteTodo?.(todoId);

      if (response) {
        setIsEditing(false);
      }

      return;
    }

    if (trimmedQuery !== title) {
      const response = await editTodoTitle?.(todoId, trimmedQuery);

      if (response) {
        setIsEditing(false);
      }
    } else {
      setIsEditing(false);
    }
  };

  const onBlur = async () => {
    const trimmedQuery = query.trim();

    if (trimmedQuery === '') {
      const response = await onDeleteTodo?.(todoId);

      if (response) {
        setIsEditing(false);
      }

      return;
    }

    if (trimmedQuery !== title) {
      const response = await editTodoTitle?.(todoId, trimmedQuery);

      if (response) {
        setIsEditing(false);
      }
    } else {
      setIsEditing(false);
    }
  };

  useEffect(() => {
    editingInput.current?.focus();
  }, []);

  return (
    <form onSubmit={onSubmit}>
      <input
        ref={editingInput}
        data-cy="TodoTitleField"
        type="text"
        className="todo__title-field"
        value={query}
        onChange={onInputChange}
        onBlur={onBlur}
        onKeyDown={onEscKeyDown}
        autoFocus
      />
    </form>
  );
};

export default TodoEditForm;
