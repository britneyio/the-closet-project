import { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { tokens } from "shared/tokens";
import { useAppDispatch, useAppSelector } from "shared/store/hooks";
import { sendMessage, reset } from "shared/store/chatSlice";
import type { ReferencedItem } from "shared/domain";
import { Eyebrow } from "../../ui";

const color = tokens.color;

const QUICK_ACTIONS = [
  "What can I wear to a warm-weather dinner?",
  "Plan my outfits for the week",
  "Pack me three days for a trip",
  "Which of my clothes do I never wear?",
];

export default function StylistPage() {
  const dispatch = useAppDispatch();
  const { messages, sending, error } = useAppSelector((state) => state.chat);
  const [draft, setDraft] = useState("");
  const streamRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = streamRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages, sending]);

  useEffect(() => {
    dispatch(reset());
  }, [dispatch]);

  const submit = (text: string) => {
    if (sending) return;
    void dispatch(sendMessage(text));
    setDraft("");
  };

  return (
    <Page>
      <Stream ref={streamRef} aria-live="polite">
        {messages.length === 0 && (
          <Intro>
            <Eyebrow>Your stylist</Eyebrow>
            <h2>Ask me anything about your closet.</h2>
            <p>I answer using only the clothes you own.</p>
          </Intro>
        )}

        {messages.map((message, index) => (
          <Bubble key={index} $role={message.role}>
            <span>{message.content}</span>
            {message.referenced_items && message.referenced_items.length > 0 && (
              <Thumbs>
                {message.referenced_items.map((item: ReferencedItem) => (
                  <Thumb key={item.id} title={item.name} aria-label={item.name}>
                    {item.cover_file ? <img src={item.cover_file} alt={item.name} /> : <span>{item.name}</span>}
                  </Thumb>
                ))}
              </Thumbs>
            )}
          </Bubble>
        ))}

        {sending && (
          <Bubble $role="assistant">
            <Typing>Styling…</Typing>
          </Bubble>
        )}
        {error && <ErrorNote role="alert">{error}</ErrorNote>}
      </Stream>

      <Chips aria-label="Suggested prompts">
        {QUICK_ACTIONS.map((prompt) => (
          <Chip key={prompt} type="button" onClick={() => submit(prompt)} disabled={sending}>
            {prompt}
          </Chip>
        ))}
      </Chips>

      <Composer
        onSubmit={(event) => {
          event.preventDefault();
          submit(draft);
        }}
      >
        <input
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          placeholder="Ask your stylist…"
          aria-label="Message the stylist"
        />
        <button type="submit" aria-label="Send" disabled={sending || !draft.trim()}>
          &rarr;
        </button>
      </Composer>
    </Page>
  );
}

const Page = styled.div`
  display: flex;
  flex-direction: column;
  height: calc(100dvh - 68px);
  overflow: hidden;
  @media (max-width: 700px) {
    height: calc(100dvh - 68px - 68px);
  }
`;
const Stream = styled.div`
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 22px;
  max-width: 760px;
  width: 100%;
  margin: 0 auto;
  @media (max-width: 600px) {
    padding: 16px;
  }
`;
const Intro = styled.div`
  text-align: center;
  color: ${color.textSoft};
  margin: auto 0;
  h2 {
    font-family: ${tokens.font.heading};
    color: ${color.textStrong};
    margin: 8px 0 6px;
  }
  p {
    margin: 0;
  }
`;
const Bubble = styled.div<{ $role: string }>`
  align-self: ${(props) => (props.$role === "user" ? "flex-end" : "flex-start")};
  max-width: 80%;
  background: ${(props) => (props.$role === "user" ? color.primary : color.surface)};
  color: ${(props) => (props.$role === "user" ? color.onPrimary : color.textStrong)};
  padding: 11px 14px;
  border-radius: 16px;
  border-bottom-${(props) => (props.$role === "user" ? "right" : "left")}-radius: 5px;
  font-size: 15px;
  line-height: 1.45;
  @media (max-width: 600px) {
    max-width: 88%;
  }
`;
const Thumbs = styled.div`
  display: flex;
  gap: 8px;
  margin-top: 10px;
`;
const Thumb = styled.div`
  width: 46px;
  height: 58px;
  border-radius: 9px;
  overflow: hidden;
  border: 1px solid ${color.border};
  background: ${color.background};
  display: grid;
  place-items: center;
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  span {
    font-family: ${tokens.font.mono};
    font-size: 8px;
    color: ${color.textSoft};
    text-align: center;
    padding: 2px;
  }
`;
const Typing = styled.span`
  color: ${color.textSoft};
  font-style: italic;
`;
const ErrorNote = styled.div`
  align-self: center;
  color: ${color.danger};
  background: ${color.dangerSoft};
  border-radius: 10px;
  padding: 10px 14px;
  font-size: 14px;
`;
const Chips = styled.div`
  flex: none;
  display: flex;
  gap: 8px;
  overflow-x: auto;
  padding: 10px 22px;
  max-width: 760px;
  width: 100%;
  margin: 0 auto;
  &::-webkit-scrollbar {
    height: 0;
  }
`;
const Chip = styled.button`
  white-space: nowrap;
  flex: none;
  cursor: pointer;
  font-family: ${tokens.font.body};
  font-size: 13px;
  color: ${color.textSoft};
  background: ${color.background};
  border: 1px solid ${color.border};
  border-radius: 999px;
  padding: 8px 14px;
  &:hover:not(:disabled) {
    border-color: ${color.primary};
    color: ${color.primary};
  }
  &:disabled {
    opacity: 0.5;
  }
`;
const Composer = styled.form`
  flex: none;
  display: flex;
  gap: 10px;
  align-items: center;
  border-top: 1px solid ${color.border};
  padding: 12px 22px 16px;
  max-width: 760px;
  width: 100%;
  margin: 0 auto;
  input {
    flex: 1;
    border: 1px solid ${color.border};
    border-radius: 999px;
    padding: 13px 18px;
    font-size: 16px;
    color: ${color.textStrong};
    outline: none;
  }
  input:focus {
    border-color: ${color.primary};
  }
  button {
    flex: none;
    width: 44px;
    height: 44px;
    border-radius: 50%;
    border: 0;
    background: ${color.primary};
    color: ${color.onPrimary};
    font-size: 20px;
    cursor: pointer;
  }
  button:disabled {
    opacity: 0.5;
  }
`;
