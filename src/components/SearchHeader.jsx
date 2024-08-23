import styled from "styled-components";

export const SearchHeader = () => {
  return (
    <Wrapper>
      <Elements>
        <SearchInput/>
      </Elements>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;

  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 10;
`;

const Elements = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  
  padding: 8px;
`;

const SearchInput = styled.input`
  width: 100%;
  border: none;
  background: #F6F6F6;
  border-radius: 6px;
  height: 40px;
`;
