/* eslint-disable jsx-a11y/label-has-associated-control */

import { Todo } from '../../types/Todo';
import { TodoItem } from './TodoItem';

/* eslint-disable jsx-a11y/control-has-associated-label */
type Props = {
  todos: Todo[];
  tempTodo: Todo | null;
  isDataInProceeding: boolean;
  selectedTodoIds: number[];
  isTodoTitleEditing: boolean;
  onTodoTitleEdit: (todoId: number) => void;
  changeEditingStatus: (editingStatus: boolean) => void;
  onUpdate: (todoToUpdate: Todo) => Promise<void>;
  onDelete: (todoId: number) => void;
  toggleStatus: (todoId: number) => void;
};

export const TodoMain: React.FC<Props> = ({
  todos,
  tempTodo,
  isDataInProceeding,
  selectedTodoIds,
  isTodoTitleEditing,
  onTodoTitleEdit,
  changeEditingStatus,
  onUpdate,
  onDelete,
  toggleStatus,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {[...todos, tempTodo].map(todo => {
        if (todo !== null) {
          return (
            <TodoItem
              todo={todo}
              isDataInProceeding={isDataInProceeding}
              selectedTodoId={selectedTodoIds?.find(id => id === todo.id)}
              isTodoTitleEditing={isTodoTitleEditing}
              onTodoTitleEdit={onTodoTitleEdit}
              changeEditingStatus={changeEditingStatus}
              onUpdate={onUpdate}
              onDelete={onDelete}
              toggleStatus={toggleStatus}
              key={todo.id}
            />
          );
        } else {
          return;
        }
      })}
    </section>
  );
};
