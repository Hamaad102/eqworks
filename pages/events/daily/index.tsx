import Head from 'next/head'
import type { NextPage } from 'next'
import { useRouter } from 'next/router'

import { useEffect, useState } from 'react'

// Context
import { useData } from '../../../Context/useDataContext'

import Daily from '../../../components/Events/Daily/Daily'

import { Loading } from '../../../lib/components'
import { CssBaseline, Stack } from '@mui/material'

const DailyEventsPage: NextPage = () => {
	// Context
	const { eventsDaily } = useData()
	const router = useRouter()

	const [loading, setLoading] = useState(true)

	useEffect(() => {
		if (!eventsDaily.length) router.push('/')
		else setLoading(false)
	}, [])

	return (
		<div style={{ background: '#84DCC6', height: '100vh' }}>
			<Head>
				<title>Hamaad Chughtai - Events Daily</title>
				<link rel='icon' href='/favicon.ico' />
			</Head>

			<main>
				<CssBaseline />
				<Stack>{loading ? <Loading /> : <Daily />}</Stack>
			</main>
		</div>
	)
}

export default DailyEventsPage
