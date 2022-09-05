import { Todo } from '../../../types/Todo';
import { TodoItem } from '../TodoItem/TodoItem';

interface Props {
  todos: Todo[];
  onDelete: (todoId: number) => void;
  onChangeTodoStatus: (todo: Todo) => void;
  onTodoTitleChange: (todoId: number, newTitle: string) => void;
}

export const TodoList: React.FC<Props> = (props) => {
  const {
    todos,
    onDelete,
    onChangeTodoStatus,
    onTodoTitleChange,
  } = props;

  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => (
        <TodoItem
          todo={todo}
          key={todo.id}
          onDelete={onDelete}
          onChangeTodoStatus={onChangeTodoStatus}
          onTodoTitleChange={onTodoTitleChange}
        />
      ))}
    </section>
  );
};
