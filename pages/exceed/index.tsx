/* eslint-disable react/no-unescaped-entities */
import Head from 'next/head'
import type { NextPage } from 'next'
import { useRouter } from 'next/router'

import { Button, CssBaseline, Typography, Stack } from '@mui/material'

import { ButtonStyle, TitleStyle } from '../../styles/Style'

const ExceedPage: NextPage = () => {
	const router = useRouter()

	return (
		<div style={{ background: '#84DCC6', height: '100vh' }}>
			<Head>
				<title>Hamaad Chughtai - Error</title>
				<link rel='icon' href='/favicon.ico' />
			</Head>

			<main>
				<CssBaseline />
				<Stack>
					<Stack alignItems='center' spacing={2} mt={25}>
						<Typography sx={TitleStyle} textAlign='center'>
							Ooops. You've exceeded your allocated requests.
							<br />
							Try again later!
						</Typography>
						<Button
							variant='outlined'
							style={ButtonStyle}
							onClick={() => router.push('/')}
						>
							Click to return home
						</Button>
					</Stack>
				</Stack>
			</main>
		</div>
	)
}

export default ExceedPage
