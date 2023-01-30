import React, { memo } from 'react';
import { Todo } from '../../types/Todo';
import { TodoInfo } from '../TodoInfo/TodoInfo';

type Props = {
  newTodoField: React.RefObject<HTMLInputElement>
  todos: Todo[];
  setErrorMessage: React.Dispatch<React.SetStateAction<string>>;
  removeTodo: (todoId: number) => Promise<void>;
  changeTodo:(id: number, itemsToUpdate: Partial<Todo>) => Promise<void>
  isTodoUpdating: boolean;
};

export const TodoList: React.FC<Props> = memo(({
  todos,
  removeTodo,
  changeTodo,
  setErrorMessage,
  isTodoUpdating,
  newTodoField,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => (
        <TodoInfo
          newTodoField={newTodoField}
          todo={todo}
          removeTodo={removeTodo}
          key={todo.id}
          changeTodo={changeTodo}
          isTodoUpdating={isTodoUpdating}
          setErrorMessage={setErrorMessage}
        />
      ))}
    </section>
  );
});
