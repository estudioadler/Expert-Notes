import * as Dialog from "@radix-ui/react-dialog"
import { formatDistanceToNow } from "date-fns"
import { ptBR } from "date-fns/locale"
import { X } from "lucide-react"

interface NoteCardProps {
  note: {
    id: string
    date: Date
    content: string
  }
  onNoteDeleted: (id: string) => void

}
export const NoteCard = ({ note, onNoteDeleted }: NoteCardProps) => {

  return (
    <Dialog.Root>
      <Dialog.Trigger className='rounded-lg text-left bg-neutral-900 p-6 flex flex-col gap-3 overflow-hidden outline outline-1 outline-neutral-800 cursor-pointer hover:outline-1 hover:outline-offset-0 hover:outline-neutral-700 focus-visible:outline-1 focus-visible:outline-neutral-500 transition-all duration-200'>
        <span className='text-neutral-300 text-sm font-medium'>{formatDistanceToNow(note.date, { addSuffix: true, locale: ptBR })}</span>
        <p className='text-neutral-500 leading-6'>
          {note.content}
        </p>
      </Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Overlay className="inset-0 fixed bg-neutral-950/50" />
        <Dialog.Content className="flex flex-col inset-0 md:inset-auto md:max-w-[640px] md:h-[60vh] w-full fixed md:left-1/2 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:rounded-md bg-neutral-800 outline-none">
          <Dialog.Close className="absolute top-0 right-0 p-2 bg-neutral-900 text-neutral-500 hover:text-neutral-200">
            <X className="size-5" />
          </Dialog.Close>
          <div className="flex flex-1 flex-col gap-3 p-6">
            <span className='text-slate-300 text-sm font-medium'>{formatDistanceToNow(note.date, { addSuffix: true, locale: ptBR })}</span>
            <p className='text-neutral-500 leading-6'>
              {note.content}
            </p>
          </div>

          <button type="button" onClick={() => onNoteDeleted(note.id)} className='group w-full text-neutral-300 bg-neutral-900 py-4 text-center text-sm font-medium outline-none rounded-b-md'>
            Deseja <span className="text-red-400 group-hover:underline">apagar esta nota?</span>
          </button>
        </Dialog.Content>
      </Dialog.Portal>

    </Dialog.Root>
  )
}
