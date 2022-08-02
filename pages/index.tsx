/* eslint-disable react/no-unescaped-entities */
import axios from 'axios'
import Head from 'next/head'
import { useRouter } from 'next/router'
import type { NextPage } from 'next'

import { Box, Button, CssBaseline, Typography, Stack } from '@mui/material'

// Components
import { ButtonStyle, TitleStyle } from '../styles/Style'

const Home: NextPage = () => {
	const router = useRouter()

	const checkBucket = (newView: string) => {
		axios
			.get('/api/data')
			.then((res) => {
				if (res.data.allowed) router.push(newView)
				else router.push('/exceed')
			})
			.catch((err) => router.push('/error'))
	}

	return (
		<div style={{ background: '#84DCC6', height: '100vh' }}>
			<Head>
				<title>Hamaad Chughtai - EQ Works</title>
				<meta
					name='description'
					content='Frontend for the Application Development Track assignment'
				/>
				<link rel='icon' href='/favicon.ico' />
			</Head>

			<main>
				<CssBaseline />
				<Stack alignItems='center'>
					<Stack mt={25} spacing={2}>
						<Typography sx={TitleStyle} textAlign='center'>
							EQ Works
							<br />
							<Box component='span' sx={{ fontSize: 40 }}>
								Application Development Track
							</Box>
						</Typography>
						<Stack direction='row' spacing={2} justifyContent='center'>
							<Button
								variant='outlined'
								sx={ButtonStyle}
								onClick={() => checkBucket('/events')}
							>
								Go to Events
							</Button>
							<Button
								variant='outlined'
								sx={ButtonStyle}
								onClick={() => checkBucket('/stats')}
							>
								Go to Stats
							</Button>
							<Button
								variant='outlined'
								sx={ButtonStyle}
								onClick={() => checkBucket('/table')}
							>
								Go to Data Table
							</Button>
							<Button
								variant='outlined'
								sx={ButtonStyle}
								onClick={() => checkBucket('/map')}
							>
								Go to Geo Visualization
							</Button>
						</Stack>
					</Stack>
				</Stack>
			</main>
		</div>
	)
}

export default Home
