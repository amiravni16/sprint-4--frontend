export function ProfileSkeleton() {
    return (
        <section className="user-details skeleton-loading">
            <div className="profile-container">
                <div className="profile-header">
                    <div className="profile-left">
                        <div className="skeleton-avatar"></div>
                    </div>
                    <div className="profile-right">
                        <div className="profile-info">
                            <div className="profile-name-section">
                                <div className="skeleton-username"></div>
                                <div className="skeleton-button"></div>
                            </div>
                            <div className="profile-stats">
                                <div className="skeleton-stat"></div>
                                <div className="skeleton-stat"></div>
                                <div className="skeleton-stat"></div>
                            </div>
                            <div className="skeleton-fullname"></div>
                        </div>
                    </div>
                </div>

                <div className="profile-tabs">
                    <div className="skeleton-tab active"></div>
                    <div className="skeleton-tab"></div>
                </div>

                <div className="profile-posts">
                    <div className="posts-grid">
                        {Array.from({ length: 9 }).map((_, i) => (
                            <div key={i} className="skeleton-post"></div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    )
}
