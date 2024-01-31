import { useState } from 'react';
import { ErrorType, Todo } from '../types';
import { TodoItem } from './TodoItem';

interface Props {
  todoList: Todo[];
  filterTodoList: (todoId: number) => void;
  setErrorMessage: (setErrorMessage: ErrorType | null) => void;
  handleTodoUpdated: (todo: Todo) => void;
}

export const TodoList: React.FC<Props> = ({
  todoList,
  filterTodoList,
  setErrorMessage,
  handleTodoUpdated,
}) => {
  const [currentEditing, setCurrentEditing] = useState<number | null>(null);

  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todoList.map(todo => (
        <TodoItem
          todo={todo}
          key={todo.id}
          filterTodoList={filterTodoList}
          setErrorMessage={setErrorMessage}
          handleTodoUpdated={handleTodoUpdated}
          currentEditing={currentEditing}
          setCurrentEditing={setCurrentEditing}
        />
      ))}
    </section>
  );
};
