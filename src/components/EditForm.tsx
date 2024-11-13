import { useEffect, useRef, useState } from 'react';
import { Todo } from '../types/Todo';
import { Loader } from './Loader';

type Props = {
  editTodo: Todo | null;
  updtTodo: (id: number, data: Partial<Todo>) => Promise<Todo>;
  deleteTodo: (id: number) => Promise<void>;
  setLoadingTodosIds: (todos: number[]) => void;
  loadingTodosIds: number[];
  todo: Todo;
  setEditTodo: (todo: Todo | null) => void;
};

export const EditForm: React.FC<Props> = ({
  editTodo,
  updtTodo,
  deleteTodo,
  setLoadingTodosIds,
  loadingTodosIds,
  todo,
  setEditTodo,
}) => {
  const [newValue, setNewValue] = useState(editTodo?.title || '');
  const editField = useRef<HTMLInputElement>(null);

  useEffect(() => {
    editField.current?.focus();
  }, []);

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
          setEditTodo(todo);
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

  const onKeyEscape = () => {
    setEditTodo(null);
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
      <form onSubmit={handleSubmit}>
        <input
          data-cy="TodoTitleField"
          type="text"
          className="todo__title-field"
          placeholder="Empty todo will be deleted"
          value={newValue}
          ref={editField}
          onChange={event => setNewValue(event.target.value)}
          onBlur={handleOnBlur}
          onKeyDown={onKeyDownHandle}
        />
      </form>

      <Loader loadingTodosIds={loadingTodosIds} todo={todo} />
    </>
  );
};
