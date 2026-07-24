import { Link, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import styled from "styled-components";
import { tokens } from "shared/tokens";
import { useAppSelector } from "shared/store/hooks";
import { Button, Eyebrow, Pill } from "../../ui";

const color = tokens.color;

const STEPS = [
  { number: "01", heading: "Add your clothes", body: "Snap a photo or upload. Each item is tagged automatically — color, fabric, formality, season." },
  { number: "02", heading: "Ask for anything", body: "“Something for a rainy interview.” The stylist answers using only what's in your closet." },
  { number: "03", heading: "Wear more of it", body: "Save outfits, plan your week, and get nudged toward pieces you own but forget about." },
];

/** Logged-out landing page. Authenticated users skip straight to the closet. */
export default function HomePage() {
  const isAuthed = useAppSelector((state) => state.auth.status === "authenticated");
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthed) void navigate("/closet", { replace: true });
  }, [isAuthed, navigate]);

  return (
    <Page>
      <Header>
        <Brand>
          The Closet <b>Project</b>
        </Brand>
        <Spacer />
        <Link to="/login" className="signin">
          Sign in
        </Link>
        <Button as={Link} to="/signup">
          Sign up free
        </Button>
      </Header>

      <main id="main">
        <Hero>
          <div>
            <Pill>Your wardrobe, with a stylist</Pill>
            <h1>
              The only closet app you can <em>actually talk to.</em>
            </h1>
            <p className="lede">
              Add your clothes once. Then just ask — and get outfits built from what you already own.
            </p>
            <div className="cta">
              <Button as={Link} to="/signup">
                Start free
              </Button>
              <Link to="/login" className="signin">
                I already have an account &rsaquo;
              </Link>
            </div>
            <p className="reassure">No credit card · Your closet stays private</p>
          </div>
          <Art aria-hidden>
            <div className="msg you">What can I wear to dinner tonight? It's warm out.</div>
            <div className="msg them">Try your linen shirt with the tan trousers — light and dressy.</div>
            <div className="thumbs">
              <span />
              <span />
              <span />
            </div>
          </Art>
        </Hero>

        <Steps>
          <Eyebrow>How it works</Eyebrow>
          <div className="grid">
            {STEPS.map((step) => (
              <div className="step" key={step.number}>
                <span className="n">{step.number}</span>
                <h3>{step.heading}</h3>
                <p>{step.body}</p>
              </div>
            ))}
          </div>
        </Steps>

        <Final>
          <h2>Get dressed in one question.</h2>
          <p>Build your closet in minutes and start asking. Free to try — your wardrobe stays yours.</p>
          <Button as={Link} to="/signup">
            Start free
          </Button>
        </Final>
      </main>
    </Page>
  );
}

const Page = styled.div`
  min-height: 100dvh;
  .signin {
    font-weight: 600;
    text-decoration: none;
    color: ${color.textStrong};
  }
  .signin:hover {
    color: ${color.primary};
  }
`;
const Header = styled.header`
  display: flex;
  align-items: center;
  gap: 20px;
  height: 72px;
  padding: 0 24px;
  border-bottom: 1px solid ${color.border};
  @media (max-width: 600px) {
    padding: 0 16px;
    gap: 12px;
  }
`;
const Brand = styled.div`
  font-family: ${tokens.font.heading};
  font-weight: 700;
  font-size: 22px;
  b {
    color: ${color.primary};
  }
`;
const Spacer = styled.div`
  flex: 1;
`;
const Hero = styled.section`
  display: grid;
  grid-template-columns: 1.05fr 0.95fr;
  gap: 56px;
  align-items: center;
  max-width: 1120px;
  margin: 0 auto;
  padding: 72px 24px 64px;
  h1 {
    font-family: ${tokens.font.heading};
    font-weight: 700;
    font-size: clamp(38px, 5.4vw, 60px);
    line-height: 1.04;
    margin: 18px 0 20px;
    text-wrap: balance;
  }
  h1 em {
    font-style: normal;
    color: ${color.primary};
  }
  .lede {
    font-size: 19px;
    color: ${color.textSoft};
    max-width: 34ch;
    margin: 0 0 32px;
  }
  .cta {
    display: flex;
    align-items: center;
    gap: 20px;
    flex-wrap: wrap;
  }
  .reassure {
    font-family: ${tokens.font.mono};
    font-size: 12px;
    color: ${color.textSoft};
    margin-top: 16px;
  }
  @media (max-width: 800px) {
    grid-template-columns: 1fr;
    gap: 32px;
    padding: 40px 16px;
  }
`;
const Art = styled.div`
  background: ${color.surface};
  border: 1px solid ${color.border};
  border-radius: 24px;
  padding: 28px;
  .msg {
    font-size: 13px;
    padding: 10px 13px;
    border-radius: 16px;
    margin: 0 0 10px;
    max-width: 84%;
  }
  .msg.you {
    background: ${color.primary};
    color: #fff;
    margin-left: auto;
    border-bottom-right-radius: 5px;
  }
  .msg.them {
    background: ${color.background};
    border: 1px solid ${color.border};
    border-bottom-left-radius: 5px;
  }
  .thumbs {
    display: flex;
    gap: 8px;
  }
  .thumbs span {
    width: 46px;
    height: 58px;
    border-radius: 9px;
    border: 1px solid ${color.border};
    background: ${color.background};
  }
  .thumbs span:nth-child(1) {
    background: ${color.lilac};
  }
  .thumbs span:nth-child(3) {
    background: ${color.primarySoft};
  }
`;
const Steps = styled.section`
  max-width: 1120px;
  margin: 0 auto;
  padding: 40px 24px 72px;
  .grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 24px;
    margin-top: 24px;
  }
  .step {
    border: 1px solid ${color.border};
    border-radius: 18px;
    padding: 28px;
  }
  .step .n {
    font-family: ${tokens.font.mono};
    font-size: 12px;
    color: ${color.primary};
    letter-spacing: 0.12em;
  }
  .step h3 {
    font-family: ${tokens.font.heading};
    font-size: 20px;
    margin: 14px 0 8px;
  }
  .step p {
    margin: 0;
    color: ${color.textSoft};
    font-size: 15px;
  }
  @media (max-width: 800px) {
    padding: 24px 16px 48px;
    .grid {
      grid-template-columns: 1fr;
    }
  }
`;
const Final = styled.section`
  background: ${color.textStrong};
  color: #fff;
  border-radius: 24px;
  text-align: center;
  padding: 64px 32px;
  margin: 0 24px 64px;
  max-width: 1072px;
  margin-inline: auto;
  h2 {
    font-family: ${tokens.font.heading};
    font-size: clamp(28px, 3.4vw, 38px);
    margin: 0 0 14px;
  }
  p {
    color: #d9cfc8;
    font-size: 18px;
    max-width: 46ch;
    margin: 0 auto 30px;
  }
`;
