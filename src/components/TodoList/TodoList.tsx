import { memo } from 'react';
import { TodoItem } from '../TodoItem/TodoItem';
import { Todo } from '../../types/Todo';

type Props = {
  todos: Todo[];
  tempTodo: Todo | null;
  onDeleteTodo: (todoId: number) => Promise<void>;
  deletingTodoIds: number[];
  updateTodo: (
    todoId: number,
    updateData: Partial<Pick<Todo, 'title' | 'completed'>>,
  ) => Promise<void>;
  updatingTodoIds: number[];
};

export const TodoList: React.FC<Props> = memo((props) => {
  const {
    todos,
    tempTodo,
    onDeleteTodo,
    deletingTodoIds,
    updateTodo,
    updatingTodoIds,
  } = props;

  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => (
        <TodoItem
          todo={todo}
          key={todo.id}
          onDeleteTodo={onDeleteTodo}
          shouldshowLoader={
            deletingTodoIds.includes(todo.id)
              || updatingTodoIds.includes(todo.id)
          }
          updateTodo={updateTodo}
        />
      ))}

      {tempTodo && (
        <TodoItem
          todo={tempTodo}
          onDeleteTodo={onDeleteTodo}
          shouldshowLoader={deletingTodoIds.includes(tempTodo.id)}
          updateTodo={updateTodo}
        />
      )}
    </section>
  );
});
