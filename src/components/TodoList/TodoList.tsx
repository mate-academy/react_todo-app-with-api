import { Todo } from '../../types/Todo';
import { TempTodo } from '../TempTodo';
import { TodoItem } from '../TodoItem';

type Props = {
  onDeleteTodo: (value: number) => void;
  todos: Todo[];
  tempTodo: Todo | null;
  isTodoId: number;
  onChangeTodoTitle: (todoId: number, value: string) => void;
  onChangeTodoCompleted: (todoId: number, value: boolean) => void;
};

export const TodoList: React.FC<Props> = ({
  todos,
  onDeleteTodo,
  onChangeTodoTitle,
  onChangeTodoCompleted,
  tempTodo,
  isTodoId,
}) => {
  return (
    <>
      {todos.map(todo => (
        <TodoItem
          key={todo.id}
          todo={todo}
          onDeleteTodo={onDeleteTodo}
          isTodoId={isTodoId}
          onChangeTodoTitle={onChangeTodoTitle}
          onChangeTodoCompleted={onChangeTodoCompleted}
        />
      ))}

      {tempTodo && (
        <TempTodo todo={tempTodo} />
      )}
    </>

  );
};
