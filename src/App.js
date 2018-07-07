import React, { Component } from 'react';
import TopBar from './components/TopBar';
import { Switch, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import LockPage from './pages/LockPage';
import ErrorPage from './pages/ErrorPage';
import GiftPage from './pages/GiftPage';
import firebase from 'firebase';
import Snackbar from '@material-ui/core/Snackbar';
import IPhoneX from './components/IPhoneX';
import Facebook from './images/facebook.png';
import Twitter from './images/twitter.png';

class App extends Component {

    state = {
        ready: false,
        open: false
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
                        this.setState({ id: data.id, name: `Guest #${data.id}`, credits: data.credits });
                    }
                });

                db.ref(`users/${uid}/messages`).on('child_added', ss => {
                    console.log(ss.val());
                    this.setState({ message: ss.val() }, () => this.setState({ open: true }));
                    setTimeout(() => this.setState({ open: false }), 3000);
                });
                setTimeout(() => this.setState({ ready: true }), 1000);
            }
        });
    }

    renderBody = () => {
        const isMobile = ('ontouchstart' in document.documentElement && navigator.userAgent.match(/Mobi/));

        return (
            <div style={styles.container}>
                <TopBar/>
                <div style={{
                    flex: 1,
                    minHeight: isMobile ? 'calc(100% - 72px - 100px)' : 'calc(100% - 102px - 100px)',
                    display: 'flex',
                    flexDirection: 'column'
                }}>
                    <Switch>
                        <Route exact path='/' component={HomePage}/>
                        <Route path='/lock' component={LockPage}/>
                        <Route path='/gift' component={GiftPage}/>
                        <Route path='/' component={ErrorPage}/>
                    </Switch>
                </div>

                <div style={{
                    fontSize: '14px',
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

                <Snackbar
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
                    open={this.state.open}
                    onClose={() => this.setState({ open: false })}
                    ContentProps={{
                        'aria-describedby': 'message-id',
                    }}
                    message={<span id="message-id">{this.state.message}</span>}
                />
            </div>
        );
    };

    render() {
        const isMobile = ('ontouchstart' in document.documentElement && navigator.userAgent.match(/Mobi/));

        if (isMobile) {
            return (
                <div style={{ height: '100vh', width: '100%', display: 'flex', flexDirection: 'column', position: 'relative !important' }}>
                    {this.renderBody()}
                </div>
            );
        }
        return (
            <div id="gradient">
                <IPhoneX>
                    {this.renderBody()}
                </IPhoneX>
            </div>
        );
    }
}

const styles = {
    container: {
        height: '100%',
        width: '100%',
        display: 'flex',
        flexDirection: 'column'
    }
};

export default App;
