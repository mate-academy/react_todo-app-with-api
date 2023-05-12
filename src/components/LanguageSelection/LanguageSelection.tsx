import classNames from 'classnames';
import React from 'react';
import { useTranslation } from 'react-i18next';

export const LanguageSelection: React.FC = React.memo(() => {
  const { i18n } = useTranslation();
  const locales: { [key: string]: { title: string } } = {
    en: { title: 'en' },
    ua: { title: 'ua' },
  };

  return (
    <div className="language">
      {Object.keys(locales).map((locale) => {
        const isActive = locale === i18n.language;

        return (
          <button
            key={locale}
            type="button"
            className={classNames(
              'language__button',
              'button',
              'is-primary',
              {
                'is-outlined:focus': isActive,
                'is-outlined': !isActive,
              },
            )}
            onClick={() => i18n.changeLanguage(locale)}
          >
            {locales[locale].title}
          </button>
        );
      })}
    </div>
  );
});
