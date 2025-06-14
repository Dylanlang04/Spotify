

const { Slider, ThemeProvider, createTheme } = MaterialUI;
const { useState, useEffect } = React;


const VolSlider = () => {
    const [volume, setVolume] = useState(70)

    const handleChange = (_, newValue) => {
        setVolume(newValue)
        setVolumeJS(newValue)
        checkVol()
    }
    useEffect(() => {
        const handleExternalUpdate = (e) => {
            const newValue = e.detail
            setVolume(newValue)
            checkVol()
        }
    window.addEventListener('update-slider', handleExternalUpdate)
    return () => window.removeEventListener('update-slider', handleExternalUpdate);
  }, []);

  return (
    
      
        <Slider
          size="small"
          value={volume}
          defaultValue={70}
          onChange={handleChange}
            sx={{
                width: 150,
                
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
