import { useRef, useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { CropModal } from './CropModal'
import { PostDetailsModal } from './PostDetailsModal'

export function UploadModal({ isOpen, onClose }) {
    const storeUser = useSelector(storeState => storeState.userModule.user)
    const fileInputRef = useRef(null)
    const [selectedFile, setSelectedFile] = useState(null)
    const [croppedImage, setCroppedImage] = useState(null)
    const [showCrop, setShowCrop] = useState(false)
    const [showPostCreate, setShowPostCreate] = useState(false)
    const [showDiscardModal, setShowDiscardModal] = useState(false)
    const [discardFromBack, setDiscardFromBack] = useState(false)

    // Disable scrolling when modal is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden'
        } else {
            document.body.style.overflow = 'unset'
        }

        // Cleanup function to restore scrolling when component unmounts
        return () => {
            document.body.style.overflow = 'unset'
        }
    }, [isOpen])

    const handleSelectClick = () => {
        fileInputRef.current?.click()
    }

    const handleFileChange = (e) => {
        const files = e.target.files
        if (files && files.length > 0) {
            setSelectedFile(files[0])
            setShowCrop(true)
        }
    }

    const handleBackFromCrop = () => {
        console.log('handleBackFromCrop called, selectedFile:', !!selectedFile)
        // Show discard modal if there's progress
        if (selectedFile) {
            console.log('Showing discard modal from crop back button')
            setDiscardFromBack(true)
            setShowDiscardModal(true)
        } else {
            console.log('Going back to upload (no progress)')
            setShowCrop(false)
            setSelectedFile(null)
        }
    }

    const handleCropComplete = (imageUrl) => {
        console.log('handleCropComplete called with:', imageUrl ? 'image' : 'no image')
        setCroppedImage(imageUrl)
        // After setting the cropped image, show the post details modal
        setShowCrop(false)
        setShowPostCreate(true)
        console.log('State updated: showCrop=false, showPostCreate=true')
    }

    const handleNextFromCrop = () => {
        // This is called by CropModal, but we handle the transition in handleCropComplete
        // No need to do anything here
    }

    const handleBackFromPostCreate = () => {
        console.log('handleBackFromPostCreate called - going back to crop')
        setShowPostCreate(false)
        setShowCrop(true)
    }

    const handleCloseAttempt = () => {
        console.log('handleCloseAttempt called, selectedFile:', !!selectedFile, 'croppedImage:', !!croppedImage)
        // Show discard modal if there's progress
        if (selectedFile || croppedImage) {
            console.log('Showing discard modal')
            setDiscardFromBack(false)
            setShowDiscardModal(true)
        } else {
            console.log('Closing modal (no progress)')
            onClose()
        }
    }

    const handleDiscard = () => {
        setShowDiscardModal(false)
        setShowCrop(false)
        setShowPostCreate(false)
        setCroppedImage(null)
        setSelectedFile(null)
        onClose()
    }

    const handleDiscardAndGoBack = () => {
        setShowDiscardModal(false)
        if (showPostCreate) {
            // Going back from post creation to crop
            setShowPostCreate(false)
            setShowCrop(true)
            // Don't clear the cropped image since we're going back to crop
        } else if (showCrop) {
            // Going back from crop to upload
            setShowCrop(false)
            setSelectedFile(null)
        }
    }

    const handleCancelDiscard = () => {
        setShowDiscardModal(false)
    }

    const handlePost = async (postData) => {
        try {
            // Import the addPost action
            const { addPost } = await import('../store/actions/post.actions')
            const { postService } = await import('../services/post')
            
            // Create a post object
            const post = postService.getEmptyPost()
            post.txt = postData.caption || ''
            post.imgUrl = postData.image
            // Resolve logged-in user from store or session
            let loggedinUser = storeUser
            if (!loggedinUser) {
                try {
                    const str = sessionStorage.getItem('loggedinUser')
                    if (str) loggedinUser = JSON.parse(str)
                } catch (err) {
                    console.warn('Could not parse loggedinUser from sessionStorage', err)
                }
            }
            if (loggedinUser?._id) {
                post.by = {
                    _id: loggedinUser._id,
                    fullname: loggedinUser.fullname || '',
                    username: loggedinUser.username || '',
                    imgUrl: loggedinUser.imgUrl || ''
                }
            }
            
            // Save the post
            await addPost(post)
            
            // Close modals and reset state BEFORE calling onClose
            setShowPostCreate(false)
            setShowCrop(false)
            setCroppedImage(null)
            setSelectedFile(null)
            
            // Reload the page to show the new post
            window.location.reload()
        } catch (err) {
            console.error('Error creating post:', err)
            const { showErrorMsg } = await import('../services/event-bus.service')
            showErrorMsg('Cannot create post')
        }
    }

    if (!isOpen) return null

    // Show PostDetails modal after crop
    if (showPostCreate && croppedImage) {
        console.log('Rendering PostDetailsModal with croppedImage')
        return (
            <>
                <PostDetailsModal
                    croppedImage={croppedImage}
                    onBack={handleBackFromPostCreate}
                    onClose={handleCloseAttempt}
                    onPost={handlePost}
                />
                {/* Discard modal overlay */}
                {showDiscardModal && (
                    <div className="discard-modal-overlay">
                        <div className="discard-modal">
                            <h3>Discard post?</h3>
                            <p>If you leave, your edits won't be saved.</p>
                            <div className="discard-modal-divider"></div>
                            <button className="discard-btn" onClick={handleDiscard}>
                                Discard
                            </button>
                            <div className="discard-modal-divider"></div>
                            <button className="cancel-discard-btn" onClick={handleCancelDiscard}>
                                Cancel
                            </button>
                        </div>
                    </div>
                )}
            </>
        )
    }

    // Show crop modal if file is selected
    if (showCrop && selectedFile) {
        return (
            <>
                    <CropModal
                        imageFile={selectedFile}
                        onBack={handleBackFromCrop}
                        onNext={handleNextFromCrop}
                        onClose={handleCloseAttempt}
                        onCropComplete={handleCropComplete}
                    />
                {/* Discard modal overlay */}
                {showDiscardModal && (
                    <div className="discard-modal-overlay">
                        <div className="discard-modal">
                            <h3>Discard post?</h3>
                            <p>If you leave, your edits won't be saved.</p>
                            <div className="discard-modal-divider"></div>
                            <button className="discard-btn" onClick={discardFromBack ? handleDiscardAndGoBack : handleDiscard}>
                                {discardFromBack ? 'Go back to upload' : 'Discard'}
                            </button>
                            <div className="discard-modal-divider"></div>
                            <button className="cancel-discard-btn" onClick={handleCancelDiscard}>
                                Cancel
                            </button>
                        </div>
                    </div>
                )}
            </>
        )
    }

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

