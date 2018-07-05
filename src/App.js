import React, { Component } from 'react';
import TopBar from './components/TopBar';
import { Switch, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import LockPage from './pages/LockPage';
import ErrorPage from './pages/ErrorPage';
import GiftPage from './pages/GiftPage';
import firebase from 'firebase';
import Snackbar from '@material-ui/core/Snackbar';

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

    render() {
        return (
            <div style={styles.container}>
                <TopBar/>
                <div style={{
                    flex: 1,
                    minHeight: '100vh',
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
    }
}

const styles = {
    container: {
        minHeight: '100vh !important',
        width: '100%',
        display: 'flex',
        flexDirection: 'column'
    }
};

export default App;
