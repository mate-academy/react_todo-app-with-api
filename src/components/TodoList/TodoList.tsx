import { memo } from 'react';
import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem/TodoItem';

interface Props {
  todos: Todo[],
  newTodoField: React.RefObject<HTMLInputElement>;
  onDeleteTodo: (todoId: number) => Promise<any>;
  onChangeTodoStatus: (todoId: number, status: boolean) => void;
  tempTodo: Todo | null;
  deletingTodoIds: number[];
  onUpdateTodo: (
    todoId: number,
    fieldsToUpdate: Partial<Todo>
  ) => Promise<void>;
}

export const TodoList: React.FC<Props> = memo(({
  todos,
  newTodoField,
  onDeleteTodo,
  onChangeTodoStatus,
  tempTodo,
  deletingTodoIds,
  onUpdateTodo,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map((todo => (
        <TodoItem
          todo={todo}
          key={todo.id}
          onDeleteTodo={onDeleteTodo}
          onChangeTodoStatus={onChangeTodoStatus}
          isDeleting={deletingTodoIds.includes(todo.id)}
          onUpdateTodo={onUpdateTodo}
          newTodoField={newTodoField}
        />
      )))}

      {tempTodo && (
        <TodoItem
          todo={tempTodo}
          onDeleteTodo={onDeleteTodo}
          onChangeTodoStatus={onChangeTodoStatus}
          isDeleting={deletingTodoIds.includes(tempTodo.id)}
          onUpdateTodo={onUpdateTodo}
          newTodoField={newTodoField}
        />
      )}
    </section>
  );
});
