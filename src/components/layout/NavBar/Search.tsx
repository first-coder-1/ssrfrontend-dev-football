import React, {Suspense, useCallback, useState} from 'react'
import SearchIcon from '@/components/icons/SearchIcon'
import IconButton from '@mui/material/IconButton'

const SearchDrawer = React.lazy(() => import('./SearchDrawer'))

export function Search(): React.ReactElement {
	const [showSearch, setShowSearch] = useState(false);
	
	const openDrawer = useCallback(() => {
		setShowSearch(true)
	}, [])
	
	const hideDrawer = useCallback(() => {
		setShowSearch(false)
	}, [])
	
	if (showSearch) {
		return (
			<Suspense>
				<SearchDrawer visible={showSearch} onClose={hideDrawer}/>
			</Suspense>
		)
	}
	
	return (
		<IconButton onClick={openDrawer}>
			<SearchIcon color="action"/>
		</IconButton>
	)
}
