import React, { memo } from 'react';
import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem/TodoItem';

type Props = {
  todos: Todo[],
  tempNewTodo: Todo | null,
  deleteTodo: (todoId: number) => void,
  processingTodoIds: number[],
  updateTodo: (todoToUpdate: Todo) => void,
  changeFilterStatus: (id: number, status: boolean) => void,
};

export const TodoList: React.FC<Props> = memo((props) => {
  const {
    todos,
    tempNewTodo,
    deleteTodo,
    processingTodoIds,
    updateTodo,
    changeFilterStatus,
  } = props;

  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => (
        <TodoItem
          key={todo.id}
          todo={todo}
          deleteTodo={deleteTodo}
          processingTodoIds={processingTodoIds}
          updateTodo={updateTodo}
          changeFilterStatus={changeFilterStatus}
        />
      ))}

      {tempNewTodo && (
        <TodoItem
          todo={tempNewTodo}
          deleteTodo={deleteTodo}
          processingTodoIds={processingTodoIds}
          updateTodo={updateTodo}
          changeFilterStatus={changeFilterStatus}
        />
      )}
    </section>
  );
});
