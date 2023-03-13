import axios from 'axios';


import Fab from '@mui/material/Fab';
import AddIcon from '@mui/icons-material/Add';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import CircularProgress from '@mui/material/CircularProgress';
import { green } from '@mui/material/colors';
import CheckIcon from '@mui/icons-material/Check';
import SaveIcon from '@mui/icons-material/Save';
import Alert from '@mui/material/Alert';
// import Card from '@mui/material/Card';
// import CardActions from '@mui/material/CardActions';
// import CardContent from '@mui/material/CardContent';
// import CardMedia from '@mui/material/CardMedia';
// import Typography from '@mui/material/Typography';


import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemText from '@mui/material/ListItemText';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import FolderIcon from '@mui/icons-material/Folder';
import DeleteIcon from '@mui/icons-material/Delete';
import PermMediaIcon from '@mui/icons-material/PermMedia';

import { useState } from 'react';
//google user auth
import {auth} from "../../utils/firebase"
import {useNavigate} from 'react-router-dom'
import { useEffect } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';

export default function MainPage(){
    const [user,userLoading]=useAuthState(auth)
    const navigate =useNavigate()

    const [albumName,setAlbumName]=useState()
    const [albumdiscp,setAlbumDisp]=useState()

    const [albums,setAlbums]=useState([])
    const [open, setOpen] = useState(false);
    const [currentAlbum,setCurrentAlbum]=useState('')

    //file upload variables
    const [files, setFiles] = useState([]);
    const [totalSize,setTotalSize]=useState(1)
    const [uploadStatus, setUploadStatus] = useState({});
    const [upldData,setUpldData]=useState(0)
    const [tempData,setTempData]=useState([])
    const [progressBar,setProgressBar]=useState(0)
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState(null);

    useEffect (()=>{
        if (!user){
            navigate('/login')
        }
        else{
          fetchData(user.accessToken)
        }
    },[user])

    const fetchData=async (token)=>{
      await axios.get('http://localhost:3000/api/common/albums/albumlist',{
        headers:{
          Authorization:'Bearer '+ token
        }
      })
      .then(res=>{
        setAlbums(res.data)
      })
      .catch(res=>{
        console.log("res=================",res)
      })
    }

    const buttonSx = {
        ...(success && {
          bgcolor: green[500],
          '&:hover': {
            bgcolor: green[700],
          },
        }),
      };
    const Demo = styled('div')(({ theme }) => ({
        backgroundColor: theme.palette.background.paper,
      }));

  const handleClose = () => {
    setOpen(false);
  };
  const handleCreate=async ()=>{
      await axios.post('http://localhost:3000/api/common/albums/create-album',
      { albumName: albumName,discription: albumdiscp},
        { 
            headers:{
                'Authorization' :'Bearer '+ user.accessToken
            }
        }
        )
        .then(res=>{
          setOpen(false)
          fetchData(user.accessToken)
        })    
  }
  const handleFileChange=(event)=>{
    const selectedFiles = Array.from(event.target.files);
    setFiles(selectedFiles);
    setTotalSize(1)
    setUploadStatus({})
    setUpldData(0)
    setTempData([])
    setProgressBar(0)
    setLoading(false)
    setSuccess(false)
    setError(null)

  }
  
  const HandleUpload =  async (batch,batchIndex,batchCount) => {
    const formData = new FormData();
    let status=''
    batch.forEach((file) => {
      formData.append('files', file);
    });
    await axios.post('http://localhost:3000/api/common/albums/upload', formData, {
      headers: {
        'Content-Type': `multipart/form-data boundary=${formData._boundary}`,
        Authorization:'Bearer '+ user.accessToken
      }
      })
      .then((response) => {
        console.log(response)
      if (response.statusText==='OK') {
        status=true
        for(let index=0;index<batch.length;index++){
          setUploadStatus((prevStatus) => ({
            ...prevStatus,
            [batchIndex*batchCount+index]: 'success',
          }));
        }
        let CurrentBatchSize=batch.reduce((accumulator,file)=>{
          return Number(file.size)+Number(accumulator)
        },0)
        setUpldData((prev)=>{return Number(prev)+Number(CurrentBatchSize)})
        let g=Number(tempData.slice(-1))+CurrentBatchSize
        setTempData(prev=>{return [...prev,Number(g)]})
        let prog=(upldData/totalSize)*100
        setProgressBar(prog)
      } else {
        throw new Error('Failed to upload file');
      }
    })
    .catch((error) => {
    status=false
      console.log(error);
      for(let index=0;index<batch.length;index++){
        setUploadStatus((prevStatus) => ({
          ...prevStatus,
          [batchIndex*batchCount+index]: 'error',
        }));
      }
    });
    return status
};

const handleSubmit = async (event) => {
  event.preventDefault();
  setLoading(true);
  setSuccess(false);
  setError(null);

  const batchCount = 10; // change batch size here
  const batches = Array.from(
    { length: Math.ceil(files.length / batchCount) },
    (_, index) => {
      const startIndex = index * batchCount;
      const endIndex = startIndex + batchCount;
      return files.slice(startIndex, endIndex);
    }
  );
  let TotalSize = batches.reduce((accumulator, CurrentBatch) => {
    const batchSize = CurrentBatch.reduce((batchAccumulator, file) => {
      return batchAccumulator + file.size;
    }, 0);
    return accumulator + batchSize;
  }, 0);
  setTotalSize(TotalSize);

  let batchIndex = 0;
  try {
    const intervalId = await setInterval(async () => {
      const batch = batches[batchIndex];
      let status =await HandleUpload(batch, batchIndex, batchCount)
        batchIndex++;
        if (batchIndex >= batches.length) {
        clearInterval(intervalId);
        setLoading(false);
        setSuccess(true);
        }
        if (!status){
          clearInterval(intervalId);
          setLoading(false);
          setError(error.message);
        }
        },1000);
  } catch (error) {
    setLoading(false);
    setError(error.message);
  }
};

    return (
        <div style={{height:'100%'}}>
           <div className='bg-gray-200 w-full flex rounded ' style={{height:'100%'}}>
                <div className='relative flex align-middle gap-2 bg-gray-200 border-r-2 border-gray-300  w-3/12 flex-col p-4'
                    style={{height:'100%'}}>
                    <Typography sx={{ mt: 4, mb: 2 }} variant="h6" component="div">
                        Albums List
                    </Typography>
                    {albums.length>0 && albums.map(album=>{
                        return (
                        <List 
                            key={album._id}
                            dense={false} 
                            className="rounded" 
                            sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}
                            onClick={()=>{setCurrentAlbum(album)}}>
                            <ListItem
                            secondaryAction={
                                <IconButton edge="end" aria-label="delete">
                                <DeleteIcon />
                                </IconButton>
                            }
                            >
                            <ListItemAvatar>
                                <Avatar>
                                <FolderIcon />
                                </Avatar>
                            </ListItemAvatar>
                            <ListItemText
                                primary={album.albumName}
                                secondary={album.discription}
                            />
                            </ListItem>,
                        
                        </List>
                        )})}
                        <div className='absolute bottom-10'>
                                <Fab color="primary" aria-label="add">
                                    <AddIcon onClick={()=>{setOpen(true)}}/>
                                </Fab>
                        </div>
                    </div>
                    <div className='flex-auto'>
                        {currentAlbum? 
                        <div className='flex flex-col h-full justify-between'>
                            <nav className=' py-2 px-4 bg-gray-400'>
                                <ul className="flex justify-between items-center py-2 px-2 ">
                                    <li>
                                        <ul>
                                            <li>{currentAlbum.name}</li>
                                            <li>{currentAlbum.discription}</li>
                                        </ul>
                                    </li>
                                    <li>8 march 2023</li>
                                </ul>
                            </nav>
                            <main></main>
                            <div className='w-full bg-gray-300 text-right flex justify-between align-middle  gap-2 p-4'>
                                    
                                    
                                    {files.length>=1 && 
                                        <div className='flex w-4/5 gap-2'>
                                            <Alert  severity={loading?"warning":'info'} className='w-4/5'>{loading?'Uploading in progress '+parseInt((upldData/totalSize)*100)+'%':'Ready To Upload '+files.length +' files'} </Alert>
                                            <Box sx={{ m: 1, position: 'relative' }}>
                                                <Fab
                                                aria-label="save"
                                                color="primary"
                                                sx={buttonSx}
                                                onClick={handleSubmit}
                                                >
                                                {success ? <CheckIcon /> : <SaveIcon />}
                                                </Fab>
                                                {loading && (
                                                <CircularProgress
                                                    size={68}
                                                    sx={{
                                                    color: green[500],
                                                    position: 'absolute',
                                                    top: -6,
                                                    left: -6,
                                                    zIndex: 1,
                                                    }}
                                                />
                                                )}
                                            </Box>
                                        </div>
                                    }
                                    <div className='w-full right'>
                                    <input
                                    accept="image/*"
                                    className="input"
                                    style={{ display: 'none' }}
                                    id="raised-button-file"
                                    multiple
                                    type="file"
                                    onChange={handleFileChange}
                                    />
                                    <label htmlFor="raised-button-file">
                                    <PermMediaIcon />
                                    </label>
                                    </div>
                                    

                            </div>     
                            </div>
                        :<div className='text-center flex flex-col h-full justify-center'>
                            <div>
                                <h2 className='text-2xl mt-10'>Upload Your Photos and Vidoes and Share them with your firends</h2>
                                <h3>back your photos and videos</h3>
                            </div>
                        </div>
                        }
                    </div>
           </div>
           
        <Dialog open={open} onClose={handleClose}>
            <DialogTitle>Create Album</DialogTitle>
            <DialogContent>
                {/* <DialogContentText>
                To subscribe to this website, please enter your email address here. We
                will send updates occasionally.
                </DialogContentText> */}
                <TextField
                autoFocus
                margin="dense"
                id="name"
                label="Album Name"
                type="text"
                fullWidth
                variant="filled"
                onChange={(e)=>{setAlbumName(e.target.value)}}
                />
                <TextField
                autoFocus
                margin="dense"
                id="name"
                type="text"
                label="discription"
                multiline
                rows={4}
                fullWidth
                variant="filled"
                onChange={(e)=>{setAlbumDisp(e.target.value)}}
                />
                
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose}>Cancel</Button>
                <Button onClick={handleCreate}>Create</Button>
            </DialogActions>
        </Dialog>
        
        </div>
    )
}
