import * as Dialog from "@radix-ui/react-dialog"
import { X } from "lucide-react"
import { useState } from "react"
import { toast } from "sonner"

interface NewNoteCardProps {
    onNoteCreated: (content: string) => void
}

let speechRecognition: SpeechRecognition | null

export const NewNoteCard = ({ onNoteCreated }: NewNoteCardProps) => {
    const [sholdShowOnboarding, setShouldShowOnboarding] = useState(true)
    const [content, setContent] = useState('')
    const [isRecording, setIsRecording] = useState(false)

    const handleStardEdit = () => {
        setShouldShowOnboarding(false)
    }

    const handleContentChanged = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        setContent(event.target.value)
        if (event.target.value === '') {
            setShouldShowOnboarding(true)
        }
    }

    const handleSaveNote = (event: React.FormEvent) => {
        event.preventDefault()

        if (content === '') {
            return
        }
        
        onNoteCreated(content)
        
        setContent('')
        setShouldShowOnboarding(true)
        
        toast.success("Nota criada com sucesso!")
    }

    const handleStartRecording = () => {
        
        const isSpeechRecognitionApiAvailable = 'SpeechRecognition' in window
        || 'webkitSpeechRecognition' in window
        
        if (!isSpeechRecognitionApiAvailable) {
            alert('Infelizmente seu navegador não suporta o reconhecimento de fala.')
            return
        }
        
        setIsRecording(true)
        setShouldShowOnboarding(false)

        const SpeechRecognitionApi = window.SpeechRecognition 
        || window.webkitSpeechRecognition

        speechRecognition = new SpeechRecognitionApi()

        speechRecognition.lang = 'pt-BR'
        speechRecognition.continuous = true
        speechRecognition.maxAlternatives = 1
        speechRecognition.interimResults = true

        speechRecognition.onresult = (event) => {
            const transcription = Array.from(event.results).reduce((text, result) => {
                return text.concat(result[0].transcript)
            } , '')
            setContent(transcription)
        }

        speechRecognition.onerror = (event) => {
            console.log(event)
        }

        speechRecognition.start()
    }

    const handleStopRecording = () => {
        setIsRecording(false)
        if (speechRecognition !== null) {
            speechRecognition.stop()
        }
    }


    return (
        <Dialog.Root>
            <Dialog.Trigger className='md:col-span-2 rounded-md flex flex-col bg-neutral-900 p-6 gap-3 text-left outline-none hover:ring-2 ring-slate-700 focus-visible:ring-2 focus-visible:ring-lime-500'>
                <span className='text-neutral-200 text-sm font-medium'>Adicionar nota</span>
                <p className='text-neutral-400 leading-6'>
                    Grave uma nota em áudio que será convertida para texto automaticamente.
                </p>
            </Dialog.Trigger>

            <Dialog.Portal>
                <Dialog.Overlay className="inset-0 fixed bg-neutral-950/50" />
                <Dialog.Content className="flex flex-col inset-0 md:inset-auto md:max-w-[640px] md:h-[60vh] w-full fixed md:left-1/2 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:rounded-md bg-neutral-800 outline-none">
                    <Dialog.Close className="absolute top-0 right-0 p-2 bg-neutral-900 text-neutral-500 hover:text-neutral-200">
                        <X className="size-5" />
                    </Dialog.Close>

                    <form className="flex-1 flex flex-col">
                        <div className="flex flex-1 flex-col gap-3 p-6">
                            <span className='text-neutral-300 text-sm font-medium'>
                                Adicionar nota
                            </span>

                            {sholdShowOnboarding ? (
                                <p className='text-neutral-400 leading-6'>
                                    <button type="button" onClick={handleStartRecording} className="font-medium text-neutral-50 hover:underline">Grave uma nota</button> em áudio ou <button type="button" onClick={handleStardEdit} className="font-medium text-neutral-50 hover:underline">utilize apenas texto</button>.
                                </p>
                            ) : (
                                <textarea placeholder="Escreva sua nota..."
                                    autoFocus
                                    className="w-full leading-6 text-neutral-400 bg-transparent outline-none resize-none flex-1"
                                    onChange={handleContentChanged}
                                    value={content}
                                ></textarea>
                            )}

                        </div>

                        {isRecording ? (
                            <button type="button" onClick={handleStopRecording} className='flex items-center gap-2 justify-center group w-full text-neutral-300 bg-neutral-900 hover:text-neutral-100 py-4 text-center text-sm font-medium outline-none rounded-b-md'>
                                <div className="size-2 animate-pulse bg-red-500 rounded-full"/>
                                Gravando! Clique para interromper.
                            </button>
                        ) : (
                            <button type="button" onClick={handleSaveNote} className='group w-full text-neutral-50 bg-neutral-900 hover:bg-neutral-900 py-4 text-center text-sm font-medium outline-none rounded-b-md'>
                                Salvar nota
                            </button>
                        )}


                    </form>

                </Dialog.Content>
            </Dialog.Portal>
        </Dialog.Root>
    )
}
