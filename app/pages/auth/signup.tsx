import React, { useState } from 'react'
import { Typography, Container, TextField, Box, Button } from '@material-ui/core'
import { useAuth } from '../../lib/useAuth'

export default function SignUp() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const { error, signUp } = useAuth()

    const onSubmit = async (e) => {
        e.preventDefault();
        signUp(email, password)
    }

    return (
        <Container maxWidth="sm">
            <Box my={4}>
                <form onSubmit={onSubmit}>
                    {error && <p>{error}</p>}
                    <Typography variant="h4">Sign Up</Typography>
                    <Box pb={2.5} />
                    <TextField style={{width: '80%'}} value={email} onChange={(e) => setEmail(e.target.value)}
                        className="form-control" label="Email" type="email" required />
                    <Box pb={2.5} />
                    <TextField style={{width: '80%'}} value={password} onChange={(e) => setPassword(e.target.value)}
                        className="form-control" label="Password" type="password" required />
                    <Box pb={2.5} />
                    <Button variant="contained" color="primary" size="large" >Sign Up</Button>
                </form>
            </Box>
        </Container>
    )
}