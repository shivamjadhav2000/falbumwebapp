
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import CloseIcon from '@mui/icons-material/Close';
export default function MediaView({currentAlbum,currentMedia,setCurrentMedia,setmediaView}){
    const handleimgRotation=(temp)=>{
        if(temp==='+'){
            if(currentMedia<currentAlbum.images.length-1){
                setCurrentMedia(currentMedia+1)
            } 
        }
        else if(temp==='-'){
            if(currentMedia>0){
                setCurrentMedia(currentMedia-1)
            }
        }
    }
    return (
    <div className='w-5/6 h-5/6  bg-slate-600 absolute shadow-md top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 '>
       { currentAlbum && <div >
                            <div className='flex flex-row-reverse p-2 text-white  text-xl cursor-pointer '>
                                <button onClick={()=>{setmediaView(false)}}>close</button>
                            </div>
                            <div className='absolute w-full h-full flex justify-center items-center'>
                            <ChevronLeftIcon sx={{ fontSize: 60,cursor:'pointer' }} onClick={()=>{handleimgRotation('-')}} />
                            <img
                                src={currentAlbum.images[currentMedia]}
                                alt={currentAlbum.images[currentMedia]}
                                className='cursor-pointer hover:shadow-2xl' 
                                style={{
                                    width: "80%",
                                    height: "70%",
                                    objectFit: "cover",
                                }}                   
                            />
                            <ChevronRightIcon sx={{ fontSize: 60,cursor:'pointer' }} onClick={()=>{handleimgRotation('+')}}/>
                            </div>
                            </div>
        }
    </div>
    )
}

