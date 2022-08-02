// @ts-nocheck
import axios from 'axios'
import Head from 'next/head'
import type { NextPage } from 'next'
import { useRouter } from 'next/router'

import { DataGrid } from '@mui/x-data-grid'
import { Loading } from '../../lib/components'
import { Button, CssBaseline, Typography, Stack } from '@mui/material'

import { useEffect, useState } from 'react'

// Context
import { useData } from '../../Context/useDataContext'

// Interface
import { StatsDaily, StatsHourly } from '../../lib/interfaces'

// API Calls
import { dailyStatsGet, hourlyStatsGet } from '../../lib/api'

import { ButtonStyle, TitleStyle } from '../../styles/Style'

const TablePage: NextPage = () => {
	// Context
	const { statsDaily, statsHourly, updateStats } = useData()
	const router = useRouter()

	const getNum = (val: string) => parseInt(val)
	const getDate = (date: string) => date.slice(0, 10)

	const [toggle, setToggle] = useState(true)
	const [loading, setLoading] = useState(true)

	const hourlyColumns = [
		{ field: 'date', headerName: 'Date', width: 100 },
		{ field: 'name', headerName: 'Name', width: 150 },
		{ field: 'hour', headerName: 'Hour', width: 75 },
		{
			field: 'impressions',
			headerName: 'Impressions',
			width: 125,
			type: 'number',
		},
		{ field: 'clicks', headerName: 'Clicks', width: 100, type: 'number' },
		{ field: 'revenue', headerName: 'Revenue', width: 100, type: 'number' },
	]

	const dailyColumns = [
		{ field: 'date', headerName: 'Date', width: 100 },
		{
			field: 'impressions',
			headerName: 'Impressions',
			width: 125,
			type: 'number',
		},
		{ field: 'clicks', headerName: 'Clicks', width: 100, type: 'number' },
		{ field: 'revenue', headerName: 'Revenue', width: 100, type: 'number' },
	]

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
							revenue: getNum(d.revenue),
						}))

						const hourly = res[1].data.map((d: StatsHourly) => ({
							date: getDate(d.date),
							name: d.name,
							hour: d.hour,
							impressions: d.impressions,
							clicks: d.clicks,
							revenue: getNum(d.revenue),
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
				<title>Hamaad Chughtai - Data Table</title>
				<link rel='icon' href='/favicon.ico' />
			</Head>

			<main>
				<CssBaseline />
				<Stack>
					{loading ? (
						<Loading />
					) : (
						<Stack alignItems='center' mt={15} spacing={2}>
							<Typography sx={TitleStyle}>
								Stats {toggle ? 'Hourly' : 'Daily'}
							</Typography>
							<DataGrid
								rows={toggle ? statsHourly : statsDaily}
								autoHeight={true}
								columns={toggle ? hourlyColumns : dailyColumns}
								pageSize={10}
								getRowId={(r) => r.impressions}
								sx={{
									width: toggle ? 700 : 450,
									borderColor: '#84DCC6',
								}}
							/>
							<Stack justifyContent='center' direction='row' spacing={2}>
								<Button
									variant='outlined'
									sx={ButtonStyle}
									onClick={() => setToggle(!toggle)}
								>
									{toggle ? 'Daily' : 'Hourly'}
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

export default TablePage
