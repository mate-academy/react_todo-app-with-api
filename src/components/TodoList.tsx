import { useState } from 'react';
import { Todo } from '../types/Todo';
import { TodoItem } from './TodoItem';

type Props = {
  todos: Todo[],
  onDeleteTodo: (todoId: number) => void,
  tempTodo: Todo | null,
  loadingTodoId: number[],
  onToggleTodoStatus: (todoId: number, completed: boolean) => void,
  onChangeTodoTitle: (todoId: number, newTitle: string) => void,
};

export const TodoList: React.FC<Props> = ({
  todos,
  onDeleteTodo,
  tempTodo,
  loadingTodoId,
  onToggleTodoStatus,
  onChangeTodoTitle,
}) => {
  const [loading] = useState(true);

  return (
    <ul className="todoapp__main">
      {todos.map(todo => (
        <TodoItem
          todo={todo}
          key={todo.id}
          onDeleteTodo={onDeleteTodo}
          loading={loadingTodoId.includes(todo.id)}
          onToggleTodoStatus={onToggleTodoStatus}
          onChangeTodoTitle={onChangeTodoTitle}

        />
      ))}
      {tempTodo && (
        <TodoItem
          key={tempTodo.id}
          todo={tempTodo}
          onDeleteTodo={onDeleteTodo}
          loading={loading}
          onToggleTodoStatus={onToggleTodoStatus}
          onChangeTodoTitle={onChangeTodoTitle}
        />
      )}
    </ul>
  );
};
