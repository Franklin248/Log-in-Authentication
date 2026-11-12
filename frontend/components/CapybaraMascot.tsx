
"use client";

import {
  Suspense,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";

export type CapybaraField =
  | "login-username"
  | "login-email"
  | "login-password"
  | "register-name"
  | "register-username"
  | "register-email"
  | "register-password"
  | "register-confirm";

type Mood = "classic" | "sleepy" | "happy" | "curious" | "error";

type CapybaraMascotProps = {
  coverEyes?: boolean;
  peek?: boolean;
  mood?: Mood;
  field?: CapybaraField;
  typingVersion?: number;
};

type CharacterProps = {
  coverEyes: boolean;
  peek: boolean;
  mood: NonNullable<CapybaraMascotProps["mood"]>;
};

const dialogues: Record<CapybaraField, string[]> = {
  "login-username": [
    "Hey! What's your username? 😊",
    "Let's find your account!",
    "Username time! Take it easy.",
    "I hope you remember your username!",
    "Type your username right here!",
    "One username coming right up!",
    "Your account is waiting for you!",
    "No rush, I'm enjoying the moment.",
    "Let's get you signed in!",
    "Looking good! Keep typing! 🧡",
  ],

  "login-email": [
    "An email? Optional, just like me! 🍊",
    "You can leave this one empty!",
    "Checking your email? I'm just chilling.",
    "No email? That's perfectly fine!",
    "An extra detail, if you want!",
    "Your email can sit this one out.",
    "Optional means optional!",
    "Just making sure you're comfortable.",
    "You decide if you want to share it!",
    "I'm not judging your inbox! 😆",
  ],

  "login-password": [
    "Shhh! That's your little secret! 🤫",
    "I'll look away, promise!",
    "Password protection mode activated!",
    "No peeking... well, maybe a little!",
    "Your secret is safe with me!",
    "Careful! Someone might be watching!",
    "I'll cover my eyes for you!",
    "A secret code? Very mysterious!",
    "Take your time. I'll face the other way.",
    "Privacy is important, even for capybaras!",
  ],

  "register-name": [
    "What should I call you? 😊",
    "Let's put a name to that account!",
    "A new friend! What's your name?",
    "Nice to meet you in advance!",
    "Your name deserves a cozy welcome!",
    "Every capy-club member has a name!",
    "Let's get acquainted!",
    "I'll try my best to remember!",
    "A name makes everything personal.",
    "Welcome! Let's start with your name!",
  ],

  "register-username": [
    "Time to pick your username!",
    "Make it uniquely yours!",
    "Your digital identity starts here!",
    "Choose something you'll remember!",
    "A username fit for the capy-club!",
    "Let's find your perfect username!",
    "Keep it simple and memorable!",
    "Your future login starts with this!",
    "I wonder what username you'll choose!",
    "Looking for a cool username? Take your time!",
  ],

  "register-email": [
    "Email address? Only if you want! 🍊",
    "This field is optional, remember!",
    "No email? No problem at all!",
    "Your inbox can take a little break.",
    "You can add an email if you'd like!",
    "An optional detail for your account!",
    "I'm just hanging out while you decide.",
    "No pressure. This one's up to you!",
    "Your email is welcome, but not required!",
    "Even without an email, we can be friends!",
  ],

  "register-password": [
    "A secret code for your new account!",
    "I'll close my eyes. Pinky promise!",
    "Make it strong and keep it private!",
    "Eight characters or more! You got this!",
    "Your password is safe with me!",
    "Shhh! Secret password in progress!",
    "Don't let anyone peek!",
    "A strong password is a happy password!",
    "I'll guard your secret!",
    "Take your time. Security first! 🔐",
  ],

  "register-confirm": [
    "Let's make sure those passwords match!",
    "One more time, just to be sure!",
    "Double-checking your secret code!",
    "Consistency is key!",
    "Same password, same happy capybara!",
    "Let's see if they match!",
    "Almost there! Confirm that password!",
    "No pressure. Just checking!",
    "Two passwords should become one!",
    "A little confirmation before we celebrate!",
  ],
};

function getRandomDialogue(
  field: CapybaraField,
  currentMessage?: string
) {
  const messages = dialogues[field];
  const available = messages.filter(
    (message) => message !== currentMessage
  );

  const choices = available.length > 0 ? available : messages;

  return choices[Math.floor(Math.random() * choices.length)];
}

function Character({
  coverEyes,
  peek,
  mood,
}: CharacterProps) {
  const { scene } = useGLTF("/models/Capybara.glb");

  const model = useMemo(() => {
    const cloned = scene.clone(true);
    cloned.updateMatrixWorld(true);

    const originalBounds = new THREE.Box3().setFromObject(cloned);
    const originalSize = originalBounds.getSize(new THREE.Vector3());

    if (originalSize.y > 0) {
      cloned.scale.setScalar(2.2 / originalSize.y);
    }

    cloned.updateMatrixWorld(true);

    const bounds = new THREE.Box3().setFromObject(cloned);
    const center = bounds.getCenter(new THREE.Vector3());

    cloned.position.set(-center.x, -bounds.min.y, -center.z);
    cloned.updateMatrixWorld(true);

    return cloned;
  }, [scene]);

  const root = useRef<THREE.Group>(null);
  const pointer = useRef({ x: 0, y: 0 });

  const isCovering = coverEyes && !peek;
  const isHappy = mood === "happy";
  const isSleepy = mood === "sleepy";
  const isError = mood === "error";

  useEffect(() => {
    const handlePointerMove = (event: PointerEvent) => {
      pointer.current.x =
        (event.clientX / window.innerWidth) * 2 - 1;

      pointer.current.y =
        1 - (event.clientY / window.innerHeight) * 2;
    };

    window.addEventListener("pointermove", handlePointerMove);

    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
    };
  }, []);

  useFrame((state, delta) => {
    if (!root.current) return;

    const time = state.clock.elapsedTime;

    const cursorY = pointer.current.x * 0.2;
    const cursorX = -pointer.current.y * 0.12;

    const idleSway = Math.sin(time * 0.8) * 0.018;
    const errorShake = isError ? Math.sin(time * 18) * 0.13 : 0;

    const happyBounce = isHappy
      ? Math.abs(Math.sin(time * 5)) * 0.1
      : 0;

    const sleepingBob = isSleepy
      ? Math.sin(time * 1.2) * 0.025
      : 0;

    const targetRotationX = isCovering
      ? -0.12
      : peek
        ? 0.05
        : cursorX;

    root.current.rotation.x = THREE.MathUtils.damp(
      root.current.rotation.x,
      targetRotationX,
      5,
      delta
    );

    root.current.rotation.y = THREE.MathUtils.damp(
      root.current.rotation.y,
      cursorY + errorShake,
      7,
      delta
    );

    root.current.rotation.z = THREE.MathUtils.damp(
      root.current.rotation.z,
      mood === "curious" ? 0.1 : idleSway,
      4,
      delta
    );

    root.current.position.y = THREE.MathUtils.damp(
      root.current.position.y,
      -1.1 +
        Math.sin(time * 1.8) * 0.018 +
        happyBounce +
        sleepingBob,
      5,
      delta
    );

    const breathing = 1 + Math.sin(time * 2) * 0.008;

    root.current.scale.x = THREE.MathUtils.damp(
      root.current.scale.x,
      breathing,
      3,
      delta
    );

    root.current.scale.y = THREE.MathUtils.damp(
      root.current.scale.y,
      1 + Math.sin(time * 2) * 0.012,
      3,
      delta
    );

    root.current.scale.z = THREE.MathUtils.damp(
      root.current.scale.z,
      breathing,
      3,
      delta
    );
  });

  return (
    <group ref={root} position={[0, -1.1, 0]}>
      <primitive object={model} />
    </group>
  );
}

export default function CapybaraMascot({
  coverEyes = false,
  peek = false,
  mood = "classic",
  field = "login-username",
  typingVersion = 0,
}: CapybaraMascotProps) {
    const [message, setMessage] = useState(
    "Hello there! Welcome to the Capybara Club! 🧡"
);
  useEffect(() => {
    setMessage(getRandomDialogue(field));
  }, [field]);

  useEffect(() => {
    if (typingVersion === 0) return;

    const timeout = window.setTimeout(() => {
      setMessage((current) =>
        getRandomDialogue(field, current)
      );
    }, 900);

    return () => window.clearTimeout(timeout);
  }, [field, typingVersion]);

  const caption = coverEyes && !peek
    ? "No peeking! 🙈"
    : peek
      ? "Just a little peek! 👀"
      : message;

  return (
    <div
      className="capybara-mascot capybara-3d"
      aria-hidden="true"
    >
      <div className="capybara-scene">
        <Canvas
          camera={{
            position: [0, 0.05, 5.8],
            fov: 32,
          }}
          dpr={[1, 1.5]}
          gl={{
            alpha: true,
            antialias: true,
          }}
        >
          <ambientLight intensity={1.5} />

          <directionalLight
            position={[3, 5, 5]}
            intensity={2}
          />

          <directionalLight
            position={[-4, 2, -2]}
            intensity={0.8}
          />

          <Suspense fallback={null}>
            <Character
              coverEyes={coverEyes}
              peek={peek}
              mood={mood}
            />
          </Suspense>
        </Canvas>

        <div
          className="capybara-message"
          key={caption}
        >
          <span>{caption}</span>
        </div>
      </div>

      <style jsx>{`
        .capybara-scene {
          position: relative;
          width: 100%;
          height: 250px;
          overflow: visible;
        }

        .capybara-message {
          position: absolute;
          top: 12px;
          left: 58%;
          z-index: 10;
          max-width: 175px;
          min-width: 90px;
          padding: 10px 14px;
          border-radius: 18px;
          background: #ffffff;
          color: #493b32;
          border: 1px solid rgba(100, 75, 55, 0.12);
          box-shadow: 0 5px 18px rgba(60, 40, 25, 0.13);
          font-size: 13px;
          font-weight: 600;
          line-height: 1.4;
          text-align: center;
          white-space: normal;
          transform-origin: bottom left;
          animation: bubbleEnter 450ms cubic-bezier(.2, 1.5, .4, 1) both,
                     bubbleFloat 3s ease-in-out 450ms infinite;
        }

        .capybara-message::before {
          content: "";
          position: absolute;
          left: 13px;
          bottom: -7px;
          width: 14px;
          height: 14px;
          background: #ffffff;
          border-right: 1px solid rgba(100, 75, 55, 0.12);
          border-bottom: 1px solid rgba(100, 75, 55, 0.12);
          transform: rotate(45deg);
        }

        .capybara-message span {
          position: relative;
          z-index: 1;
        }

        @keyframes bubbleEnter {
          0% {
            opacity: 0;
            transform: translateY(12px) scale(0.65);
          }
          65% {
            opacity: 1;
            transform: translateY(-3px) scale(1.06);
          }
          100% {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        @keyframes bubbleFloat {
          0%, 100% {
            translate: 0 0;
          }
          50% {
            translate: 0 -4px;
          }
        }

        @media (max-width: 480px) {
          .capybara-message {
            left: 55%;
            top: 8px;
            max-width: 145px;
            padding: 8px 11px;
            font-size: 12px;
          }
        }
      `}</style>
    </div>
  );
}

useGLTF.preload("/models/Capybara.glb");
