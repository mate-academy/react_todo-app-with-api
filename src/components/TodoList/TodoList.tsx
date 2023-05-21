import React from 'react';
import { Todo } from '../../types/Todo';
import { TodoInfo } from '../TodoInfo/TodoInfo';

type Props = {
  todos: Todo[];
  onDelete: (todoToDelete: Todo) => void;
  tempTodo: Todo | null;
  updateTodo: (todoId: number, completed: boolean) => Promise<void>;
  handleTitleEdit: (todoId: number, titles: string) => Promise<void>;
};

export const TodoList: React.FC<Props> = ({
  todos,
  onDelete,
  tempTodo,
  updateTodo,
  handleTitleEdit,
}) => {
  const createTodo = tempTodo?.id === 0;

  return (
    <section className="todoapp__main">
      {todos.map(todo => (
        <TodoInfo
          key={todo.id}
          todo={todo}
          onDelete={onDelete}
          updateTodo={updateTodo}
          updateTitle={handleTitleEdit}
        />
      ))}

      {createTodo && (
        <TodoInfo
          todo={tempTodo}
          tempTodoId={tempTodo.id}
        />
      )}
    </section>
  );
};
