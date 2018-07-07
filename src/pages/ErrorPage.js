import React, { Component } from 'react';
import { Fade } from '@material-ui/core';
import Facebook from '../images/facebook.png';
import Twitter from '../images/twitter.png';
import { Link } from 'react-router-dom';
import Kitty from '../images/kitty.png';
import { GridLoader } from 'react-spinners';

class ErrorPage extends Component {

    state = {
        ready: true
    };

    componentDidMount() {
        setTimeout(() => this.setState({ ready: true }), 1000);
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
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                <div style={{
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    padding: 16
                }}>

                    <img src={Kitty} style={{ width: 150, height: 150 }}/>

                    <Fade in mountOnEnter unmountOnExit>
                        <h1 style={{ color: 'red', textAlign: 'center' }}>404: Page not found!</h1>
                    </Fade>

                    <Fade in mountOnEnter unmountOnExit timeout={500}>
                        <div>
                            <p style={{ marginTop: 16, textAlign: 'center' }}>Oh no! It appears that this page has not
                                been implemented yet!</p>

                            <p style={{ color: '#555', marginTop: 32, textAlign: 'center' }}>Click <Link to='/' style={{ color: '#0074D9' }}>here</Link> to return to homepage
                            </p>
                        </div>
                    </Fade>
                </div>
            </div>
        );
    }
}

export default ErrorPage;
