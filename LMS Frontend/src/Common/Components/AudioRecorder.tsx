import { Box, Button, Typography } from "@mui/material";
import { useRef, useState } from "react";

export function AudioRecorder({ onRecordingComplete }: { onRecordingComplete: (blob: Blob) => void }) {
    const [recording, setRecording] = useState(false);
    const [audioURL, setAudioURL] = useState("");
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const chunks = useRef<Blob[]>([]);

    const startRecording = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            const mediaRecorder = new MediaRecorder(stream);
            mediaRecorderRef.current = mediaRecorder;
            chunks.current = [];

            mediaRecorder.ondataavailable = (e) => {
                if (e.data.size > 0) {
                    chunks.current.push(e.data);
                }
            };

            mediaRecorder.onstop = () => {
                const blob = new Blob(chunks.current, { type: "audio/wav" });
                const url = URL.createObjectURL(blob);
                setAudioURL(url);
                onRecordingComplete(blob);
            };

            mediaRecorder.start();
            setRecording(true);
        } catch (err) {
            alert("Microphone access denied or not supported.");
            console.error(err);
        }
    };

    const stopRecording = () => {
        if (mediaRecorderRef.current) {
            mediaRecorderRef.current.stop();
            setRecording(false);
        }
    };

    return (
        <Box mt={2}>
            <Button
                variant="contained"
                color={recording ? "error" : "primary"}
                onClick={recording ? stopRecording : startRecording}
            >
                {recording ? "Stop Recording" : "Start Recording"}
            </Button>
        </Box>
    );
}
