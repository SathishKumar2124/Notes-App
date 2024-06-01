import React from 'react'
import {MdOutlinePushPin} from 'react-icons/md'
import {MdCreate,MdDelete} from 'react-icons/md'

const NoteCard = ({
    title,
    date,
    content,
    tags,
    isPinned,
    onEdit,
    onDelete,
    onPinNote
}) => {
  return (
    <div className='border rounded p-4 bg-white hover:shadow-xl transition-all ease-in-out'>
        <div className='flex item justify-between'>
            <div>
                <h6 className='text-sm font-medium'>{title}</h6>
                <span className='text-xs text-slate-500'>{date}</span>
            </div>
            <MdOutlinePushPin className={`text-xl text-slate-300 cursor-pointer ${isPinned ? "text-blue-900" : "text-gray-500"}`} onClick={onPinNote} />
        </div>
        <p className='text-slate-600  text-xs mt-2'>{content?.slice(0,60)}</p>
        <div className='flex items-center justify-between mt-2'>
            <div className='text-xs text-slate-500'>
                {tags.map((tag,index)=>(
                    <span key={index}># {tag}</span>
                ))}
            </div>
            <div className='flex items-center gap-2'>
                <MdCreate className='text-xl text-slate-300 cursor-pointer  hover:text-green-600' onClick={onEdit}/>
                <MdDelete className='text-xl text-slate-300 cursor-pointer  hover:text-red-500' onClick={onDelete}/>
            </div>
        </div>
    </div>
  )
}

export default NoteCard