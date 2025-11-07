/* eslint-disable jsx-a11y/label-has-associated-control */
import { Todo } from '../../types/Todo';
import { TodoItem } from '../../components/TodoItem/TodoItem';

type Props = {
  todos: Todo[];
  selectedTodoId?: number;
  processingIds: number[];
  onDelete?: (id: number) => void;
  onUpdateUserTodo?: (todo: Todo) => Promise<Todo> | void;
  inputTodoTitleFieldRef?: React.RefObject<HTMLInputElement>;
  editingTodos: Todo[] | undefined;
  onBeginEditTitle?: (todo: Todo) => void;
  onSaveEditTitle?: (todoId: number, newTitle: string) => Promise<Todo> | void;
  onCancelEditTitle?: () => void;
  onChangeEditTitle?: (todoId: number, value: string) => void;
};

export const TodosList = ({
  todos,
  selectedTodoId,
  processingIds,
  onDelete,
  onUpdateUserTodo,
  inputTodoTitleFieldRef,
  editingTodos,
  onBeginEditTitle,
  onSaveEditTitle,
  onCancelEditTitle,
  onChangeEditTitle,
}: Props) => (
  <section className="todoapp__main" data-cy="TodoList">
    {todos.map(todo => (
      <TodoItem
        key={todo.id}
        todo={todo}
        selectedTodoId={selectedTodoId}
        isProcessed={processingIds.includes(todo.id)}
        onDelete={() => onDelete?.(todo.id)}
        onUpdateUserTodo={onUpdateUserTodo}
        inputTodoTitleFieldRef={inputTodoTitleFieldRef}
        editingTodoId={editingTodos?.find(e => e.id === todo.id)?.id}
        editTitle={editingTodos?.find(e => e.id === todo.id)?.title}
        onBeginEditTitle={onBeginEditTitle}
        onSaveEditTitle={onSaveEditTitle}
        onCancelEditTitle={onCancelEditTitle}
        onChangeEditTitle={onChangeEditTitle}
      />
    ))}
  </section>
);
