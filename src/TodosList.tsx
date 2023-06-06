import React from 'react';
import { Todo } from './types/Todo';
import { TodoComponent } from './TodoComponent';
import { TempTodo } from './TempTodo';

type Props = {
  todos: Todo[];
  tempTodo: Todo | null;
  loadingTodoIds: number[];
  onDelete: (id: number) => void;
  onChangeStatus: (id: number, completed: boolean) => void;
  onSubmitEdited: (id: number, newTitle: string) => void;
};

export const TodosList:React.FC<Props> = ({
  todos,
  tempTodo,
  loadingTodoIds,
  onDelete,
  onChangeStatus,
  onSubmitEdited,
}) => {
  return (
    <section className="todoapp__main">
      {todos.map(todo => (
        <TodoComponent
          key={todo.id}
          todo={todo}
          loadingTodoIds={loadingTodoIds}
          onDelete={onDelete}
          onChangeStatus={onChangeStatus}
          onSubmitEdited={onSubmitEdited}
        />
      ))}
      {tempTodo && (
        <TempTodo
          tempTodo={tempTodo}
          loadingTodoIds={loadingTodoIds}
        />
      )}
    </section>
  );
};
