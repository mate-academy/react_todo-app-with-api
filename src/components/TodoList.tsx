import { Todo } from '../types/Todo';
import { TodoItem } from './TodoItem';

type Props = {
  todos: Todo[],
  handleDeleteTodo: (id: number) => void,
  processingTodoIds: number[],
  handleStatusUpdate: (todo:Todo) => void,
  handleTitleUpdate: (todo: Todo, newTitile: string) => Promise<void>,
};

export const TodoList: React.FC<Props> = ({
  todos,
  processingTodoIds,
  handleDeleteTodo,
  handleStatusUpdate,
  handleTitleUpdate,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => (
        <TodoItem
          todo={todo}
          handleDeleteTodo={handleDeleteTodo}
          handleStatusUpdate={handleStatusUpdate}
          handleTitleUpdate={handleTitleUpdate}
          isProcessing={processingTodoIds.includes(todo.id)}
          key={todo.id}
        />
      ))}
    </section>
  );
};
