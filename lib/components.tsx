import { formatDate } from './utils'
import { barColor, ButtonStyle } from '../styles/Style'
import { Button, CircularProgress, MenuItem, Stack } from '@mui/material'

// Select
const menuItem = (arr: Array<string>) => {
	return arr.map((item) => (
		<MenuItem key={item} value={item}>
			{item}
		</MenuItem>
	))
}

const menuItemDate = (arr: Array<string>) => {
	return arr.map((day) => (
		<MenuItem key={day} value={day}>
			{formatDate(day)}
		</MenuItem>
	))
}

const Loading = (): JSX.Element => {
	return (
		<Stack alignItems='center' justifyContent='center'>
			<CircularProgress sx={{ color: barColor, mt: '30vh' }} size={150} />
		</Stack>
	)
}

const DefaultButton = (props: any): JSX.Element => {
	return (
		<Stack justifyContent='center' direction='row' spacing={2}>
			<Button
				variant='outlined'
				sx={ButtonStyle}
				onClick={() => props.changeView('daily')}
			>
				View Daily
			</Button>
			<Button
				variant='outlined'
				sx={ButtonStyle}
				onClick={() => props.changeView('hourly')}
			>
				View Hourly
			</Button>
		</Stack>
	)
}

export { menuItem, menuItemDate, Loading, DefaultButton }
