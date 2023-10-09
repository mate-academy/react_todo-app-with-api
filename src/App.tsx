/* eslint-disable jsx-a11y/control-has-associated-label */
import { UserWarning } from './UserWarning';
import { TodoList } from './components/TodoList';
import { Footer } from './components/Footer';
import { CaseOfErrorMessage } from './components/CaseOfErrorMessage';
import { useTodo } from './context/TodoContext';
import { Header } from './components/Header';

const USER_ID = 11433;

export const App: React.FC = () => {
  const { todos } = useTodo();

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>
      <div className="todoapp__content">
        <Header />
        {todos && <TodoList />}

        {todos.length !== 0
          && (
            <Footer />
          )}
      </div>
      <CaseOfErrorMessage />
    </div>
  );
};
