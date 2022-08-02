// @ts-nocheck
import axios from 'axios'
import Head from 'next/head'
import type { NextPage } from 'next'
import { useRouter } from 'next/router'

import { Button, CssBaseline, Typography, Stack } from '@mui/material'
import { Loading } from '../../lib/components'

import { useEffect, useState } from 'react'

// Context
import { useData } from '../../Context/useDataContext'

// Interface
import { StatsDaily, StatsHourly } from '../../lib/interfaces'

// API Calls
import { dailyStatsGet, hourlyStatsGet } from '../../lib/api'

import { ButtonStyle, TitleStyle } from '../../styles/Style'

const StatsPage: NextPage = () => {
	// Context
	const { statsDaily, updateStats } = useData()
	const router = useRouter()

	const getNum = (val: string) => parseInt(val)
	const getDate = (date: string) => date.slice(0, 10)
	const getFloat = (val: string) => parseFloat(val).toFixed(2)

	const [loading, setLoading] = useState(true)

	useEffect(() => {
		if (!statsDaily.length) {
			axios
				.all([dailyStatsGet(), hourlyStatsGet()])
				.then(
					axios.spread((...res) => {
						const daily = res[0].data.map((d: StatsDaily) => ({
							date: getDate(d.date),
							impressions: getNum(d.impressions),
							clicks: getNum(d.clicks),
							revenue: getFloat(d.revenue),
						}))

						const hourly = res[1].data.map((d: StatsHourly) => ({
							date: getDate(d.date),
							name: d.name,
							hour: d.hour,
							impressions: d.impressions,
							clicks: d.clicks,
							revenue: getFloat(d.revenue),
						}))
						updateStats(daily, hourly)
						setLoading(false)
					})
				)
				.catch((err) => router.push('/error'))
		} else setLoading(false)
	}, [])

	return (
		<div style={{ background: '#84DCC6', height: '100vh' }}>
			<Head>
				<title>Hamaad Chughtai - Stats</title>
				<link rel='icon' href='/favicon.ico' />
			</Head>

			<main>
				<CssBaseline />
				<Stack>
					{loading ? (
						<Loading />
					) : (
						<Stack alignItems='center' mt={25} spacing={2}>
							<Typography sx={TitleStyle}>Stats</Typography>
							<Stack justifyContent='center' direction='row' spacing={2}>
								<Button
									variant='outlined'
									sx={ButtonStyle}
									onClick={() => router.push('/stats/daily')}
								>
									View Daily
								</Button>
								<Button
									variant='outlined'
									sx={ButtonStyle}
									onClick={() => router.push('/stats/hourly')}
								>
									View Hourly
								</Button>
								<Button
									variant='outlined'
									sx={ButtonStyle}
									onClick={() => router.push('/')}
								>
									Return Home
								</Button>
							</Stack>
						</Stack>
					)}
				</Stack>
			</main>
		</div>
	)
}

export default StatsPage
