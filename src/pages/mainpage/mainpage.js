import axios from 'axios';
import Fab from '@mui/material/Fab';
import AddIcon from '@mui/icons-material/Add';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContentText from '@mui/material/DialogContentText';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';

// import Card from '@mui/material/Card';
// import CardActions from '@mui/material/CardActions';
// import CardContent from '@mui/material/CardContent';
// import CardMedia from '@mui/material/CardMedia';
// import Typography from '@mui/material/Typography';


import { styled } from '@mui/material/styles';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemText from '@mui/material/ListItemText';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import FolderIcon from '@mui/icons-material/Folder';
import DeleteIcon from '@mui/icons-material/Delete';




import { useState } from 'react';
//google user auth
import {auth} from "../../utils/firebase"
import {useNavigate} from 'react-router-dom'
import { useEffect } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import AlbumsView from '../../components/albumsView';
export default function MainPage(){
    const [user,userLoading]=useAuthState(auth)
    const navigate =useNavigate()

    const [albumName,setAlbumName]=useState()
    const [albumdiscp,setAlbumDisp]=useState()

    const [albums,setAlbums]=useState([])
    const [open, setOpen] = useState(false);
    const [currentAlbum,setCurrentAlbum]=useState('')

    

    useEffect (()=>{
        if (!user){
            navigate('/login')
        }
        else{
          fetchData(user.accessToken)
        }
    },[user])

    const fetchData=async (token)=>{
      await axios.get(process.env.REACT_APP_API_URL+'/common/albums/albumlist',{
        headers:{
          Authorization:'Bearer '+ token
        }
      })
      .then(res=>{
        setAlbums(res.data.data)
      })
      .catch(res=>{
        console.log("res=================",res)
      })
    }
    const fetchAlbumByName=async (token,albumName)=>{
      await axios.get(process.env.REACT_APP_API_URL+`/common/albums/albumlist/${albumName}`,{
        headers:{
          Authorization:'Bearer '+ token
        }
      })
      .then(res=>{
        let newAlbums=albums.map(album=>{
          if (album._id===res.data.data._id){
            return res.data.data
          }
          else{
            return album
          }
        })
        setAlbums(newAlbums)
        setCurrentAlbum(res.data.data)
      })
      .catch(res=>{
        console.log("res=================",res)
      })
    }

    const Demo = styled('div')(({ theme }) => ({
        backgroundColor: theme.palette.background.paper,
      }));

  const handleClose = () => {
    setOpen(false);
  };
  
  const handleCreate=async ()=>{
      await axios.post(process.env.REACT_APP_API_URL+'/common/albums/create-album',
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
    return (
        <div style={{height:'100%'}}>
           <div className='bg-gray-200 w-full flex rounded ' style={{height:'100%'}}>
                <div className='relative flex align-middle gap-2 bg-gray-200 border-r-2 border-gray-300  w-3/12 flex-col p-4'
                    style={{height:'100%'}}>
                    <Typography sx={{ mt: 4, mb: 2 }} variant="h6" component="div">
                        Albums List
                    </Typography>
                    {albums.length>0 && albums.map((album)=>{
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
                    <div className='w-9/12'>
                    <AlbumsView currentAlbum={currentAlbum} user={user} fetchAlbumByName={fetchAlbumByName}/>
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
