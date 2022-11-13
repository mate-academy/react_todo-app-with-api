import { FC, memo } from 'react';
import { Todo } from '../../types/Todo';
import { TodoInfo } from './TodoInfo';

type Props = {
  todos: Todo[];
  deleteTodo: (todoId: number) => Promise<void>;
  isAdding: boolean;
  tempTodo: Todo;
  deleteCompleted: boolean;
  handleTodoUpdate: (todoId: number, data: Partial<Todo>) => Promise<void>;
  isPatchingTodoIds: number[];
};

export const TodoList: FC<Props> = memo(({
  todos,
  deleteTodo,
  isAdding,
  tempTodo,
  deleteCompleted,
  handleTodoUpdate,
  isPatchingTodoIds,
}) => (
  <section className="todoapp__main" data-cy="TodoList">
    {todos.map(todo => (
      <TodoInfo
        key={todo.id}
        todo={todo}
        deleteTodo={deleteTodo}
        deleteCompleted={deleteCompleted}
        handleTodoUpdate={handleTodoUpdate}
        isPatchingTodoIds={isPatchingTodoIds}
      />
    ))}
    {isAdding && (
      <TodoInfo todo={tempTodo} isAdding={isAdding} />
    )}
  </section>
));
