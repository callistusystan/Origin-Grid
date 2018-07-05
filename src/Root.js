import React, { Component } from 'react';
import firebase from 'firebase';
import { Provider } from 'react-redux';
import { BrowserRouter as Router } from 'react-router-dom';
import { createStore, applyMiddleware } from 'redux';
import App from './App';
import reducers from './reducers';

const createStoreWithMiddleware = applyMiddleware()(createStore);

class Root extends Component {
    constructor(props) {
        super(props);

        const config = {
            apiKey: 'AIzaSyBU0PbI_FhlNG-sfuB41kC6WW8mX31hUV0',
            authDomain: 'origin-grid.firebaseapp.com',
            databaseURL: 'https://origin-grid.firebaseio.com',
            projectId: 'origin-grid',
            storageBucket: '',
            messagingSenderId: '822196235606'
        };
        firebase.initializeApp(config);

        firebase.auth().signInAnonymously().then(({ user }) => {
            const db = firebase.database();
            const ref = db.ref(`users/${user.uid}`);
            ref.once('value', ss => {
                const data = ss.val();
                if (!data) {
                    this.getId().then(({ snapshot }) => {
                        ref.set({
                            id: snapshot.val(),
                            credits: 842
                        });
                    });
                }
            });
        });
    }

    getId = idRef => {
        const db = firebase.database();
        const ref = db.ref(`id`);
        const id = ref.transaction(val => {
            return val + 1;
        });
        return id;
    };

    render() {
        return (
            <Provider store={createStoreWithMiddleware(reducers)}>
                <Router>
                    <App/>
                </Router>
            </Provider>
        );
    }
}

export default Root;
