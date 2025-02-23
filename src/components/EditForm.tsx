import { useEffect, useRef, useState } from 'react';
import { Todo } from '../types/Todo';
import { Loader } from './Loader';

type Props = {
  editTodo: Todo | null;
  setEditTodo: (todo: Todo | null) => void;
  updtTodo: (id: number, data: Partial<Todo>) => Promise<Todo>;
  loadingTodosIds: number[];
  setLoadingTodosIds: (todos: number[]) => void;
  deleteTodo: (id: number) => Promise<void>;
};

export const EditForm: React.FC<Props> = ({
  editTodo,
  setEditTodo,
  updtTodo,
  loadingTodosIds,
  setLoadingTodosIds,
  deleteTodo,
}) => {
  const [newValue, setNewValue] = useState(editTodo?.title || '');
  const editField = useRef<HTMLInputElement>(null);

  const isTodoLoading = editTodo
    ? loadingTodosIds.includes(editTodo.id)
    : false;

  useEffect(() => {
    editField.current?.focus();
  }, []);

  const onKeyEscape = () => {
    setEditTodo(null);
  };

  const prevValue = editTodo?.title || '';

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    if (prevValue === newValue) {
      setEditTodo(null);

      return;
    }

    if (editTodo) {
      setLoadingTodosIds([...loadingTodosIds, editTodo.id]);

      updtTodo(editTodo.id, { title: newValue?.trim() })
        .then(() => {
          setEditTodo(null);
        })
        .catch(() => {
          setEditTodo(editTodo);
        })
        .finally(() =>
          setLoadingTodosIds(loadingTodosIds.filter(id => id !== editTodo.id)),
        );
    }
  };

  const handleOnBlur = (event: React.FormEvent) => {
    if (newValue?.trim().length === 0) {
      setLoadingTodosIds([...loadingTodosIds, editTodo?.id || 0]);

      if (editTodo) {
        deleteTodo(editTodo.id).finally(() =>
          setLoadingTodosIds(loadingTodosIds.filter(id => id !== editTodo.id)),
        );
      }

      return;
    }

    handleSubmit(event);
  };

  const onKeyEnter = (event: React.KeyboardEvent) => {
    event.preventDefault();

    if (!newValue?.trim().length) {
      setLoadingTodosIds([...loadingTodosIds, editTodo?.id || 0]);

      if (editTodo) {
        deleteTodo(editTodo.id).finally(() =>
          setLoadingTodosIds(loadingTodosIds.filter(id => id !== editTodo.id)),
        );
      }

      return;
    }

    handleSubmit(event);
  };

  const onKeyDownHandle = (event: React.KeyboardEvent) => {
    switch (event.key) {
      case 'Enter':
        onKeyEnter(event);
        break;
      case 'Escape':
        onKeyEscape();
        break;
    }
  };

  return (
    <>
      <form>
        <input
          data-cy="TodoTitleField"
          type="text"
          className="todo__title-field"
          placeholder="Empty todo will be deleted"
          value={newValue}
          ref={editField}
          onBlur={handleOnBlur}
          onChange={event => setNewValue(event.target.value)}
          onKeyDown={onKeyDownHandle}
        />
      </form>

      {isTodoLoading && <Loader isLoading={isTodoLoading} />}
    </>
  );
};
