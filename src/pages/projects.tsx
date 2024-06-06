import { GetStaticProps } from 'next';
import { getAllRepos } from '../lib/github';
import {
  Container,
  Title,
  ProjectList,
  ProjectCard
} from '../styles/ProjectStyles';

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
