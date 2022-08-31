import { Todo } from '../types/Todo';
import { AddedTodoItem } from './AddedTodoItem';
import { TodoItem } from './TodoItem';

type Props = {
  todos: Todo[];
  removeTodo: (todoId: number) => void;
  selectedTodoId: number | null;
  isLoading: boolean;
  title: string;
  isRemoveLoading: boolean;
  updateTodoById: (todoId: number, data: {}) => void;
  isUpdateLoading: boolean;
  isAllToggled: boolean;
};

export const TodoList: React.FC<Props> = (props) => {
  const {
    todos,
    removeTodo,
    selectedTodoId,
    isLoading,
    title,
    isRemoveLoading,
    updateTodoById,
    isUpdateLoading,
    isAllToggled,
  } = props;

  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => {
        return (
          <TodoItem
            todo={todo}
            key={todo.id}
            removeTodo={removeTodo}
            selectedTodoId={selectedTodoId}
            isRemoveLoading={isRemoveLoading}
            updateTodoById={updateTodoById}
            isUpdateLoading={isUpdateLoading}
            isAllToggled={isAllToggled}
          />
        );
      })}

      {isLoading && <AddedTodoItem title={title} />}
    </section>
  );
};
