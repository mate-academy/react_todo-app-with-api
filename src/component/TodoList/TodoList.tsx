import { TodoElement } from '../Todo';
import { Todo } from '../../types/Todo';

type Props = {
  todos: Todo[];
  onDelete: (todoId: number) => void;
  idsToDelete: number[];
  tempTodo: Todo | null;
  handleTodoToggle: (todo: Todo) => void;
  onTitleUpdate?: (todo: Todo, title: string) => Promise<void>;
};

export const TodoList = ({
  todos,
  onDelete,
  idsToDelete,
  tempTodo,
  handleTodoToggle,
  onTitleUpdate,
}: Props) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => (
        <TodoElement
          todo={todo}
          key={todo.id}
          onDelete={onDelete}
          idsToDelete={idsToDelete}
          handleTodoToggle={handleTodoToggle}
          onTitleUpdate={onTitleUpdate}
        />
      ))}

      <TodoElement todo={tempTodo} idsToDelete={[0]} />
    </section>
  );
};
