import { Dispatch, FC } from 'react';

import TodoItem from './TodoItem';

import { Status } from '../types/Status';
import { Todo } from '../types/Todo';

interface Props {
  todos: Todo[];
  selectedStatus: Status;
  deleteTodo: (todoId: number) => void;
  onToggle: (todo: Todo) => void;
  tempTodo: Todo | null;
  loadingTodosIds: number[];
  onRename: (todo: Todo) => Promise<void>;
  setLoadingTodosIds: Dispatch<React.SetStateAction<number[]>>;
}

const TodoList: FC<Props> = ({
  todos,
  deleteTodo,
  onToggle,
  tempTodo,
  loadingTodosIds,
  onRename,
  setLoadingTodosIds,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => (
        <TodoItem
          key={todo.id}
          todo={todo}
          deleteTodo={deleteTodo}
          onToggle={onToggle}
          isLoading={loadingTodosIds.includes(todo.id)}
          onRename={onRename}
          setLoadingTodosIds={setLoadingTodosIds}
        />
      ))}

      {tempTodo && <TodoItem todo={tempTodo} isLoading={true} />}
    </section>
  );
};

export default TodoList;
