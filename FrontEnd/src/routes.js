import React from 'react'
import { BrowserRouter, Route, Switch } from 'react-router-dom'
import styled from 'styled-components'
// import ReactGA from 'react-ga'
import LOL from './routes/LOL'
import PUBG from './routes/PUBG'
// import TopMenu from './components/TopMenu.js'
import * as Settings from './components/Settings.js'


const PaddingWrapper = styled.div`
    display: block;
    max-width: 1240px;
    margin: 0 auto;
`

const Wrapper = styled.div`
    display: grid;
    grid-template-rows: 7.5rem 1fr;
    grid-row-gap: 10px;
    margin: 0 20px;
`

const MainContainer = styled.div`
    grid-row: 2;
`

const RouteWithTopMenu = ({ hidePlayerSearch, component: Component, ...rest }) =>
    <Route
        {...rest}
        render={props => [
            <MainContainer className="container" key="mainContainer" id="MainContainer">
                <Component key="Component" {...props} />
            </MainContainer>,
        ]}
    />

// TODO: Collapse Options and Settings and move it out of here
class App extends React.Component { // eslint-disable-line
    /* eslint-disable react/no-unused-state */

    render() {
        return (
            <Settings.Context.Provider value={this.state}>
                <BrowserRouter>
                    <PaddingWrapper>
                        <Wrapper>
                            <Switch>
                                <RouteWithTopMenu path="/lol/:playerName/:matchId" component={LOL} />
                                <RouteWithTopMenu path="/pubg/:playerName/:platformId/:matchId" component={PUBG} />
                            </Switch>
                        </Wrapper>
                    </PaddingWrapper>
                </BrowserRouter>
            </Settings.Context.Provider>
        )
    }
}

export default App;
