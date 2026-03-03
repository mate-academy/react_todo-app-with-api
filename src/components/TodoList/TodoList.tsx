import React from 'react';
import { TodoItem } from './TodoItem';
import { Todo } from '../../types/Todo';

type Props = {
  todos: Todo[];
  tempTodo?: Todo | null;
  onToggleTodoStatus: (todo: Todo, completed: boolean) => void;
  loadingTodoIds: number[];
  editedTodoId: number | null;
  setEditedTodoId: (id: number | null) => void;
  onDeleteTodo: (id: number) => void;
  onEditTodo: (
    todo: Todo,
    data: Partial<Omit<Todo, 'id' | 'userId'>>,
  ) => Promise<void>;
};

const emptyFn = () => {};

const emptyAsyncFn = async () => {};

export const TodoList: React.FC<Props> = ({
  todos,
  tempTodo,
  onToggleTodoStatus,
  loadingTodoIds,
  editedTodoId,
  setEditedTodoId,
  onDeleteTodo,
  onEditTodo,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => (
        <TodoItem
          key={todo.id}
          todo={todo}
          onToggleTodoStatus={onToggleTodoStatus}
          isLoading={loadingTodoIds.includes(todo.id)}
          editedTodoId={editedTodoId}
          setEditedTodoId={setEditedTodoId}
          onDelete={onDeleteTodo}
          onEditTodo={onEditTodo}
        />
      ))}

      {tempTodo && (
        <TodoItem
          key="temp-todo"
          todo={tempTodo}
          onToggleTodoStatus={emptyFn}
          isLoading={true}
          editedTodoId={null}
          setEditedTodoId={emptyFn}
          onDelete={emptyFn}
          onEditTodo={emptyAsyncFn}
        />
      )}
    </section>
  );
};
