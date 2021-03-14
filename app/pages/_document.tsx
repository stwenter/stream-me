import Document, { Html, Head, Main, NextScript, DocumentContext } from 'next/document'
import { ServerStyleSheets } from '@material-ui/core'
import React from 'react';

class MyDocument extends Document {

    static async getInitialProps(ctx: DocumentContext) {
      // REnder the app and get the context fo the page wth collected side effects
        const sheets = new ServerStyleSheets()
        const originalRenderPage = ctx.renderPage;

        ctx.renderPage = () => {
            return originalRenderPage({
                enhanceApp: (App) => (props) => {
                return sheets.collect(<App {...props} />)
            }});
        }

        const initialProps = await Document.getInitialProps(ctx)
        return {
            ...initialProps, styles: [...React.Children.toArray(initialProps.styles),
            sheets.getStyleElement()]
        }
    }

  render() {
    return (
      <Html>
        <Head />
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}

export default MyDocument