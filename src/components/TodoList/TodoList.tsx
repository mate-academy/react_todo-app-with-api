import { Todo } from '../../types/Todo';
import { UpdatingTodo } from '../UpdatingTodo';
import { TodoItem } from '../TodoItem';

type Props = {
  todos: Todo[];
  todoId: number;
  setTodoId: (id: number) => void;
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>;
  setErrorNotification: (value: string) => void;
  isShownTempTodo: boolean;
  previewTitle: string;
  updateStatus: (todoId: number, data: Partial<Todo>) => void;
};

export const TodoList: React.FC<Props> = ({
  todos,
  todoId,
  setTodos,
  setTodoId,
  setErrorNotification,
  isShownTempTodo,
  previewTitle,
  updateStatus,
}) => {
  return (
    <>
      { todos.map((todo) => (
        <UpdatingTodo
          title={todo.title}
          completed={todo.completed}
          id={todo.id}
          key={todo.id}
          setErrorNotification={setErrorNotification}
          setTodos={setTodos}
          todos={todos}
          todoId={todoId}
          setTodoId={setTodoId}
          updateStatus={updateStatus}

        />
      ))}

      {isShownTempTodo
        && (
          <TodoItem
            previewTitle={previewTitle}
          />
        )}
    </>
  );
};
