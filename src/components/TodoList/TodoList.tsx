import { memo, FC } from 'react';
import { Todo } from '../../types/Todo';
import { TodoItem } from './components/TodoItem';
import { TodosProps } from '../../types/TodoListProps';

export const TodoList: FC<TodosProps> = memo(({
  tempId,
  todos,
  tempIds,
  tempTodo,
  deletingTodoIDs,
  removeTodo,
  completeTodo,
  renameTodo,
  updateTitle,
  setTempId,
}) => (
  <>
    {todos.map((todo: Todo) => (
      <TodoItem
        tempId={tempId}
        todo={todo}
        key={todo.id}
        loading={
          deletingTodoIDs.includes(todo.id) || tempIds.includes(todo.id)
        }
        setTempId={setTempId}
        completeTodo={completeTodo}
        removeTodo={removeTodo}
        renameTodo={renameTodo}
        updateTitle={updateTitle}
      />
    ))}
    {tempTodo && <TodoItem loading todo={tempTodo} />}
  </>
));
