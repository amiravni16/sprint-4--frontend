import { useRef } from 'react'

export function CreatePostModal({ isOpen, onClose }) {
    const fileInputRef = useRef(null)

    const handleSelectClick = () => {
        fileInputRef.current?.click()
    }

    const handleFileChange = (e) => {
        const files = e.target.files
        if (files && files.length > 0) {
            console.log('Files selected:', files)
            // TODO: Handle file upload
        }
    }

    if (!isOpen) return null

    return (
        <div className="create-post-overlay" onClick={onClose}>
            <div className="create-post-modal" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h2>Create new post</h2>
                    <button className="close-btn" onClick={onClose}>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                            <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                        </svg>
                    </button>
                </div>
                
                <div className="modal-content">
                    <div className="upload-icon">
                        <img src="/img/create-modal.svg" alt="Upload" className="upload-svg" />
                    </div>
                    <p className="upload-text">Drag photos and videos here</p>
                    <button className="select-btn" onClick={handleSelectClick}>
                        Select from computer
                    </button>
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*,video/*"
                        multiple
                        style={{ display: 'none' }}
                        onChange={handleFileChange}
                    />
                </div>
            </div>
        </div>
    )
}

