import React, { useState, useEffect, useRef } from 'react';

const soundData = [
  { name: '비', url: 'https://www.soundjay.com/nature/rain-01.mp3' },
  { name: '장작', url: 'https://www.soundjay.com/nature/campfire-1.mp3' },
];

const Noizes = () => {
  const [volume, setVolume] = useState(0.5);
  const [isPlaying, setIsPlaying] = useState(false);
  const [soundIndex, setSoundIndex] = useState(0);

  const audioRef = useRef(null);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  useEffect(() => {
    if (audioRef.current) {
        audioRef.current.src = soundData[soundIndex].url;
        if (isPlaying) {
            audioRef.current.play();
        }
    }
  }, [soundIndex]);

  const togglePlay = () => {
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  return (
    <div>
      <audio ref={audioRef} loop src={soundData[soundIndex].url} />
      <h3 className="text-lg font-semibold mb-2 text-gray-700">소리</h3>
      <div className="flex items-center mb-4">
        <button onClick={togglePlay} className="mr-4 p-2 rounded bg-blue-500 text-white">
          {isPlaying ? '정지' : '재생'}
        </button>
        <div className='w-full'>
            <div className="flex justify-between">
                <label htmlFor="soundType" className="mr-2 self-center">{soundData[soundIndex].name}</label>
                <input
                    type="range"
                    id="soundType"
                    min="0"
                    max={soundData.length - 1}
                    step="1"
                    value={soundIndex}
                    onChange={(e) => setSoundIndex(parseInt(e.target.value, 10))}
                    className="w-8/12 self-center"
                />
            </div>
            <div className="flex justify-between">
                <label htmlFor="volume" className="mr-2 self-center">볼륨</label>
                <input
                    type="range"
                    id="volume"
                    min="0"
                    max="1"
                    step="0.01"
                    value={volume}
                    onChange={(e) => setVolume(parseFloat(e.target.value))}
                    className="w-8/1L2 self-center"
                />
            </div>
        </div>
      </div>
    </div>
  );
};

export default Noizes;
