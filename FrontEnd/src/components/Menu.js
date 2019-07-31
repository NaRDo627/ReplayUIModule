import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import styled from 'styled-components'
import logoImg from 'assets/logo.png'

const LogoImage = styled.img`
    width: 160px;
    height: auto;
`

const TopMenuContainer = styled.div`
    grid-row: 1;
    align-self: center;
    justify-self: center;
    width: 100%;
    display: grid;
    grid-template-columns: 160px 300px 1fr;
    grid-column-gap: 15px;
`

const HomeLink = styled(Link)`
    font-size: 2.2rem;
    font-weight: 400;
    color: #714868;
    position: relative;
    align-self: center;
    &:hover {
        color: #714868;
    }
    span {
        font-size: 1.9rem;
    }
`
const LeftLinks = styled.div`
    align-self: center;
    justify-self: start;
    a {
        text-decoration: none;
        text-transform: uppercase;
        font-size: 1.0rem;
        font-weight: 400;
        color: #222;
        grid-column: 2;
        margin-left: 15px;
        &:hover {
            color: #714868;
        }
    }
`

class Menu extends Component {
    render() {
        return(
            <TopMenuContainer>
                <div>
                    <HomeLink to ="/">
                        <LogoImage src={logoImg} />
                    </HomeLink>
                </div>
                <LeftLinks>
                    <Link to ="/lol">Lol</Link>
                    <Link to ="/pubg">Pubg</Link>
                </LeftLinks>
            </TopMenuContainer>
        );
    }
}

export default Menu;