import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem/TodoItem';

interface Props {
  todos: Todo[];
  deleteHandler: (todoId: number) => Promise<unknown>;
  completedIsRemoving: boolean;
  toggleTodoStatus: (todoId: number, completed: boolean) => Promise<unknown>;
  todosStatusIsChanging: boolean;
  toggleAllIsActive: boolean;
  renameTodo: (todoId: number, title: string) => Promise<unknown>;
}

export const TodoList: React.FC<Props> = ({
  todos,
  deleteHandler,
  completedIsRemoving,
  toggleTodoStatus,
  todosStatusIsChanging,
  toggleAllIsActive,
  renameTodo,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => {
        return (
          <TodoItem
            todo={todo}
            key={todo.id}
            deleteHandler={deleteHandler}
            completedIsRemoving={completedIsRemoving}
            toggleTodoStatus={toggleTodoStatus}
            todosStatusIsChanging={todosStatusIsChanging}
            toggleAllIsActive={toggleAllIsActive}
            renameTodo={renameTodo}
          />
        );
      })}
    </section>
  );
};
