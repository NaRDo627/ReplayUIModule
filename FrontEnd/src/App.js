import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom'
import Menu  from 'components/Menu'
import Pubg from 'pages/Pubg/index.js'
import Match from 'pages/Pubg/Match.js'
import Matchtest from 'pages/Pubg/Matchtest.js'
import Lol from 'pages/Lol'
import About from 'pages/About'
import Home from 'pages/Home'
import styled from 'styled-components'

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

class App extends Component {
    render() {
        return (
            <PaddingWrapper>
                <Wrapper>
                    <Menu />
                    <Route exact path="/" component={Home}/>
                    <Route path="/about" component={About}/>
                    <Switch>
                        <Route path="/pubg/:telemetryUrl" component={Matchtest}/>
                        <Route path="/pubg" component={Pubg}/>
                    </Switch>
                    <Switch>
                        <Route path="/lol/:playerId/:platformrId:/matchId" component={Lol}/>
                        <Route path="/lol/:playerId" component={Lol}/>
                        <Route path="/lol" component={Lol}/>
                    </Switch>
                    
                </Wrapper>
            </PaddingWrapper>
        );
    }
}

export default App;