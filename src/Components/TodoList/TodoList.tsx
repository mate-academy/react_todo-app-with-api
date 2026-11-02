import { Todo as TodoType } from '../../types/Todo';
import { Todo } from '../Todo/Todo';

type Props = {
  todos: TodoType[];
  handleTodoDeletion?: (status: boolean, id?: number) => void;
  activeTodos: number[];
  handleStatusChange: (id: number, currentStatus: boolean) => Promise<boolean>;
  handleFailedTitleUpdate: () => void;
  handleSuccessTitleUpdate: (todoId: number, newTitle: string) => void;
};

export const TodoList: React.FC<Props> = ({
  todos,
  handleTodoDeletion,
  activeTodos,
  handleStatusChange,
  handleFailedTitleUpdate,
  handleSuccessTitleUpdate,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(({ id, title, completed }) => (
        <Todo
          key={id}
          title={title}
          completed={completed}
          todoId={id}
          handleTodoDeletion={handleTodoDeletion}
          activeTodos={activeTodos}
          handleStatusChange={handleStatusChange}
          onSuccessTitleUpdate={handleSuccessTitleUpdate}
          onFailedTitleUpdate={handleFailedTitleUpdate}
        />
      ))}
    </section>
  );
};
