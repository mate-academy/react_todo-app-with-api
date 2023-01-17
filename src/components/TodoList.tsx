import { Todo } from '../types/Todo';
import { TodoInfo } from './TodoInfo';

type Props = {
  todos: Todo[];
  onDelete: (todoId: number) => void,
  activeLoading: number[];
  isAdding: boolean;
  loader: number;
  tickTodo:(id: number, completed: boolean) => void,
  idToUpdate: number,
  updateTodoTitle:(id: number, title: string) => void,
  isTotalTick: boolean;
};

export const TodoList: React.FC<Props> = ({
  todos,
  onDelete,
  activeLoading,
  loader,
  tickTodo,
  idToUpdate,
  updateTodoTitle,
  isTotalTick,
}) => (
  <section className="todoapp__main" data-cy="TodoList">
    {todos.map(todo => (
      <TodoInfo
        key={todo.id}
        todo={todo}
        onDelete={onDelete}
        activeLoading={activeLoading.includes(todo.id)}
        loader={loader}
        tickTodo={tickTodo}
        idToUpdate={idToUpdate}
        updateTodoTitle={updateTodoTitle}
        isTotalTick={isTotalTick}
      />
    ))}
  </section>
);
