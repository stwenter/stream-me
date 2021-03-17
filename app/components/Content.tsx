import { makeStyles, Theme } from '@material-ui/core/styles'

type VideProps = {
    url: string
}

export default function Video({ url }: VideProps) {
    const classes = useStyles()
    return (
        <div className={classes.container}>
            <iframe className={classes.iframe} src={url} frameBorder="0"
                allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture;"
                allowFullScreen
                loading="lazy"
            />
        </div>
    )
}

const useStyles = makeStyles((theme: Theme) => ({
    container: {
        paddingTop: '56.25%',
        position: 'relative'
    },
    iframe: {
        border: '0',
        height: '100%',
        left: 0,
        position: 'absolute',
        top: 0,
        width: '100%'
    }
}))