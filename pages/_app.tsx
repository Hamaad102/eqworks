import type { AppProps } from 'next/app'

import { CacheProvider, EmotionCache } from '@emotion/react'
import createEmotionCache from '../lib/createEmotionCache'

import '../styles/ShowPoi.css'

// Context Provider
import { DataProvider } from '../Context/useDataContext'
import { ValueProvider } from '../Context/useValueContext'

interface MyAppProps extends AppProps {
	emotionCache?: EmotionCache
}

const clientSideEmotionCache = createEmotionCache()

const MyApp: React.FunctionComponent<MyAppProps> = (props) => {
	const { Component, emotionCache = clientSideEmotionCache, pageProps } = props
	return (
		<DataProvider>
			<ValueProvider>
				<CacheProvider value={emotionCache}>
					<Component {...pageProps} />
				</CacheProvider>
			</ValueProvider>
		</DataProvider>
	)
}

export default MyApp
