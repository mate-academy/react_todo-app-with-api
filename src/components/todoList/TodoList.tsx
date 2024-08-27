import { FC, useState } from 'react';

import { TodoItem } from '../todoItem/TodoItem';
import { Todo } from '../../types/Todo';

interface Props {
  todoList: Todo[];
  tempTodo: Todo | null;
}

export const TodoList: FC<Props> = ({ todoList, tempTodo }) => {
  const [editingTodoId, setEditingTodoId] = useState<number | null>(null);

  const handleDoubleClick = (id: number) => {
    setEditingTodoId(id);
  };

  const handleSave = () => {
    setEditingTodoId(null);
  };

  const handleCancel = () => {
    setEditingTodoId(null);
  };

  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todoList.map(todo => (
        <TodoItem
          key={todo.id}
          todo={todo}
          isEditing={todo.id === editingTodoId}
          onEdit={handleDoubleClick}
          onSave={handleSave}
          onCancel={handleCancel}
        />
      ))}
      {tempTodo && <TodoItem todo={tempTodo} />}
    </section>
  );
};
