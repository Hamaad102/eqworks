import Head from 'next/head'
import type { NextPage } from 'next'
import { useRouter } from 'next/router'

import { useEffect, useState } from 'react'

// Context
import { useData } from '../../../Context/useDataContext'

import Hourly from '../../../components/Stats/Hourly/Hourly'

import { Loading } from '../../../lib/components'
import { CssBaseline, Stack } from '@mui/material'

const DailyStatsPage: NextPage = () => {
	// Context
	const { statsHourly } = useData()
	const router = useRouter()

	const [loading, setLoading] = useState(true)

	useEffect(() => {
		if (!statsHourly.length) router.push('/')
		else setLoading(false)
	}, [])

	return (
		<div style={{ background: '#84DCC6', height: '100vh' }}>
			<Head>
				<title>Hamaad Chughtai - Stats Hourly</title>
				<link rel='icon' href='/favicon.ico' />
			</Head>

			<main>
				<CssBaseline />
				<Stack>{loading ? <Loading /> : <Hourly />}</Stack>
			</main>
		</div>
	)
}

export default DailyStatsPage
