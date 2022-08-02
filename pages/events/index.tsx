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
import { EventsDaily, EventsHourly } from '../../lib/interfaces'

// API Calls
import { dailyEventsGet, hourlyEventsGet } from '../../lib/api'
import { ButtonStyle, TitleStyle } from '../../styles/Style'

const EventsPage: NextPage = () => {
	// Context
	const { eventsDaily, updateEvents } = useData()
	const router = useRouter()

	const getDate = (date: string) => date.slice(0, 10)
	const getEvents = (events: string) => parseInt(events)

	const [loading, setLoading] = useState(true)

	useEffect(() => {
		if (!eventsDaily.length) {
			axios
				.all([dailyEventsGet(), hourlyEventsGet()])
				.then(
					axios.spread((...res) => {
						const daily = res[0].data.map((d: EventsDaily) => ({
							date: getDate(d.date),
							name: d.name,
							// @ts-expect-error
							events: getEvents(d.events),
						}))

						const hourly = res[1].data.map((d: EventsHourly) => ({
							date: getDate(d.date),
							name: d.name,
							events: d.events,
							hour: d.hour,
						}))
						updateEvents(daily, hourly)
						setLoading(false)
					})
				)
				.catch((err) => router.push('/error'))
		} else setLoading(false)
	}, [])

	return (
		<div style={{ background: '#84DCC6', height: '100vh' }}>
			<Head>
				<title>Hamaad Chughtai - Events</title>
				<link rel='icon' href='/favicon.ico' />
			</Head>

			<main>
				<CssBaseline />
				<Stack>
					{loading ? (
						<Loading />
					) : (
						<Stack alignItems='center' mt={25} spacing={2}>
							<Typography sx={TitleStyle}>Events</Typography>
							<Stack justifyContent='center' direction='row' spacing={2}>
								<Button
									variant='outlined'
									sx={ButtonStyle}
									onClick={() => router.push('/events/daily')}
								>
									View Daily
								</Button>
								<Button
									variant='outlined'
									sx={ButtonStyle}
									onClick={() => router.push('/events/hourly')}
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

export default EventsPage
