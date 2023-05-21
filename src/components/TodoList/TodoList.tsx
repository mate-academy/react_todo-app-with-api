import { FC } from 'react';
import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem';
import { TempTodo } from '../TempTodo';

interface Props {
  todos: Todo[];
  todoId: number | null;
  tempTodo: Todo | null;
  completedTodosId: number[];
  onDelete: (id: number) => void;
  setTodoId: (id: number | null) => void;
  onChangeStatus: (id: number, completed: boolean) => void;
  onChangeTitle: (id: number, title: string) => void;
}

export const TodoList: FC<Props> = ({
  todos,
  todoId,
  tempTodo,
  completedTodosId,
  onDelete,
  setTodoId,
  onChangeStatus,
  onChangeTitle,
}) => {
  return (
    <section className="todoapp__main">

      {todos.length > 0 && (
        todos.map(todo => (
          <TodoItem
            key={todo.id}
            todo={todo}
            todoId={todoId}
            completedTodosId={completedTodosId}
            onDelete={onDelete}
            setTodoId={setTodoId}
            onChangeStatus={onChangeStatus}
            onChangeTitle={onChangeTitle}
          />
        ))
      )}

      {tempTodo && <TempTodo tempTodo={tempTodo} />}
    </section>
  );
};
