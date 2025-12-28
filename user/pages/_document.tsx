import Document, {
  Html, Head, Main, NextScript
} from 'next/document';
import { settingService } from '@services/setting.service';
import parse from 'html-react-parser';

class CustomDocument extends Document {
  static async getInitialProps(ctx) {
    const initialProps = await Document.getInitialProps(ctx);
    const {
      metaKeywords, metaDescription, headerScript, afterBodyScript
    } = await settingService.valueByKeys([
      'metaKeywords',
      'metaDescription',
      'headerScript',
      'afterBodyScript'
    ]);
    const resp = await settingService.all();
    const settings = resp.data;
    return {
      ...initialProps,
      settings,
      metaKeywords,
      metaDescription,
      headerScript,
      afterBodyScript
    };
  }

  render() {
    const {
      settings,
      metaKeywords,
      metaDescription,
      headerScript,
      afterBodyScript
    } = this.props as any;
    return (
      <Html>
        <Head>
          <link rel="icon" href={settings && settings.favicon} sizes="64x64" />
          <meta
            name="viewport"
            content="initial-scale=1.0, width=device-width"
          />
          {/* GA code */}
          {settings
            && settings.gaCode && [
              <script
                async
                src={`https://www.googletagmanager.com/gtag/js?id=${settings.gaCode}`}
              />,
              <script
                // eslint-disable-next-line react/no-danger
                dangerouslySetInnerHTML={{
                  __html: `
                 window.dataLayer = window.dataLayer || [];
                 function gtag(){dataLayer.push(arguments);}
                 gtag('js', new Date());
                 gtag('config', '${settings.gaCode}',{
                  page_path:window.location.pathname,
                 });
             `
                }}
              />
          ]}
          {metaKeywords && <meta name="keywords" content={metaKeywords as string} />}
          {metaDescription && <meta name="description" content={metaDescription} />}
          {headerScript && parse(headerScript)}
        </Head>
        <body>
          {/* {settings && settings.headerScript && (
            // eslint-disable-next-line react/no-danger
            <div dangerouslySetInnerHTML={{ __html: settings.headerScript }} />
          )} */}
          <Main />
          <NextScript />

          {/* {settings && settings.afterBodyScript && (
            // eslint-disable-next-line react/no-danger
            <div
              dangerouslySetInnerHTML={{ __html: settings.afterBodyScript }}
            />
          )} */}
        </body>
        {afterBodyScript && parse(afterBodyScript)}
      </Html>
    );
  }
}

export default CustomDocument;
