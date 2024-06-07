import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Container,
  Title,
  ProjectList,
  ProjectCard,
  Loader
} from '../styles/ProjectStyles';
import {
  Menu,
  menuVariants
} from '../styles/HomeStyles';
import { getAllRepos_v2, api_repo, Repository } from '../lib/client_github';

interface Repo {
  id: number;
  name: string;
  html_url: string;
  description: string;
}

const Projects: React.FC = () => {
  const [load, setLoading] = useState(false);

  useEffect(() => {
    async function fetchRepos() {
      const res = await getAllRepos_v2();
      if(res){
        setLoading(true)
      }
    }
    fetchRepos();
  }, [api_repo]);

  return (
    <Container>
      <Menu
      >
        <Link href="/">Home</Link>
        <Link href="/projects">Projects</Link>
      </Menu>
      <Title>Projects {load}</Title>
      <ProjectList>
        {api_repo.length < 1 && 
          <Loader><br />loading...<br /></Loader>
        }
        {api_repo.map((repo) => (
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

export default Projects;
