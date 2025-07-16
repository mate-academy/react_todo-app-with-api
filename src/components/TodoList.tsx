import { Todo } from '../types/Todo';
import { FilterType } from '../types/FilterType';
import { TodoItem } from './TodoItem';

type Props = {
  todos: Todo[];
  loadingTodoIds: number[];
  tempTodo: Todo | null;
  filterType: FilterType;
  onTodoCompleteChange: (todoId: number, completed: boolean) => void;
  onTodoRemove: (todoId: number) => void;
  onTodoTitleChange: (todo: Todo, newTitle: string) => void;
  onTodoSelect: (todoId: number, title: string) => void;
  onTodoDeselect: () => void;
  selectedTodoId: number | null;
  selectedTodoNewValue: string;
  onSelectedTodoNewValueChange: (value: string) => void;
};

export const TodoList: React.FC<Props> = ({
  todos,
  loadingTodoIds,
  tempTodo,
  filterType,
  onTodoCompleteChange,
  onTodoRemove,
  onTodoTitleChange,
  onTodoSelect,
  onTodoDeselect,
  selectedTodoId,
  selectedTodoNewValue,
  onSelectedTodoNewValueChange,
}) => {
  function isTodoVisible(todo: Todo): boolean {
    if (loadingTodoIds.includes(todo.id)) {
      return true;
    }

    switch (filterType) {
      case 'all':
        return true;
      case 'active':
        return !todo.completed;
      case 'completed':
        return todo.completed;
    }
  }

  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.filter(isTodoVisible).map((todo: Todo) => {
        return (
          <TodoItem
            todo={todo}
            isLoading={loadingTodoIds.includes(todo.id)}
            onTodoCompleteChange={onTodoCompleteChange}
            onTodoRemove={onTodoRemove}
            onTodoTitleChange={onTodoTitleChange}
            onTodoSelect={onTodoSelect}
            onTodoDeselect={onTodoDeselect}
            isSelected={selectedTodoId === todo.id}
            selectedTodoNewValue={selectedTodoNewValue}
            onSelectedTodoNewValueChange={onSelectedTodoNewValueChange}
            key={todo.id}
          />
        );
      })}

      {tempTodo !== null && (
        <TodoItem
          todo={tempTodo}
          isLoading
          onTodoCompleteChange={onTodoCompleteChange}
          onTodoRemove={onTodoRemove}
          onTodoTitleChange={() => {}}
          onTodoSelect={() => {}}
          onTodoDeselect={() => {}}
          isSelected={false}
          selectedTodoNewValue=""
          onSelectedTodoNewValueChange={() => {}}
        />
      )}
    </section>
  );
};
