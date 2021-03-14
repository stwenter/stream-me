import { Container, Typography, Box, Button } from '@material-ui/core'
import Link from 'next/link'
import React from 'react'

const About = () => {
    return (
        <Container maxWidth="sm">
            <Box my={4}>
                <Typography variant="h4" component="h1" gutterBottom>
                   About page
                </Typography>
                <Link href="/">
                    <Button variant="contained" color="primary">Go to the index page</Button>
                </Link>
            </Box>
        </Container>
    )
};

export default About;