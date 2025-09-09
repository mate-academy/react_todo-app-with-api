import { Todo } from '../../types/Todo';
import { SetStateAction } from 'react';
import { TodoItem } from '../TodoItem/TodoItem';

type Props = {
  filteredTodos: Todo[];
  isHover: boolean;
  tempTodo: Todo | null;
  deletedTodoId: number | null;
  setIsHover: React.Dispatch<SetStateAction<boolean>>;
  handleDelete: (id: number) => void;
  setUpdatingTodoId: React.Dispatch<SetStateAction<number | null>>;
  handleToggle: (id: number) => void;
  updatingTodoId: number | null;
  setIsEditingId: React.Dispatch<SetStateAction<number | null>>;
  isEditingId: number | null;
  handleUpdateTitle: (id: number, newTitle: string) => void;
  isTogglleAll: boolean;
};

export const TodoList: React.FC<Props> = ({
  filteredTodos,
  isHover,
  tempTodo,
  deletedTodoId,
  setIsHover,
  handleDelete,
  setUpdatingTodoId,
  handleToggle,
  updatingTodoId,
  setIsEditingId,
  isEditingId,
  handleUpdateTitle,
  isTogglleAll,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {filteredTodos.map((todo: Todo) => (
        <TodoItem
          key={todo.id}
          isHover={isHover}
          todo={todo}
          deletedTodoId={deletedTodoId}
          isTempTodo={false}
          setIsHover={setIsHover}
          handleDelete={handleDelete}
          setUpdatingTodoId={setUpdatingTodoId}
          handleToggle={handleToggle}
          updatingTodoId={updatingTodoId}
          setIsEditingId={setIsEditingId}
          isEditingId={isEditingId}
          handleUpdateTitle={handleUpdateTitle}
          isTogglleAll={isTogglleAll}
        />
      ))}
      {tempTodo && (
        <TodoItem
          todo={tempTodo}
          isHover={isHover}
          deletedTodoId={deletedTodoId}
          setIsHover={setIsHover}
          handleDelete={handleDelete}
          isTempTodo={true}
        />
      )}
    </section>
  );
};
