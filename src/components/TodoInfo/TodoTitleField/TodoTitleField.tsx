import React, { useEffect, useRef, useState } from 'react';
import { upDateTodo } from '../../../api/todos';
import { Todo } from '../../../types/Todo';

type Props = {
  todo: Todo,
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>,
  setIsTodoTitleField: React.Dispatch<React.SetStateAction<boolean>>,
  setHasLoader: React.Dispatch<React.SetStateAction<boolean>>,
  removeTodo: (todo: Todo) => Promise<void>,
  handleError: ((textError: string) =>
  () => void) | (() => void),
};

export const TodoTitleField: React.FC<Props> = ({
  todo, setTodos, setIsTodoTitleField, setHasLoader, removeTodo, handleError,
}) => {
  const { title, id } = todo;
  const titleInput = useRef<HTMLInputElement>(null);
  const [value, setValue] = useState(title);

  useEffect(() => {
    if (titleInput.current) {
      titleInput.current.focus();
    }
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => setValue(e.target.value);

  const upDateDate = (
    e: React.KeyboardEvent<HTMLInputElement>
    | React.FocusEvent<HTMLInputElement, Element>,
  ) => {
    setIsTodoTitleField(false);

    return upDateTodo(id, { title: e.target.value })
      .then(response => {
        setTodos(currentTodos => {
          const currentTodo = currentTodos.find(itemTodo => itemTodo.id === id);

          if (currentTodo) {
            currentTodo.title = response.title;
          }

          return [
            ...currentTodos,
          ];
        });
      })
      .catch(() => {
        handleError('Unable to update a todo');
      })
      .finally(() => {
        setHasLoader(false);
        setIsTodoTitleField(false);
      });
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    switch (e.key) {
      case 'Escape':
        setIsTodoTitleField(false);
        break;
      case 'Enter':
        if (e.target.value === title) {
          setIsTodoTitleField(false);

          return;
        }

        if (!value) {
          removeTodo(todo);

          return;
        }

        setHasLoader(true);
        upDateDate(e);
        break;
      default:
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement, Element>) => {
    if (e.target.value === title) {
      setIsTodoTitleField(false);

      return;
    }

    if (!value) {
      setIsTodoTitleField(false);
      setHasLoader(true);
      removeTodo(todo);

      return;
    }

    setHasLoader(true);
    upDateDate(e);
  };

  return (
    <input
      ref={titleInput}
      value={value}
      data-cy="TodoTitleField"
      className="todo__title-field"
      type="text"
      placeholder="Emply todo will be deleted"
      onChange={handleChange}
      onKeyDown={handleKeyDown}
      onBlur={handleBlur}
    />
  );
};
