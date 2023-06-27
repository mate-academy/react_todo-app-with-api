import { FC } from 'react';
import { TodoItem } from './TodoItem';
import { Todo } from '../types/Todo';

interface Props {
  todos: Todo[];
  handleDeleteTodo: (id: number) => void;
  handleTodoComplited:(id: number) => void;
  isLoading:boolean;
  tempTodo:Todo | null
  handleTodoEdit:(id: number, EditTitle:string) => void
  selectedTodoId: number | null;
}

export const TodoList: FC<Props> = ({
  todos,
  handleDeleteTodo,
  handleTodoComplited,
  isLoading,
  tempTodo,
  handleTodoEdit,
  selectedTodoId,
}) => {
  return (
    <section className="todoapp__main">
      {todos.map(todo => (
        <TodoItem
          key={todo.id}
          todo={todo}
          handleDeleteTodo={handleDeleteTodo}
          handleTodoComplited={handleTodoComplited}
          isLoading={isLoading
            && (
              !todo.id || selectedTodoId === todo.id
            )}
          handleTodoEdit={handleTodoEdit}
        />
      ))}

      {tempTodo
      && (
        <TodoItem
          todo={tempTodo}
          isLoading
          handleTodoEdit={handleTodoEdit}
          handleDeleteTodo={handleDeleteTodo}
          handleTodoComplited={handleTodoComplited}
        />
      )}
    </section>
  );
};
