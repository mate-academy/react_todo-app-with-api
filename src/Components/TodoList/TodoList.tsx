/* eslint-disable jsx-a11y/label-has-associated-control */
import { TodoItem } from '../TodoItem/TodoItem';
import { Todo } from '../../types/Todo';

type Props = {
  currentTodos: Todo[];
  temporaryTodo: Todo | null;
  onDeleteTodo: (id: number) => void;
  todoIdsInLoading: number[];
  onUpdateTodo: (updatedTodo: Todo) => void;
  onSetTodoIdsInLoading: React.Dispatch<React.SetStateAction<number[]>>;
  onSetTodo: React.Dispatch<React.SetStateAction<Todo[]>>;
  onHandleErrorShow: (_: string) => void;
  todoEditingId: number | null;
  onSetTodoEditingId: React.Dispatch<React.SetStateAction<number | null>>;
};

export const TodoList: React.FC<Props> = ({
  currentTodos,
  temporaryTodo,
  onDeleteTodo,
  onUpdateTodo,
  todoIdsInLoading,
  onSetTodoIdsInLoading,
  onSetTodo,
  onHandleErrorShow,
  todoEditingId,
  onSetTodoEditingId,
}) => {
  return (
    <div>
      {currentTodos.map(todo => (
        <TodoItem
          key={todo.id}
          todo={todo}
          onDeleteTodo={onDeleteTodo}
          onUpdateTodo={onUpdateTodo}
          todoIdsInLoading={todoIdsInLoading}
          onSetTodoIdsInLoading={onSetTodoIdsInLoading}
          onSetTodo={onSetTodo}
          onHandleErrorShow={onHandleErrorShow}
          todoEditingId={todoEditingId}
          onSetTodoEditingId={onSetTodoEditingId}
        />
      ))}
      {temporaryTodo && (
        <TodoItem
          todo={temporaryTodo}
          onDeleteTodo={onDeleteTodo}
          key={temporaryTodo.id}
          onUpdateTodo={onUpdateTodo}
          todoIdsInLoading={todoIdsInLoading}
          onSetTodoIdsInLoading={onSetTodoIdsInLoading}
          onSetTodo={onSetTodo}
          onHandleErrorShow={onHandleErrorShow}
          todoEditingId={todoEditingId}
          onSetTodoEditingId={onSetTodoEditingId}
        />
      )}
    </div>
  );
};
