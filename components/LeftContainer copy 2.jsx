import React, { useState, useEffect, useRef, useCallback } from 'react';
import { HandLandmarker, FilesetResolver } from "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.0";

var height = window.innerHeight;
var width = window.innerWidth;

export default function LeftContainer() {
  const [model_confidence, setModelConfidence] = useState(0);
  const [modelStatus, setModelStatus] = useState("INITIALIZING");
  const videoRef = useRef(null);
  const landmarkerRef = useRef(null);
  const requestRef = useRef(null);

  // 1. Initialize MediaPipe with explicit CDN paths
  useEffect(() => {
    const initMediaPipe = async () => {
      try {
        setModelStatus("LOADING_WASM");
        const vision = await FilesetResolver.forVisionTasks(
          "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.0/wasm"
        );
        
        setModelStatus("LOADING_MODEL");
        landmarkerRef.current = await HandLandmarker.createFromOptions(vision, {
          baseOptions: {
            modelAssetPath: `https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task`,
            delegate: "GPU"
          },
          runningMode: "VIDEO",
          numHands: 1
        });
        
        setModelStatus("READY");
        console.log("MediaPipe Hand Landmarker Ready");
      } catch (err) {
        setModelStatus("ERROR");
        console.error("MediaPipe Init Error:", err);
      }
    };
    initMediaPipe();

    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, []);

  // 2. Detection Loop Logic
  const runDetection = useCallback(() => {
    if (
      videoRef.current &&
      videoRef.current.readyState === 4 &&
      landmarkerRef.current
    ) {
      const video = videoRef.current;
      const startTimeMs = performance.now();
      
      try {
        const results = landmarkerRef.current.detectForVideo(video, startTimeMs);

        if (results.landmarks && results.landmarks.length > 0) {
          // const score = Math.round(results.handedness[0][0].score * 100);
          console.log(results)
          setModelConfidence(10);
        } else {
          setModelConfidence(0);
        }
      } catch (e) {
        console.error("Detection Error:", e);
      }
    }
    requestRef.current = requestAnimationFrame(runDetection);
  }, []);

  // 3. Setup Camera Stream and Trigger Detection
  useEffect(() => {
    let stream = null;
    const startCamera = async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: { 
            width: { ideal: 1280 }, 
            height: { ideal: 720 },
            facingMode: "user" 
          }
        });
        
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.onloadedmetadata = () => {
            videoRef.current.play();
            // Start detection loop as soon as metadata is ready
            requestRef.current = requestAnimationFrame(runDetection);
          };
        }
      } catch (err) {
        console.error("Camera access error:", err);
        setModelStatus("CAMERA_ERROR");
      }
    };

    startCamera();

    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [runDetection]);

  return (
    <div className="LeftContainer">
      <section className="viewport" style={{ position: 'relative' }}>
        <video
          ref={videoRef}
          playsInline
          muted
          style={{
            backdropFilter: "blur(12px)",
            borderRadius: '1.25rem',
            transition: "transform 0.2s ease",
            width: "100%",
            height: "100%",
            objectFit: "cover",
            backgroundColor: "#000"
          }}
        />
        
        {/* Status HUD Overlay */}
        <div style={{
          position: 'absolute',
          top: '20px',
          left: '20px',
          background: 'rgba(0,0,0,0.6)',
          padding: '5px 10px',
          borderRadius: '5px',
          fontFamily: 'monospace',
          fontSize: '10px',
          color: modelStatus === "READY" ? "#22c55e" : "#f59e0b",
          border: '1px solid rgba(255,255,255,0.1)',
          pointerEvents: 'none'
        }}>
          STATUS: {modelStatus}
        </div>
      </section>

      <span className='tech-label' style={{ justifySelf: "left", color: "white" }}>Model Confidence : </span>
      <div className="progress-track" style={{ background: 'rgba(255,255,255,0.1)', height: '8px', borderRadius: '4px', overflow: 'hidden' }}>
        <div 
          className="progress-filler" 
          style={{ 
            width: `${model_confidence}%`,
            height: '100%',
            background: 'var(--neural-indigo, #6366f1)',
            transition: 'width 0.1s linear'
          }}
        ></div>
      </div>
      <h4 style={{ justifySelf: "right" }}>{model_confidence} %</h4>
    </div>
  )
}