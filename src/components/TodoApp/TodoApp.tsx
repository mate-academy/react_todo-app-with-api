import { Dispatch, SetStateAction, useMemo, useState } from 'react';
import { useTodos } from '../../hooks/useTodos';
import { ErrorMessages, FilterStatus } from '../../types/enums';
import { filterTodos } from '../../utils/filterTodos';
import { Todo } from '../../types/types';
import { UserWarning } from '../../UserWarning';
import { TodoHeader } from '../TodoHeader/TodoHeader';
import { TodoList } from '../TodoList/TodoList';
import { TodoFooter } from '../TodoFooter/TodoFooter';
import { USER_ID } from '../../types/types';

type Props = {
  setCurrentError: Dispatch<SetStateAction<ErrorMessages | ''>>;
};

export const TodoApp: React.FC<Props> = ({ setCurrentError }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const {
    todos,
    loadingTodos,
    handleAddTodo,
    inputRef,
    tempTodo,
    handleDeleteTodos,
    handleDeleteAllTodos,
    handleCheckTodo,
    handleToggleAll,
    handleEditTodo,
    editTodoTitle,
    setEditTodoTitle,
    activeTodoEdit,
    setActiveTodoEdit,
  } = useTodos(setCurrentError);
  const [activeFilterStatus, setActiveFilterStatus] = useState<FilterStatus>(
    FilterStatus.All,
  );

  const filteredTodos: Todo[] = useMemo(
    () => filterTodos(todos, activeFilterStatus),
    [todos, activeFilterStatus],
  );

  const handleChangeFilter = (type: FilterStatus) => {
    setActiveFilterStatus(type);
  };

  const quantityActiveTasks = todos.filter(todo => !todo.completed).length;

  const handleSearchQuery = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <TodoHeader
          quantityActiveTasks={quantityActiveTasks}
          handleSearchQuery={handleSearchQuery}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          handleAddTodo={handleAddTodo}
          inputRef={inputRef}
          loadingTodos={loadingTodos}
          handleToggleAll={handleToggleAll}
          todos={todos}
        />

        <TodoList
          loadingTodos={loadingTodos}
          handleCheckTodo={handleCheckTodo}
          handleDeleteTodos={handleDeleteTodos}
          filteredTodos={
            tempTodo ? [...filteredTodos, tempTodo] : filteredTodos
          }
          handleEditTodo={handleEditTodo}
          editTodoTitle={editTodoTitle}
          inputRef={inputRef}
          activeTodoEdit={activeTodoEdit}
          setEditTodoTitle={setEditTodoTitle}
          setActiveTodoEdit={setActiveTodoEdit}
        />

        {todos.length > 0 && (
          <TodoFooter
            todos={todos}
            quantityActiveTasks={quantityActiveTasks}
            activeFilterStatus={activeFilterStatus}
            handleChangeFilter={handleChangeFilter}
            handleDeleteAllTodos={handleDeleteAllTodos}
          />
        )}
      </div>
    </div>
  );
};
