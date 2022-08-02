import { TouchEvent, MouseEvent } from 'react'
import { EventsHourly, HourlyEventsBar } from '../../../lib/interfaces'

import { barColor, axisLabelColor, tickLabelColor } from '../../../styles/Style'

// Visx
import { Bar } from '@visx/shape'
import { Group } from '@visx/group'
import { AnimatedAxis } from '@visx/react-spring'

const BarComponent = (props: HourlyEventsBar): JSX.Element => {
	const {
		margin,
		height,
		groupCategory,
		date,
		selected,
		getHour,
		getEvents,
		xScale,
		yScale,
		onMouseOver,
		onMouseOut,
		xAxisLabel,
	} = props

	const innerHeight = height - margin * 2

	return (
		<>
			<Group>
				<AnimatedAxis
					orientation='bottom'
					top={innerHeight}
					scale={xScale}
					hideAxisLine
					numTicks={2}
					label={xAxisLabel}
					labelProps={{ fontSize: 20, fill: axisLabelColor }}
					hideTicks
					tickLabelProps={() => ({
						fill: tickLabelColor,
						fontSize: 14,
						textAnchor: 'middle',
					})}
				/>
			</Group>
			<Group>
				<AnimatedAxis
					orientation='left'
					scale={yScale}
					labelOffset={40}
					left={margin + 35}
					hideAxisLine
					hideTicks
					label='Events'
					labelProps={{ fontSize: 20, fill: axisLabelColor }}
					tickStroke='#612efb'
					tickLabelProps={() => ({
						fill: tickLabelColor,
						fontSize: 14,
						textAnchor: 'middle',
					})}
				/>
			</Group>
			<Group>
				{groupCategory
					.get(date)
					.get(selected)
					?.map((d: EventsHourly) => {
						const xValue = getHour(d)
						const barWidth = xScale.bandwidth()
						const barHeight = innerHeight - (yScale(getEvents(d)) ?? 0)

						const barX = xScale(xValue)
						const barY = innerHeight - barHeight

						return (
							<Bar
								key={`bar-${xValue}`}
								x={barX}
								y={barY}
								width={barWidth}
								height={barHeight}
								fill={barColor}
								onMouseMove={(
									event: TouchEvent<SVGRectElement> | MouseEvent<SVGRectElement>
								) => {
									onMouseOver(event, d)
								}}
								onMouseLeave={onMouseOut}
							/>
						)
					})}
			</Group>
		</>
	)
}

export default BarComponent
