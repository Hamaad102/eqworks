// @ts-nocheck
import L from 'leaflet'
import { useCallback, useEffect, useState } from 'react'
import { Marker, Popup, useMap } from 'react-leaflet'
import useSuperCluster from 'use-supercluster'

// Context
import { useData } from '../../Context/useDataContext'

const icons = {}
const fetchIcon = (count, size) => {
	if (!icons[count]) {
		icons[count] = L.divIcon({
			html: `<div class="cluster-marker" style="width: ${size}px; height: ${size}px;">
                  ${count}
                </div>`,
		})
	}
	return icons[count]
}

const ShowPoi = (): JSX.Element => {
	const { daily } = useData()

	const maxZoom = 22
	const [zoom, setZoom] = useState(12)
	const [bounds, setBounds] = useState(null)
	const map = useMap()

	const update = () => {
		const mapBounds = map.getBounds()
		setBounds([
			mapBounds.getSouthWest().lng,
			mapBounds.getSouthWest().lat,
			mapBounds.getNorthEast().lng,
			mapBounds.getNorthEast().lat,
		])
		setZoom(map.getZoom())
	}

	const onMove = useCallback(() => {
		update()
	}, [map])

	useEffect(() => {
		update()
	}, [map])

	useEffect(() => {
		map.on('move', onMove)
		return () => {
			map.off('move', onMove)
		}
	}, [map, onMove])

	const points = daily.map((poi) => ({
		type: 'Feature',
		properties: {
			cluster: false,
			clicks: poi.clicks,
			events: poi.events,
			impressions: poi.impressions,
			revenue: poi.revenue,
			name: poi.name,
		},
		geometry: {
			type: 'Point',
			coordinates: [poi.lon, poi.lat],
		},
	}))

	const { clusters, supercluster } = useSuperCluster({
		points: points,
		bounds: bounds,
		zoom: zoom,
		options: { radius: 75, maxZoom: 17 },
	})

	return (
		<>
			{clusters.map((cluster) => {
				const [longitude, latitude] = cluster.geometry.coordinates

				const { cluster: isCluster, point_count: pointCount } =
					cluster.properties

				if (isCluster) {
					return (
						<Marker
							position={[latitude, longitude]}
							icon={fetchIcon(
								pointCount,
								10 + (pointCount / points.length) * 40
							)}
							eventHandlers={{
								click: () => {
									const expansionZoom = Math.min(
										supercluster.getClusterExpansionZoom(cluster.id),
										maxZoom
									)
									map.setView([latitude, longitude], expansionZoom, {
										animate: true,
									})
								},
							}}
						/>
					)
				}

				return (
					<>
						<Marker position={[latitude, longitude]}>
							<Popup>
								<b>Name: </b> {cluster.properties.name}
								<br />
								<b>Clicks: </b> {cluster.properties.clicks}
								<br />
								<b>Events: </b> {cluster.properties.events}
								<br />
								<b>Impressions: </b> {cluster.properties.impressions}
								<br />
								<b>Revenue: </b> {cluster.properties.revenue}
							</Popup>
						</Marker>
					</>
				)
			})}
		</>
	)
}

export default ShowPoi
