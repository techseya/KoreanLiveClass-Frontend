// src/Common/Components/AudioRecorder.tsx

import React, { useEffect, useRef, useState } from "react";
import { IconButton, Box, Typography, Button } from "@mui/material";
import MicIcon from "@mui/icons-material/Mic";
import StopIcon from "@mui/icons-material/Stop";
import DeleteIcon from "@mui/icons-material/Delete";
import WaveSurfer from "wavesurfer.js";

interface AudioRecorderProps {
    onRecordingComplete: (blob: Blob) => void;
}

export const AudioRecorder: React.FC<AudioRecorderProps> = ({ onRecordingComplete }) => {
    const [isRecording, setIsRecording] = useState(false);
    const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
    const [audioChunks, setAudioChunks] = useState<Blob[]>([]);
    const waveRef = useRef<HTMLDivElement>(null);
    const waveSurferRef = useRef<WaveSurfer | null>(null);

    useEffect(() => {
        if (waveRef.current && !waveSurferRef.current) {
            waveSurferRef.current = WaveSurfer.create({
                container: waveRef.current,
                waveColor: "#cce5ff",
                progressColor: "#2196f3",
                height: 60,
            });
        }
    }, []);

    const startRecording = async () => {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const recorder = new MediaRecorder(stream);
        const chunks: Blob[] = [];

        recorder.ondataavailable = (e) => chunks.push(e.data);
        recorder.onstop = () => {
            const blob = new Blob(chunks, { type: "audio/wav" });
            setAudioChunks([]);
            onRecordingComplete(blob);

            // Load into wavesurfer for preview
            waveSurferRef.current?.loadBlob(blob);
        };

        recorder.start();
        setIsRecording(true);
        setMediaRecorder(recorder);
        setAudioChunks(chunks);
    };

    const stopRecording = () => {
        mediaRecorder?.stop();
        setIsRecording(false);
    };

    const resetRecording = () => {
        setAudioChunks([]);
        waveSurferRef.current?.empty();
    };

    return (
        <Box sx={{ border: "1px solid #ccc", padding: 2, borderRadius: 2 }}>
            <Typography variant="subtitle1" gutterBottom>
                Audio Recorder
            </Typography>

            <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
                {!isRecording ? (
                    <IconButton color="primary" onClick={startRecording}>
                        <MicIcon fontSize="large" />
                    </IconButton>
                ) : (
                    <IconButton color="error" onClick={stopRecording}>
                        <StopIcon fontSize="large" />
                    </IconButton>
                )}

                <Typography variant="body2">
                    {isRecording ? "Recording..." : "Click mic to start"}
                </Typography>

                {audioChunks.length > 0 && (
                    <IconButton onClick={resetRecording}>
                        <DeleteIcon />
                    </IconButton>
                )}
            </Box>
        </Box>
    );
};
