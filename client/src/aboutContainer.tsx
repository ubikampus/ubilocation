import React from 'react';
import { withRouter } from 'react-router';
import styled from 'styled-components';

/** Containers
–––––––––––––––––––––––––––––––––––––––––––––––––– --*/
const Container = styled.div`
  max-width: 800px;
  justify-content: center;
  margin: 5rem auto;
  padding: 15px 0 15px 0;
`;

const Article = styled.article`
  padding: 0 0 30px 0;
`;

/** Header
–––––––––––––––––––––––––––––––––––––––––––––––––– --*/
const HeaderRow = styled.ul`
  display: flex;
  flex-direction: column;
  justify-content: center;
  list-style-type: none;
  padding: 0 0 15px 0;

  @media (min-width: 750px) {
    flex-direction: row;
  }
`;

const HeaderColumn = styled.li`
  text-align: left;
  font-family: 'Helvetica', 'Arial', sans-serif;
`;

const Headline = styled.h1`
  font-family: 'Comfortaa', cursive;
  font-size: 40px;
`;

const Button = styled.button`
  border: none;
  margin: 5px;
  border-radius: 5px;
  padding: 10px 25px;
  color: #ffffff;
  text-transform: uppercase;
  font-weight: 700;
  background-color: #4287f5;
  font-family: 'Comfortaa', cursive;
  font-size: 11px;
  cursor: pointer;
  &:hover {
    background-color: #3670cf;
  }
`;

/** Lightweight Navigation bar 
–––––––––––––––––––––––––––––––––––––––––––––––––– --*/
const NavRow = styled.ul`
  display: flex;
  flex-direction: column;
  justify-content: left;
  list-style-type: none;
  border-bottom: 1px solid lightgray;
  border-top: 1px solid lightgray;
  @media (min-width: 750px) {
    flex-direction: row;
  }
`;

const NavColumn = styled.li`
  padding: 15px 15px 15px 0;
  text-align: left;
  font-family: 'Helvetica', 'Arial', sans-serif;
`;

const NavLink = styled.li`
  &:active {
    color: #4287f5;
  }
  &:hover {
    color: #4287f5;
  }
`;

/** Body
–––––––––––––––––––––––––––––––––––––––––––––––––– --*/
const BodyRow = styled.ul`
  display: flex;
  padding: 0 0 15px 0;
  flex-direction: column;
  list-style-type: none;
  justify-content: space-between;

  @media (min-width: 750px) {
    flex-direction: row;
  }
`;

const BodyColumn = styled.li`
  text-align: left;
  font-size: 15px;
  line-height: 1.6;
  font-family: 'Raleway', sans-serif;
`;

const HalfBodyColumn = styled.li`
  width: 49%;
  text-align: left;
  font-size: 15px;
  line-height: 1.6;
  font-family: 'Raleway', sans-serif;
  justify-content: space-between;
`;

const BodyHeadline = styled.h2`
  text-align: left;
  text-transform: uppercase;
  font-family: 'Comfortaa', cursive;
  font-weight: 700;
  font-size: 14px;
`;

const AboutContainer = () => (
  <>
    <Container>
      <Article>
        <HeaderRow>
          <HeaderColumn>
            <Headline>Ubikampus Location Service</Headline>
          </HeaderColumn>
        </HeaderRow>
        <HeaderRow>
          <HeaderColumn>
            <Button>Download</Button>
          </HeaderColumn>
        </HeaderRow>
      </Article>

      <Article>
        <NavRow>
          <NavColumn>
            <NavLink>Info X</NavLink>
          </NavColumn>
          <NavColumn>
            <NavLink>Info Y</NavLink>
          </NavColumn>
          <NavColumn>
            <NavLink>Info Z</NavLink>
          </NavColumn>
        </NavRow>
      </Article>

      <Article>
        <BodyRow>
          <BodyColumn>
            <BodyHeadline>Is Ubilocation for you?</BodyHeadline>
          </BodyColumn>
        </BodyRow>

        <BodyRow>
          <BodyColumn>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent
            ultrices, tortor vel volutpat placerat, lectus mauris tempus ex, non
            pharetra leo justo at odio. Etiam feugiat nibh nec nibh vehicula, et
            porta massa luctus. Fusce ut purus facilisis nunc ullamcorper
            gravida id vitae mauris. Nulla interdum dignissim risus, vitae
            placerat velit malesuada quis. Aenean eget nibh vitae sapien
            suscipit laoreet vel quis neque. Vestibulum v olutpat nisl sed orci
            venenatis, vel feugiat nibh posuere. Nam a enim gravida, aliquet
            magna vel, placerat mauris. Nam ut nisl in
          </BodyColumn>
        </BodyRow>
        <BodyRow>
          <HalfBodyColumn>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent
            ultrices, tortor vel volutpat placerat, lectus mauris tempus ex, non
            pharetra leo justo at odio. Etiam feugiat nibh nec nibh vehicula, et
            porta massa luctus. Fusce ut purus facilisis nunc ullamcorper
            gravida id vitae mauris. Nulla interdum dignissim risus, vitae
            placerat velit malesuada quis. Aenean eget nibh vitae sapien
            suscipit laoreet vel quis neque. Vestibulum v olutpat nisl sed orci
            venenatis, vel feugiat nibh posuere. Nam a enim gravida, aliquet
            magna vel, placerat mauris. Nam ut nisl in
          </HalfBodyColumn>
          <HalfBodyColumn>
            magna tempor cursus quis eget velit. Sed nunc nunc, convallis et
            tempus vel, finibus eu sem. Quisque sit amet ultrices mi, at
            ullamcorper purus. Nulla tristique augue a arcu dictum tincidunt.
            Etiam in sollicitudin nisi. In ut ex nunc. Praesent tellus magna,
            ultrices nec turpis a, hendrerit fringilla magna. Phasellus
            consequat dui sed neque sollicitudin varius. Nulla vitae volutpat
            ligula. Sed aliquet rhoncus nunc ut venenatis. Vivamus nibh risus,
            egestas vel tincidunt eu, imperdiet nec ex. Donec sit amet suscipit
            nisi. Curabitur bibendum leo quis sem eleifend fermentum. Fusce id
            imperdiet felis, ut aliquet magna. gravida id vitae mauris.
          </HalfBodyColumn>
        </BodyRow>
      </Article>
    </Container>
  </>
);

export default withRouter(AboutContainer);
