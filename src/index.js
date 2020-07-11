import React, { Component } from 'react'
import { render } from 'react-dom'

import './index.scss'
class Demo extends Component {
  constructor(props) {
    super(props)
    this.state = {
      from: 0,
      to: 0,
      containerTop: 0,
      time: '',
      disableTime: ['01:15~04:00'],
    }
    this.wrap = React.createRef()
  }
  componentDidMount() {
    this.setState({
      containerTop: this.wrap.current.getBoundingClientRect().top,
    })
  }

  renderHourLine = () => {
    return Array(24)
      .fill('')
      .map((item, index) => {
        return (
          <div style={{ top: 20 * 4 * index }} className="hour-line-wrap">
            <span className="hour-text">{index}:00</span>

            <div className="hour-line"></div>
          </div>
        )
      })
  }
  renderCurrentTimeLine = () => {
    const hour = new Date().getHours()
    const min = new Date().getMinutes()
    const top = hour * 80 + (min / 15) * 20
    return (
      <div className="current-time-line-wrap" style={{ top: top }}>
        <span className="current-time-text">
          {`${hour}`.padStart(2, '0') + ':' + `${min}`.padStart(2, '0')}
        </span>
        <div className="current-time-line"></div>
      </div>
    )
  }
  renderFifTeenLine = () => {
    return Array(96)
      .fill('')
      .map((item, index) => {
        if (index % 4 == 0) return ''
        return (
          <line
            x1="0"
            y1={20 * index}
            x2="100%"
            y2={20 * index + 1}
            stroke="#eee"
            style={{ strokeWidth: 1 }}
          />
        )
      })
  }
  generateTimeRange = () => {
    const { from, to } = this.state
    let fromTime,
      toTime,
      hour,
      min,
      _hour,
      _min = 0
    if (from > to) {
      //向上
      hour = Math.floor(to / 80)
      min = ((from % 80) / 20) * 15
      _hour = Math.floor(from / 80)
      _min = ((from % 80) / 20) * 15
    } else {
      //向下

      hour = Math.floor(from / 80)
      min = ((from % 80) / 20) * 15
      _hour = Math.floor(to / 80)
      _min = ((to % 80) / 20) * 15
    }
    fromTime = this.formatTime(hour, min)
    toTime = this.formatTime(_hour, _min)
    this.setState({
      time: `${fromTime}~${toTime}`,
    })
  }
  formatTime = (hour, min) => {
    return `${hour}`.padStart(2, '0') + `:` + `${min}`.padStart(2, '0')
  }
  handleTouchMove = (e) => {
    const pageY = e.touches[0].pageY
    const _to =
      pageY % 20 >= 10
        ? Math.ceil(pageY / 20) * 20
        : Math.floor(pageY / 20) * 20

    this.setState(
      {
        to: _to,
      },
      () => {
        this.generateTimeRange()
      }
    )
  }
  renderBg = () => {
    return (
      <svg
        width="100%"
        height="1920"
        fill="gray"
        stroke-dasharray="2 2"
        viewBox="0 0 100% 1920"
        className="bg">
        {this.renderFifTeenLine()}
      </svg>
    )
  }
  handleTouchStart = (e) => {
    const pageY = e.touches[0].pageY
    if (
      e.target.contains(document.getElementsByClassName('btn')[0]) ||
      e.target.contains(document.getElementsByClassName('btn')[1])
    ) {
      return false
    }

    const _from =
      pageY % 20 >= 10
        ? Math.ceil(pageY / 20) * 20
        : Math.floor(pageY / 20) * 20
    this.setState(
      {
        from: _from,
        to: _from + 20,
      },
      () => {
        this.generateTimeRange()
      }
    )
  }
  handleCancel = (e) => {
    e.stopPropagation()
    e.nativeEvent.stopImmediatePropagation()
    const { handleCancel } = this.props
    if (typeof handleCancel === 'function') {
      handleCancel()
    }
    this.handleReset()
  }
  handleSubmit = (e) => {
    e.stopPropagation()
    e.nativeEvent.stopImmediatePropagation()
    const { time } = this.state
    const { onChange } = this.props
    console.log('selectedTimeRange：' + time)
    if (typeof onChange === 'function') {
      onChange(time)
    }
    this.handleReset()
  }
  handleReset = () => {
    this.setState({
      from: 0,
      to: 0,
    })
  }
  renderDisableTime = () => {
    const { disableTime } = this.state
    return disableTime.map((item) => {
      const { 0: from, 1: to } = item.split('~')
      const start = +from.slice(0, 2) * 80 + (+from.slice(-2) / 15) * 20
      const end = +to.slice(0, 2) * 80 + (+to.slice(-2) / 15) * 20
      return (
        <div
          className="disabled-time"
          style={{ top: start, height: end - start }}></div>
      )
    })
  }
  renderSelectedRange = () => {
    const { from, to, containerTop, time } = this.state
    let top,
      height = 0
    if (from > to) {
      //向上拖动
      top = to - containerTop
      height = from - to - containerTop
    } else {
      //向下拖动
      top = from - containerTop
      height = to - from - containerTop
    }
    return (
      <div
        className="selected-area"
        style={{
          top: top,
          height: height,
          display: to == 0 ? 'none' : 'block',
        }}>
        {time}
        <div className="submit-btn">
          <span onClick={this.handleCancel} className="btn">
            取消
          </span>
          <span onClick={this.handleSubmit} className="btn">
            {' '}
            预约
          </span>
        </div>
      </div>
    )
  }
  render() {
    return (
      <React.Fragment>
        <div
          ref={this.wrap}
          className="wrap"
          onTouchMove={this.handleTouchMove}
          onTouchStart={this.handleTouchStart}>
          {this.renderBg()}
          {this.renderHourLine()}
          {this.renderCurrentTimeLine()}
          {this.renderSelectedRange()}
          {this.renderDisableTime()}
        </div>
      </React.Fragment>
    )
  }
}

export default Demo

render(<Demo />, document.getElementById('app'))
