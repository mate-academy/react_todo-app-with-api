import { FormEvent } from 'react';
import { Todo } from '../types/Todo';
import { TodoInfo } from './TodoInfo';

interface Props {
  todos: Todo[] | null;
  todoId:number[];
  changTitle: string;
  setChangTitle: (event: string) => void;
  handleDeleteTodo: (event: FormEvent, element: number) => void;
  handleChangeCompleted: (event: number, completed: boolean) => void;
  isAdding: boolean;
  handleUpdateTodo: (event: FormEvent, element: number) => void;
}

export const TodoList: React.FC<Props> = ({
  todos,
  todoId,
  changTitle,
  setChangTitle,
  handleDeleteTodo,
  handleChangeCompleted,
  isAdding,
  handleUpdateTodo,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos && (todos.map(todo => (
        <TodoInfo
          key={todo.id}
          todo={todo}
          changTitle={changTitle}
          setChangTitle={setChangTitle}
          handleDeleteTodo={handleDeleteTodo}
          handleChangeCompleted={handleChangeCompleted}
          isAdding={isAdding}
          handleUpdateTodo={handleUpdateTodo}
          todoId={todoId}
        />
      )))}
    </section>
  );
};
