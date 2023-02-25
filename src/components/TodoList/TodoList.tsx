import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem/TodoItem';

type Props = {
  todos: Todo[];
  tempTodo: Todo | null;
  isDeleting: boolean;
  onDeleteTodo: (todoId: number) => () => void;
  isStatusUpdating: boolean;
  onUpdateTodoStatus: (todo: Todo) => () => void;
  titleUpdatingTodoId: number | null;
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
  titleUpdatingTodoId,
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
            isTitleUpdating={titleUpdatingTodoId === todo.id ? true : false}
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
          isTitleUpdating={titleUpdatingTodoId ? true : false}
          editedTitleValue={editedTitleValue}
          onUpdateTitle={onUpdateTodoTitle}
          onChangeTitle={onChangeTodoTitle}
          onSubmitUpdatedTitle={onSubmitUpdatedTodoTitle}
        />
      )}
    </section>
  );
};
