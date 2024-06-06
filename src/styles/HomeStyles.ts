import styled from 'styled-components';
import { motion } from 'framer-motion';

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100vh;
  width: 100vw;
  text-align: center;
  padding: 0;
  background: linear-gradient(135deg, #0d0d0d 25%, #1a1a1a 75%);
  position: relative;
  overflow: hidden;
`;

export const AbstractBackground = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, rgba(0, 0, 0, 0.7) 25%, rgba(25, 25, 25, 0.7) 75%);
  mix-blend-mode: overlay;
  pointer-events: none;
  z-index: 1;
`;

export const NameTitle = styled(motion.div)`
  font-size: 2rem;
  margin-bottom: 2rem;
  color: #C0C0C0;
  z-index: 2;
  transition: transform 0.3s ease;

  &:hover {
    transform: scale(1.1);
  }
  h1:hover {
    transition: transform 1s ease;
    transform: scale(1.1);
  }
  h1 {
    margin: 0.6em 0 0.1em 0;

    img {
      height: 40px;
      width: 40px;
      border-radius: 50%;
      vertical-align: middle;
    }
  }
  h2 {
    font-size: 1em;
    margin: 0.3em 0;
  }

  @media (max-width: 600px) {
    font-size: 1.5rem;
  }
`;

export const Menu = styled(motion.nav)`
  display: flex;
  gap: 2rem;
  font-size: 1.5rem;
  z-index: 2;

  a {
    color: #329548;
    text-decoration: none;
    position: relative;
    padding: 0.5rem 1rem;
    transition: color 0.3s, transform 0.3s;

    &:hover {
      color: #04c942;
      transform: scale(1.1);

      &:before {
        transform: scaleX(1);
        transform-origin: bottom left;
      }

      &:after {
        transform: scaleX(1);
        transform-origin: top right;
      }
    }

    &:before,
    &:after {
      content: '';
      position: absolute;
      left: 0;
      right: 0;
      height: 2px;
      background-color: #04c942;
      transform: scaleX(0);
      transition: transform 0.3s ease-out;
    }

    &:before {
      top: 0;
    }

    &:after {
      bottom: 0;
    }
  }

  @media (max-width: 600px) {
    flex-direction: column;
    gap: 1rem;
    font-size: 1.2rem;
  }
`;

export const Description = styled.div`
  margin: 4% 5%;
  font-family: ui-sans-serif,system-ui,sans-serif;
  max-width: 1400px;

  line-height: 23px;

  ul {
    list-style-type: none;

    li {
      margin-bottom: 0.4em;
    }
  }
  a {
    color: #04c942;
    transform: scale(1.1);
  }
`;

export const Neon = styled.a`
  margin: 1rem auto;
  animation: neon 1s ease infinite;

  @keyframes neon {
    0%,
    100% {
        text-shadow: 0 0 10px #ef00e3a8, 0 0 20px #ef00e3a8, 0 0 20px #ef00e3a8, 0 0 20px #ef00e3a8, 0 0 2px #fed128, 2px 2px 2px #806914;
        color: #c35b31;
    }
    50% {
        text-shadow: 0 0 2px #0c7f56, 0 0 5px #0c7f56, 0 0 5px #0c7f56, 0 0 5px #0c7f56, 0 0 2px #0c7f56, 4px 4px 2px #0c7f56;
        color: #b7bbf3;
    }
  }
`;
export const NeonIcon = styled.span`
  margin: 1rem auto;
  animation: neonIconFr 1s ease infinite;

  @keyframes neonIconFr {
    0%,
    100% {
        text-shadow: 0 0 10px #c52e0acc, 0 0 20px #c52e0acc, 0 0 20px #c52e0acc, 0 0 20px #c52e0acc, 0 0 2px #fed128, 2px 2px 2px #806914;
        color: #c35b31;
    }
    50% {
        text-shadow: 0 0 2px #04c942, 0 0 5px #04c942, 0 0 5px #04c942, 0 0 5px #04c942, 0 0 2px #04c942, 4px 4px 2px #04c942;
        color: #b7bbf3;
    }
  }
`;

export const variants = {
  hidden: { opacity: 0, y: -50 },
  visible: { opacity: 1, y: 0 },
};

export const menuVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      delay: 1,
      staggerChildren: 0.2,
    },
  },
};

export const menuItemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};
