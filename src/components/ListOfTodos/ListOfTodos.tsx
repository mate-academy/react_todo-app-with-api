import { Todo } from '../../types/Todo';
import { TodoElement } from '../TodoElement/TodoElement';

type Props = {
  todos: Todo[],
  tempTodo: Todo | null,
  onTodoDeletion: (id:number) => void,
  loadingTodoId: number[],
  onTodoUpdating: (id: number, data: Partial<Todo>) => Promise<void>
};

export const ListOfTodos: React.FC<Props> = ({
  todos,
  tempTodo,
  onTodoDeletion,
  loadingTodoId,
  onTodoUpdating,
}) => (
  <>
    {todos.map((todo) => {
      const isLoading = loadingTodoId.some(id => id === todo.id);

      return (
        <TodoElement
          todo={todo}
          key={todo.id}
          onTodoDeletion={onTodoDeletion}
          onTodoUpdating={onTodoUpdating}
          isLoading={isLoading}
        />
      );
    })}
    {tempTodo && (
      <TodoElement
        todo={tempTodo}
        onTodoDeletion={() => {}}
        onTodoUpdating={() => {}}
        isLoading
      />
    )}
  </>
);
