import React from 'react';
import { css } from '@emotion/react';
import PropTypes from 'prop-types';
import { Button } from '@newrelic/gatsby-theme-newrelic';
import { QUICKSTARTS_COLLAPSE_BREAKPOINT } from '../data/constants';

const QuickstartsSidebar = ({
  categoriesWithCount,
  category,
  handleCategory,
  totalQuickstartCount,
}) => (
  <aside
    data-swiftype-index={false}
    css={css`
      grid-area: sidebar;
      height: calc(100vh - var(--global-header-height));
      position: sticky;
      top: var(--global-header-height);

      @media screen and (max-width: ${QUICKSTARTS_COLLAPSE_BREAKPOINT}) {
        display: none;
        position: relative;
        overflow: hidden;
        width: 100%;
        height: 100%;
      }
    `}
  >
    <div
      css={css`
        padding: var(--site-content-padding);
        height: 100%;
        overflow: auto;
        @media screen and (max-width: ${QUICKSTARTS_COLLAPSE_BREAKPOINT}) {
          position: relative;
        }
      `}
    >
      <FormControl>
        <Label htmlFor="quickstartCategory">CATEGORIES</Label>
        <Button
          type="button"
          key="all"
          disabled={totalQuickstartCount === 0}
          onClick={() => handleCategory([])}
          css={css`
            padding: 1rem 0.5rem;
            width: 100%;
            display: flex;
            justify-content: flex-start;
            color: var(--primary-text-color);
            font-weight: 100;
            background: ${category === [].toString()
              ? 'var(--divider-color)'
              : 'none'};
          `}
        >
          All
          <span
            css={css`
              color: var(--secondary-text-color);
              padding-left: 0.25rem;
            `}
          >{`(${totalQuickstartCount})`}</span>
        </Button>
        {categoriesWithCount.map(({ displayName, terms, slug, count }) => (
          <Button
            type="button"
            key={slug}
            disabled={count === 0}
            onClick={() => handleCategory(terms)}
            css={css`
              padding: 1rem 0.5rem;
              width: 100%;
              display: flex;
              justify-content: flex-start;
              color: var(--primary-text-color);
              font-weight: 100;
              background: ${category === terms.toString()
                ? 'var(--divider-color)'
                : 'none'};
            `}
          >
            {`${displayName}`}
            <span
              css={css`
                color: var(--secondary-text-color);
                padding-left: 0.25rem;
              `}
            >{`(${count})`}</span>
          </Button>
        ))}
      </FormControl>
    </div>
  </aside>
);

QuickstartsSidebar.propTypes = {
  categoriesWithCount: PropTypes.array.isRequired,
  category: PropTypes.string.isRequired,
  handleCategory: PropTypes.func.isRequired,
  totalQuickstartCount: PropTypes.number.isRequired,
};

const Label = ({ children, htmlFor }) => (
  <label
    htmlFor={htmlFor}
    css={css`
      display: block;
      font-size: 1rem;
      font-weight: 600;
      margin-bottom: 0.5rem;
      color: var(--primary-text-color);
    `}
  >
    {children}
  </label>
);

Label.propTypes = {
  children: PropTypes.node,
  htmlFor: PropTypes.string,
};

const FormControl = ({ children }) => (
  <div
    css={css`
      display: flex;
      flex-direction: column;
      align-items: flex-start;
    `}
  >
    {children}
  </div>
);

FormControl.propTypes = {
  children: PropTypes.node,
};

export default QuickstartsSidebar;
