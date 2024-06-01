import React, { useEffect, useState } from 'react'
import Navbar from '../../components/Navbar/Navbar'
import NoteCard from '../../components/cards/NoteCard'
import {MdAdd} from 'react-icons/md'
import AddEditNote from './AddEditNote'
import Modal from 'react-modal'
import { useNavigate } from 'react-router-dom'
import moment from 'moment'
import axiosInstance from '../../utils/axiosInstance'

const Home = () => {

  const [openAddEditModal,setOpenAddEditModal] = useState({
    isShown : false,
    type:"add",
    data:null
  })

  const [allNotes,setAllNotes] = useState([]);
  const [userInfo,setUserInfo] = useState("");

  const [isSearch,setIsSearch] = useState(false);

  const navigate = useNavigate()

  const handleEdit = (noteDetails) => {
    setOpenAddEditModal({isShown : true , data : noteDetails , type : "edit"})
  }

  const getUserInfo = async () => {
    try {
      const response = await axiosInstance.get("/get-user");
      if(response.data && response.data.user){
        setUserInfo(response.data.user)
        
      }
    } catch (error) {
      if(error.response.status == 401){
        localStorage.clear();
        navigate('/login')
      }
    }
  }

  const getAllNotes = async () => {
    try {
      const response = await axiosInstance.get('/get-allnotes')
      if(response.data && response.data.notes){
        setAllNotes(response.data.notes)
      }
    } catch (error) {
      console.log("an unexpected error occurred")
    }
  }

  const deleteNote = async (data) => {
    const noteData = data._id
    try{
      const response = await axiosInstance.delete(`/delete-note/${noteData}`)
      if(response.error && response.data.msg){
          setError(response.data.msg)
      }
      if(response.data && response.data.note){
          getAllNotes()
      }
      location.reload()
  }catch(error){
      if(error.response && error.response.data && error.response.data.msg){
          setError(error.response.data.msg)
      }
  }
  }

  const onSearchNote = async (query) => {
    try {
      const response = await axiosInstance.get('/search-note',{
        params : {query}
      })

      if(response.data && response.data.notes){
        setIsSearch(true);
        setAllNotes(response.data.notes)
      }

    } catch (error) {
      console.log(error);
    }
  }

  const updateIsPinned = async (noteData) => {
    const noteId = noteData._id
        try{
            const response = await axiosInstance.put(`/update-note-pin/${noteId}`,{
                isPinned : !noteData.isPinned,
                
            })
            
            if(response.data && response.data.note){
                getAllNotes()
                
            }
        }catch(error){
            console.log(error);
        }
  }

  const handleClearSearch = () => {
    setIsSearch(false);
    getAllNotes()
  }

  useEffect(() => {
    getAllNotes()
    getUserInfo()
  }, [])
  

  return (
    <div>
      <Navbar userInfo={userInfo }  onSearchNote={onSearchNote} handleClearSearch={handleClearSearch} />
      <div className='container mx-auto'>
        {allNotes.length > 0 ? <div className='grid grid-cols-3 gap-4 mt-8'>
          {allNotes.map((item,index)=>( 
          <NoteCard  
          key={item._id}
          title={item.title} 
          date={moment(item.createdOn).format("Do MMM YYYY")} 
          content={item.content}
          tags={item.tags}
          isPinned={item.isPinned}
          onEdit={()=>{handleEdit(item)}}
          onDelete={()=>{deleteNote(item)}}
          onPinNote={()=>{updateIsPinned(item)}}
          />
          ))}
        </div> : <p className='text-center text-2xl text-red-600 mt-32 shadow-sm'>No notes Found...</p>}
      </div>
      <button className='w-16 h-16 rounded-xl  flex items-center justify-center bg-blue-500 hover:bg-blue-700 absolute right-10 bottom-10  ' onClick={() =>{ setOpenAddEditModal({
        isShown:true,
        type:"add",
        data:null
      }) }}>
        <MdAdd  className='text-[32px] text-white'/>
      </button>

      <Modal
      isOpen={openAddEditModal.isShown}
      onRequestClose={()=>{}}
      style={{
        overlay:{
          backgroundColor:"rgba(0,0,0,0.2)"
        },
      }}
      contentLabel=''
      className="w-[40%] max-h-3/4 bg-white rounded mx-auto mt-14 p-5 overflow-scroll"
      >
      <AddEditNote 
      type={openAddEditModal.type}
      noteData={openAddEditModal.data}
      onClose={() => {
        setOpenAddEditModal({
          isShown:false,
          type:"add",
          data:null
        })
        location.reload()
      }}
      getAllNotes={getAllNotes}
      />
      </Modal>
    </div>
  )
}

export default Home