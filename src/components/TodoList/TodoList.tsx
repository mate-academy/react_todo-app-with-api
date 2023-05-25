import { Todo } from '../../types/Todo';
import { TodoUpdate } from '../../types/todoUpdate';
import { TodItem } from '../TodoItem';

interface Props {
  todos: Todo[];
  onRemove: (id: number) => void;
  onChange: (id:number, data: TodoUpdate) => void;
  loadingTodoId: number[];

}

export const TodoList: React.FC<Props> = ({
  todos,
  onRemove,
  onChange,
  loadingTodoId,

}) => {
  return (
    <section className="todoapp__main">
      {todos.map(todo => (
        <TodItem
          todo={todo}
          onRemove={onRemove}
          onChange={onChange}
          loadingTodoId={loadingTodoId}
        />
      ))}
    </section>

  );
};
