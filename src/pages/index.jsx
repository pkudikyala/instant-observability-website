import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import '@components/styles.scss';

import { Button, Icon, Spinner } from '@newrelic/gatsby-theme-newrelic';
import React, { useEffect, useState } from 'react';

import CATEGORIES from '@data/instant-observability-categories';
import useSearchAndCategory from '@hooks/useSearchAndCategory';
import getFilteredQuickstarts from '@utils/getFilteredQuickstarts';
import IOBanner from '@components/IOBanner';
import IOSeo from '@components/IOSeo';
import Overlay from '@components/Overlay';
import PropTypes from 'prop-types';
import { QUICKSTARTS_COLLAPSE_BREAKPOINT } from '@data/constants';
import QuickstartTile from '@components/QuickstartTile';
import Slider from 'react-slick';
import SuperTiles from '@components/SuperTiles';
import { css } from '@emotion/react';
import { graphql } from 'gatsby';
import LeftArrowSVG from '@components/Icons/LeftArrowSVG';
import RightArrowSVG from '@components/Icons/RightArrowSVG';
import featherIcons from '../@newrelic/gatsby-theme-newrelic/icons/feather';

const TRIPLE_COLUMN_BREAKPOINT = '1420px';
const DOUBLE_COLUMN_BREAKPOINT = '1180px';
const SINGLE_COLUMN_BREAKPOINT = '900px';
const COLUMN_BREAKPOINT = '1131px';
// used to set the height of the Spinner to reduce layout shift on page load
const TILE_HEIGHT = '362px';

const QuickstartsPage = ({ data, location }) => {
  const {
    search,
    category,
    setSearch,
    handleParam,
    handleParams,
  } = useSearchAndCategory(location);
  const {
    featuredQuickstarts,
    filteredQuickstarts,
    mostPopularQuickstarts,
    categoriesWithCount,
  } = getFilteredQuickstarts(data.allQuickstarts.nodes, search, category);

  const [isCategoriesOverlayOpen, setIsCategoriesOverlayOpen] = useState(false);
  // variable to check if the page load completed
  const [loadComplete, setLoadComplete] = useState(false);

  // mark the value as true, if the page is loaded
  useEffect(() => {
    if (categoriesWithCount) {
      setLoadComplete(true);
    }
  }, [categoriesWithCount]);

  const closeCategoriesOverlay = () => {
    setIsCategoriesOverlayOpen(false);
  };

  /**
   * Finds display name for selected category.
   * @returns {String} Display name for results found.
   */
  const getDisplayName = (defaultName = 'All quickstarts') => {
    const found = CATEGORIES.find((cat) => cat.value === category);

    if (!found || !found.value) return defaultName;

    return found.displayName;
  };

  // Settings for Slick-Carousel
  const settings = {
    dots: false,
    infinite: false,
    speed: 300,
    slidesToShow: 4,
    slidesToScroll: 4,
    adaptiveHeight: false,
    adaptiveWidth: true,
    mobileFirst: true, // necessary for breakpoints to work as expected
    prevArrow: (
      <button type="button">
        <LeftArrowSVG
          className="slick-prev"
          css={css`
            width: auto;
            height: auto;
            margin: 0 1.5rem;
          `}
        />
      </button>
    ),
    nextArrow: (
      <button type="button">
        <RightArrowSVG
          className="slick-next"
          css={css`
            width: auto;
            height: auto;
            margin: 0 1.5rem;
          `}
        />
      </button>
    ),

    responsive: [
      {
        breakpoint: parseInt(TRIPLE_COLUMN_BREAKPOINT),
        settings: {
          slidesToShow: 3,
          slidesToScroll: 3,
          infinite: true,
          dots: false,
        },
      },
      {
        breakpoint: parseInt(DOUBLE_COLUMN_BREAKPOINT),
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
          infinite: true,
          dots: false,
        },
      },
      {
        breakpoint: parseInt(SINGLE_COLUMN_BREAKPOINT),
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

  const handleScroll = () => {
    const btn = document.getElementById('go-to-page-top-btn');
    if (
      document.body.scrollTop > 3000 ||
      document.documentElement.scrollTop > 3000
    ) {
      btn.style.display = 'block';
    } else {
      btn.style.display = 'none';
    }
  };

  useEffect(() => {
    // Anything in here is fired on component mount.
    window.addEventListener('scroll', handleScroll);
    return () => {
      // Anything in here is fired on component unmount.
      window.removeEventListener('scroll', handleScroll);
    };
  });

  function topFunction() {
    document.documentElement.scrollTop = 0;
  }

  const renderGoToTopButton = () => {
    return (
      <Button
        onClick={() => topFunction()}
        css={css`
          display: none;
          flex-direction: row;
          justify-content: center;
          align-items: center;
          padding: 8px 12px;
          gap: 8px;
          position: fixed;
          width: 40px;
          height: 40px;
          right: 9px;
          bottom: 43px;
          background: #1d252c;
          border-radius: 97px;
          border: 1px solid #898e91;
        `}
        id="go-to-page-top-btn"
      >
        {featherIcons.topArrow}
      </Button>
    );
  };

  return (
    <>
      <IOSeo
        title="Instant Observability"
        location={location}
        type="quickstarts"
      />
      <IOBanner
        handleSearch={handleParam('search')}
        setSearch={setSearch}
        search={search}
      />
      <div
        css={css`
          --sidebar-width: 300px;
          --banner-height: 450px;
          --divider-color: #e4e5e6;
          --primary-text-color: #1d252c;
          display: grid;
          grid-template-columns: var(--sidebar-width) minmax(0, 1fr);
          grid-template-areas: 'sidebar main';
          grid-template-rows: 1fr auto;
          grid-gap: 20px;
          min-height: calc(100vh - var(--global-header-height));
          margin: 0 auto;
          padding: var(--banner-height) 0 15vh 0;

          max-width: var(--site-max-width);

          @media screen and (min-width: ${COLUMN_BREAKPOINT}) {
            --banner-height: 394px;
          }

          @media screen and (max-width: ${QUICKSTARTS_COLLAPSE_BREAKPOINT}) {
            grid-gap: 0;
            grid-template-columns: minmax(0, 1fr);
            grid-template-areas: 'main';
            grid-template-rows: unset;
            padding-bottom: 20px;
          }

          @media screen and (max-width: 359px) {
            padding: calc(var(--banner-height) + 50px) 0 15vh 0;
          }
        `}
      >
        <aside
          data-swiftype-index={false}
          css={css`
            grid-area: sidebar;
            height: calc(100vh - var(--global-header-height));
            position: sticky;
            top: var(--global-header-height);
            width: 100%;

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
              padding: 24px 0 32px 32px;
              height: 100%;
              overflow: auto;

              label {
                font-family: 'Söhne-Leicht';
                font-size: 28px;
                line-height: 36px;
                font-weight: normal;
                margin-bottom: 23px;
                letter-spacing: -0.5px;
              }
              @media screen and (max-width: ${QUICKSTARTS_COLLAPSE_BREAKPOINT}) {
                position: relative;
              }
            `}
          >
            <FormControl>
              <Label htmlFor="quickstartCategory">Categories</Label>

              {!loadComplete && <Spinner />}
              {loadComplete &&
                categoriesWithCount.map(({ displayName, value, count }) => (
                  <Button
                    type="button"
                    key={value}
                    disabled={count === 0}
                    variant={Button.VARIANT.PRIMARY}
                    onClick={() => {
                      handleParams('category', 'search')(value, search);
                    }}
                    css={css`
                      padding: 8px 12px;
                      font-family: 'Söhne-Leicht';
                      font-size: 18px;
                      font-weight: 400;
                      line-height: 54px;
                      width: 100%;
                      display: flex;
                      justify-content: flex-start;
                      color: var(--primary-text-color);
                      border-radius: 3px;
                      background: ${category === value
                        ? 'var(--divider-color)'
                        : 'none'};
                      &:hover {
                        color: var(--black-text-color);
                        background: var(--category-hover-color);
                      }
                    `}
                  >
                    {`${displayName}`}
                    <span
                      css={css`
                        padding-left: 0.25rem;
                      `}
                    >{`(${count})`}</span>
                  </Button>
                ))}
            </FormControl>
          </div>
        </aside>
        <div
          css={css`
            grid-area: main;
            padding: 1.5rem;
          `}
        >
          <div
            css={css`
              display: flex;
              @media screen and (min-width: ${QUICKSTARTS_COLLAPSE_BREAKPOINT}) {
                display: none;
              }
            `}
          >
            <Button
              css={css`
                width: 100%;
                border-radius: 4px;
                border: 1px solid #1d252c;
                color: var(--primary-text-color);
                font-weight: 400;
                font-size: 18px;
                justify-content: flex-start;
                margin: 10px 10px 30px;
                padding: 20px 24px;
                display: flex;
                justify-content: space-between;
              `}
              variant={Button.VARIANT.LINK}
              onClick={() => setIsCategoriesOverlayOpen(true)}
            >
              {getDisplayName('Filter by Category')}
              <Icon
                css={css`
                  color: #1d252c;
                  width: 20px;
                  transform: rotate(-90deg);
                  margin: -4px;
                `}
                name="fe-chevron-left"
                size="120%"
              />
            </Button>
            <Overlay
              isOpen={isCategoriesOverlayOpen}
              onCloseOverlay={closeCategoriesOverlay}
            >
              <div
                css={css`
                  --divider-color: #e4e5e6;

                  border-radius: 5px;
                  position: relative;
                  width: 100%;
                  margin: 30% auto 0;
                  padding: 1rem;
                  background: var(--primary-background-color);
                `}
              >
                <h3
                  css={css`
                    padding: 0.5rem 0 0 0.5rem;
                    font-family: 'Söhne-Buch';
                    font-size: 28px;
                    line-height: 36px;
                    margin-bottom: 12px;
                    letter-spacing: -0.5px;
                    font-weight: normal;
                  `}
                >
                  Category
                </h3>
                <div
                  css={css`
                    max-height: 400px;
                    padding-bottom: 3rem;
                    overflow-y: scroll;
                  `}
                >
                  {!loadComplete && <Spinner />}
                  {loadComplete &&
                    categoriesWithCount.map(({ displayName, value, count }) => (
                      <Button
                        type="button"
                        key={value}
                        variant={Button.VARIANT.PRIMARY}
                        onClick={() => handleParam('category')(value)}
                        css={css`
                          width: 100%;
                          display: flex;
                          justify-content: flex-start;
                          color: var(--primary-text-color);
                          border-radius: 3px;
                          padding: 8px 12px;
                          font-family: 'Söhne-Buch';
                          font-size: 18px;
                          line-height: 54px;
                          background: ${category === value
                            ? 'var(--divider-color)'
                            : 'none'};
                        `}
                      >
                        {`${displayName} (${count})`}
                      </Button>
                    ))}
                </div>
                <div
                  css={css`
                    background: var(--divider-color);
                    position: absolute;
                    bottom: 0;
                    left: 0;
                    width: 100%;
                    height: 4rem;
                    border-bottom-right-radius: 5px;
                    border-bottom-left-radius: 5px;
                    display: flex;
                    justify-content: flex-end;
                    align-items: center;
                  `}
                >
                  <Button
                    css={css`
                      height: 2rem;
                      margin-right: 1rem;
                      background: #1d252c;
                      &:hover {
                        background: #1d252c;
                      }
                    `}
                    onClick={closeCategoriesOverlay}
                    variant={Button.VARIANT.PRIMARY}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </Overlay>
          </div>

          {!category && !search && (
            <>
              {mostPopularQuickstarts.length > 0 && (
                <>
                  <div
                    css={css`
                      --text-color: var(--primary-text-color);
                      font-size: 16px;
                      color: var(--color-neutrals-800);
                      align-text: center;
                      margin: 0 0 13px 0;
                      span {
                      }
                      strong {
                        font-family: 'Söhne-Leicht';
                        font-size: 28px;
                        line-height: 36px;
                        letter-spacing: -0.5px;
                        color: #1d252c;
                        font-weight: normal;
                      }
                      @media screen and (max-width: ${QUICKSTARTS_COLLAPSE_BREAKPOINT}) {
                        padding: 0 0 0.5rem;
                      }
                    `}
                  >
                    <span>
                      <strong>Most Popular</strong>
                    </span>
                  </div>
                  <div
                    css={css`
                      height: ${TILE_HEIGHT};
                    `}
                  >
                    {!loadComplete && <Spinner />}
                    {loadComplete && (
                      <Slider
                        {...settings}
                        css={css`
                          display: flex;
                        `}
                      >
                        <SuperTiles />
                        {mostPopularQuickstarts.map((pack) => (
                          <QuickstartTile
                            key={pack.id}
                            featured={false}
                            {...pack}
                          />
                        ))}
                      </Slider>
                    )}
                  </div>
                </>
              )}
              <div
                css={css`
                  --text-color: var(--primary-text-color);
                  font-size: 16px;
                  color: var(--color-neutrals-800);
                  align-text: center;
                  margin: 75px 0 13px 0;

                  strong {
                    font-family: 'Söhne-Leicht';
                    font-size: 28px;
                    line-height: 36px;
                    letter-spacing: -0.5px;
                    color: #1d252c;
                    font-weight: normal;
                  }
                  @media screen and (max-width: ${QUICKSTARTS_COLLAPSE_BREAKPOINT}) {
                    padding: 0 0 0.5rem;
                  }
                `}
              >
                <span>
                  <strong>Featured</strong>
                </span>
              </div>
              <div
                css={css`
                  margin-bottom: 75px;
                  height: ${TILE_HEIGHT};
                `}
              >
                {!loadComplete && <Spinner />}
                {loadComplete && (
                  <Slider {...settings}>
                    {featuredQuickstarts.map((pack) => (
                      <QuickstartTile
                        key={pack.id}
                        featured={false}
                        {...pack}
                      />
                    ))}
                  </Slider>
                )}
              </div>
            </>
          )}
          <div
            css={css`
              --text-color: var(--primary-text-color);
              margin: 0px 0 13px 4px;

              padding: 0 0 1.25rem 0;
              font-size: 18px;
              color: var(--color-neutrals-800);
              display: flex;
              justify-content: space-between;
              align-text: center;

              span {
                width: 100%;
                color: var(--text-color);

                /* target inner children of parent span */
                span,
                strong {
                  font-family: 'Söhne-Leicht';

                  letter-space: -0.5px;
                  @media screen and (max-width: ${QUICKSTARTS_COLLAPSE_BREAKPOINT}) {
                    display: none;
                  }
                }
              }

              strong {
                color: var(--text-color);
                display: block;
                text-overflow: ellipsis;
                overflow-x: hidden;
                whitespace: nowrap;
                font-weight: 100;
                font-size: 28px;
              }

              @media screen and (max-width: ${QUICKSTARTS_COLLAPSE_BREAKPOINT}) {
                padding: 0 0 0.5rem;
              }
            `}
          >
            <span>
              Showing {filteredQuickstarts.length} results
              <span> for: </span>
              <strong>{search || getDisplayName()}</strong>
            </span>
          </div>
          <div
            css={css`
              display: grid;
              grid-gap: 40px 15px;
              grid-template-columns: repeat(4, 1fr);
              grid-auto-rows: 1fr;
              @media (max-width: ${TRIPLE_COLUMN_BREAKPOINT}) {
                grid-template-columns: repeat(3, 1fr);
              }

              @media (max-width: ${DOUBLE_COLUMN_BREAKPOINT}) {
                grid-template-columns: repeat(2, 1fr);
              }

              @media (max-width: ${SINGLE_COLUMN_BREAKPOINT}) {
                grid-template-columns: repeat(1, 1fr);
              }
            `}
          >
            {Boolean(search) && <SuperTiles />}
            {filteredQuickstarts.map((pack) => (
              <QuickstartTile key={pack.id} featured={false} {...pack} />
            ))}
          </div>
        </div>
      </div>
      {renderGoToTopButton()}
    </>
  );
};

QuickstartsPage.propTypes = {
  data: PropTypes.object.isRequired,
  location: PropTypes.object,
};

export const pageQuery = graphql`
  query {
    allQuickstarts {
      nodes {
        id
        name
        title
        slug
        summary
        description
        level
        keywords
        logoSvg {
          ext
          publicURL
        }
        logo {
          childImageSharp {
            gatsbyImageData(
              height: 45
              placeholder: BLURRED
              formats: [AUTO, WEBP]
            )
          }
        }
      }
    }
  }
`;

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

export default QuickstartsPage;
