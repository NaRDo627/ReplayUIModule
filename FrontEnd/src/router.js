import React, {Component, Fragment} from 'react';
import { Route, Switch } from 'react-router-dom'
import Menu  from 'components/Menu'
import Pubg from 'pages/Pubg/index.js'
import Match from 'pages/Pubg/Match.js'
//import Matchtest from 'pages/Pubg/Matchtest.js'
import Lol from 'pages/Lol'
import About from 'pages/About'
import Home from 'pages/Home'
import styled from 'styled-components'
import { BrowserRouter } from 'react-router-dom';

const PaddingWrapper = styled.div`
    display: block;
    max-width: 1240px;
    margin: 0 auto;
    background-color: white;
`

const Wrapper = styled.div`
    display: grid;
    grid-template-rows: 7.5rem 1fr;
    grid-row-gap: 10px;
    margin: 0 20px;
    background-color: white;
`

const MainContainer = styled.div`
    grid-row: 2;
`

const RouteTo = ({component: Component, ...rest }) =>
    <Route
        {...rest}
        render={props => [
            <Menu />,
            <MainContainer className="container" key="mainContainer" id="MainContainer">
                <Component key="Component" {...props} />
            </MainContainer>,
        ]}
    />

class Router extends Component {
    render() {
        return (
            <BrowserRouter>
                <PaddingWrapper>
                    <Wrapper>
                        <Route exact path="/" component={Home}/>
                        <Route exact path="/about" component={About}/>
                        <Switch>
                            <RouteTo path="/pubg/:telemetryUrl" component={Match}/>
                            <RouteTo path="/pubg" component={Pubg}/>
                        </Switch>
                        <Switch>
                            <RouteTo path="/lol/:playerId/:platformrId:/matchId" component={Lol}/>
                            <RouteTo path="/lol/:playerId" component={Lol}/>
                            <RouteTo path="/lol" component={Lol}/>
                        </Switch>
                    </Wrapper>
                </PaddingWrapper>
            </BrowserRouter>
        )
    }
}

export default Router;