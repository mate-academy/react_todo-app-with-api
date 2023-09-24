import { CurrentError } from '../../types/CurrentError';
import { Todo } from '../../types/Todo';
import { ToggleType } from '../../types/ToggleType';
import { TodoItem } from '../TodoItem/TodoItem';
import { TodoLoadingItem } from '../TodoLoadingItem/TodoLoadingItem';

type Props = {
  todos: Todo[],
  tempTodo: Todo | null,
  isClearCompleted: boolean
  toggleType: ToggleType
  onChangeStatus: (todoId: number, todoStatus: boolean) => void,
  onChangeTitle: (todoId: number, todoTitle: string) => void,
  onDeleteTodo: (todoId: number) => void,
  onSetErrorMessage: (error: CurrentError) => void,
  setIsClearCompleted: (isClearCompleted: boolean) => void,
  setToggleType: (toggleType: ToggleType) => void,
};

export const TodoList: React.FC<Props> = ({
  todos,
  tempTodo,
  isClearCompleted,
  toggleType,
  onDeleteTodo,
  onChangeStatus,
  onChangeTitle,
  onSetErrorMessage,
  setIsClearCompleted,
  setToggleType,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos?.map(todo => (
        <TodoItem
          key={todo.id}
          todo={todo}
          isClearCompleted={isClearCompleted}
          toggleType={toggleType}
          onDeleteTodo={onDeleteTodo}
          onChangeStatus={onChangeStatus}
          onChangeTitle={onChangeTitle}
          onSetErrorMessage={onSetErrorMessage}
          setIsClearCompleted={setIsClearCompleted}
          setToggleType={setToggleType}
        />
      ))}
      {tempTodo && (
        <TodoLoadingItem
          key={tempTodo.id}
          tempTodo={tempTodo}
        />
      )}
    </section>
  );
};
