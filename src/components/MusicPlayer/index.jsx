import { useEffect, useRef, useState } from 'react';
import { GoMute, GoUnmute } from "react-icons/go";
import { io } from 'socket.io-client';
import { api } from '../../services/api';
import { Button } from './styles';

const socket = io(api.defaults.baseURL);

export function MusicPlayer({streaming = false, ...rest}) {
  const audioRef = useRef(null);
  const [audioUrl, setAudioUrl] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    // socket.on('audio-duration', (data) => {
    //   audioRef.current.currentTime = data.currentTime; 
    // });

    socket.on('audio-play', (data) => {
      console.log('recebendo play');
      setAudioUrl(data.audioUrl);
      audioRef.current.currentTime = data.currentTime;
      if (isPlaying) {
        audioRef.current.play().catch(error => {
          console.error('Erro ao tentar reproduzir o áudio:', error);
        });
      }
    });

    socket.on('audio-pause', (data) => {
      console.log('recebendo pause');
      audioRef.current.currentTime = data.currentTime;
      audioRef.current.pause();
    });

    socket.on('audio-volume', (data) => {
      console.log('recebendo volume');
      audioRef.current.volume = data.volume; // Sincroniza o volume
    });

    return () => {
      socket.off('audio-duration');
      socket.off('audio-play');
      socket.off('audio-pause');
      socket.off('audio-volume');
    };
  }, [isPlaying]);

  const handleActive = () => {
    setIsPlaying(true);
    if (audioRef.current) {
      audioRef.current.play().catch(error => {
        console.error('Erro ao tentar reproduzir o áudio:', error);
      });
      audioRef.current.pause().catch(error => {
        console.error('Erro ao tentar pausar o áudio:', error);
      });
    }
  };

  const handleDesactive = () => {
    setIsPlaying(false);
    if (audioRef.current) {
      audioRef.current.pause().catch(error => {
        console.error('Erro ao tentar pausar o áudio:', error);
      });
    }
  }

  return (
    <div {...rest}>
      {isPlaying && <audio ref={audioRef} src={audioUrl} />}
      {!isPlaying ? 
        <Button streaming={streaming.toString()} onClick={handleActive}><GoMute size={streaming ? 20 : 25}/> Sons</Button>
      :
        <Button streaming={streaming.toString()} onClick={handleDesactive}><GoUnmute size={streaming ? 20 : 25}/> Sons</Button>
      }
    </div>
  );
}