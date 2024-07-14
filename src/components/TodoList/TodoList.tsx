import { Dispatch, FC } from 'react';

import { TodoItem } from '../TodoItem/TodoItem';

import { Status } from '../../types/statusTypes';
import { Todo } from '../../types/Todo';

interface Props {
  todos: Todo[];
  filter: Status;
  onDelete: (todoId: number) => void;
  onToggle: (todo: Todo) => void;
  tempTodo: Todo | null;
  idsProccesing: number[];
  onRename: (todo: Todo) => Promise<void>;
  setIdsProccesing: Dispatch<React.SetStateAction<number[]>>;
}

export const TodoList: FC<Props> = ({
  todos,
  onDelete,
  onToggle,
  tempTodo,
  idsProccesing,
  onRename,
  setIdsProccesing,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => (
        <TodoItem
          key={todo.id}
          todo={todo}
          onDelete={onDelete}
          onToggle={onToggle}
          isLoading={idsProccesing.includes(todo.id)}
          onRename={onRename}
          setIdsProccesing={setIdsProccesing}
        />
      ))}

      {tempTodo && <TodoItem todo={tempTodo} isLoading={true} />}
    </section>
  );
};
