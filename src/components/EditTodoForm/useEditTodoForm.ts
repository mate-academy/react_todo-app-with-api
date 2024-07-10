import {
  ChangeEvent,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import { TodoContext } from '../../context/Todo.context';
import { useDeleteTodo } from '../DeleteTodo/useDeleteTodo';
import { editTodo } from '../../api/todos';
import { ErrorContext } from '../../context/Error.context';

export interface UseEditTodoFormProps {
  id: number;
  title: string;
}

export const useEditTodoForm = ({ id, title }: UseEditTodoFormProps) => {
  const { onError } = useContext(ErrorContext);
  const { onEditTodo, onAddLoadingId, clearLoadingIds } =
    useContext(TodoContext);

  const [titleValue, setTitleValue] = useState(title);
  const [editMode, setEditMode] = useState(false);

  const { onDelete } = useDeleteTodo();

  const inputRef = useRef<HTMLInputElement | null>(null);

  const onDisableEditMode = () => {
    setEditMode(false);
  };

  const onCancelEditing = useCallback(() => {
    onDisableEditMode();
    setTitleValue(title);
  }, [title]);

  useEffect(() => {
    const callback = (event: KeyboardEvent) => {
      if (editMode && event.key === 'Escape') {
        onCancelEditing();
      }
    };

    document.addEventListener('keydown', callback);

    return () => {
      document.removeEventListener('keydown', callback);
    };
  }, [editMode, onCancelEditing]);

  useEffect(() => {
    if (editMode) {
      inputRef.current?.focus();
    }
  }, [editMode]);

  const onEnableEditMode = () => {
    setEditMode(true);
  };

  const onEditTitle = (event: ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;

    setTitleValue(value);
  };

  const onSubmit = async () => {
    const trimmedValue = titleValue.trim();

    if (!trimmedValue) {
      onDelete(id);

      return;
    }

    if (title === trimmedValue) {
      onCancelEditing();

      return;
    }

    try {
      onAddLoadingId(id);

      const response = await editTodo({ id, title: trimmedValue });

      onEditTodo(response);
      onDisableEditMode();
    } catch {
      onError('Unable to update a todo');
    } finally {
      clearLoadingIds();
    }
  };

  return {
    inputRef,
    titleValue,
    editMode,
    onEditTitle,
    onEnableEditMode,
    onSubmit,
  };
};
