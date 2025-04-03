/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */

import React from 'react';
import { Todos } from '../TodoItem/TodoItem';
import { Todo } from '../../types/Todo';

type Props = {
  todos: Todo[];
  deleteTodo: (id: number) => void;
  loadingTodo: number[];
  updateTodo: (todo: Todo) => void;
  editingTodoId: number | null;
  newTitleTodo: string;
  setNewTitleTodo: (title: string) => void;
  startEditing: (todo: Todo) => void;
  cancelEditing: () => void;
  toggleTodo: (todo: Todo) => void;
};

export const TodoList: React.FC<Props> = ({
  todos,
  deleteTodo,
  loadingTodo,
  updateTodo,
  editingTodoId,
  newTitleTodo,
  setNewTitleTodo,
  startEditing,
  cancelEditing,
  toggleTodo,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => (
        <Todos
          todo={todo}
          key={todo.id}
          deleteTodo={deleteTodo}
          loadingTodo={loadingTodo}
          updateTodo={updateTodo}
          isEditing={editingTodoId === todo.id}
          newTitleTodo={newTitleTodo}
          setNewTitleTodo={setNewTitleTodo}
          startEditing={startEditing}
          cancelEditing={cancelEditing}
          toggleTodo={toggleTodo}
        />
      ))}
    </section>
  );
};
