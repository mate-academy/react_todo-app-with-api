import { FC } from 'react';
import { TodoItem } from './TodoItem';
import { Todo } from '../types/Todo';

interface Props {
  todos: Todo[];
  handleDeleteTodo: (id: number) => void;
  handleTodoComplited:(id: number) => void;
  isLoading:boolean;
  setDeletingId:React.Dispatch<React.SetStateAction<number | null>>
  deletingId:number | null;
  tempTodo:Todo | null
  handleTodoEdit:(id: number, EditTitle:string) => void
}

export const TodoList: FC<Props> = ({
  todos,
  handleDeleteTodo,
  deletingId,
  setDeletingId,
  handleTodoComplited,
  isLoading,
  tempTodo,
  handleTodoEdit,
}) => {
  return (
    <section className="todoapp__main">
      {todos.map(todo => (
        <TodoItem
          todo={todo}
          handleDeleteTodo={handleDeleteTodo}
          handleTodoComplited={handleTodoComplited}
          isLoading={isLoading}
          deletingId={deletingId}
          setDeletingId={setDeletingId}
          handleTodoEdit={handleTodoEdit}
        />
      ))}

      {tempTodo
      && (
        <TodoItem
          todo={tempTodo}
          isLoading={isLoading}
          handleTodoEdit={handleTodoEdit}
          handleDeleteTodo={handleDeleteTodo}
          handleTodoComplited={handleTodoComplited}
          deletingId={deletingId}
          setDeletingId={setDeletingId}
        />
      )}
    </section>
  );
};
