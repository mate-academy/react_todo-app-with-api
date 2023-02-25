import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem/TodoItem';

type Props = {
  todos: Todo[];
  tempTodo: Todo | null;
  isDeleting: boolean;
  onDeleteTodo: (todoId: number) => () => void;
  isStatusUpdating: boolean;
  onUpdateTodoStatus: (todo: Todo) => () => void;
  isTitleUpdating: boolean;
  editedTitleValue: string;
  onUpdateTodoTitle: (todo: Todo) => () => void;
  onChangeTodoTitle: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmitUpdatedTodoTitle: () => void;
};

export const TodoList: React.FC<Props> = ({
  todos,
  tempTodo,
  isDeleting,
  onDeleteTodo,
  isStatusUpdating,
  onUpdateTodoStatus,
  isTitleUpdating,
  editedTitleValue,
  onUpdateTodoTitle,
  onChangeTodoTitle,
  onSubmitUpdatedTodoTitle,
}) => {
  return (
    <section className="todoapp__main">
      {todos.map((todo) => {
        return (
          <TodoItem
            key={todo.id}
            todo={todo}
            isDeleting={isDeleting}
            onDelete={onDeleteTodo}
            isStatusUpdating={isStatusUpdating}
            onUpdateStatus={onUpdateTodoStatus}
            isTitleUpdating={isTitleUpdating}
            editedTitleValue={editedTitleValue}
            onUpdateTitle={onUpdateTodoTitle}
            onChangeTitle={onChangeTodoTitle}
            onSubmitUpdatedTitle={onSubmitUpdatedTodoTitle}
          />
        );
      })}

      {!!tempTodo && (
        <TodoItem
          key={0}
          todo={tempTodo}
          isDeleting={isDeleting}
          onDelete={onDeleteTodo}
          isStatusUpdating={isStatusUpdating}
          onUpdateStatus={onUpdateTodoStatus}
          isTitleUpdating={isTitleUpdating}
          editedTitleValue={editedTitleValue}
          onUpdateTitle={onUpdateTodoTitle}
          onChangeTitle={onChangeTodoTitle}
          onSubmitUpdatedTitle={onSubmitUpdatedTodoTitle}
        />
      )}
    </section>
  );
};
