import { FlexPlugin } from 'flex-plugin';
import React from 'react';
import MessageBadges from './MessageBadges';

const PLUGIN_NAME = 'MessageBadges';

export default class MessageBadgesPlugin extends FlexPlugin {
  constructor() {
    super(PLUGIN_NAME);
  }

  /**
   * This code is run when your plugin is being started
   * Use this to modify any UI components or attach to the actions framework
   *
   * @param flex { typeof import('@twilio/flex-ui') }
   * @param manager { import('@twilio/flex-ui').Manager }
   */
  init(flex, manager) {

    flex.Actions.addListener('afterAcceptTask', (payload) => {
      window.selectedTaskSid = payload.task.sid;
    })

    window.selectedTaskSid = flex.selectedTaskSid || window.location.pathname.replace('/agent-desktop/', '').slice(0, -1);

    flex.TaskListItem.Content.add(
      <MessageBadges flex={ flex } manager={ manager } key="message-badges" />, {
        if: props => props.channelDefinition.capabilities.has("Chat") && props.task.taskStatus === 'assigned'
      }
    );
  }
}
