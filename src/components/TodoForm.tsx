import React, { memo, useContext, useState } from 'react';

import { USER_ID } from '../constans';
import { TodosContext } from '../store/TodosContext';
import { Todo } from '../types/Todo';

export const TodoForm = memo(function TodoFormComponent() {
  const { newError, setTempTodo, loading, setLoading, titleField, addTodo } =
    useContext(TodosContext);

  const [title, setTitle] = useState('');

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    const normalizeTitle = title.trim();

    if (!normalizeTitle) {
      newError('Title should not be empty');
      setLoading(false);

      return;
    }

    setLoading(true);

    const id = 0;

    const todo: Todo = {
      id: id,
      userId: USER_ID,
      completed: false,
      title: normalizeTitle,
    };

    setTempTodo(todo);

    addTodo(todo)
      .then(() => setTitle(''))
      .finally(() => setLoading(false));
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        data-cy="NewTodoField"
        type="text"
        className="todoapp__new-todo"
        placeholder="What needs to be done?"
        ref={titleField}
        value={title}
        disabled={loading}
        onChange={event => setTitle(event.target.value)}
      />
    </form>
  );
});
