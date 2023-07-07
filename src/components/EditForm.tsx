import React, { ChangeEvent, FormEvent, useState } from 'react';
import { client } from '../utils/fetchClient';
import { Todo } from '../types/Todo';

type Props = {
  todo: Todo;
  todos: Todo[];
  setTodos: (calueL: Todo[]) => void;
  formRef: React.RefObject<HTMLInputElement> | null;
};

export const EditForm: React.FC<Props> = ({
  todo,
  todos,
  setTodos,
  formRef,
}) => {
  const [newTodoTitle, setNewTodoTitle] = useState(todo.title);

  const handleTodoTitleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setNewTodoTitle(event.target.value);
  };

  const updateTodoTitle = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const updatedTodo = await client.patch<Todo>(`/todos/${todo.id}`, {
      title: newTodoTitle,
    });

    const updatedTodos = todos.map(item => (
      item.id === updatedTodo.id ? updatedTodo : item
    ));

    setTodos(updatedTodos);
  };

  return (
    <form onSubmit={updateTodoTitle}>
      <input
        type="text"
        className="todo__title-field"
        placeholder="Note: Empty title deletes a Todo"
        value={newTodoTitle}
        onChange={handleTodoTitleChange}
        ref={formRef}
      />
    </form>
  );
};
