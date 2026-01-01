import React, { PureComponent } from 'react';
import { Spin } from 'antd';
import Link from 'next/link';
import { videoService } from '@services/index';
import './trending-videos.less';

interface Video {
  _id: string;
  title: string;
  thumbnail: string;
  duration?: number;
  performer?: {
    name: string;
    username: string;
    avatar: string;
    gender: string;
    age?: number;
  };
  performers?: Array<{
    name: string;
    username: string;
    avatar: string;
    gender: string;
    age?: number;
  }>;
  stats?: {
    views: number;
  };
  views?: number;
  createdAt: string;
}

interface IProps {
  limit?: number;
}

interface IState {
  videos: Video[];
  loading: boolean;
}

class TrendingVideos extends PureComponent<IProps, IState> {
  static defaultProps = {
    limit: 5
  };

  constructor(props: IProps) {
    super(props);
    this.state = {
      videos: [],
      loading: true
    };
  }

  componentDidMount() {
    this.fetchTrendingVideos();
  }

  fetchTrendingVideos = async () => {
    try {
      const response = await videoService.search({
        limit: this.props.limit || 5,
        sort: 'desc',
        sortBy: 'createdAt',
        offset: 0
      });

      const videos = response.data?.data?.map((video: any) => {
        const performer = video.performers?.[0] || {};
        return {
          _id: video._id,
          title: video.title || 'Untitled Video',
          thumbnail: video.thumbnail || '/no-image.jpg',
          duration: video.video?.duration || 0,
          performer: {
            name: performer.name || 'Unknown',
            username: performer.username || '',
            avatar: performer.avatar || '/no-avatar.png',
            gender: performer.gender || 'female',
            age: performer.age
          },
          views: video.stats?.views || video.views || 0,
          createdAt: video.createdAt || new Date().toISOString()
        };
      }) || [];

      this.setState({ videos, loading: false });
    } catch (error) {
      console.error('Error fetching trending videos:', error);
      this.setState({ loading: false });
    }
  };

  formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  formatTimeAgo = (date: string) => {
    const now = new Date();
    const past = new Date(date);
    const diffInSeconds = Math.floor((now.getTime() - past.getTime()) / 1000);

    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
    const days = Math.floor(diffInSeconds / 86400);
    return `${days} ${days === 1 ? 'day' : 'days'} ago`;
  };

  formatViews = (views: number) => {
    if (views < 1000) return views.toString();
    if (views < 1000000) return `${(views / 1000).toFixed(1)}K`;
    return `${(views / 1000000).toFixed(1)}M`;
  };

  render() {
    const { videos, loading } = this.state;

    if (loading) {
      return (
        <div className="trending-videos">
          <div className="trending-videos-header">
            <h3>Trending video's</h3>
          </div>
          <div className="trending-videos-loading">
            <Spin />
          </div>
        </div>
      );
    }

    if (!videos.length) {
      return null;
    }

    return (
      <div className="trending-videos">
        <div className="trending-videos-header">
          <h3>Trending video's</h3>
        </div>
        <div className="trending-videos-list">
          {videos.map((video) => (
            <Link
              key={video._id}
              href={{
                pathname: '/video/[id]',
                query: { id: video._id }
              }}
            >
              <a className="trending-video-item">
                <div className="video-thumbnail">
                  <img src={video.thumbnail || '/no-image.jpg'} alt={video.title} />
                  <div className="video-overlay">
                    <span className="play-icon">▶</span>
                    <span className="video-duration">{this.formatDuration(video.duration)}</span>
                  </div>
                </div>
                <div className="video-info">
                  <h4 className="video-title">{video.title}</h4>
                  <div className="video-meta">
                    <span className="performer-name">
                      {video.performer.name} ({video.performer.gender === 'female' ? 'Vrouw' : video.performer.gender === 'male' ? 'Man' : 'Stel'}, {video.performer.age} Jaar)
                    </span>
                  </div>
                  <div className="video-stats">
                    <span className="views">{this.formatViews(video.views)} views</span>
                    <span className="time-ago">{this.formatTimeAgo(video.createdAt)}</span>
                  </div>
                </div>
              </a>
            </Link>
          ))}
        </div>
      </div>
    );
  }
}

export default TrendingVideos;

