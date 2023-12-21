import { useState } from 'react';
import { Todo as TodoType } from '../../types/Todo';
import { Todo } from '../Todo/Todo';

interface Props {
  todos: TodoType[],
  onDelete: (id: number) => void,
  addTodo: (title: string, userId: number) => void;
  tempTodo: TodoType | null,
  updateTodos: (updatedTodo: TodoType) => void;
}

export const TodoList: React.FC<Props> = (
  {
    todos, onDelete, tempTodo, updateTodos,
  },
) => {
  const [editingTodoId, setEditingTodoId] = useState<number | null>(null);

  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => (
        <Todo
          key={todo.id}
          todo={todo}
          onDelete={onDelete}
          onUpdate={updateTodos}
          isEditing={editingTodoId === todo.id}
          setEditing={setEditingTodoId}
        />
      ))}

      {tempTodo && (
        <Todo
          key={tempTodo.id}
          todo={tempTodo}
        />
      )}
    </section>
  );
};
