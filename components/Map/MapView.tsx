// @ts-nocheck
import { MapContainer, TileLayer } from 'react-leaflet'

import ShowPoi from './ShowPoi'

const MapView = (): JSX.Element => {
	const position = [43.6824, -79.4089]

	return (
		<MapContainer
			style={{ height: '60vh', width: '75vw' }}
			center={position}
			zoom={4}
			scrollWheelZoom={true}
		>
			<TileLayer
				attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
				url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
			/>
			<ShowPoi />
		</MapContainer>
	)
}

export default MapView
