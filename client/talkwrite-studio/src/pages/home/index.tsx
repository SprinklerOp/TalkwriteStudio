import * as React from 'react';
import styled, { createGlobalStyle, ThemeProvider } from 'styled-components';
import Switch from 'react-switch'; // Updated import
import { Link } from 'react-router-dom';
import Logo from '../../components/atoms/logo/logo';

const GlobalStyle = createGlobalStyle`
  body {
    background-color: ${(props) => (props.theme.darkMode ? '#111' : '#f4f4f4')};
    color: ${(props) => (props.theme.darkMode ? '#fff' : '#333')};
    font-family: 'Arial', sans-serif;
    transition: background-color 0.3s ease, color 0.3s ease;
  }
`;

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px;
  background-color: ${(props) => (props.theme.darkMode ? '#111' : '#f4f4f4')};
`;

const Header = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 40px;
`;

const Title = styled.h1`
  font-size: 48px;
  margin: 0;
  color: #ff4500;
  text-shadow: ${(props) =>
    props.theme.darkMode ? '2px 2px 4px rgba(255, 255, 255, 0.7)' : 'none'};
  transition: text-shadow 0.3s ease;
`;

const DarkModeToggle = styled.div`
  display: flex;
  align-items: center;
  color: ${(props) => (props.theme.darkMode ? '#fff' : '#333')};
`;

const Nav = styled.nav`
  margin-top: 40px;
  display: flex;
  justify-content: space-around;
`;

const NavLink = styled(Link)`
  text-decoration: none;
  color: ${(props) => (props.theme.darkMode ? '#fff' : '#333')};
  font-size: 24px;
  margin: 0 20px;
  transition: color 0.3s ease;

  &:hover {
    color: #ff4500;
    font-weight: bold;
  }
`;

const Section = styled.section`
  margin-top: 60px;
`;

const About = styled.div`
  text-align: center;
  padding: 20px;
  background-color: ${(props) => (props.theme.darkMode ? '#222' : '#fff')};
  border-radius: 12px;
  box-shadow: ${(props) =>
    props.theme.darkMode ? '0 0 20px rgba(255, 255, 255, 0.1)' : 'none'};

  h2 {
    font-size: 36px;
    margin-bottom: 20px;
    color: #ff4500;
  }

  p {
    font-size: 18px;
    color: ${(props) => (props.theme.darkMode ? '#ccc' : '#666')};
  }
`;

const Contact = styled.div`
  text-align: center;
  background-color: ${(props) => (props.theme.darkMode ? '#222' : '#fff')};
  border-radius: 12px;
  padding: 20px;
  margin-top: 40px;
  box-shadow: ${(props) =>
    props.theme.darkMode ? '0 0 20px rgba(255, 255, 255, 0.1)' : 'none'};

  h2 {
    font-size: 36px;
    margin-bottom: 20px;
    color: #ff4500;
  }

  p {
    font-size: 18px;
    color: ${(props) => (props.theme.darkMode ? '#ccc' : '#666')};
  }
`;

const FeatureSection = styled.div`
  display: flex;
  justify-content: space-around;
  margin-top: 60px;
`;

const Feature = styled.div`
  text-align: center;
  flex: 1;
  padding: 40px;
  border: 2px solid #555;
  border-radius: 12px;
  margin: 0 40px;
  transition: transform 0.3s ease, box-shadow 0.3s ease;

  &:hover {
    transform: translateY(-10px);
    box-shadow: 0 0 20px rgba(0, 0, 0, 0.3);
  }

  h3 {
    font-size: 28px;
    margin-bottom: 20px;
    color: #ff4500;
  }

  p {
    font-size: 18px;
    color: ${(props) => (props.theme.darkMode ? '#ccc' : '#666')};
  }
`;

const Home: React.FC = () => {
  const [darkMode, setDarkMode] = React.useState(false);

  const toggleDarkMode = () => {
    setDarkMode((prevMode) => !prevMode);
  };

  return (
    <ThemeProvider theme={{ darkMode }}>
      <GlobalStyle />
      <Container>
        <Header>
          <Logo />
          <Title>TalkWrite Studio</Title>
          <DarkModeToggle>
            <Switch onChange={toggleDarkMode} checked={darkMode} />
          </DarkModeToggle>
        </Header>
        <Nav>
          <NavLink to="/about">About</NavLink>
          <NavLink to="/contact">Contact Us</NavLink>
          <NavLink to="/login">Login</NavLink>
          <NavLink to="/register">Register</NavLink>
        </Nav>

        <Section>
          <About>
            <FeatureSection>
              <Feature>
            <h2>About TalkWrite Studio</h2>
            <p>
              Revolutionizing document creation and collaboration, TalkWrite Studio is your go-to platform.
            </p>
            <p>
              Whether solo or in a team, our real-time collaboration feature ensures an efficient workflow.
              Enjoy the convenience of voice typing, creating documents hands-free.
            </p>
            <p>
              Join us in transforming document creation. Welcome to TalkWrite Studio!
            </p>
            </Feature>
            </FeatureSection>
          </About>
        </Section>

        <Section>
          <Contact>
            <FeatureSection>
          <Feature>

            <h2>Contact Us</h2>
            <p>
              Need assistance or have a question? Contact our support team.
            </p>
            </Feature>
            </FeatureSection>
          </Contact>
        </Section>

        <Section>
          <h5>Explore Our Features</h5>
          <FeatureSection>
            <Feature>
              <h3>Real-time Collaboration</h3>
              <p>Work together seamlessly with real-time collaboration.</p>
            </Feature>
            <Feature>
              <h3>Voice Typing</h3>
              <p>Experience hands-free document creation with voice typing.</p>
            </Feature>
          </FeatureSection>
        </Section>
      </Container>
    </ThemeProvider>
  );
};

export default Home;
