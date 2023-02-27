import { Todo } from '../../types/Todo';
import { TodoInfo } from '../TodoInfo';

type Props = {
  todos: Todo[],
  handleDeleteTodo: (todoDelete: Todo) => void,
  tempTodo: Todo | null,
  handleUpdateTodoStatus: (todo: Todo) => void,
  updatingTodoId: number

  handleUpdateTodoName: (todo: Todo, name: string) =>void,
  loadingForToggle:boolean

};

export const TodoList:React.FC<Props> = ({
  todos,
  handleDeleteTodo,
  tempTodo,
  handleUpdateTodoStatus,
  updatingTodoId,
  handleUpdateTodoName,
  loadingForToggle,
}) => (
  <section className="todoapp__main">
    {todos.map(todo => (
      (
        <TodoInfo
          todo={todo}
          key={todo.id}
          handleDeleteTodo={handleDeleteTodo}
          handleUpdateTodoStatus={handleUpdateTodoStatus}
          updatingTodoId={updatingTodoId}
          handleUpdateTodoName={handleUpdateTodoName}
          loadingForToggle={loadingForToggle}
        />
      )

    ))}

    {tempTodo && (
      <TodoInfo
        todo={tempTodo}
        key={0}
        handleDeleteTodo={handleDeleteTodo}
        handleUpdateTodoStatus={handleUpdateTodoStatus}
        updatingTodoId={tempTodo.id}
        handleUpdateTodoName={handleUpdateTodoName}
        loadingForToggle={loadingForToggle}
      />
    ) }
  </section>
);
