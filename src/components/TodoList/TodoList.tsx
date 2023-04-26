import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem/TodoItem';

type Props = {
  todos: Todo[],
  tempTodo: Todo | null,
  deleteTodo: (id: number) => void,
  processedIds: number[],
  handleCheckbox: (id: number, value: boolean) => void,
  handleChangeTitle: (id: number, value: string) => void,
};

export const TodoList: React.FC<Props> = ({
  todos,
  tempTodo,
  deleteTodo,
  processedIds,
  handleCheckbox,
  handleChangeTitle,
}) => (
  <ul style={{ listStyleType: 'none' }}>
    {todos.map((todo: Todo) => (
      <TodoItem
        key={todo.id}
        todo={todo}
        deleteTodo={deleteTodo}
        processedIds={processedIds}
        handleCheckbox={handleCheckbox}
        handleChangeTitle={handleChangeTitle}
      />
    ))}

    {tempTodo && (
      <TodoItem
        todo={tempTodo}
        deleteTodo={deleteTodo}
        processedIds={processedIds}
        handleCheckbox={handleCheckbox}
        handleChangeTitle={handleChangeTitle}
      />
    )}
  </ul>
);
