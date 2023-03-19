import React from "react";
import { useState } from 'react';
import axios from "axios";
// images list component
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';

import CircularProgress from '@mui/material/CircularProgress';
import CheckIcon from '@mui/icons-material/Check';
import SaveIcon from '@mui/icons-material/Save';
import Alert from '@mui/material/Alert';


import Box from '@mui/material/Box';
import PermMediaIcon from '@mui/icons-material/PermMedia';
import Fab from '@mui/material/Fab';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContentText from '@mui/material/DialogContentText';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { green } from '@mui/material/colors';


export default function AlbumsView({currentAlbum,user}){
    //file upload variables
    const [files, setFiles] = useState([]);
    const [totalSize,setTotalSize]=useState(1)
    const [uploadStatus, setUploadStatus] = useState({});
    const [upldData,setUpldData]=useState(0)
    const [tempData,setTempData]=useState([])
    const [progressBar,setProgressBar]=useState(0)
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [openAlbumsUpload, setAlbumsUpload] = useState(false);
    const [success, setSuccess] = useState(false);


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
    const handleFileChange=(event)=>{
        console.log("heyyyyyyyyyyyyyyyyyyyyyyyyyyyyyy")
        const selectedFiles = Array.from(event.target.files);
        setFiles(selectedFiles);
        console.log("selectedFiles====",selectedFiles)
        setAlbumsUpload(true)
        setTotalSize(1)
        setUploadStatus({})
        setUpldData(0)
        setTempData([])
        setProgressBar(0)
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
    
      const HandleUpload =  async (batch,batchIndex,batchCount) => {
        const formData = new FormData();
        let status=''
        batch.forEach((file) => {
          formData.append('files', file);
        });
        formData.append('albumName',currentAlbum.albumName)
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
                    {currentAlbum.images.map((item) => (
                        <ImageListItem key={item} className="border border-gray-300">
                        <img
                            src={`http://localhost:3000/uploads/${item}?w=164&h=164&fit=crop&auto=format`}
                            srcSet={`${item}?w=164&h=164&fit=crop&auto=format&dpr=2 2x`}
                            alt={item}
                            loading="lazy"
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
            {files.length && 
                <ImageList sx={{ height: 600}} cols={6} rowHeight={150}>
                        {files.map((item) => (
                            <ImageListItem key={item.name} className="border border-gray-300">
                            <img
                                src={URL.createObjectURL(item)}
                                alt={item.name}
                                loading="lazy"
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
        </div>
    )
}