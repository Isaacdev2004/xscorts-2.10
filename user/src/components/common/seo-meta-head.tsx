import { truncate } from 'lodash';
import Head from 'next/head';
import { connect, ConnectedProps } from 'react-redux';

export interface ISeoMetaHeadProps {
  item?: any;
  imageUrl?: string;
  pageTitle?: string;
  keywords?: string | Array<string>;
  description?: string;
  metaTitle?: string;
  canonicalUrl?:string;
}

const mapStates = (state: any) => ({
  ui: state.ui,
  seo: state.settings.seo // overwrite settings from path if any
});

const connector = connect(mapStates);

type PropsFromRedux = ConnectedProps<typeof connector>;

function SeoMetaHead({
  ui,
  seo,
  item = null,
  imageUrl = '',
  pageTitle = '',
  keywords = '',
  description = '',
  metaTitle = '',
  canonicalUrl = ''
}: PropsFromRedux & ISeoMetaHeadProps) {
  const itemTitle = seo?.metaTitle || item?.title || item?.name || item?.username;
  const title = seo?.metaTitle || pageTitle || `${itemTitle} | ${ui.siteName}`;
  const mTitle = seo?.metaTitle || metaTitle || title;
  let metaKeywords = seo?.metaKeywords || keywords || item?.keywords;
  if (Array.isArray(keywords)) metaKeywords = keywords.join(',');
  const metaDescription = truncate(seo?.metaDescription || description || item?.description || item?.bio || item?.name || '', {
    length: 160
  });
  const _canonicalUrl = seo?.canonicalUrl || canonicalUrl;
  return (
    <Head>
      <title>
        {title}
      </title>
      {metaKeywords && <meta name="keywords" content={metaKeywords as string} />}
      {metaDescription && <meta name="description" content={metaDescription} />}
      <meta property="title" content={mTitle || title} key="title" />
      {ui.logo && <link rel="icon" type="image/png" href={ui.logo} />}
      <meta property="og:title" content={mTitle || title} key="title" />
      {imageUrl && <meta property="og:image" content={imageUrl || ''} />}
      <meta property="og:keywords" content={metaKeywords as string} />
      <meta property="og:description" content={metaDescription} />
      <meta name="twitter:title" content={mTitle || title} />
      {imageUrl && <meta name="twitter:image" content={imageUrl || ''} />}
      <meta name="twitter:description" content={metaDescription} />
      {_canonicalUrl && <link rel="canonical" href={_canonicalUrl} />}
    </Head>
  );
}

export default connector(SeoMetaHead);
