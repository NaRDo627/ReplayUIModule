import React, {Component, Fragment} from 'react';
import { Route, Switch } from 'react-router-dom'
import Menu  from 'components/Menu'
import Pubg from 'pages/Pubg/index.js'
import Lol from 'pages/Lol'
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
                        <RouteTo exact path="/" component={Home}/>
                        <Switch>
                            <RouteTo path="/pubg/:playerId/:shardId/:matchId" component={Pubg}/>
                            <RouteTo path="/pubg" exact component={Pubg}/>
                        </Switch>
                        <Switch>
                            <RouteTo path="/lol/:playerId/:regionId/:matchId" component={Lol}/>
                            <RouteTo path="/lol" component={Lol}/>
                        </Switch>
                    </Wrapper>
                </PaddingWrapper>
            </BrowserRouter>
        )
    }
}

export default Router;