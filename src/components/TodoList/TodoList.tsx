/* eslint-disable jsx-a11y/label-has-associated-control */

import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem';

type Props = {
  todos: Todo[];
  temporaryTodo: Todo | null;
  onDeleteTodo: (id: number) => void;
  inputRef: React.RefObject<HTMLInputElement>;
  onToggleTodoStatus: (id: number) => void;
  updatingTodos: number[];
  onUpdateTodoTitle: (id: number, newTitle: string) => void;
};

export const TodoList = ({
  todos,
  temporaryTodo,
  onDeleteTodo,
  inputRef,
  onToggleTodoStatus,
  updatingTodos,
  onUpdateTodoTitle,
}: Props) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos &&
        todos.map(todo => {
          return (
            <TodoItem
              key={todo.id}
              todo={todo}
              onDeleteTodo={onDeleteTodo}
              inputRef={inputRef}
              onToggleTodoStatus={onToggleTodoStatus}
              updatingTodos={updatingTodos.includes(todo.id)}
              onUpdateTodoTitle={onUpdateTodoTitle}
            />
          );
        })}
      {temporaryTodo && (
        <TodoItem
          key={temporaryTodo.id}
          todo={temporaryTodo}
          temporaryTodo={temporaryTodo}
          onDeleteTodo={onDeleteTodo}
          inputRef={inputRef}
          onToggleTodoStatus={onToggleTodoStatus}
          updatingTodos={updatingTodos.includes(temporaryTodo.id)}
          onUpdateTodoTitle={onUpdateTodoTitle}
        />
      )}
    </section>
  );
};
