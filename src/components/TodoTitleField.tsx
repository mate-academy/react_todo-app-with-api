import React, { useCallback, useState } from 'react';
import { Todo } from '../types/Todo';

type Props = {
  todo: Todo,
  onDeleteTodo: (value: number) => void,
  setSelectId: React.Dispatch<React.SetStateAction<number>>,
  changeTodo: (id: number, data: Partial<Todo>) => Promise<void>,
};

export const TodoTitleField: React.FC<Props> = ({
  todo,
  onDeleteTodo,
  setSelectId,
  changeTodo,
}) => {
  const { id, title } = todo;
  const [query, setQuery] = useState('');
  const [doubleClick, setDoubleClick] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };

  const handleSubmit = (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    setDoubleClick(false);
  };

  const simpleTitle = useCallback(() => {
    if (title === query) {
      setDoubleClick(false);

      return;
    }

    if (!query) {
      onDeleteTodo(id);
    }

    changeTodo(id, { title: query });
    setDoubleClick(false);
  }, [query]);

  const handleDoubleClick = () => {
    setDoubleClick(true);
    setQuery(title);
  };

  const pressedEnter = (e: { key: string; }) => {
    if (e.key === 'Enter') {
      simpleTitle();
    }

    if (e.key === 'Escape') {
      setDoubleClick(false);
    }
  };

  const losesBlur = () => {
    simpleTitle();
  };

  return (
    <>
      {doubleClick ? (
        <form
          onSubmit={handleSubmit}
        >
          <input
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            value={query}
            onChange={handleChange}
            onKeyDown={pressedEnter}
            onBlur={losesBlur}
          />
        </form>
      ) : (
        <>
          <span
            data-cy="TodoTitle"
            className="todo__title"
            onDoubleClick={handleDoubleClick}
          >
            {title}
          </span>
          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDeleteButton"
            onClick={() => {
              onDeleteTodo(id);
              setSelectId(id);
            }}
          >
            ×
          </button>
        </>
      )}
    </>
  );
};
