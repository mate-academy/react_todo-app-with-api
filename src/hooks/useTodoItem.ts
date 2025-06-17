import { useEffect, useRef, useState } from 'react';
import { Todo } from '../types/Todo';
import { UpdateTodo } from '../types/UpdateTodo';

interface UseTodoItemProps {
  todo: Todo;
  updateTitle: string;
  onChangeDeletedTodoId: (deletedTodoId: Todo['id']) => void;
  onDeleteTodo: (todoId: Todo['id']) => void;
  onChangeTodo: ({ id, title, completed }: UpdateTodo) => Promise<void>;
  onToggledTodoId: (toggledTodoId: Todo['id']) => void;
  onUpdateTitle: (updateTitle: string) => void;
}

export const useTodoItem = ({
  todo,
  updateTitle,
  onChangeDeletedTodoId,
  onDeleteTodo,
  onChangeTodo,
  onToggledTodoId,
  onUpdateTitle,
}: UseTodoItemProps) => {
  const [isVisibleFormForChange, setIsVisibleFormForChange] = useState(true);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!isVisibleFormForChange) {
      inputRef.current?.focus();
    }
  }, [isVisibleFormForChange]);

  const handleChangeTitle = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    inputRef.current?.blur();
  };

  const handleOnDelete = async () => {
    onChangeDeletedTodoId(todo.id);
    onDeleteTodo(todo.id);
  };

  const handleChangeTitleOnBlur = async ({
    id,
    title,
    completed,
  }: Omit<Todo, 'userId'>) => {
    if (updateTitle === '') {
      try {
        await handleOnDelete();
      } finally {
        onToggledTodoId(0);
        setIsVisibleFormForChange(false);
      }
    } else {
      if (updateTitle !== todo.title) {
        try {
          await onChangeTodo({
            id,
            title,
            completed,
          });
        } catch (error) {
          if (error instanceof Error) {
            setIsVisibleFormForChange(false);
          }
        }
      } else {
        onToggledTodoId(0);
      }
    }

    inputRef.current?.blur();
  };

  const handleOnBlur = () => {
    const trimmedTitle = updateTitle.trim();

    setIsVisibleFormForChange(true);
    onToggledTodoId(todo.id);
    handleChangeTitleOnBlur({
      id: todo.id,
      title: trimmedTitle,
      completed: todo.completed,
    });
    onUpdateTitle(todo.title);
  };

  const handleOnKeyUp = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Escape') {
      setIsVisibleFormForChange(true);
      onUpdateTitle(todo.title);
    }
  };

  const handleClickCheckbox = () => {
    onChangeTodo({
      id: todo.id,
      title: todo.title,
      completed: !todo.completed,
    });
    onToggledTodoId(todo.id);
  };

  return {
    isVisibleFormForChange,
    setIsVisibleFormForChange,
    inputRef,
    handleChangeTitle,
    handleOnDelete,
    handleOnBlur,
    handleOnKeyUp,
    handleClickCheckbox,
  };
};
