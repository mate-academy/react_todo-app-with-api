import React, { useState } from 'react';
import { removeTodos, updateTodos } from '../../api/todos';
import { Todo } from '../../types/Todo';

type Props = {
  oldValue: string;
  setCallUpdatingForm: React.Dispatch<React.SetStateAction<number | null>>;
  todo: Todo;
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>;
  setErrorMesage: React.Dispatch<React.SetStateAction<string>>;
  setLoader: React.Dispatch<React.SetStateAction<number | null>>;
};

export const UpdateToDo: React.FC<Props> = ({
  oldValue,
  setCallUpdatingForm,
  todo,
  setTodos,
  setErrorMesage,
  setLoader,
}) => {
  const [updatedValue, setUpdatedValue] = useState<string>(oldValue);
  const handleUpdatingOnChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setUpdatedValue(event.target.value);
  };

  const id = todo.id ?? -1;

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Escape') {
      return setCallUpdatingForm(null);
    }
  };

  const handleOnBlur = async () => {
    setLoader(id);

    if (!updatedValue) {
      setLoader(id);
      removeTodos(id)
        .then(() => {
          setTodos(prev => prev.filter(el => el.id !== id));
          setLoader(null);
        })
        // eslint-disable-next-line no-console
        .catch(() => {
          setTimeout(() => {
            setErrorMesage('Unable to delete a todo');
          }, 300);
        })
        .finally(() => {
          setErrorMesage('');
        });

      return;
    }

    try {
      const updatedTodo: Todo = await updateTodos(id, {
        ...todo,
        title: updatedValue.trim(),
      });

      setTodos(prev =>
        prev.map(item => (item.id === updatedTodo.id ? updatedTodo : item)),
      );
      setCallUpdatingForm(null);
    } catch {
      setTimeout(() => {
        setErrorMesage('Unable to update a todo');
      }, 300);
    } finally {
      setLoader(null);
      setErrorMesage('');
    }
  };

  const handleUpdatingForm = async (
    event: React.FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    if (!updatedValue) {
      setLoader(id);
      removeTodos(id)
        .then(() => {
          setTodos(prev => prev.filter(el => el.id !== id));
          setLoader(null);
        })
        // eslint-disable-next-line no-console
        .catch(() => {
          setTimeout(() => {
            setErrorMesage('Unable to delete a todo');
          }, 300);
        })
        .finally(() => {
          setErrorMesage('');
        });

      return;
    }

    if (updatedValue === oldValue) {
      setCallUpdatingForm(null);

      return;
    }

    setLoader(id);

    try {
      const updatedTodo: Todo = await updateTodos(id, {
        ...todo,
        title: updatedValue.trim(),
      });

      setTodos(prev =>
        prev.map(item => (item.id === updatedTodo.id ? updatedTodo : item)),
      );
      setCallUpdatingForm(null);
    } catch {
      setTimeout(() => {
        setErrorMesage('Unable to update a todo');
      }, 300);
    } finally {
      setLoader(null);
      setErrorMesage('');
    }
  };

  return (
    <form onSubmit={event => handleUpdatingForm(event)}>
      <input
        data-cy="TodoTitleField"
        type="text"
        className="todo__title-field"
        placeholder="Empty todo will be deleted"
        value={updatedValue}
        onBlur={handleOnBlur}
        autoFocus
        onChange={handleUpdatingOnChange}
        onKeyDown={handleKeyDown}
      />
    </form>
  );
};
