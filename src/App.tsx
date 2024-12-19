import { FC, useState } from 'react';

import { getFilteredTodos } from './utils/getFilterdTodos';
import { TodoList } from './components/TodoList';
import { Footer } from './components/Footer';
import { Error } from './components/Error';
import { SelectedType } from './types/SelectedType';
import { Header } from './components/Header';
import { useTodos } from './hooks/useTodos';

export const App: FC = () => {
  const {
    todos,
    errorMessage,
    setErrorMessage,
    handleAddTodo,
    handleDeleteTodo,
    updateTodo,
    loading,
    setLoading,
    newTitle,
    setNewTitle,
    setTempTodo,
    temptTodo,
    loadingTodoId,
    editingTodoId,
    setEditingTodoId,
  } = useTodos();
  const [selectedOption, setSelectedOption] = useState<SelectedType>(
    SelectedType.ALL,
  );

  const filteredTodos = getFilteredTodos(todos, selectedOption);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          todos={todos}
          newTitle={newTitle}
          setNewTitle={setNewTitle}
          setErrorMessage={setErrorMessage}
          onAddTodo={handleAddTodo}
          setLoading={setLoading}
          loading={loading}
          setTempTodo={setTempTodo}
          updateTodo={updateTodo}
        />

        {todos.length > 0 && (
          <>
            <TodoList
              todos={filteredTodos}
              temptTodo={temptTodo}
              onDeleteTodo={handleDeleteTodo}
              loadingTodoId={loadingTodoId}
              updateTodo={updateTodo}
              editingTodoId={editingTodoId}
              setEditingTodoId={setEditingTodoId}
            />

            <Footer
              todos={todos}
              selectedOption={selectedOption}
              setSelectedOption={setSelectedOption}
              handleDeleteTodo={handleDeleteTodo}
            />
          </>
        )}
      </div>

      <Error errorMessage={errorMessage} setErrorMessage={setErrorMessage} />
    </div>
  );
};
