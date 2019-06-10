import React from 'react';

const badgeWrapper = {
  display: 'block',
  float: 'right',
  marginTop: '-32px',
  marginRight: '10px'
}

const badgeStyles = {
  color: '#fff',
  background: '#f00',
  fontWeight: 'bold',
  padding: '5px 10px',
  borderRadius: '20px'
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

    // when selecting a specific task, set the unread count to 0
    flex.Actions.addListener('afterSelectTask', (payload) => {
      if (payload.task && payload.task.taskSid === task.taskSid) {
        this.setState({
          unreadCount: 0
        })
        window.selectedTaskSid = this.props.selectedTaskSid;
      }
    })

    // TODO: improve the approach here, a timeout isn't the best way to handle this
    // the problem: it takes time for the underlying Chat client to initialize - its possible
    // for flex to ask it for the chat channel before the client has initialized.
    // the channelSid for the chat channel is stored on the task Attributes!
    setTimeout(() => {
      manager.chatClient.getChannelBySid(task.attributes.channelSid).then((source) => {
        // if the component renders and the task is selected
        // reset the unread count to 0
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

        // listen to the underlying chat channel in Flex
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
          // we're using the Chat SDK directly
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
      <div style={ badgeWrapper }><span style={ badgeStyles }>{ this.state.unreadCount }</span></div>
    )
  }
}