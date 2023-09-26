import { Todo } from '../types/Todo';
import { TodoItem } from './TodoItem';

type Props = {
  todos: Todo[],
  handleDeleteTodo: (id: number) => void,
  // activeTodoId: number,
  handleStatusUpdate: (todo:Todo) => void,
  handleTitleUpdate: (todo: Todo, newTitile: string) => void,
  processingTodoIds: number[],
};

export const TodoList: React.FC<Props> = ({
  todos,
  handleDeleteTodo,
  // activeTodoId,
  handleStatusUpdate,
  handleTitleUpdate,
  processingTodoIds,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => (
        <TodoItem
          todo={todo}
          handleDeleteTodo={handleDeleteTodo}
          // isActive={activeTodoId === todo.id}
          handleStatusUpdate={handleStatusUpdate}
          handleTitleUpdate={handleTitleUpdate}
          isProcessing={processingTodoIds.includes(todo.id)}
          key={todo.id}
        />
      ))}
    </section>
  );
};
