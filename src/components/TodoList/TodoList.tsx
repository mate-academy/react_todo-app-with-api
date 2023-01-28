import React, { memo } from 'react';
import { Todo } from '../../types/Todo';
import { TodoInfo } from '../TodoInfo/TodoInfo';

interface Props {
  todos: Todo[];
  onRemoveTodo: (todoId: number) => Promise<void>;
  setErrorMessage: React.Dispatch<React.SetStateAction<string>>;
  changeTodo:(todoId: number, fieldsToUpdate: Partial<Todo>) => Promise<void>;
  newTodoField:React.RefObject<HTMLInputElement>;
  isUpdating: boolean;
}

export const TodoList: React.FC<Props> = memo(({
  todos,
  onRemoveTodo,
  setErrorMessage,
  changeTodo,
  newTodoField,
  isUpdating,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map((todo) => (
        <TodoInfo
          todo={todo}
          key={todo.id}
          removeTodo={onRemoveTodo}
          setErrorMessage={setErrorMessage}
          changeTodo={changeTodo}
          newTodoField={newTodoField}
          isUpdating={isUpdating}
        />
      ))}
    </section>
  );
});
