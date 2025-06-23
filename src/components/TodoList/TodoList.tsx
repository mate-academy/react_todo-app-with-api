import { Todo } from '../../types/Todo';
import { ProcessState } from '../../utils/constants';
import { TodoInfo } from '../TodoInfo/TodoInfo';

type Props = {
  todos: Todo[];
  tempTodo: Todo | null;
  onDelete: (id: number) => void;
  onCheck: (todosId: number[], completed: boolean) => void;
  onEditTodo: (todo: Todo, title: string) => void;
  processingTodos: Map<number, ProcessState>;
};

export const TodoList: React.FC<Props> = ({
  todos,
  tempTodo,
  onDelete,
  onCheck,
  onEditTodo,
  processingTodos,
}) => {
  const newArray = tempTodo ? todos.concat(tempTodo) : todos;

  return (
    <section className="todoapp__main" data-cy="TodoList">
      {/* This is a completed todo */}
      {newArray.map(t => (
        <TodoInfo
          key={t.id}
          todo={t}
          onCheck={onCheck}
          onDelete={onDelete}
          onEditTodo={onEditTodo}
          processingTodos={processingTodos}
        />
      ))}
    </section>
  );
};
