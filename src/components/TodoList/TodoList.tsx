import { FC } from 'react';
import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem';

type Props = {
  todos: Todo[];
  tempTodo: Todo | null;
  loadingTodoId: number[];

  onDeleteTodo: (id: number) => void;
  onUpdateTodo: (todoToUpdate: Todo) => void;

  editedTodo: Todo | null;
  setEditedTodo: React.Dispatch<React.SetStateAction<Todo | null>>;
};

export const TodoList: FC<Props> = ({
  todos,
  tempTodo,
  loadingTodoId,
  onDeleteTodo,
  onUpdateTodo,
  editedTodo,
  setEditedTodo,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => {
        return (
          <TodoItem
            key={todo.id}
            todo={todo}
            loadingTodoId={loadingTodoId}
            onDeleteTodo={onDeleteTodo}
            onUpdateTodo={onUpdateTodo}
            editedTodo={editedTodo}
            setEditedTodo={setEditedTodo}
          />
        );
      })}

      {tempTodo && (
        <TodoItem
          todo={tempTodo}
          loadingTodoId={loadingTodoId}
          onDeleteTodo={onDeleteTodo}
          onUpdateTodo={onUpdateTodo}
          editedTodo={editedTodo}
          setEditedTodo={setEditedTodo}
        />
      )}
    </section>
  );
};
