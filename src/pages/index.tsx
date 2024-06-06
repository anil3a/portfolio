import {
  Container,
  AbstractBackground,
  NameTitle,
  Menu,
  variants,
  menuVariants,
  menuItemVariants,
  Description,
  NeonIcon,
  Neon
} from '../styles/HomeStyles';
import { motion } from 'framer-motion';

const Home = () => {
  return (
    <Container>
      <AbstractBackground />
      <NameTitle
        initial="hidden"
        animate="visible"
        variants={variants}
        transition={{ duration: 1 }}
      >
        <h1>
          Anil Prajapati 
          <img alt='Anil Prajapati - Software Engineer' width={40} height={40}
            src='https://avatars.githubusercontent.com/u/2561627?v=4' />
        </h1>
        <h2>Software Engineer</h2>
      </NameTitle>
      <Menu
        initial="hidden"
        animate="visible"
        variants={menuVariants}
      >
        <motion.a href="#" variants={menuItemVariants}>Home</motion.a>
        <motion.a href="#projects" variants={menuItemVariants}>Projects</motion.a>
        <motion.a href="#contact" variants={menuItemVariants}>Contact</motion.a>
      </Menu>
      <Description>
        <div>
          <p>I'm a professional software engineer with a passion for building innovative solutions and automating processes. 
            My work spans across various technologies and domains, always aiming to create efficient, scalable, and maintainable software. 
            I enjoy tackling complex problems, learning new skills, and collaborating with others to turn ideas into reality.
          </p>
          <br />
          <ul>
            <li><NeonIcon>🌱</NeonIcon> I’m currently programming in various programming languages: Python, PHP and JavaScript.</li>
            <li><NeonIcon>🔭</NeonIcon> I’m currently working on open-source projects and personal initiatives.</li>
            <li><NeonIcon>👯</NeonIcon> I’m looking to collaborate on exciting and impactful projects.</li>
            <li><NeonIcon>💬</NeonIcon> Ask me about software development, automation, and cutting-edge technologies.</li>
            <li><NeonIcon>📫</NeonIcon> How to reach me: 
              <Neon href="https://www.linkedin.com/in/mr-anil-prajapati/">@anilprz</Neon>
            </li>
            <li><NeonIcon>⚡</NeonIcon> Fun fact:  I love car racing, listen music, and exploring the latest advancements in artificial intelligence and machine learning.</li>
          </ul>
        </div>
      </Description>
    </Container>
  );
};

export default Home;
