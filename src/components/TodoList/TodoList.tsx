import { TodoItem } from '../TodoItem';
import { Todo } from '../../types/Todo';

interface Props {
  todos: Todo[];
  selectedTodoId: number;
  onDeleteTodo: (todoId: number) => void;
  onError: (errorTitle: string) => void;
  handleUpdate: (isUpdate: boolean) => void;
}

export const TodoList = (props: Props) => {
  const {
    todos,
    selectedTodoId,
    onDeleteTodo,
    onError,
    handleUpdate,
  } = props;

  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => (
        <TodoItem
          key={todo.id}
          todo={todo}
          selectedTodoId={selectedTodoId}
          onDeleteTodo={onDeleteTodo}
          onError={onError}
          handleUpdate={handleUpdate}
        />
      ))}
    </section>
  );
};
