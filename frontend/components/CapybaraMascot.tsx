
"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";

type CapybaraMascotProps = {
  coverEyes?: boolean;
  peek?: boolean;
  mood?: "classic" | "sleepy" | "happy" | "curious";
};

export default function CapybaraMascot({
  coverEyes = false,
  peek = false,
  mood = "classic",
}: CapybaraMascotProps) {
  const mascotRef = useRef<HTMLDivElement>(null);
  const [look, setLook] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handlePointerMove = (event: PointerEvent) => {
      const element = mascotRef.current;
      if (!element) return;

      const rect = element.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      setLook({
        x: Math.max(-1, Math.min(1, (event.clientX - centerX) / (rect.width / 2))),
        y: Math.max(-1, Math.min(1, (event.clientY - centerY) / (rect.height / 2))),
      });
    };

    const resetLook = () => setLook({ x: 0, y: 0 });

    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("blur", resetLook);

    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("blur", resetLook);
    };
  }, []);

  const pupilStyle: CSSProperties = {
    transform: `translate(${look.x * 3}px, ${look.y * 2}px)`,
  };

  const headStyle: CSSProperties = {
    transform: `rotate(${look.x * 2}deg)`,
  };

  const isCovering = coverEyes && !peek;
  const isPeeking = peek;
  const isHappy = mood === "happy";
  const isSleepy = mood === "sleepy";

  return (
    <div
      ref={mascotRef}
      className={[
        "capybara-mascot",
        isCovering ? "is-covering" : "",
        isPeeking ? "is-peeking" : "",
        isHappy ? "is-happy" : "",
        isSleepy ? "is-sleepy" : "",
      ].filter(Boolean).join(" ")}
      aria-hidden="true"
    >
      <svg
        className="capybara-svg"
        viewBox="0 0 240 220"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Soft ground shadow */}
        <ellipse
          cx="120"
          cy="205"
          rx="66"
          ry="8"
          fill="#80583F"
          opacity=".12"
          className="capybara-shadow"
        />

        {/* Body */}
        <g className="capybara-body">
          <path
            d="M72 197
              C65 193 61 183 66 169
              L82 133
              C88 119 98 112 120 112
              C142 112 152 119 158 133
              L174 169
              C179 183 175 193 168 197
              C153 204 87 204 72 197Z"
            fill="#C58A61"
            stroke="#70472F"
            strokeWidth="3.5"
            strokeLinejoin="round"
          />

          {/* Feet */}
          <path
            d="M76 190 Q65 191 67 199 Q78 205 99 201 L99 193Z"
            fill="#A96F50"
            stroke="#70472F"
            strokeWidth="2.5"
          />
          <path
            d="M164 190 Q175 191 173 199 Q162 205 141 201 L141 193Z"
            fill="#A96F50"
            stroke="#70472F"
            strokeWidth="2.5"
          />
          <path
            d="M82 197 l6 3 M91 197 l5 3 M158 197 l-6 3 M149 197 l-5 3"
            fill="none"
            stroke="#70472F"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
        </g>

        {/* Head and orange */}
        <g className="capybara-head" style={headStyle}>
          {/* Ears */}
          <ellipse
            cx="73" cy="62" rx="15" ry="20"
            fill="#A96F50"
            stroke="#70472F"
            strokeWidth="3"
          />
          <ellipse
            cx="73" cy="63" rx="8" ry="12"
            fill="#D59A77"
          />
          <ellipse
            cx="167" cy="62" rx="15" ry="20"
            fill="#A96F50"
            stroke="#70472F"
            strokeWidth="3"
          />
          <ellipse
            cx="167" cy="63" rx="8" ry="12"
            fill="#D59A77"
          />

          {/* Head */}
          <path
            d="M120 34
              C82 34 58 58 57 100
              C56 132 80 153 120 153
              C160 153 184 132 183 100
              C182 58 158 34 120 34Z"
            fill="#D6A078"
            stroke="#70472F"
            strokeWidth="3.5"
          />

          {/* Orange */}
          <g className="capybara-orange">
            <path
              d="M103 36
                C96 24 105 12 120 12
                C135 12 144 24 137 36
                C131 45 109 45 103 36Z"
              fill="#F3A044"
              stroke="#70472F"
              strokeWidth="3"
            />
            <path
              d="M121 15 C120 5 132 2 139 7"
              fill="none"
              stroke="#55754C"
              strokeWidth="5"
              strokeLinecap="round"
            />
            <path
              d="M128 13 C136 2 146 7 143 16"
              fill="#78965A"
              stroke="#55754C"
              strokeWidth="2"
            />
            <path
              d="M108 24 Q112 18 118 19"
              fill="none"
              stroke="#FFD18D"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
          </g>

          {/* Eyes - normal */}
          <g className="capybara-open-eyes">
            <g style={pupilStyle}>
              <ellipse cx="94" cy="86" rx="4.8" ry="6.5" fill="#38271F" />
              <circle cx="95" cy="84" r="1.5" fill="#FFF8EC" />
            </g>
            <g style={pupilStyle}>
              <ellipse cx="146" cy="86" rx="4.8" ry="6.5" fill="#38271F" />
              <circle cx="147" cy="84" r="1.5" fill="#FFF8EC" />
            </g>
          </g>

          {/* Closed eyes */}
          <g className="capybara-closed-eyes">
            <path
              d="M85 88 Q94 96 103 88"
              fill="none"
              stroke="#493027"
              strokeWidth="3"
              strokeLinecap="round"
            />
            <path
              d="M137 88 Q146 96 155 88"
              fill="none"
              stroke="#493027"
              strokeWidth="3"
              strokeLinecap="round"
            />
          </g>

          {/* Snout */}
          <ellipse cx="120" cy="112" rx="23" ry="19" fill="#A96F50" />
          <ellipse cx="112" cy="107" rx="2.5" ry="2" fill="#493027" />
          <ellipse cx="128" cy="107" rx="2.5" ry="2" fill="#493027" />
          <path
            d="M120 111 L120 120 M120 120 Q114 125 110 120 M120 120 Q126 125 130 120"
            fill="none"
            stroke="#493027"
            strokeWidth="2.3"
            strokeLinecap="round"
          />

          {/* Tiny blush */}
          <ellipse cx="77" cy="116" rx="6" ry="3" fill="#E99D91" opacity=".55" />
          <ellipse cx="163" cy="116" rx="6" ry="3" fill="#E99D91" opacity=".55" />

          {/* Happy mouth */}
          <path
            className="capybara-happy-mouth"
            d="M111 119 Q120 132 129 119"
            fill="none"
            stroke="#493027"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
        </g>

        {/* Normal paws */}
        <g className="capybara-resting-paws">
          <ellipse cx="91" cy="186" rx="16" ry="8" fill="#A96F50" />
          <ellipse cx="149" cy="186" rx="16" ry="8" fill="#A96F50" />
        </g>

        {/* Covering paws */}
        <g className="capybara-cover-paws">
          <path
            d="M69 185
              C70 165 77 133 89 104
              C94 93 104 94 108 103
              C112 111 105 126 101 138
              L91 174
              C87 190 75 196 69 185Z"
            fill="#C58A61"
            stroke="#70472F"
            strokeWidth="3"
            strokeLinejoin="round"
          />
          <path
            d="M171 185
              C170 165 163 133 151 104
              C146 93 136 94 132 103
              C128 111 135 126 139 138
              L149 174
              C153 190 165 196 171 185Z"
            fill="#C58A61"
            stroke="#70472F"
            strokeWidth="3"
            strokeLinejoin="round"
          />
          <path
            d="M86 111 Q94 105 99 113 M154 111 Q146 105 141 113"
            fill="none"
            stroke="#E5B18D"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </g>

        {/* Peek paws - slightly separated */}
        <g className="capybara-peek-paws">
          <path
            d="M65 184
              C67 160 74 135 88 111
              C94 101 104 101 108 110
              C111 117 103 132 98 143
              L87 176
              C82 190 69 195 65 184Z"
            fill="#C58A61"
            stroke="#70472F"
            strokeWidth="3"
            strokeLinejoin="round"
          />
          <path
            d="M175 184
              C173 160 166 135 152 111
              C146 101 136 101 132 110
              C129 117 137 132 142 143
              L153 176
              C158 190 171 195 175 184Z"
            fill="#C58A61"
            stroke="#70472F"
            strokeWidth="3"
            strokeLinejoin="round"
          />
        </g>

        {/* Happy raised paws */}
        <g className="capybara-happy-paws">
          <path
            d="M76 179 Q52 157 55 132 Q57 119 68 126 L91 151"
            fill="#C58A61"
            stroke="#70472F"
            strokeWidth="3.5"
            strokeLinecap="round"
          />
          <path
            d="M164 179 Q188 157 185 132 Q183 119 172 126 L149 151"
            fill="#C58A61"
            stroke="#70472F"
            strokeWidth="3.5"
            strokeLinecap="round"
          />
        </g>
      </svg>

      <span className="capybara-caption">
        {isCovering
          ? "No peeking! 🙈"
          : isPeeking
            ? "Just a little peek! 👀"
            : isHappy
              ? "Yay! 🧡"
              : isSleepy
                ? "Zzz..."
                : "Hello there! 🧡"}
      </span>
    </div>
  );
}
