import { useState } from 'react'
import logo from '../src/assets/logo-nlw-experts.svg'
import { NewNoteCard } from './components/NewNoteCard'
import { NoteCard } from './components/NoteCard'
import { toast } from "sonner"

interface Note {
  id: string
  date: Date
  content: string
}
export default function App() {
  const [search, setSearch] = useState('')
  const [notes, setNotes] = useState<Note[]>(() => {
    const notesOnStorage = localStorage.getItem('notes')

    if (notesOnStorage) {
      return JSON.parse(notesOnStorage)
    } else {
      return []
    }
  })

  const onNoteCreated =(content: string) => {
    const newNote = {
      id: crypto.randomUUID(),
      date: new Date(),
      content,
    }

    const notesArray = [newNote, ...notes]

    setNotes(notesArray)

    localStorage.setItem('notes', JSON.stringify(notesArray))
  }

  const onNoteDeleted = (id: string) => {
    const notesArray = notes.filter((note) => {
      return note.id !== id
    })

    setNotes(notesArray)
    toast.success("Nota excluída com sucesso!")
    localStorage.setItem('notes', JSON.stringify(notesArray))
  }

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const query = event.target.value

    setSearch(query) 
    
  }
  
  const filteredNotes = search !== '' 
  ? notes.filter((note => note.content.toLocaleLowerCase().includes(search.toLocaleLowerCase()))) 
  : notes


  return (
    <div className='mx-auto max-w-6xl my-12 space-y-8 px-6'>
      <img src={logo} alt="Logo NLW" className="w-36" />

      <form className='w-full'>
        <input
          className='rounded-lg w-full bg-transparent text-sm py-2 px-3 tracking-tight placeholder:text-neutral-500 outline-1 outline-neutral-800 outline-none hover:outline-1 hover:outline-neutral-700 focus-visible:outline-1 focus-visible:outline-neutral-500 transition-all duration-200'
          type="text"
          placeholder='Busque suas notas...'
          onChange={handleSearch}
        />
      </form>

      <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 auto-rows-[250px] gap-3'>
        <NewNoteCard onNoteCreated={onNoteCreated}/>
        {filteredNotes.map((note) => {
          return <NoteCard key={note.id} note={note} onNoteDeleted={onNoteDeleted} />
        })}       
      </div>

    </div>

  )
}
