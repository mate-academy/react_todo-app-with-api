import { FC, memo } from 'react';
import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem';

type Props = {
  todos: Todo[]
  onDeleteTodo: (id: number) => unknown
  processings: number[]
  onTodoUpdate: (changedTodo: Todo) => unknown
};

export const TodoList: FC<Props> = memo(({
  todos, onDeleteTodo, processings, onTodoUpdate,
}) => (
  <>
    {todos.map(todo => (
      <TodoItem
        key={todo.id}
        todo={todo}
        onDelete={onDeleteTodo}
        isProcessing={processings.includes(todo.id)}
        onUpdate={onTodoUpdate}
      />
    ))}
  </>
));
