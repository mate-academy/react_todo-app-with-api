import React, { useContext } from 'react';
import { Todo, UpdateTodoframent } from '../types/Todo';
import { StateContext } from './StateContext';
import { TodoItem } from './TodoItem';
import { TodoItemPreview } from './TodoItemPreview';

interface Props {
  todos: Todo[];
  onDelete: (todoId: number) => void;
  onUpdate: (todoId: number, data: UpdateTodoframent) => void;
}

export const TodoList: React.FC<Props> = React.memo((props) => {
  const { todos, onDelete, onUpdate } = props;

  const { isCreatingTodo } = useContext(StateContext);

  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.length > 0 && todos.map(todo => (
        <TodoItem
          key={todo.id}
          todo={todo}
          onDelete={onDelete}
          onUpdate={onUpdate}
        />
      ))}
      {isCreatingTodo && <TodoItemPreview />}
    </section>
  );
});
