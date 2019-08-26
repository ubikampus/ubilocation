import React from 'react';
import { withRouter } from 'react-router';
import styled from 'styled-components';
import githubLogo from '../asset/GitHub-Mark-Light-64px.png';
import { PrimaryButton } from '../src/common/button';

/** Container */
const About = styled.div`
  max-width: 800px;

  display: flex;
  flex-direction: column;
  justify-content: center;
  margin: auto;
  padding: 45px 0;

  @media (max-width: 840px) {
    margin: auto 2rem;
  }
`;

const Wrap = styled.div`
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

const Divider = styled.div`
  padding-top: 20px;
  border-bottom: 1px solid lightgray;
`;

/** Content */
const Content = styled.div`
  text-align: left;
  line-height: 1.6;

  & > div {
    padding-top: 15px;
  }
`;

const SplitContent = styled.div`
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

const ContentItem = styled.div`
  & > * {
    @media (max-width: 575px) {
      text-align: center;
    }
  }
`;

const ContentHeadline = styled.h2`
  display: flex;
  align-items: center;
  height: 33px;
  padding: 10px 0;
  border-radius: 10px;
  padding: 0 15px;

  font-size: 16px;
  font-weight: 700;
  text-transform: uppercase;
  font-family: 'Comfortaa', cursive;
  background-color: salmon;

  @media (max-width: 575px) {
    justify-content: center;
    text-align: center;
  }
`;

const ContentText = styled.div`
  padding: 15px;

  font-size: 15px;
  font-family: 'Raleway', sans-serif;
`;

/** Footer */
const Footer = styled.footer`
  display: flex;
  margin: 0;
  justify-content: center;
  width: 100%;
  height: 40px;
  background-color: #20262b;
  color: white;
  font-size: 13px;
  text-align: center;
`;

const AboutContainer = () => (
  <>
    <Wrap>
      <About>
        <Header>
          <Headline>Ubikampus Location Service</Headline>
          <ButtonComponent>
            <Logo src={githubLogo} />
            <ButtonText>View on GitHub</ButtonText>
          </ButtonComponent>
        </Header>

        <Content>
          <ContentItem>
            <ContentHeadline>What is Ubilocation?</ContentHeadline>
            <ContentText>
              Ubilocation is a Bluetooth-positioning system developed on the
              course Software Engineering Lab at the University of Helsinki,
              department of Computer Science. The aim of the project is to
              calculate campus visitors’ indoor position by using an inverse
              technique of collecting Bluetooth signals via minicomputers such
              as Raspberry PIs placed on the walls. Ubilocation is part of the
              Ubikampus project and is built on the specifications and
              requirements of Ubikampus’ coordinator Petri Savolainen.
              <br />
              <br />
              Please note that users need to carry Bluetooth beacons with them
              (the size of small, electronic keys) or download a beacon
              simulation app in order to be positioned.
            </ContentText>
          </ContentItem>

          <SplitContent>
            <ContentItem>
              <ContentHeadline>Contributing</ContentHeadline>
              <ContentText>
                Ubilocation is an Open Source project consisting of three
                code repositories: Android scanner, Ubilocation
                library and an user application. If you would like to develop the
                project further please visit Ubilocation’s GitHub page and
                submit an issue and/or pull request in one of the repositories.
                <br />
                <br />
                Android Scanner
                <br />
                Ubilocation Library
                <br />
                Ubilocation User Application
              </ContentText>
            </ContentItem>

            <ContentItem>
              <ContentHeadline>Creators</ContentHeadline>
              <ContentText>
                Elizabeth Berg, UI/UX<br />
                Jere Lahelma, front-end<br />
                Matti Riekkinen, front-end<br />
                Atte Haarni, full-stack<br />
                Joni Kokko, back-end<br />
                Emil Andersson, back-end<br />
                Aleksander Matikainen, back-end<br />
              </ContentText>
            </ContentItem>
          </SplitContent>
        </Content>
      </About>

      <Footer>Helsingin yliopisto 2019</Footer>
    </Wrap>
  </>
);

export default withRouter(AboutContainer);
