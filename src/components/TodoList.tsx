import React, { RefObject } from 'react';
import { Todo } from '../types/Todo';
import { Todos } from './Todos';

type Props = {
  todos: Todo[],
  title:string
  isAdding:boolean,
  deleteTodo:(param: number) => void,
  loadingTodoIds: number[],
  changeTodo: (updateId: number, data: Partial<Todo>) => Promise<void>,
  newTodoField: RefObject<HTMLInputElement>,
};

export const TodoList: React.FC<Props> = ({
  todos,
  title,
  isAdding,
  deleteTodo,
  loadingTodoIds,
  changeTodo,
  newTodoField,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">

      {todos.map((todo) => (
        <Todos
          key={todo.id}
          todo={todo}
          deleteTodo={deleteTodo}
          loadingTodoIds={loadingTodoIds}
          isAdding={isAdding}
          changeTodo={changeTodo}
          newTodoField={newTodoField}
        />
      ))}

      {isAdding && (
        <Todos
          key={Math.random()}
          todo={{
            id: 0,
            title,
            completed: false,
            userId: Math.random(),
          }}
          deleteTodo={deleteTodo}
          loadingTodoIds={loadingTodoIds}
          isAdding={isAdding}
          changeTodo={changeTodo}
          newTodoField={newTodoField}
        />
      )}

    </section>
  );
};
