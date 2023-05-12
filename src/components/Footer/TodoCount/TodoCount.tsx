import { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { FooterContext } from '../../../context/FooterContext';

export const TodoCount: React.FC = () => {
  const { notCompletedTodoCount } = useContext(FooterContext);
  const { t } = useTranslation();

  return (
    <span className="todo-count">
      {`${notCompletedTodoCount} ${t('Footer.count')}`}
    </span>
  );
};
