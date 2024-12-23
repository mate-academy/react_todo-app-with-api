import React from 'react';
import { Todo } from '../types/Todo';
import { TodoItem } from './TodoItem';

interface Props {
  todos: Todo[];
  onUpdate: (v: Todo) => void;
  onDelete: (n: number) => void;
  loader: boolean;
  onLoader: (v: boolean) => void;
  massLoader: boolean;
  tempTodo?: Todo | null;
  onErrorMessage: (v: string) => void;
  onTodos: React.Dispatch<React.SetStateAction<Todo[]>>;
}

export const TodoList: React.FC<Props> = ({
  todos,
  onUpdate,
  onDelete,
  loader,
  massLoader,
  tempTodo = null,
  onErrorMessage,
  onLoader,
  onTodos,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      <div>
        {todos.map(todo => (
          <TodoItem
            key={todo.id}
            todo={todo}
            onUpdate={onUpdate}
            onDelete={onDelete}
            loader={loader}
            onLoader={onLoader}
            massLoader={massLoader}
            onErrorMessage={onErrorMessage}
            onTodos={onTodos}
          />
        ))}

        {tempTodo && (
          <TodoItem todo={tempTodo} loader={loader} tempTodo={tempTodo} />
        )}
      </div>
    </section>
  );
};
