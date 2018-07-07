import React, { Component } from 'react';
import { Fade } from '@material-ui/core';
import Clock from '../images/clock.png';
import { Link } from 'react-router-dom';
import { Line } from 'react-chartjs-2';
import moment from 'moment';
import DATASET from '../data';
import { GridLoader } from 'react-spinners';

const Action = props => {
    const body = (
        <Fade in timeout={props.timeout}>
            <div style={{ flex: 1, display: 'flex', boxShadow: '0 2px 10px 0 rgba(0,0,0,0.3)', cursor: 'pointer' }}>
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

class LockPage extends Component {

    constructor(props) {
        super(props);

        console.log(moment());

        this.state = {
            ready: false,
            timer: 0,
            interval: undefined,
            curTime: moment(),
            height: undefined
        };
    }

    componentDidMount() {
        setTimeout(() => this.setState({ ready: true }), 1000);
        setTimeout(() => this.setState({ curTime: moment() }), 60000);
    }

    setTimerr = timer => () => {
        if (this.state.interval) {
            clearInterval(this.state.interval);
        }
        this.setState({ ready: false });

        setTimeout(() => this.setState({
            ready: true,
            height: 0,
            timer,
            interval: setInterval(() => this.setState({ timer: this.state.timer - 1 }), 1000)
        }), 1000);
    };

    renderTimer = curPrice => {
        const h = Math.floor(this.state.timer / 60) % 60;
        const m = this.state.timer % 60;

        return (
            <Fade in timeout={500}>
                <div style={{ marginTop: 8 }}>
                    <h1><strong style={{ color: '#2ECC40' }}>Success!</strong></h1>
                    <br/>
                    <h2><strong style={{ color: (curPrice > 0 ? '#2ecc71' : (curPrice < 0 ? '#e74c3c' : '#f39c12')) }}>
                        {curPrice.toFixed(2)}%
                    </strong>&nbsp;discount
                    for {Math.floor(this.state.timer / 3600)}:{h > 10 ? h : `0${h}`}:{m > 10 ? m : `0${m}`}
                    </h2>
                </div>
            </Fade>
        );
    };

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

        let dataset = DATASET;

        dataset.labels = dataset.labels.filter((el, i) => dataset.labels[ i ] <= moment('2018-07-06 15:00', 'YYYY-MM-DD HH:mm').format('HH:mm'));
        dataset.datasets[ 0 ].data = dataset.datasets[ 0 ].data.filter((el, i) => dataset.labels[ i ] <= moment('2018-07-06 15:00', 'YYYY-MM-DD HH:mm').format('HH:mm'));

        const curPrice = dataset.datasets[ 0 ].data[ dataset.datasets[ 0 ].data.length - 1 ];

        return (
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: 16 }}>
                    <Fade in mountOnEnter unmountOnExit>
                        <h2 style={{ color: '#555' }}>Lock Energy Prices</h2>
                    </Fade>

                    <Line data={dataset}/>

                    <Fade in mountOnEnter unmountOnExit timeout={500}
                          style={{ display: this.state.height === 0 ? 'none' : undefined }}>
                        <p style={{ marginTop: 0 }}>Current Discount:&nbsp;
                            <strong
                                style={{ color: (curPrice > 0 ? '#2ecc71' : (curPrice < 0 ? '#e74c3c' : '#f39c12')) }}>
                                {curPrice.toFixed(2)}%
                            </strong>
                        </p>
                    </Fade>

                    <div style={{
                        marginTop: 16,
                        display: this.state.height === 0 ? 'none' : 'flex',
                        alignItems: 'center',
                        transition: 'all 0.2s ease-in-out',
                        height: this.state.height
                    }}>
                        <Action onClick={this.setTimerr(60 * 60)} img={Clock} style={{ backgroundColor: '#27ae60' }}
                                timeout={1000}>
                            1 hour
                        </Action>
                        <Action onClick={this.setTimerr(60 * 60 * 2)} img={Clock}
                                style={{ backgroundColor: '#e67e22' }}
                                timeout={1000}>
                            2 hours
                        </Action>
                    </div>

                    <div style={{
                        marginTop: 8,
                        display: this.state.height === 0 ? 'none' : 'flex',
                        alignItems: 'center',
                        transition: 'all 0.2s ease-in-out',
                        height: this.state.height
                    }}>
                        <Action onClick={this.setTimerr(60 * 60 * 3)} img={Clock}
                                style={{ backgroundColor: '#e74c3c' }}
                                timeout={1000}>
                            3 hours
                        </Action>
                        <div style={{ flex: 1, margin: '0px 4px' }}/>
                    </div>

                    {this.state.timer > 0 ? this.renderTimer(curPrice) : <div/>}
                </div>
            </div>
        );
    }
}

export default LockPage;
