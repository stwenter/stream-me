import {useEffect} from 'react'

import CssBaseline from '@material-ui/core/CssBaseline'
import { ThemeProvider } from '@material-ui/core/styles'

import { themeDark, themeLight } from 'lib/theme'

const MyApp = ({ Component, pageProps }) => {
    
    useEffect(() => {
        // Remove ssr injected css
        const jssStyles = document.querySelector('#jss-server-side-styles');
        if (jssStyles && jssStyles.parentNode) {
            jssStyles.parentNode.removeChild(jssStyles)
        }
    }, [])
    
    return (
        <ThemeProvider theme={true ? themeLight : themeDark}>
            <CssBaseline />
            <Component {...pageProps} />
        </ThemeProvider>
    )
}

export default MyApp