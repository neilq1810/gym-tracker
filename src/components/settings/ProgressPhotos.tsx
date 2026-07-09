import { useRef } from 'react'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { CameraIcon, TrashIcon } from '@/components/ui/Icons'
import { useAppStore } from '@/store/useAppStore'
import { formatDate } from '@/utils/format'

export function ProgressPhotos() {
  const photos = useAppStore((s) => s.progressPhotos)
  const addPhoto = useAppStore((s) => s.addProgressPhoto)
  const deletePhoto = useAppStore((s) => s.deleteProgressPhoto)
  const inputRef = useRef<HTMLInputElement>(null)

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => {
      if (typeof reader.result === 'string') addPhoto(reader.result)
    }
    reader.readAsDataURL(file)
    e.target.value = ''
  }

  return (
    <Card className="p-4">
      <div className="mb-3 flex items-center justify-between">
        <p className="flex items-center gap-1.5 text-xs font-semibold text-text-faint">
          <CameraIcon className="h-3.5 w-3.5" /> PROGRESS PHOTOS
        </p>
        <Button size="sm" variant="secondary" onClick={() => inputRef.current?.click()}>
          Add Photo
        </Button>
        <input ref={inputRef} type="file" accept="image/*" capture="environment" className="hidden" onChange={handleFile} />
      </div>

      {photos.length === 0 ? (
        <p className="text-sm text-text-faint">No photos yet. Progress photos stay on this device.</p>
      ) : (
        <div className="grid grid-cols-3 gap-2">
          {photos.map((photo) => (
            <div key={photo.id} className="group relative aspect-square overflow-hidden rounded-xl bg-surface-raised">
              <img src={photo.dataUrl} alt={`Progress ${photo.date}`} className="h-full w-full object-cover" />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-1.5">
                <p className="text-[10px] text-white">{formatDate(photo.date)}</p>
              </div>
              <button
                onClick={() => deletePhoto(photo.id)}
                aria-label="Delete photo"
                className="absolute right-1 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-black/60 text-white opacity-0 transition-opacity group-hover:opacity-100"
              >
                <TrashIcon className="h-3.5 w-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}
    </Card>
  )
}
