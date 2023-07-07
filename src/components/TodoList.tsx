import { FC, FormEvent } from 'react';
import { Todo } from '../types/Todo';
import { TodoItem } from './TodoItem';

interface Props {
  visibleTodos: Todo[],
  handleRemove: (todoId: number) => Promise<unknown>,
  handleChangeCheckBox: (todoId: number) => void,
  handleSubmitonChange: (
    event: FormEvent,
    newTitle: string,
    id: number,
    edit: (value: boolean) => void,
    editTitle: (value: string) => void,
  ) => void,
}

export const TodoList: FC<Props> = ({
  visibleTodos,
  handleRemove,
  handleChangeCheckBox,
  handleSubmitonChange,
}) => {
  return (
    <section className="todoapp__main">
      {visibleTodos.map(todo => (
        <TodoItem
          todo={todo}
          key={todo.id}
          handleRemove={handleRemove}
          handleChangeCheckBox={handleChangeCheckBox}
          handleSubmitonChange={handleSubmitonChange}
        />
      ))}
    </section>
  );
};
