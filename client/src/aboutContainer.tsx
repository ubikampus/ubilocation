import React from 'react';
import { withRouter } from 'react-router';
import styled from 'styled-components';
// TODO: add missing file
// import githubLogo from '../asset/GitHub-Mark-Light-64px.png';
import { PrimaryButton } from '../src/common/button';

/** Container */
const About = styled.div`
  max-width: 800px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin: auto;
  padding: 40px 0 0;

  @media (max-width: 840px) {
    margin: auto 2rem;
  }
`;

const Wrap = styled.div`
  width: 100vw;
  margin: auto;
`;

/** Header */
const Header = styled.article`
  width: auto;
  padding: 15px;

  text-align: center;
  font-family: 'Comfortaa', cursive;
`;

const Headline = styled.h1`
  padding-bottom: 15px;

  font-size: 40px;
`;

const ButtonComponent = styled(PrimaryButton)`
  height: 75px;
  width: 160px;

  background-color: #20262b;

  &:hover {
    background-color: #282e33;
  }
  &:active {
    background-color: #282e33;
  }
`;

/** GitHub button */
const ButtonText = styled.div`
  padding-top: 5px;

  font-size: 12px;
`;

const Logo = styled.img`
  height: 50%;
`;

/** Content */
const Body = styled.div`
  flex: 1 0 auto;
  padding-bottom: 25px;

  text-align: left;
  line-height: 1.6;

  & > div {
    padding-top: 15px;
  }
`;

const SplitContainer = styled.div`
  display: flex;

  @media (max-width: 575px) {
    flex-direction: column;
    justify-content: space-between;
  }

  & > div {
    max-width: 50%;
    @media (max-width: 575px) {
      max-width: 100%;
    }
  }

  & > div:first-child {
    padding-right: 30px;
    @media (max-width: 575px) {
      padding-right: 0px;
      padding-bottom: 15px;
    }
  }

  & > div:nth-child(2) {
    min-width: 50%;
  }
`;

/** Align text to center on mobile */
const Article = styled.div`
  & > * {
    @media (max-width: 575px) {
      text-align: center;
    }
  }
`;

const ArticleHeadline = styled.h2`
  display: flex;
  align-items: center;
  height: 33px;
  padding: 10px 0;
  padding: 0 15px;

  font-size: 16px;
  font-weight: 700;
  font-family: 'Comfortaa', cursive;
  text-transform: uppercase;
  border-bottom: 5px solid salmon;

  /** Align headlin text to center on mobile */
  @media (max-width: 575px) {
    text-align: center;
    justify-content: center;
  }
`;

const ArticleText = styled.div`
  padding: 15px;

  font-size: 15px;
  font-family: 'Raleway', sans-serif;
`;

const ArticleBoldText = styled(ArticleText)`
  font-weight: 700;
`;

/** Footer */
const Footer = styled.footer`
  display: flex;
  padding: 10px;
  height: 50px;
  width: 100%;
  align-items: center;
  justify-content: center;

  color: white;
  font-size: 13px;
  text-align: center;
  font-family: inherit;
  background-color: #20262b;
`;

const FooterText = styled.div``;

const AboutContainer = () => (
  <>
    <Wrap>
      <About>
        <Header>
          <Headline>Ubikampus Location Service</Headline>
          <a href="https://github.com/ubikampus/ubi-Indoor-Positioning">
            <ButtonComponent>
              <Logo src="TODO add real url" />
              <ButtonText>View on GitHub</ButtonText>
            </ButtonComponent>
          </a>
        </Header>

        <Body>
          <Article>
            <ArticleHeadline>What is Ubilocation?</ArticleHeadline>
            <ArticleText>
              Ubilocation is a Bluetooth-positioning system developed on the
              course Software Engineering Lab at the University of Helsinki,
              department of Computer Science. The aim of the project is to
              calculate campus visitors’ indoor position by using an inverse
              technique of collecting Bluetooth signals via minicomputers (in
              this case Android devices) placed on the floors, tables or walls.
              Ubilocation is part of the Ubikampus project and is built on the
              specifications and requirements of Ubikampus’ coordinator Petri
              Savolainen.
            </ArticleText>
            <ArticleBoldText>
              Please note that users need to carry Bluetooth beacons with them
              (the size of small, electronic keys) or download a beacon
              simulation app in order to be positioned.
            </ArticleBoldText>
          </Article>

          <SplitContainer>
            <Article>
              <ArticleHeadline>Contributing</ArticleHeadline>
              <ArticleText>
                Ubilocation is an Open Source project consisting of five code
                repositories: Android scanner, Indoor Positioning library, Room
                reservator, Ubilocation server and Ubilocation client. If you
                would like to develop the project further please visit
                Ubilocation’s GitHub page and submit an issue and/or pull
                request in one of the repositories.
              </ArticleText>
            </Article>

            <Article>
              <ArticleHeadline>Creators</ArticleHeadline>
              <ArticleText>
                Elizabeth Berg, UI/UX
                <br />
                Jere Lahelma, front-end
                <br />
                Matti Riekkinen, front-end
                <br />
                Atte Haarni, full-stack
                <br />
                Joni Kokko, back-end
                <br />
                Emil Andersson, back-end
                <br />
                Aleksander Matikainen, back-end
                <br />
              </ArticleText>
            </Article>
          </SplitContainer>
        </Body>
      </About>
      <Footer>
        <FooterText>&#169; University of Helsinki 2019</FooterText>
      </Footer>
    </Wrap>
  </>
);

export default withRouter(AboutContainer);
