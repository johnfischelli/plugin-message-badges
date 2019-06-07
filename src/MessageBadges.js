import React from 'react';

const badgeStyles = {
  padding: '6px',
  margin: '-46px 0px 0px',
  color: '#fff',
  background: '#f00',
  fontWeight: 'bold',
  fontSize: '1.5rem',
  display: 'block',
  float: 'right'
};

export default class MessageBadges extends React.Component {
  constructor(props) {
    super();
    this.state = {
      unreadCount: 0
    }
    this.props = props;
  }

  componentDidMount() {
    const { selected, flex, task, manager } = this.props;

    flex.Actions.addListener('afterSelectTask', (payload) => {
      if (payload.task && payload.task.taskSid === task.taskSid) {
        this.setState({
          unreadCount: 0
        })
        window.selectedTaskSid = this.props.selectedTaskSid;
      }
    })

    setTimeout(() => {
      manager.chatClient.getChannelBySid(task.attributes.channelSid).then((source) => {
        // if the component renders and the task is selected
        if (selected) {
          this.setState({
            unreadCount: 0
          })
        }

        // when the component renders gather any unread messages
        source.getUnconsumedMessagesCount().then(count => {
          this.setState({
            unreadCount: count
          })
        })

        // when messages are added - count unreads
        source.on('messageAdded', (message) => {
          // if the message was sent by the worker - unreads should be zero
          const workerName = manager.workerClient.name.replace('@', '_40').replace('.', '_2E');
          if (message.author === workerName) {
            this.setState({
              unreadCount: 0
            });
            return;
          }

          // don't display unreads on the active task
          let selectedTaskSid = window.selectedTaskSid || '';
          if (selectedTaskSid === task.sid) {
            return;
          }

          // otherwise, count the unreads
          source.getUnconsumedMessagesCount().then(count => {
            this.setState({
              unreadCount: count
            })
          })
        })
      }).catch(error => console.log(error));
    }, 2000)
  }

  render() {
    if (this.state.unreadCount < 1) {
      return null;
    }

    return (
      <span style={ badgeStyles }>{ this.state.unreadCount }</span>
    )
  }
}