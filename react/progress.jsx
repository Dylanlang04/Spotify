const { Slider, ThemeProvider, createTheme } = MaterialUI
const { useState, useEffect } = React


const ProgressSlider = () => {
    const [duration, setDuration] = useState(0)
    const [progress, setProgress] = useState(0)

    useEffect(() => {
        const player = document.getElementById("playAudio")
        if (!player) return

        const handleLoadedMetadata = () => {
            setDuration(player.duration)
        }
        const handleTimeUpdate = () => {
            setProgress(player.currentTime)
        }
        player.addEventListener('loadedmetadata', handleLoadedMetadata)
        player.addEventListener('timeupdate', handleTimeUpdate)
        
        return () => {
            player.removeEventListener('loadedmetadata', handleLoadedMetadata)
            player.removeEventListener('timeupdate', handleTimeUpdate)
        }
    
    },[])

    const handleSliderChange = (_, newValue) => {
        const player = document.getElementById("playAudio")
        if (player) {
            player.currentTime = newValue
            setProgress(newValue)
            
        }
        
    }

  return (
    
      
        <Slider
          size="small"
          value={progress}
          min={0}
          max={duration || 1}
          onChange={handleSliderChange}
            sx={{
                width: 'clamp(210px, calc((100vw - 810px) * 0.38 + 210px), 700px)',
                
                '& .MuiSlider-thumb': {
                    color: 'white',
                    opacity: 0,
                    height: 10,
                    width: 10,
                    marginLeft: 0,
                    marginRight: 0,
                    '&:hover, &.Mui-focusVisible, &.Mui-active': {
                        boxShadow: 'none', 
                        
                    }
                },
                  '& .MuiSlider-thumb::before': {
                    content: '""',
                    display: 'block',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '10px',
                    height: '10px',
                    borderRadius: '50%',
    
                },
                '& .MuiSlider-thumb::after': {
                    width: '10px',  
                    height: '10px',
                },
                '&:hover .MuiSlider-thumb': {
                    opacity: 1,            
                },
                '& .MuiSlider-rail': {
                    color: 'white'
                },
                '& .MuiSlider-track': {
                    color: '#f88379'
                }
            }}
        />
      
    
  );
};