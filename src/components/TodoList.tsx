import { Todo } from '../types/Todo';
import { TodoItem } from './TodoItem';

type Props = {
  todos: Todo[];
  handleDeleteTodo: (id: number) => void;
  handleChangeCompletion: (todo: Todo, newIsCompleted: boolean) => void;
  todosIdBeingEdited: number[];
  updateTodoTitle: (todo: Todo, newTitle: string) => void;
  todoBeingUpdated: number | null;
};

export const TodoList: React.FC<Props> = ({
  todos,
  handleDeleteTodo,
  handleChangeCompletion,
  todosIdBeingEdited,
  updateTodoTitle,
  todoBeingUpdated,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map((todo: Todo) => (
        <TodoItem
          key={todo.id}
          todo={todo}
          handleDeleteTodo={handleDeleteTodo}
          handleChangeCompletion={handleChangeCompletion}
          isBeingEdited={todosIdBeingEdited.includes(todo.id)}
          updateTodoTitle={updateTodoTitle}
          todoBeingUpdated={todoBeingUpdated}
        />
      ))}
    </section>
  );
};
