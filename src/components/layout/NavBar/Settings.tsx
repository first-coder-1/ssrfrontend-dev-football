import React, {useCallback, useState, Suspense} from 'react'
import IconButton from '@mui/material/IconButton'
import SliderIcon  from '@/components/icons/SliderIcon'

const SettingsForm = React.lazy(() => import('./SettingsForm'))

export function Settings() {
	const [showSettings, setShowSettings] = useState(false);
 
	const openSettings = useCallback(() => {
		setShowSettings(true)
	}, [])
	
	const closeSettings = useCallback(() => {
		setTimeout(() => {
			setShowSettings(false)
		}, 0)
	}, [])
	
  return (
	  <IconButton onClick={openSettings}>
		  <SliderIcon color="action"/>
		  {showSettings && <Suspense><SettingsForm open={showSettings} onClose={closeSettings}/></Suspense>}
	  </IconButton>
  );
}

export default Settings
