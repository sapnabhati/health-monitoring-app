import { useState, useEffect } from 'react';

// Using the experimental Web Speech API
// Ensure typings are loosely handled for the window object
declare global {
    interface Window {
        SpeechRecognition: any;
        webkitSpeechRecognition: any;
    }
}

export function useSpeechText() {
    const [transcript, setTranscript] = useState('');
    const [isListening, setIsListening] = useState(false);
    const [recognition, setRecognition] = useState<any>(null);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
            if (SpeechRecognition) {
                const rec = new SpeechRecognition();
                rec.continuous = false;
                rec.interimResults = true;
                rec.lang = 'en-US';

                rec.onresult = (event: any) => {
                    let currentTranscript = '';
                    for (let i = event.resultIndex; i < event.results.length; i++) {
                        currentTranscript += event.results[i][0].transcript;
                    }
                    setTranscript(currentTranscript);
                };

                rec.onerror = (event: any) => {
                    console.error('Speech recognition error', event.error);
                    setIsListening(false);
                };

                rec.onend = () => {
                    setIsListening(false);
                };

                setRecognition(rec);
            } else {
                console.warn("Speech Recognition API is not supported in this browser.")
            }
        }
    }, []);

    const startListening = () => {
        setTranscript('');
        setIsListening(true);
        if (recognition) {
            recognition.start();
        }
    };

    const stopListening = () => {
        setIsListening(false);
        if (recognition) {
            recognition.stop();
        }
    };

    return { transcript, isListening, startListening, stopListening, hasSupport: !!recognition };
}
