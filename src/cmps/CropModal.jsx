import { useState, useRef, useEffect } from 'react'

export function CropModal({ imageFile, onBack, onNext, onClose, onCropComplete }) {
    const [zoom, setZoom] = useState(1)
    const [position, setPosition] = useState({ x: 0, y: 0 })
    const [isDragging, setIsDragging] = useState(false)
    const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
    const [showGrid, setShowGrid] = useState(false)
    const [isZoomed, setIsZoomed] = useState(false)
    const [showZoomSlider, setShowZoomSlider] = useState(false)
    const imageRef = useRef(null)
    const [imageUrl, setImageUrl] = useState(null)

    // Create blob URL for display
    useEffect(() => {
        const url = URL.createObjectURL(imageFile)
        setImageUrl(url)
        return () => URL.revokeObjectURL(url) // Cleanup
    }, [imageFile])

    // Disable scrolling when crop modal is open
    useEffect(() => {
        document.body.style.overflow = 'hidden'
        
        // Cleanup function to restore scrolling when component unmounts
        return () => {
            document.body.style.overflow = 'unset'
        }
    }, [])

    const handleZoomIn = () => {
        setZoom(prev => Math.min(prev + 0.1, 3))
    }

    const handleZoomOut = () => {
        setZoom(prev => Math.max(prev - 0.1, 0.5))
    }

    const handleToggleZoom = () => {
        setShowZoomSlider(!showZoomSlider)
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
        console.log('CropModal handleNext called with zoom:', zoom, 'position:', position)
        
        try {
            // Get the actual crop area dimensions from the container
            const cropContainer = document.querySelector('.crop-image-container')
            if (!cropContainer) {
                throw new Error('Crop container not found')
            }
            
            const cropRect = cropContainer.getBoundingClientRect()
            const containerWidth = cropRect.width
            const containerHeight = cropRect.height
            
            // Use container dimensions for crop
            const cropWidth = containerWidth
            const cropHeight = containerHeight
            
            console.log('Container dimensions:', containerWidth, 'x', containerHeight)
            console.log('Crop dimensions:', cropWidth, 'x', cropHeight)
            
            // Create a canvas to perform the actual cropping
            const canvas = document.createElement('canvas')
            const ctx = canvas.getContext('2d')
            
            // Set canvas size
            canvas.width = cropWidth
            canvas.height = cropHeight
            
            // Fill with white background
            ctx.fillStyle = '#ffffff'
            ctx.fillRect(0, 0, cropWidth, cropHeight)
            
            // Create an image element to load the original image
            const img = new Image()
            img.onload = () => {
                console.log('Original image loaded:', img.width, 'x', img.height)
                
                // For object-fit: contain, calculate how the image is displayed in the container
                const containerAspectRatio = cropWidth / cropHeight
                const imageAspectRatio = img.width / img.height
                
                let displayedWidth, displayedHeight, offsetX, offsetY
                
                if (imageAspectRatio > containerAspectRatio) {
                    // Image is wider - fit to height, center horizontally
                    displayedHeight = cropHeight
                    displayedWidth = cropHeight * imageAspectRatio
                    offsetX = (cropWidth - displayedWidth) / 2
                    offsetY = 0
                } else {
                    // Image is taller - fit to width, center vertically
                    displayedWidth = cropWidth
                    displayedHeight = cropWidth / imageAspectRatio
                    offsetX = 0
                    offsetY = (cropHeight - displayedHeight) / 2
                }
                
                // Map the visible area to the original image coordinates
                const scaleX = img.width / displayedWidth
                const scaleY = img.height / displayedHeight
                
                // Apply zoom and position transformations
                const zoomedWidth = displayedWidth / zoom
                const zoomedHeight = displayedHeight / zoom
                
                // Calculate the source rectangle based on zoom and position
                const sourceWidth = zoomedWidth * scaleX
                const sourceHeight = zoomedHeight * scaleY
                
                // Calculate the source position - center the crop area and apply position offset
                const centerX = img.width / 2
                const centerY = img.height / 2
                const sourceX = centerX - (sourceWidth / 2) - (position.x * scaleX / zoom) + (offsetX * scaleX)
                const sourceY = centerY - (sourceHeight / 2) - (position.y * scaleY / zoom) + (offsetY * scaleY)
                
                // Draw the entire visible area to fill the canvas
                const drawWidth = cropWidth
                const drawHeight = cropHeight
                const drawX = 0
                const drawY = 0
                
                console.log('Crop calculations:', {
                    sourceX,
                    sourceY,
                    sourceWidth,
                    sourceHeight,
                    drawX,
                    drawY,
                    drawWidth,
                    drawHeight,
                    zoom,
                    position,
                    displayedWidth,
                    displayedHeight,
                    offsetX,
                    offsetY
                })
                
                // Draw the cropped portion to the canvas, centered and maintaining aspect ratio
                ctx.drawImage(
                    img,
                    sourceX, sourceY, sourceWidth, sourceHeight, // Source rectangle
                    drawX, drawY, drawWidth, drawHeight // Destination rectangle
                )
                
                // Convert canvas to data URL
                const croppedDataUrl = canvas.toDataURL('image/jpeg', 0.9)
                console.log('Cropped image created, data URL length:', croppedDataUrl.length)
                
                if (onCropComplete) {
                    onCropComplete(croppedDataUrl)
                }
            }
            
            img.onerror = (error) => {
                console.error('Error loading image for cropping:', error)
                // Fallback to original image if cropping fails
                const reader = new FileReader()
                reader.onloadend = () => {
                    if (onCropComplete) {
                        onCropComplete(reader.result)
                    }
                }
                reader.readAsDataURL(imageFile)
            }
            
            // Load the original image
            img.src = imageUrl
            
        } catch (error) {
            console.error('Error during cropping:', error)
            // Fallback to original image if cropping fails
            const reader = new FileReader()
            reader.onloadend = () => {
                if (onCropComplete) {
                    onCropComplete(reader.result)
                }
            }
            reader.readAsDataURL(imageFile)
        }
    }

    if (!imageFile || !imageUrl) return null

    return (
        <div className="crop-overlay" onClick={onClose}>
            <button className="crop-close-btn" onClick={onClose}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
            </button>
            <div className="crop-modal" onClick={(e) => e.stopPropagation()}>
                {/* Header */}
                <div className="crop-header">
                    <button className="crop-back-btn" onClick={onBack}>
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


                {/* Zoom Slider */}
                <div className={`crop-zoom-slider ${showZoomSlider ? 'visible' : ''}`}>
                    <input
                        type="range"
                        min="1"
                        max="3"
                        step="0.1"
                        value={zoom}
                        onChange={(e) => setZoom(parseFloat(e.target.value))}
                        className="crop-zoom-range"
                    />
                </div>

                {/* Zoom toggle button */}
                <div className="crop-zoom-control">
                    <button 
                        className={`crop-zoom-btn ${showZoomSlider ? 'active' : ''}`} 
                        onClick={handleToggleZoom} 
                        title={showZoomSlider ? "Hide Zoom" : "Show Zoom"}
                    >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                            <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="2"/>
                            <path d="m21 21-4.35-4.35" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                            <path d="M11 8v6M8 11h6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                        </svg>
                    </button>
                </div>

            </div>
        </div>
    )
}

