import './App.css'
import styled from "styled-components";
import {SearchHeader} from "./components/SearchHeader.jsx";

function App() {
  return (
    <PageLayout>
      <SearchHeader/>
    </PageLayout>
  )
}

export default App

const PageLayout = styled.div`
  width: 100%;
  height: 100%;
`
