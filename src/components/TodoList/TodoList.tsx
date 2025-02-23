import { FC } from 'react';

import { Todo } from '../../types/Todo';

import { TodoItem } from '../TodoItem';

interface Props {
  todos: Todo[];
  idsForDelete: number[];
  idsForUpdate: number[];
  setIdsForDelete: (prevIds: (ids: number[]) => number[]) => void;
  setIdsForUpdate: (prevIds: (ids: number[]) => number[]) => void;
  setNewTodoData: (newTodoData: Partial<Todo>) => void;
}

export const TodoList: FC<Props> = ({
  todos,
  idsForDelete,
  idsForUpdate,
  setIdsForDelete,
  setIdsForUpdate,
  setNewTodoData,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => (
        <TodoItem
          key={todo.id}
          todo={todo}
          idsForDelete={idsForDelete}
          idsForUpdate={idsForUpdate}
          setIdsForDelete={setIdsForDelete}
          setIdsForUpdate={setIdsForUpdate}
          setNewTodoData={setNewTodoData}
        />
      ))}
    </section>
  );
};
