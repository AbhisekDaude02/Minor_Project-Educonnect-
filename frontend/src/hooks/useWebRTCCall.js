
import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

import { socket } from "../services/socket";

// ============================================
// WEBRTC CONFIGURATION
// ============================================

const ICE_SERVERS = {
  iceServers: [
    {
      urls: "stun:stun.l.google.com:19302",
    },
  ],
};

export default function useWebRTCCall() {
  // ============================================
  // REFS
  // ============================================

  const peerRef = useRef(null);
  const localStreamRef = useRef(null);
  const remoteStreamRef = useRef(null);

  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);

  const callRef = useRef(null);
  const incomingRef = useRef(null);

  const pendingCandidatesRef = useRef([]);
  const pendingCallCandidatesRef = useRef(new Map());

  const startingRef = useRef(false);
  const acceptingRef = useRef(false);

  // ============================================
  // STATES
  // ============================================

  const [call, setCall] = useState(null);
  const [incoming, setIncoming] = useState(null);

  const [muted, setMuted] = useState(false);
  const [cameraOff, setCameraOff] = useState(false);

  const [localStream, setLocalStream] = useState(null);
  const [remoteStream, setRemoteStream] = useState(null);

  const [callError, setCallError] = useState("");

  // ============================================
  // UPDATE CALL STATE
  // ============================================

  const updateCall = useCallback((value) => {
    callRef.current = value;
    setCall(value);
  }, []);

  const updateIncoming = useCallback((value) => {
    incomingRef.current = value;
    setIncoming(value);
  }, []);

  // ============================================
  // ATTACH MEDIA STREAMS
  // ============================================

  const setLocalMedia = useCallback((stream) => {
    localStreamRef.current = stream;
    setLocalStream(stream);

    if (localVideoRef.current) {
      localVideoRef.current.srcObject = stream;
    }
  }, []);

  const setRemoteMedia = useCallback((stream) => {
    remoteStreamRef.current = stream;
    setRemoteStream(stream);

    if (remoteVideoRef.current) {
      remoteVideoRef.current.srcObject = stream;
    }
  }, []);

  // ============================================
  // CLEANUP CALL
  // ============================================

  const cleanup = useCallback(() => {
    const peer = peerRef.current;

    if (peer) {
      peer.onicecandidate = null;
      peer.ontrack = null;
      peer.onconnectionstatechange = null;

      peer.close();
      peerRef.current = null;
    }

    if (localStreamRef.current) {
      localStreamRef.current
        .getTracks()
        .forEach((track) => track.stop());
    }

    localStreamRef.current = null;
    remoteStreamRef.current = null;

    if (localVideoRef.current) {
      localVideoRef.current.srcObject = null;
    }

    if (remoteVideoRef.current) {
      remoteVideoRef.current.srcObject = null;
    }

    pendingCandidatesRef.current = [];
    pendingCallCandidatesRef.current.clear();

    startingRef.current = false;
    acceptingRef.current = false;

    callRef.current = null;
    incomingRef.current = null;

    setCall(null);
    setIncoming(null);

    setLocalStream(null);
    setRemoteStream(null);

    setMuted(false);
    setCameraOff(false);
  }, []);

  // ============================================
  // CREATE PEER CONNECTION
  // ============================================

  const createPeer = useCallback(
    (otherUserId, callId) => {
      const peer = new RTCPeerConnection(
        ICE_SERVERS
      );

      peerRef.current = peer;

      // Send ICE candidates to the other user
      peer.onicecandidate = (event) => {
        if (!event.candidate) return;

        socket.emit("call:ice", {
          to: otherUserId,
          callId,
          candidate: event.candidate.toJSON(),
        });
      };

      // Receive remote audio/video
      peer.ontrack = (event) => {
        let stream = event.streams?.[0];

        if (!stream) {
          stream =
            remoteStreamRef.current ||
            new MediaStream();

          if (!stream.getTracks().some(
            (track) => track.id === event.track.id
          )) {
            stream.addTrack(event.track);
          }
        }

        setRemoteMedia(stream);
      };

      // Monitor connection state
      peer.onconnectionstatechange = () => {
        const state = peer.connectionState;

        if (state === "connected") {
          if (
            callRef.current?.callId === callId
          ) {
            updateCall({
              ...callRef.current,
              status: "connected",
            });
          }
        }

        if (state === "failed") {
          setCallError(
            "Call connection failed. Please try again."
          );

          const current = callRef.current;

          if (current?.callId === callId) {
            socket.emit("call:end", {
              to: current.otherUserId,
              callId,
            });
          }

          cleanup();
        }
      };

      return peer;
    },
    [cleanup, setRemoteMedia, updateCall]
  );

  // ============================================
  // REQUEST MICROPHONE / CAMERA
  // ============================================

  const getMedia = useCallback(
    async (type) => {
      if (!navigator.mediaDevices?.getUserMedia) {
        throw new Error(
          "Camera and microphone require HTTPS or localhost."
        );
      }

      const constraints = {
        audio: true,
        video:
          type === "video"
            ? {
                facingMode: "user",
              }
            : false,
      };

      const stream =
        await navigator.mediaDevices.getUserMedia(
          constraints
        );

      setLocalMedia(stream);

      return stream;
    },
    [setLocalMedia]
  );

  // ============================================
  // ADD QUEUED ICE CANDIDATES
  // ============================================

  const flushCandidates = useCallback(
    async () => {
      const peer = peerRef.current;

      if (
        !peer ||
        !peer.remoteDescription
      ) {
        return;
      }

      const candidates = [
        ...pendingCandidatesRef.current,
      ];

      pendingCandidatesRef.current = [];

      for (const candidate of candidates) {
        try {
          await peer.addIceCandidate(
            new RTCIceCandidate(candidate)
          );
        } catch (error) {
          console.error(
            "Failed to add ICE candidate:",
            error
          );
        }
      }
    },
    []
  );

  // ============================================
  // START AUDIO / VIDEO CALL
  // ============================================

  const startCall = useCallback(
    async (otherUserId, type = "audio") => {
      if (
        startingRef.current ||
        acceptingRef.current ||
        callRef.current ||
        incomingRef.current
      ) {
        return;
      }

      if (!socket.connected) {
        throw new Error(
          "Real-time connection is unavailable."
        );
      }

      if (
        !otherUserId ||
        !["audio", "video"].includes(type)
      ) {
        throw new Error(
          "Invalid call information."
        );
      }

      startingRef.current = true;
      setCallError("");

      const callId = crypto.randomUUID();

      updateCall({
        otherUserId: String(otherUserId),
        callId,
        type,
        status: "starting",
      });

      try {
        const stream = await getMedia(type);

        // Call may have been ended while requesting permission
        if (
          callRef.current?.callId !== callId
        ) {
          stream.getTracks().forEach(
            (track) => track.stop()
          );
          return;
        }

        const peer = createPeer(
          otherUserId,
          callId
        );

        stream.getTracks().forEach((track) => {
          peer.addTrack(track, stream);
        });

        const offer =
          await peer.createOffer();

        await peer.setLocalDescription(
          offer
        );

        if (
          callRef.current?.callId !== callId
        ) {
          return;
        }

        updateCall({
          otherUserId: String(otherUserId),
          callId,
          type,
          status: "calling",
        });

        socket.emit("call:offer", {
          to: String(otherUserId),
          callId,
          type,
          offer: peer.localDescription,
        });
      } catch (error) {
        console.error(
          "Start call error:",
          error
        );

        cleanup();
        setCallError(
          error.message ||
          "Failed to start call"
        );

        throw error;
      } finally {
        startingRef.current = false;
      }
    },
    [
      cleanup,
      createPeer,
      getMedia,
      updateCall,
    ]
  );

  // ============================================
  // ACCEPT INCOMING CALL
  // ============================================

  const acceptCall = useCallback(
    async () => {
      const request = incomingRef.current;

      if (
        !request ||
        acceptingRef.current ||
        callRef.current
      ) {
        return;
      }

      acceptingRef.current = true;
      setCallError("");

      try {
        const stream = await getMedia(
          request.type
        );

        if (
          incomingRef.current?.callId !==
          request.callId
        ) {
          stream.getTracks().forEach(
            (track) => track.stop()
          );
          return;
        }

        const peer = createPeer(
          request.from,
          request.callId
        );

        stream.getTracks().forEach(
          (track) => {
            peer.addTrack(track, stream);
          }
        );

        await peer.setRemoteDescription(
          new RTCSessionDescription(
            request.offer
          )
        );

        // Move ICE candidates received before acceptance
        const earlyCandidates =
          pendingCallCandidatesRef.current.get(
            request.callId
          ) || [];

        pendingCandidatesRef.current.push(
          ...earlyCandidates
        );

        pendingCallCandidatesRef.current.delete(
          request.callId
        );

        await flushCandidates();

        const answer =
          await peer.createAnswer();

        await peer.setLocalDescription(
          answer
        );

        updateCall({
          otherUserId: String(request.from),
          callId: request.callId,
          type: request.type,
          status: "connecting",
        });

        updateIncoming(null);

        socket.emit("call:answer", {
          to: String(request.from),
          callId: request.callId,
          answer: peer.localDescription,
        });
      } catch (error) {
        console.error(
          "Accept call error:",
          error
        );

        socket.emit("call:reject", {
          to: request.from,
          callId: request.callId,
        });

        cleanup();

        setCallError(
          error.message ||
          "Failed to accept call"
        );

        throw error;
      } finally {
        acceptingRef.current = false;
      }
    },
    [
      cleanup,
      createPeer,
      flushCandidates,
      getMedia,
      updateCall,
      updateIncoming,
    ]
  );

  // ============================================
  // REJECT INCOMING CALL
  // ============================================

  const rejectCall = useCallback(() => {
    const request = incomingRef.current;

    if (!request) return;

    socket.emit("call:reject", {
      to: request.from,
      callId: request.callId,
    });

    pendingCallCandidatesRef.current.delete(
      request.callId
    );

    updateIncoming(null);
  }, [updateIncoming]);

  // ============================================
  // END ACTIVE CALL
  // ============================================

  const endCall = useCallback(() => {
    const current = callRef.current;

    if (current) {
      socket.emit("call:end", {
        to: current.otherUserId,
        callId: current.callId,
      });
    }

    cleanup();
  }, [cleanup]);

  // ============================================
  // TOGGLE MICROPHONE
  // ============================================

  const toggleMute = useCallback(() => {
    const tracks =
      localStreamRef.current?.getAudioTracks() ||
      [];

    if (!tracks.length) return;

    const nextMuted = !muted;

    tracks.forEach((track) => {
      track.enabled = !nextMuted;
    });

    setMuted(nextMuted);
  }, [muted]);

  // ============================================
  // TOGGLE CAMERA
  // ============================================

  const toggleCamera = useCallback(() => {
    const tracks =
      localStreamRef.current?.getVideoTracks() ||
      [];

    if (!tracks.length) return;

    const nextCameraOff = !cameraOff;

    tracks.forEach((track) => {
      track.enabled = !nextCameraOff;
    });

    setCameraOff(nextCameraOff);
  }, [cameraOff]);

  // ============================================
  // SOCKET.IO EVENT LISTENERS
  // ============================================

  useEffect(() => {
    // Incoming call
    const onOffer = (payload = {}) => {
      if (
        !payload.from ||
        !payload.callId ||
        !payload.offer ||
        !["audio", "video"].includes(payload.type)
      ) {
        return;
      }

      // Already busy
      if (
        callRef.current ||
        incomingRef.current ||
        startingRef.current ||
        acceptingRef.current
      ) {
        socket.emit("call:reject", {
          to: payload.from,
          callId: payload.callId,
        });
        return;
      }

      updateIncoming(payload);
      setCallError("");
    };

    // Answer from other user
    const onAnswer = async (payload = {}) => {
      const current = callRef.current;

      if (
        !current ||
        payload.callId !== current.callId ||
        String(payload.from) !==
          String(current.otherUserId)
      ) {
        return;
      }

      const peer = peerRef.current;

      if (
        !peer ||
        peer.signalingState !== "have-local-offer"
      ) {
        return;
      }

      try {
        await peer.setRemoteDescription(
          new RTCSessionDescription(
            payload.answer
          )
        );

        await flushCandidates();

        if (
          callRef.current?.callId ===
          current.callId
        ) {
          updateCall({
            ...callRef.current,
            status: "connecting",
          });
        }
      } catch (error) {
        console.error(
          "Call answer error:",
          error
        );

        setCallError(
          "Failed to establish the call."
        );

        cleanup();
      }
    };

    // ICE candidate
    const onIce = async (payload = {}) => {
      if (
        !payload.callId ||
        !payload.candidate
      ) {
        return;
      }

      const current = callRef.current;
      const request = incomingRef.current;

      const activeId =
        current?.callId ||
        request?.callId;

      const otherId =
        current?.otherUserId ||
        request?.from;

      if (
        payload.callId !== activeId ||
        String(payload.from) !== String(otherId)
      ) {
        return;
      }

      const peer = peerRef.current;

      try {
        if (
          peer &&
          peer.remoteDescription
        ) {
          await peer.addIceCandidate(
            new RTCIceCandidate(
              payload.candidate
            )
          );
        } else if (current) {
          pendingCandidatesRef.current.push(
            payload.candidate
          );
        } else {
          const existing =
            pendingCallCandidatesRef.current.get(
              payload.callId
            ) || [];

          existing.push(payload.candidate);

          pendingCallCandidatesRef.current.set(
            payload.callId,
            existing
          );
        }
      } catch (error) {
        console.error(
          "ICE candidate error:",
          error
        );
      }
    };

    // Other user ended or rejected the call
    const onEnd = (payload = {}) => {
      const current = callRef.current;
      const request = incomingRef.current;

      const matchesCurrent =
        current &&
        payload.callId === current.callId &&
        String(payload.from) ===
          String(current.otherUserId);

      const matchesIncoming =
        request &&
        payload.callId === request.callId &&
        String(payload.from) ===
          String(request.from);

      if (
        matchesCurrent ||
        matchesIncoming
      ) {
        cleanup();
      }
    };

    // Call signaling error
    const onCallError = (payload = {}) => {
      setCallError(
        payload.message ||
        "Call signaling failed."
      );
    };

    socket.on("call:offer", onOffer);
    socket.on("call:answer", onAnswer);
    socket.on("call:ice", onIce);
    socket.on("call:end", onEnd);
    socket.on("call:reject", onEnd);
    socket.on("call:error", onCallError);

    return () => {
      socket.off("call:offer", onOffer);
      socket.off("call:answer", onAnswer);
      socket.off("call:ice", onIce);
      socket.off("call:end", onEnd);
      socket.off("call:reject", onEnd);
      socket.off("call:error", onCallError);
    };
  }, [
    cleanup,
    flushCandidates,
    updateCall,
    updateIncoming,
  ]);

  // ============================================
  // ATTACH STREAMS WHEN VIDEO ELEMENTS MOUNT
  // ============================================

  useEffect(() => {
    if (
      localVideoRef.current &&
      localStream
    ) {
      localVideoRef.current.srcObject =
        localStream;
    }
  }, [call, localStream]);

  useEffect(() => {
    if (
      remoteVideoRef.current &&
      remoteStream
    ) {
      remoteVideoRef.current.srcObject =
        remoteStream;
    }
  }, [call, remoteStream]);

  // ============================================
  // CLEANUP ON UNMOUNT
  // ============================================

  useEffect(() => {
    return () => {
      const current = callRef.current;

      if (current) {
        socket.emit("call:end", {
          to: current.otherUserId,
          callId: current.callId,
        });
      }

      const request = incomingRef.current;

      if (request) {
        socket.emit("call:reject", {
          to: request.from,
          callId: request.callId,
        });
      }

      const peer = peerRef.current;

      if (peer) {
        peer.onicecandidate = null;
        peer.ontrack = null;
        peer.onconnectionstatechange = null;
        peer.close();
      }

      localStreamRef.current
        ?.getTracks()
        .forEach((track) => track.stop());
    };
  }, []);

  // ============================================
  // RETURN
  // ============================================

  return {
    call,
    incoming,
    callError,

    localVideoRef,
    remoteVideoRef,

    localStream,
    remoteStream,

    startCall,
    acceptCall,
    rejectCall,
    endCall,

    muted,
    cameraOff,

    toggleMute,
    toggleCamera,
  };
}
