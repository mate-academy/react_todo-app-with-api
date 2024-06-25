import React, { memo, useEffect, useState } from 'react';

import { Todo } from '../../types/Todo';

interface Props {
  todoUpdate: Todo;
  onUpdate(todos: Todo[]): Promise<PromiseSettledResult<void>[]>;
  onSelectTodo: (todo: Todo | null) => void;
  onDelete: (id: number[]) => void;
  titleField: React.RefObject<HTMLInputElement>;
}

export const TodoFormUpdate: React.FC<Props> = memo(
  function TodoFormUpdateComponent({
    todoUpdate,
    onUpdate,
    onSelectTodo,
    onDelete,
    titleField,
  }) {
    const [title, setTitle] = useState(todoUpdate.title);

    useEffect(() => {
      if (titleField.current) {
        titleField.current.focus();
      }
    }, [titleField]);

    const handleSubmit = (event: React.FormEvent) => {
      event.preventDefault();

      const normalizeTitle = title.trim();

      if (normalizeTitle === todoUpdate.title) {
        onSelectTodo(null);

        return;
      }

      if (!normalizeTitle) {
        onDelete([todoUpdate.id]);

        return;
      }

      onUpdate([{ ...todoUpdate, title: normalizeTitle }]);
    };

    return (
      <form onSubmit={handleSubmit}>
        <input
          data-cy="TodoTitleField"
          type="text"
          className="todo__title-field"
          placeholder="Empty todo will be deleted"
          value={title}
          ref={titleField}
          onBlur={event => handleSubmit(event)}
          onChange={event => setTitle(event.target.value)}
          onKeyUp={event => event.key === 'Escape' && onSelectTodo(null)}
        />
      </form>
    );
  },
);
