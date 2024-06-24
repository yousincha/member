import Document, { Html, Head, Main, NextScript } from "next/document";
import createEmotionServer from "@emotion/server/create-instance";
import createCache from "@emotion/cache";
import { CacheProvider } from "@emotion/react";
import React from "react";

// Emotion Cache 설정
const cache = createCache({ key: "css", prepend: true });
const { extractCritical } = createEmotionServer(cache);

class MyDocument extends Document {
  static async getInitialProps(ctx) {
    const originalRenderPage = ctx.renderPage;

    // Render app and page and get the context of the page with collected side effects
    ctx.renderPage = () =>
      originalRenderPage({
        enhanceApp: (App) => (props) =>
          (
            <CacheProvider value={cache}>
              <App {...props} />
            </CacheProvider>
          ),
      });

    const initialProps = await Document.getInitialProps(ctx);
    const styles = extractCritical(initialProps.html);

    return {
      ...initialProps,
      styles: (
        <>
          {initialProps.styles}
          <style
            data-emotion-css={styles.ids.join(" ")}
            dangerouslySetInnerHTML={{ __html: styles.css }}
          />
        </>
      ),
    };
  }

  render() {
    return (
      <Html lang="en">
        <Head></Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
