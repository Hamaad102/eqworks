// @ts-nocheck
import Head from 'next/head'
import dynamic from 'next/dynamic'
import type { NextPage } from 'next'
import { useRouter } from 'next/router'

import { Loading } from '../../lib/components'
import { Button, CssBaseline, Typography, Stack } from '@mui/material'

import { useEffect, useState } from 'react'

// Context
import { useData } from '../../Context/useDataContext'

// Interface
import { Daily } from '../../lib/interfaces'

// API Calls
import { dailyGet } from '../../lib/api'

import { ButtonStyle, TitleStyle } from '../../styles/Style'

const MapView = dynamic(() => import('../../components/Map/MapView'), {
	ssr: false,
})

const MapPage: NextPage = () => {
	// Context
	const { daily, updateDaily } = useData()
	const router = useRouter()

	const getNum = (val: string) => parseInt(val)
	const getFloat = (val: string) => parseFloat(val).toFixed(2)

	const [loading, setLoading] = useState(true)

	useEffect(() => {
		if (!daily.length) {
			dailyGet()
				.then((res) => {
					const parsedDaily = res.data.map((d: Daily) => ({
						name: d.name,
						events: getNum(d.events),
						impressions: getNum(d.impressions),
						clicks: getNum(d.clicks),
						revenue: getFloat(d.revenue),
						lat: d.lat,
						lon: d.lon,
					}))

					updateDaily(parsedDaily)
					setLoading(false)
				})
				.catch((err) => router.push('/error'))
		} else setLoading(false)
	}, [])

	return (
		<div style={{ background: '#84DCC6', height: '100vh' }}>
			<Head>
				<title>Hamaad Chughtai - Geo Visualizations</title>
				<link rel='icon' href='/favicon.ico' />
				<link
					rel='stylesheet'
					href='https://unpkg.com/leaflet@1.8.0/dist/leaflet.css'
					integrity='sha512-hoalWLoI8r4UszCkZ5kL8vayOGVae1oxXe/2A4AO6J9+580uKHDO3JdHb7NzwwzK5xr/Fs0W40kiNHxM9vyTtQ=='
					crossOrigin=''
				/>
			</Head>

			<main>
				<CssBaseline />
				<Stack>
					{loading ? (
						<Loading />
					) : (
						<Stack alignItems='center' mt={15} spacing={2}>
							<Typography sx={TitleStyle}>Geo Visualizations</Typography>
							<MapView />
							<Stack justifyContent='center' direction='row' spacing={2}>
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

export default MapPage
