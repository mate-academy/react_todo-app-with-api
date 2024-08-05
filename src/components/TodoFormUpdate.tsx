import React, { memo, useContext, useEffect, useState } from 'react';

import { TodosContext } from '../store/TodosContext';
import { Todo } from '../types/Todo';

export const TodoFormUpdate = memo(function TodoFormUpdateComponent() {
  const {
    titleField,
    deletedTodos,
    setSelectedTodo,
    updateTodos,
    selectedTodo,
  } = useContext(TodosContext);

  const todoUpdate = selectedTodo?.id ? selectedTodo : ({} as Todo);

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
      setSelectedTodo(null);

      return;
    }

    if (!normalizeTitle) {
      deletedTodos([todoUpdate.id]);

      return;
    }

    updateTodos([{ ...todoUpdate, title: normalizeTitle }]);
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
        onKeyUp={event => event.key === 'Escape' && setSelectedTodo(null)}
      />
    </form>
  );
});
