import React, { memo } from 'react';
import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem/TodoItem';

type Props = {
  todos: Todo[],
  tempNewTodo: Todo | null,
  onDeleteTodo: (todoId: number) => void,
  processingTodoIds: number[],
  updateTodo: (
    todoId: number,
    fieldsToUpdate: Partial<Pick<Todo, 'title' | 'completed'>>
  ) => Promise<void>,
};

export const TodoList: React.FC<Props> = memo((props) => {
  const {
    todos,
    tempNewTodo,
    onDeleteTodo,
    processingTodoIds,
    updateTodo,
  } = props;

  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => (
        <TodoItem
          key={todo.id}
          todo={todo}
          onDeleteTodo={onDeleteTodo}
          processingTodoIds={processingTodoIds}
          updateTodo={updateTodo}
        />
      ))}

      {tempNewTodo && (
        <TodoItem
          todo={tempNewTodo}
          onDeleteTodo={onDeleteTodo}
          processingTodoIds={processingTodoIds}
          updateTodo={updateTodo}
        />
      )}
    </section>
  );
});
