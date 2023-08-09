import { useState } from 'react';
import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem/TodoItem';

type Props = {
  todos: Todo[],
  onDeleteTodo: (todoId: number) => void,
  tempTodo: Todo | null,
  loadingTodoIds: number[],
  onToggleTodoStatus: (todoId: number, completed: boolean) => void,
  onChangeTodoTitle: (todoId: number, newTitle: string) => void,
};

export const TodoList: React.FC<Props> = ({
  todos,
  onDeleteTodo,
  tempTodo,
  loadingTodoIds,
  onToggleTodoStatus,
  onChangeTodoTitle,
}) => {
  const [loading] = useState(true);

  return (
    <section className="todoapp__main">
      <ul className="todo-list">
        {todos.map((todo) => (
          <TodoItem
            todo={todo}
            key={todo.id}
            onDeleteTodo={onDeleteTodo}
            loading={loadingTodoIds.includes(todo.id)}
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
    </section>
  );
};
