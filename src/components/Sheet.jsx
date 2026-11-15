/**
 * Overlay panel: a centred modal on laptops and a bottom sheet on phones (a top sheet
 * when `placement` is "top"). Built on the native <dialog> element, which gives the
 * focus trap, Escape to close and the top layer for free. Phones can also swipe the
 * sheet down to close it. Used by the directory filters and the mobile search.
 */
import { useEffect, useId, useRef } from 'react'
import { X } from 'lucide-react'

// A downward drag longer than this (in pixels) closes a bottom sheet.
const swipeCloseDistance = 90

/**
 * Lets a bottom sheet follow the finger when dragged down by its handle or title row,
 * and closes it when released far enough down. Returns pointer handlers for that row.
 */
function useSwipeToClose(dialogRef, placement, onClose) {
  const dragRef = useRef(null)
  const setOffset = (offset) => {
    const dialog = dialogRef.current
    if (!dialog) return
    dialog.style.transform = offset ? `translateY(${offset}px)` : ''
    dialog.style.transition = offset ? 'none' : ''
  }
  const onPointerDown = (event) => {
    // Only touch drags on a bottom sheet, and never when the press starts on a button.
    if (placement !== 'bottom' || event.pointerType !== 'touch' || event.target.closest('button')) return
    dragRef.current = { startY: event.clientY, offset: 0 }
    event.currentTarget.setPointerCapture(event.pointerId)
  }
  const onPointerMove = (event) => {
    if (!dragRef.current) return
    dragRef.current.offset = Math.max(0, event.clientY - dragRef.current.startY)
    setOffset(dragRef.current.offset)
  }
  const onPointerUp = () => {
    if (!dragRef.current) return
    const shouldClose = dragRef.current.offset > swipeCloseDistance
    dragRef.current = null
    setOffset(0)
    if (shouldClose) onClose()
  }
  return { onPointerDown, onPointerMove, onPointerUp, onPointerCancel: onPointerUp }
}

/**
 * Modal panel with a title row, a scrolling body and an optional footer. The parent owns
 * `isOpen`; `onClose` runs for the close button, Escape, a backdrop tap and a swipe down.
 * The body is only rendered while open. An element marked data-autofocus gets the focus.
 */
export function Sheet({ isOpen, onClose, title, children, footer, placement = 'bottom', className = '' }) {
  const dialogRef = useRef(null)
  const titleId = useId()
  const swipeHandlers = useSwipeToClose(dialogRef, placement, onClose)

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return
    if (isOpen && !dialog.open) {
      dialog.showModal()
      dialog.querySelector('[data-autofocus]')?.focus()
    }
    if (!isOpen && dialog.open) dialog.close()
  }, [isOpen])

  return (
    <dialog
      ref={dialogRef}
      className={`sheet sheet-${placement} ${className}`}
      aria-labelledby={titleId}
      onClose={() => isOpen && onClose()}
      // A press on the dialog element itself (not its content) is a press on the backdrop.
      onClick={(event) => event.target === event.currentTarget && onClose()}
    >
      {isOpen && (
        <>
          <div className="sheet-head" {...swipeHandlers}>
            <span className="sheet-handle" aria-hidden="true" />
            <h2 id={titleId}>{title}</h2>
            <button type="button" className="header-icon sheet-close" onClick={onClose}>
              <X size={20} aria-hidden="true" />
              <span className="visually-hidden">Close</span>
            </button>
          </div>
          <div className="sheet-body">{children}</div>
          {footer && <div className="sheet-foot">{footer}</div>}
        </>
      )}
    </dialog>
  )
}
