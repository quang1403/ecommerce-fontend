import React, { useState } from "react";
import "./VideoSection.css";

const VideoSection = () => {
  const [selectedVideo, setSelectedVideo] = useState(null);

  const videos = [
    {
      id: 1,
      title: "Các bước Kiểm tra iPhone cũ",
      videoId: "cCytNfYMye0",
      thumbnail: "https://img.youtube.com/vi/cCytNfYMye0/mqdefault.jpg",
    },
    {
      id: 2,
      title: "Review sản phẩm mới",
      videoId: "gmafHwvxFlw",
      thumbnail: "https://img.youtube.com/vi/gmafHwvxFlw/mqdefault.jpg",
    },
    {
      id: 3,
      title: "Hướng dẫn sử dụng",
      videoId: "lvKTRpM4gKA",
      thumbnail: "https://img.youtube.com/vi/lvKTRpM4gKA/mqdefault.jpg",
    },
  ];

  const handleVideoClick = (videoId) => {
    setSelectedVideo(videoId);
  };

  const closeModal = () => {
    setSelectedVideo(null);
  };

  return (
    <>
      <div className="video-section">
        {videos.map((video) => (
          <div
            key={video.id}
            className="video-item"
            onClick={() => handleVideoClick(video.videoId)}
          >
            <div className="video-thumbnail">
              <img src={video.thumbnail} alt={video.title} />
              <div className="play-overlay">
                <div className="play-button">
                  <i className="fas fa-play"></i>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {selectedVideo && (
        <div className="video-modal" onClick={closeModal}>
          <div
            className="video-modal-content"
            onClick={(e) => e.stopPropagation()}
          >
            <button className="video-modal-close" onClick={closeModal}>
              <i className="fas fa-times"></i>
            </button>
            <div className="video-iframe-wrapper">
              <iframe
                src={`https://www.youtube.com/embed/${selectedVideo}?autoplay=1`}
                title="YouTube video player"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default VideoSection;
