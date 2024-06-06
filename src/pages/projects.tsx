import { GetStaticProps } from 'next';
import { getAllRepos } from '../lib/github';
import { motion } from 'framer-motion';
import {
  Container,
  Title,
  ProjectList,
  ProjectCard
} from '../styles/ProjectStyles';
import {
  Menu,
  menuVariants,
  menuItemVariants
} from '../styles/HomeStyles';

interface Repo {
  id: number;
  name: string;
  html_url: string;
  description: string;
}

interface ProjectsProps {
  repos: Repo[];
}

const Projects: React.FC<ProjectsProps> = ({ repos }) => {
  return (
    <Container>
      <Menu
        initial="visible"
        animate="visible"
        variants={menuVariants}
      >
        <motion.a href="/" variants={menuItemVariants}>Home</motion.a>
        <motion.a href="#" variants={menuItemVariants}>Projects</motion.a>
        <motion.a href="#contact" variants={menuItemVariants}>Contact</motion.a>
      </Menu>
      <Title>Projects</Title>
      <ProjectList>
        {repos.map((repo) => (
          <ProjectCard key={repo.id}>
             <h3>{repo.name}</h3>
              <p>{repo.description}</p>
              <a href={repo.html_url} target="_blank" rel="noopener noreferrer">View Repository</a>
          </ProjectCard>
        ))}
      </ProjectList>
    </Container>
  );
};

export const getStaticProps: GetStaticProps = async () => {
  const repos = await getAllRepos(`${process.env.GH_USERNAME}`);
  return {
    props: {
      repos,
    },
  };
};

export default Projects;
