import React, { useState } from 'react'
import TagInput from '../../components/input/TagInput'
import { MdClose } from 'react-icons/md'
import axiosInstance from '../../utils/axiosInstance'

const AddEditNote = ({noteData,getAllNotes,type,onClose}) => {

    const [title,setTitle] = useState(noteData?.title || "")
    const [content,setContent] = useState(noteData?.content || '')
    const [tags,setTags] =  useState(noteData?.tags || [])
    const [error,setError] = useState('')

    const addNewNote = async () => {
        try{
            const response = await axiosInstance.post('/create-note',{
                title,
                content,
                tags
            })
            if(response.error && response.data.msg){
                setError(response.data.msg)
            }
            if(response.data && response.data.note){
                getAllNotes()
                onClose()
            }
        }catch(error){
            if(error.response && error.response.data && error.response.data.msg){
                setError(error.response.data.msg)
            }
        }
    }

    const editNote = async () => {
        const noteId = noteData._id
        try{
            const response = await axiosInstance.put(`/edit-note/${noteData._id}`,{
                title,
                content,
                tags
            })
            if(response.error && response.data.msg){
                setError(response.data.msg)
            }
            if(response.data && response.data.note){
                getAllNotes()
                onClose()
            }
        }catch(error){
            if(error.response && error.response.data && error.response.data.msg){
                setError(error.response.data.msg)
            }
        }
    }

    const handleAddNote = () => {
        if(!title){
            setError("please enter a Title")
            return
        }

        if(!content){
            setError("please enter a Content")
            return
        }

        setError("")

        if(type == "edit"){
            editNote() 
            onClose()
        }else{
            addNewNote()
            onClose()
        }

    }

  return (
    <div className='relative'>
        <button className=' w-10 h-10 rounded-full flex items-center justify-center absolute -top-3 -right-3 hover:bg-slate-500' onClick={onClose}>
            <MdClose className='text-xl text-slate-400' />
        </button>
        <div className='flex flex-col gap-2'>
            <label className='text-xs text-slate-400' >TITLE</label>
            <input type="text" className='text-2xl text-slate-950 outline-none' placeholder='TITLE' 
            value={title} 
            onChange={(e) => setTitle(e.target.value)} />
        </div>
        <div className='flex flex-col gap-2 mt-2'>
            <label className='text-xs text-slate-400' >CONTENT</label>
            <textarea type="text" className='text-xl text-slate-950 outline-none bg-slate-50 rounded' placeholder='CONTENT' rows={10} 
            value={content} 
            onChange={(e) => setContent(e.target.value)}
            />            
        </div> 
        <div className='mt-2'>
            <label className='text-xs text-slate-400'>TAGS</label>
            <TagInput tags={tags} setTags={setTags} />
        </div>
        {error && <p className='text-sm text-red-500'>{error}</p>}
        <button className='bg-blue-600 text-white font-medium w-full mt-5 p-3'
        onClick={() => handleAddNote()}

        >
         {type == "edit" ? "UPDATE" : "ADD"}
        </button>
    </div>
  )
}

export default AddEditNote