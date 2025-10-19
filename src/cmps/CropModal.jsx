import { useState, useRef, useEffect } from 'react'

export function CropModal({ imageFile, onBack, onNext, onClose, onCropComplete }) {
    const [zoom, setZoom] = useState(1)
    const [position, setPosition] = useState({ x: 0, y: 0 })
    const [isDragging, setIsDragging] = useState(false)
    const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
    const [showGrid, setShowGrid] = useState(false)
    const imageRef = useRef(null)
    const [imageUrl, setImageUrl] = useState(null)

    // Create blob URL for display
    useEffect(() => {
        const url = URL.createObjectURL(imageFile)
        setImageUrl(url)
        return () => URL.revokeObjectURL(url) // Cleanup
    }, [imageFile])

    const handleZoomIn = () => {
        setZoom(prev => Math.min(prev + 0.1, 3))
    }

    const handleZoomOut = () => {
        setZoom(prev => Math.max(prev - 0.1, 0.5))
    }

    const handleMouseDown = (e) => {
        setIsDragging(true)
        setShowGrid(true)
        setDragStart({
            x: e.clientX - position.x,
            y: e.clientY - position.y
        })
    }

    const handleMouseMove = (e) => {
        if (!isDragging) return
        setPosition({
            x: e.clientX - dragStart.x,
            y: e.clientY - dragStart.y
        })
    }

    const handleMouseUp = () => {
        setIsDragging(false)
        setShowGrid(false)
    }

    const handleNext = async () => {
        // Convert image to base64 for persistence
        const reader = new FileReader()
        reader.onloadend = () => {
            if (onCropComplete) {
                onCropComplete(reader.result) // base64 data URL
            }
            onNext()
        }
        reader.readAsDataURL(imageFile)
    }

    if (!imageFile || !imageUrl) return null

    return (
        <div className="crop-overlay">
            <button className="crop-close-btn" onClick={onClose}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
            </button>
            <div className="crop-modal">
                {/* Header */}
                <div className="crop-header">
                    <button className="crop-back-btn" onClick={onClose}>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                            <path d="M15 18l-6-6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                    </button>
                    <h2>Crop</h2>
                    <button className="crop-next-btn" onClick={handleNext}>
                        Next
                    </button>
                </div>

                {/* Image Area */}
                <div 
                    className="crop-image-container"
                    onMouseMove={handleMouseMove}
                    onMouseUp={handleMouseUp}
                    onMouseLeave={handleMouseUp}
                >
                    <img
                        ref={imageRef}
                        src={imageUrl}
                        alt="Crop"
                        className="crop-image"
                        style={{
                            transform: `scale(${zoom}) translate(${position.x / zoom}px, ${position.y / zoom}px)`,
                            cursor: isDragging ? 'grabbing' : 'grab'
                        }}
                        onMouseDown={handleMouseDown}
                        draggable={false}
                    />
                    
                    {/* Grid overlay that appears when dragging */}
                    {showGrid && (
                        <div className="crop-grid-overlay">
                            <div className="crop-grid-line crop-grid-line-horizontal crop-grid-line-1"></div>
                            <div className="crop-grid-line crop-grid-line-horizontal crop-grid-line-2"></div>
                            <div className="crop-grid-line crop-grid-line-vertical crop-grid-line-3"></div>
                            <div className="crop-grid-line crop-grid-line-vertical crop-grid-line-4"></div>
                        </div>
                    )}
                </div>

                {/* Bottom Controls - Only zoom buttons */}
                <div className="crop-controls">
                    <button className="crop-control-btn" onClick={handleZoomOut} title="Zoom Out">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                            <path d="M8 12h8" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                        </svg>
                    </button>
                    
                    <button className="crop-control-btn" onClick={handleZoomIn} title="Zoom In">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                            <path d="M12 8v8M8 12h8" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    )
}

