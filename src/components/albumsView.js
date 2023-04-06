import React, { useEffect } from "react";
import { useState } from 'react';
// images list component
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import IconButton from '@mui/material/IconButton';
import ImageListItemBar from '@mui/material/ImageListItemBar';

import CircularProgress from '@mui/material/CircularProgress';
import CheckIcon from '@mui/icons-material/Check';
import SaveIcon from '@mui/icons-material/Save';
import Alert from '@mui/material/Alert';
import StarBorderIcon from '@mui/icons-material/StarBorder';

import Box from '@mui/material/Box';
import PermMediaIcon from '@mui/icons-material/PermMedia';
import Fab from '@mui/material/Fab';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { green } from '@mui/material/colors';

// forms
import Switch from '@mui/material/Switch';

// custom component
import MediaView from "./mediaView";
import axios from "axios";

export default function AlbumsView({currentAlbum,user,fetchAlbumByName}){
    //file upload variables
    const [files, setFiles] = useState([]);
    const [selectedfiles,setSelectedfiles]=useState([]);
    const [totalSize,setTotalSize]=useState(1)
    const [uploadStatus, setUploadStatus] = useState({});
    const [upldData,setUpldData]=useState(0)
    const [tempData,setTempData]=useState([])
    const [loading, setLoading] = useState(false);
    const [selectAll,setSelectAll]=useState(false);
    const [error, setError] = useState(null);
    const [openAlbumsUpload, setAlbumsUpload] = useState(false);
    const [success, setSuccess] = useState(false);
    const [mediaView,setmediaView]=useState(false);
    const [currentMedia,setCurrentMedia]=useState(0)

    const buttonSx = {
        ...(success && {
          bgcolor: green[500],
          '&:hover': {
            bgcolor: green[700],
          },
        }),
      };
    const handleAlbumsUploadClose=()=>{
        setAlbumsUpload(false)
      }
    const handleSelectAll=(event)=>{
      setSelectAll(event.target.checked);
    }
    useEffect(()=>{
      let newArray=selectAll?Array(files.length).fill(true):Array(files.length).fill(false)
        setSelectedfiles(newArray)
    },[selectAll])
    const handleAlbumSelect=(index)=>{
      const newArray = [...selectedfiles]; // create a new array copy
    newArray[index] = !newArray[index];
    // update the item at the given index
     setSelectedfiles(newArray);
    }
    const handleFileChange=(event)=>{
        const selectedFiles = Array.from(event.target.files);
        setFiles(selectedFiles);
        // let booleanarray =Array(selectedFiles.length).fill(false)
        // setSelectedfiles(Array(selectedFiles.length).fill(false))
        setAlbumsUpload(true)
        setSelectAll(false)
        setTotalSize(1)
        setUploadStatus({})
        setUpldData(0)
        setTempData([])
        setLoading(false)
        setSuccess(false)
        setError(null)
    
      }

    const handleSubmit = async (event) => {
        event.preventDefault();
        setAlbumsUpload(false)
        setLoading(true);
        setSuccess(false);
        setError(null);
        let updatedFilesList=[]
        if (!selectAll){
          updatedFilesList=files.filter((file,idx)=>{
            if (selectedfiles[idx]) return file
            return null
          })
          setFiles(updatedFilesList)
        }
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
            fetchAlbumByName(user.accessToken,currentAlbum.albumName)
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
    
      const HandleUpload =  async (batch,batchIndex,batchCount) => {
        const formData = new FormData();
        let status=''
        batch.forEach((file) => {
          formData.append('files', file);
        });
        formData.append('albumName',currentAlbum.albumName)
        await axios.post(process.env.REACT_APP_API_URL+'common/albums/uploads', formData, {
          headers: {
            'Content-Type': `multipart/form-data boundary=${formData._boundary}`,
            Authorization:'Bearer '+ user.accessToken
          }
          })
          .then((res) => {
          if (res.statusText==='OK') {
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
          } else {
            throw new Error('Failed to upload file');
          }
        })
        .catch((error) => {
        status=false
          for(let index=0;index<batch.length;index++){
            setUploadStatus((prevStatus) => ({
              ...prevStatus,
              [batchIndex*batchCount+index]: 'error',
            }));
          }
        });
        return status
    };
      
    return (
        <div className="h-full">
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
                    <main className='p-4'>
                    <ImageList sx={{ height: 600}} cols={6} rowHeight={150}>
                    {currentAlbum.images.map((item,idx) => (
                        <ImageListItem key={item} className="border border-gray-300" onClick={()=>{setmediaView(true);setCurrentMedia(idx)}}>
                        <img
                            src={item}
                            srcSet={`${item}?w=164&h=164&fit=crop&auto=format&dpr=2 2x`}
                            alt={item}
                            loading="lazy"
                            className="cursor-pointer hover:shadow-2xl"
                        />
                        </ImageListItem>
                    ))}
                    </ImageList>
                    </main>
                    <div className='w-full bg-gray-300 text-right flex justify-between align-middle  gap-2 p-4'>
                            
                            
                            {files.length>=1 && 
                                <div className='flex w-4/5 gap-2'>
                                    <Alert  severity={loading?"warning":'info'} className='w-4/5'>{loading?'Uploading in progress '+parseInt((upldData/totalSize)*100)+'%':'Ready To Upload '+files.length +' files'} </Alert>
                                    <Box sx={{ m: 1, position: 'relative' }}>
                                        <Fab
                                        aria-label="save"
                                        color="primary"
                                        sx={buttonSx}
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
            <Dialog
                open={openAlbumsUpload}
                aria-labelledby="scroll-dialog-title"
                aria-describedby="scroll-dialog-description"
                >
          <DialogTitle id="scroll-dialog-title">Albums Upload</DialogTitle>
          <DialogContent>
          <div >
              <Switch
            onChange={handleSelectAll}
            name="loading"
            color="primary"
          />Select all</div>
            {files.length &&
                <ImageList sx={{ height: 600}} cols={6} rowHeight={150}>
                        {files.map((item,idx) => (
                            <ImageListItem key={item.name} className="border border-gray-300">
                                  <img
                                  src={URL.createObjectURL(item)}
                                  alt={item.name}
                                  loading="lazy"
                                />
                                <ImageListItemBar
                                  sx={{
                                    background:
                                      'linear-gradient(to bottom, rgba(0,0,0,0.3) 0%, ' +
                                      'rgba(0,0,0,0.1) 70%, rgba(0,0,0,0) 100%)',
                                  }}
                                  title={item.title}
                                  position="top"
                                  actionIcon={
                                    <IconButton
                                      sx={{ color: selectedfiles[idx]?'blue':'gray'  }}
                                      // aria-label={`star ${item.title}`}
                                      onClick={() => handleAlbumSelect(idx)}
                                    >
                                      <StarBorderIcon />
                                    </IconButton>
                                  }
                                  actionPosition="right"
                                />
                            </ImageListItem>
                            
                        ))}
                        </ImageList>
            }
          </DialogContent>
          <DialogActions>
            <Button onClick={handleAlbumsUploadClose}>Cancel</Button>
            <Button onClick={handleSubmit}>Upload</Button>
          </DialogActions>
        </Dialog> 
        {mediaView===true && <MediaView currentAlbum={currentAlbum} currentMedia={currentMedia} setCurrentMedia={setCurrentMedia} setmediaView={setmediaView}/>}
        </div>
    )
}