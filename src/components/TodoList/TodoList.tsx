import { TodoInfo } from '../TodoInfo/TodoInfo';

import { Todo } from '../../types/Todo';
import { PatchTodo } from '../../types/PatchTodo';

type Props = {
  todos: Todo[];
  tempTodo: Todo | null;
  onDelete: (id: number) => void;
  loadingTodo: number[];
  changeTodo: (id: number, data: PatchTodo) => void;
};

export const TodoList: React.FC<Props> = ({
  todos,
  tempTodo,
  onDelete,
  loadingTodo,
  changeTodo,
}) => (
  <ul className="todoapp__main">
    {todos.map(todo => (
      <TodoInfo
        todo={todo}
        key={todo.id}
        onDelete={onDelete}
        loadingTodo={loadingTodo}
        changeTodo={changeTodo}
      />
    ))}

    {tempTodo && (
      <TodoInfo
        todo={tempTodo}
        onDelete={onDelete}
        loadingTodo={loadingTodo}
        changeTodo={changeTodo}
      />
    )}
  </ul>
);
