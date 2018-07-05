import _ from 'lodash';
import React, { Component } from 'react';
import firebase from 'firebase';
import { GridLoader } from 'react-spinners';
import { Fade } from '@material-ui/core';
import Facebook from '../images/facebook.png';
import Twitter from '../images/twitter.png';
import { Link } from 'react-router-dom';
import User from '../images/user.png';
import Credit from '../images/credit-card.png';
import Snackbar from '@material-ui/core/Snackbar';

const COLORS = ['#c0392b','#d35400','#f39c12','#27ae60','#2980b9','#9b59b6','#34495e'];
const COLORS2 = ['#2ecc71','#f39c12','#d35400','#e74c3c','#c0392b','#9b59b6','#34495e'];

const Action = props => {
    const body = (
        <Fade in timeout={props.timeout} style={{ marginTop: 8, minWidth: 120 }}>
            <div style={{ flex: 1, display: 'flex', boxShadow: '0 2px 10px 0 rgba(0,0,0,0.3)' }}>
                <div style={{
                    height: 80,
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
    );

    if (props.to) {
        return (
            <Link to={props.to} style={{ textDecoration: 'none', flex: 1, margin: '0px 4px', display: 'flex' }}>
                {body}
            </Link>
        );
    } else if (props.onClick) {
        return (
            <div onClick={props.onClick}
                 style={{ textDecoration: 'none', flex: 1, margin: '0px 4px', display: 'flex' }}>
                {body}
            </div>
        );
    } else return body;
};

class GiftPage extends Component {

    constructor(props) {
        super(props);

        this.state = {
            ready: false,
            name: null,
            credits: 0,
            users: {},
            donateView: false,
            targetUser: null,
            transactions: {}
        };

        const db = firebase.database();
        const ref = db.ref(`users/`);
        ref.on('value', ss => {
            this.setState({ users: ss.val() });
        });
    }

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

                        db.ref(`users/${uid}/messages`).on('child_added', ss => {
                            console.log(ss.val());
                            this.setState({ open: true, message: ss.val() });
                            setTimeout(() => this.setState({ open: false }), 3000);
                        });
                    }
                });
                setTimeout(() => this.setState({ ready: true }), 1000);
            }
        });
    }

    donate = (ref, inc, message) => {
        return ref.transaction(data => {
            data.credits += inc;
            if (!data.messages) data.messages = {};
            data.messages[`${Date.now()}`] = message;
            return data;
        });
    };

    renderValues = () => {
        const values = [10, 20, 50, 100, 200];
        return _.map(values, (val, i) => {
            const backgroundColor = COLORS2[i%7];
            return (
                <Action onClick={() => {
                    this.setState({ donateView: false, ready: false });

                    const db = firebase.database();
                    const ref = db.ref(`users/${this.state.targetUser}`);

                    this.donate(ref, val, `Guest #${this.state.id} has given ${val} credits to you!`).then(ss => this.setState({ ready: true, credits: this.state.credits - val }));

                    const targetUserId = this.state.users[this.state.targetUser].id;

                    this.setState({ open: true, message: `You have given ${val} credits to Guest #${targetUserId}!` });

                    setTimeout(() => this.setState({ open: false }), 3000);
                }} img={Credit} style={{ backgroundColor }}
                        timeout={i*200}
                >
                    {val} Credits
                </Action>
            );
        });
    };

    renderDonate = () => {
        return (
            <div style={{ marginTop: 28, display: 'flex', flexWrap: 'wrap' }}>
                {this.renderValues()}
                <div style={{ flex: 1, marginLeft: '0px 4px', minWidth: 120 }} />
            </div>
        );
    };

    renderUsers = () => {
        let i = 0;
        return _.map(this.state.users, (user, key) => {
            if (user.id === this.state.id) return <div />;
            i += 200;
            const backgroundColor = COLORS[Math.floor(i/200)%7];
            return (
                <Action onClick={() => this.setState({ donateView: true, targetUser: key })} img={User} style={{ backgroundColor }}
                        timeout={i}
                >
                    Guest #{user.id}
                </Action>
            );
        });
    };

    renderUserList = () => {
        return (
            <div style={{ marginTop: 28, display: 'flex', flexWrap: 'wrap' }}>
                {this.renderUsers()}
                <div style={{ flex: 1, marginLeft: '0px 4px', minWidth: 120 }} />
            </div>
        );
    };

    render() {
        if (!this.state.ready || !this.state.name || _.isEmpty(this.state.users)) {
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
                        <h2 style={{ color: '#555' }}>Hi {this.state.name}</h2>
                    </Fade>

                    <Fade in mountOnEnter unmountOnExit timeout={500} >
                        <p style={{ marginTop: 0 }}>You have <strong>{this.state.credits}</strong> excess energy credits!</p>
                    </Fade>

                    <Fade in mountOnEnter unmountOnExit timeout={500}>
                        <h3 style={{ color: '#555', marginTop: 24 }}>Would you like to share some of that good energy?</h3>
                    </Fade>

                    {this.state.donateView ? this.renderDonate() : this.renderUserList()}
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

export default GiftPage;
