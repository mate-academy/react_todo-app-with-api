import { Dispatch, FormEvent, RefObject, SetStateAction } from 'react';
import { updateTodos } from '../api/todos';
import { ErrorMessages, Todo } from '../types';

type Props = {
  preparedTodos: Todo[];

  onSetTodoIdLoading: (id: number[]) => void;
  onSetError: (error: ErrorMessages) => void;
  onSetActiveForm: Dispatch<SetStateAction<number>>;
  editInputRef?: RefObject<HTMLInputElement | null> | undefined;
  handleDeleteTodos: (id: number) => void;
};

export const useUpdateTodo = ({
  preparedTodos,

  onSetTodoIdLoading,
  onSetError,
  onSetActiveForm,
  handleDeleteTodos,
  editInputRef,
}: Props) => {
  const handleUpdateTodos = async (
    id: number,
    text: string,
    event?: FormEvent<HTMLFormElement>,
  ) => {
    if (event) {
      event.preventDefault();
    }

    if (!text.trim()) {
      handleDeleteTodos(id);

      return;
    }

    const origilalTitle: string | null =
      preparedTodos.find(i => i.id === id)?.title || null;

    if (origilalTitle === null) {
      return;
    }

    if (origilalTitle === text) {
      onSetActiveForm(-1);

      return;
    }

    const preparedForUpdate: Todo | undefined = preparedTodos.find(
      i => i.id === id,
    );

    if (!preparedForUpdate || !origilalTitle) {
      return;
    }

    preparedForUpdate.title = text.trim();
    onSetTodoIdLoading([id]);
    try {
      await updateTodos({ ...preparedForUpdate }, id);
      onSetActiveForm(-1);
    } catch (err) {
      onSetError(ErrorMessages.Update);
      if (editInputRef) {
        editInputRef.current?.focus();
      }
    } finally {
      onSetTodoIdLoading([]);
    }
  };

  return { handleUpdateTodos };
};
