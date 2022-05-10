import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

import Breadcrumbs from '../../components/Breadcrumbs';
import InstallButton from '../../components/InstallButton';
import { css } from '@emotion/react';
import { quickstart } from '../../types';
import defaultImage from '../../images/defaultQuickstartImage.png';
import BannerBackground from './BannerBackground';

const IMAGE_DISPLAY_BREAKPOINT = '1200px';

const LandingBanner = ({ quickstart, className, location }) => {
  const bannerImg = useDetermineBannerImg(quickstart, defaultImage);

  const breadcrumbs = [
    {
      name: 'Instant Observability',
      url: '/',
    },
    {
      name: quickstart.title,
    },
  ];

  return (
    <BannerBackground>
      <div
        className={className}
        css={css`
          border-bottom: none;
          color: var(--brand-secondary-text-color);
          display: grid;
          grid-column-gap: 1rem;
          grid-row-gap: 1rem;
          grid-template-areas:
            'breadcrumbs . .'
            'title title image'
            'summ summ image'
            'cta . image';
          grid-template-columns: 1fr 0.5fr 1fr;
          grid-template-rows: 0.25fr 0.5fr auto auto;
          height: 100%;
          justify-content: normal;
          justify-self: center;
          padding-bottom: 1rem;
          row-gap: 1rem;
          z-index: 2;

          h2 {
            color: white;
          }

          @media (max-width: ${IMAGE_DISPLAY_BREAKPOINT}) {
            grid-template-areas:
              'breadcrumbs'
              'title'
              'summ'
              'cta';
            grid-template-columns: 1fr;
            grid-template-rows: 0.25fr 0.25fr auto auto;
          }
        `}
      >
        <Breadcrumbs segments={breadcrumbs} />
        {quickstart.logoUrl && (
          <div
            css={css`
              position: absolute;
              display: flex;
              justify-content: center;
              top: 0;
              left: 0;
              right: 0;
              pointer-events: none;
            `}
          >
            <div
              css={css`
                background-color: var(--brand-white);
                border-radius: 0 0 7px 7px;
                padding: 5px;
                @media (max-width: ${IMAGE_DISPLAY_BREAKPOINT}) {
                  display: none;
                }
              `}
            >
              <img
                src={quickstart.logoUrl}
                alt={quickstart.title}
                css={css`
                  max-width: 350px;
                  margin: auto;
                  display: block;
                  height: 50px;
                `}
              />
            </div>
          </div>
        )}
        <h2
          css={css`
            font-weight: normal;
            grid-area: title;
            margin-bottom: 0;

            @media (max-width: 760px) {
              font-size: 44px;
              line-height: 46px;
              letter-spacing: -0.015em;
            }
          `}
        >
          {quickstart.title}
        </h2>
        {quickstart.summary && (
          <div
            css={css`
              grid-area: summ;
              font-size: 24px;
              line-height: 32px;

              @media (max-width: 760px) {
                max-width: 100%;
                font-size: 18px;
                line-height: 24px;
                letter-spacing: -0.005em;
              }
            `}
          >
            {quickstart.summary}
          </div>
        )}
        <div
          css={css`
            grid-area: image;
            align-self: start;
            margin: 0 auto 1rem;
            padding-top: 1rem;

            @media (max-width: ${IMAGE_DISPLAY_BREAKPOINT}) {
              display: none;
            }
          `}
        >
          <img
            style={bannerImg.style}
            src={bannerImg.src}
            alt={quickstart.title}
            css={css`
              border: 28px solid #000000;
              border-radius: 26px;
              height: 250px;
              background: white;
            `}
          />
        </div>
        <div
          css={css`
            grid-area: cta;
          `}
        >
          <InstallButton
            css={css``}
            quickstart={quickstart}
            location={location}
            style="PRIMARY"
          />
        </div>
      </div>
    </BannerBackground>
  );
};

function useDetermineBannerImg(quickstart, defaultImage) {
  const defaultBannerImg = {
    src: defaultImage,
    //style the default img's element to fit 1.9 aspect ratio
    style: { padding: ' 20px 100px 0' },
  };
  const [bannerImg, setBannerImg] = useState(defaultBannerImg);

  // get image resolution from URL
  const getURLMeta = async (url) => {
    const img = new Image();
    img.src = url;
    const { width, height } = await new Promise((resolve) => {
      img.onload = function () {
        resolve({
          width: this.width,
          height: this.height,
        });
      };
    });
    return { width, height };
  };

  const isImgAspect16by9 = async () => {
    let image = {
      src: bannerImg.src,
      style: bannerImg.style,
    };

    for (const screenshot of quickstart.dashboards[0]?.screenshots ?? []) {
      const { width, height } = await getURLMeta(screenshot);
      const aspectRatio = width / height;
      if (aspectRatio > 1.6 && aspectRatio < 2.2) {
        //set quickstartImgUrl to this screenshot if its the aspect ratio fits the page layout
        //the ideal ratio is near(~1.9)
        image.src = screenshot;
        console.log('new image', image);
        //unsetting the padding allows the image to size itself with no whitespace
        image.style = { padding: '0' };
        break;
      }
    }
    setBannerImg(image);
  };

  useEffect(() => {
    isImgAspect16by9();
  }, []);

  return bannerImg;
}

LandingBanner.propTypes = {
  quickstart: quickstart.isRequired,
  className: PropTypes.string,
  location: PropTypes.object.isRequired,
};

export default LandingBanner;
