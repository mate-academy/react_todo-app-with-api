import React from 'react';
import { Todo } from './types/Todo';
import { TodoComponent } from './TodoComponent';
import { TempTodo } from './TempTodo';

type Props = {
  todos: Todo[];
  tempTodo: Todo | null;
  loadingTodoId: number | null;
  onDelete: (id: number) => void;
  onChangeStatus: (id: number, completed: boolean) => void;
  onSubmitEdited: (id: number, newTitle: string) => void;
};

export const TodosList:React.FC<Props> = ({
  todos,
  tempTodo,
  loadingTodoId,
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
          loadingTodoId={loadingTodoId}
          onDelete={onDelete}
          onChangeStatus={onChangeStatus}
          onSubmitEdited={onSubmitEdited}
        />
      ))}
      {tempTodo && (
        <TempTodo
          tempTodo={tempTodo}
          loadingTodoId={loadingTodoId}
        />
      )}
    </section>
  );
};
