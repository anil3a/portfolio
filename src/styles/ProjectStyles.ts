import styled from 'styled-components';

export const Container = styled.div`
  padding: 20px;
  background-color: #121212;
  color: #fff;
  min-height: 100vh;
`;

export const Title = styled.h1`
  font-size: 2em;
  margin-bottom: 20px;
`;

export const ProjectList = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
`;

export const ProjectCard = styled.div`
  padding: 20px;
  background: #1e1e1e;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s;

  &:hover {
    transform: translateY(-5px);
  }
`;
