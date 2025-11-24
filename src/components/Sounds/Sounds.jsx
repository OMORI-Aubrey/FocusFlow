import React, { useState, useEffect, useRef } from 'react';

const soundData = [
  { name: '비', url: 'https://www.soundjay.com/nature/rain-01.mp3' },
  { name: '장작', url: 'https://www.soundjay.com/nature/campfire-1.mp3' },
  { name: '시냇물', url: 'https://www.soundjay.com/nature/stream-1.mp3' },
  { name: '파도', url: 'https://www.soundjay.com/nature/ocean-waves-1.mp3' },
  { name: '바람', url: 'https://www.soundjay.com/nature/wind-1.mp3' },
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
        <button onClick={togglePlay} className="mr-4 p-2 rounded bg-blue-500 text-white whitespace-nowrap">
          {isPlaying ? '정지' : '재생'}
        </button>
        <div className='w-full'>
            <div className="flex space-x-4 mb-2">
                {soundData.map((sound, index) => (
                        <div key={index} className="flex items-center">
                            <input
                                type="radio"
                                id={`sound-${index}`}
                                name="soundType"
                                value={index}
                                checked={soundIndex === index}
                                onChange={(e) => setSoundIndex(parseInt(e.target.value, 10))}
                                className="mr-1"
                            />
                            <label htmlFor={`sound-${index}`} className="text-gray-900">{sound.name}</label>
                        </div>
                    ))}
            </div>
            <div className="flex items-center space-x-4">
                <label htmlFor="volume" className="self-center text-gray-900">볼륨</label>
                <input
                    type="range"
                    id="volume"
                    min="0"
                    max="1"
                    step="0.01"
                    value={volume}
                    onChange={(e) => setVolume(parseFloat(e.target.value))}
                    className="w-8/12 self-center"
                />
            </div>
        </div>
      </div>
    </div>
  );
};

export default Noizes;
