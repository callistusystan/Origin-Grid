import React, { Component } from 'react';
import { Fade } from '@material-ui/core';
import Solar from '../images/solar-panel.png';
import Battery from '../images/battery.png';
import Lock from '../images/locked.png';
import Gift from '../images/gift.png';
import Facebook from '../images/facebook.png';
import Twitter from '../images/twitter.png';
import Chart from '../images/bars-chart.png';
import { Link } from 'react-router-dom';
import firebase from 'firebase';
import { GridLoader } from 'react-spinners';

const Action = props => {
    return (
        <Link to={props.to} style={{ textDecoration: 'none', flex: 1, margin: '0px 4px', display: 'flex' }}>
            <Fade in timeout={props.timeout}>
                <div style={{ flex: 1, display: 'flex', boxShadow: '0 2px 10px 0 rgba(0,0,0,0.3)' }}>
                    <div style={{
                        height: 120,
                        flex: 1,
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        backgroundColor: '#e74c3c',
                        padding: '8px 16px',
                        ...props.style
                    }}>
                        <h3 style={{ color: '#FFF' }}>{props.children}</h3>
                        <img src={props.img} style={{ marginLeft: 4, width: 40, height: 40 }}/>
                    </div>
                </div>
            </Fade>
        </Link>
    );
};

class HomePage extends Component {
    state = {
        ready: false,
        name: null
    };

    componentDidMount() {
        firebase.auth().onAuthStateChanged(user => {
            if (user) {
                const uid = user.uid;
                const db = firebase.database();
                const ref = db.ref(`users/${uid}`);
                ref.on('value', ss => {
                    const data = ss.val();
                    if (data) {
                        this.setState({ name: `Guest #${data.id}` });
                    }
                });
                setTimeout(() => this.setState({ ready: true }), 1000);
            }
        });
    }

    render() {
        if (!this.state.ready) {
            return (
                <div style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <GridLoader
                        color={'#ffb432'}
                        loading={!this.state.ready}
                    />
                </div>
            );
        }

        return (
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', marginTop: 70 }}>
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: 16 }}>
                    <Fade in mountOnEnter unmountOnExit>
                        <h2 style={{ color: '#555' }}>Welcome back, {this.state.name}</h2>
                    </Fade>
                    <Fade in mountOnEnter unmountOnExit timeout={200}>
                        <p style={{ marginTop: 8 }}>What would you like to do today?
                        </p>
                    </Fade>

                    <div style={{ marginTop: 16, display: 'flex', alignItems: 'center' }}>
                        <Action to='/solar' img={Solar} style={{ backgroundColor: '#e74c3c' }} timeout={400}>
                            Subscribe for Solar
                        </Action>
                        <Action to='/battery' img={Battery} style={{ backgroundColor: '#f39c12' }} timeout={600}>
                            Home Battery Plans
                        </Action>
                    </div>

                    <div style={{ marginTop: 8, display: 'flex', alignItems: 'center' }}>
                        <Action to='/lock' img={Lock} style={{ backgroundColor: '#2980b9' }} timeout={800}>
                            Lock Energy Prices
                        </Action>
                        <Action to='/gift' img={Gift} style={{ backgroundColor: '#27ae60' }} timeout={1000}>
                            Gift Energy
                        </Action>
                    </div>

                    <div style={{ marginTop: 8, display: 'flex', alignItems: 'center' }}>
                        <Action to='/usage' img={Chart} style={{ backgroundColor: '#8e44ad' }} timeout={1200}>
                            View my Usage
                        </Action>
                        <div style={{ flex: 1, margin: '0px 4px' }}/>
                    </div>
                </div>

                <div style={{ flex: 1 }}/>

                <div style={{
                    height: 80,
                    justifySelf: 'flex-end',
                    justifyContent: 'center',
                    alignItems: 'center',
                    padding: '8px 16px',
                    display: 'flex',
                    boxShadow: '0 0 2px rgba(0, 0, 0, 0.3)'
                }}>
                    <p style={{ letterSpacing: 2 }}>SHARE WITH FRIENDS AND GET A <strong>20%</strong> DISCOUNT!</p>
                    <img src={Facebook} style={{ marginLeft: 12, width: 40, height: 40 }}/>
                    <img src={Twitter} style={{ marginLeft: 12, width: 40, height: 40 }}/>
                </div>
            </div>
        );
    }
}

export default HomePage;
