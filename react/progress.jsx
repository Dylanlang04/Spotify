const { Slider, ThemeProvider, createTheme } = MaterialUI;
const { useState, useEffect } = React;


const ProgressSlider = () => {
    const [volume] = useState(70)

  return (
    
      
        <Slider
          size="small"
          value={volume}
          defaultValue={70}
            sx={{
                width: '25%',
                
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