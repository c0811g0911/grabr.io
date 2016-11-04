import React from 'react';
import {connectToStores} from 'fluxible-addons-react';
import {loadParticipantData} from '../../actions/GrabActionCreators';
import {ParticipantStore} from '../../stores/SequenceStores';
import './participant-phone.scss';

const {func, number, string} = React.PropTypes;

export const ParticipantPhone = connectToStores(class extends React.Component {
  static propTypes = {
    grabId: number.isRequired,
    className: string.isRequired
  };

  static contextTypes = {
    executeAction: func.isRequired
  };

  componentDidMount() {
    const {grabId} = this.props;

    this.context.executeAction(loadParticipantData, {grabId});
  }

  render() {
    const {user, className} = this.props;
    if (!user || !user.get('phone')) {
      return null;
    }

    return <a className={`participant-phone link-unstyled ${ className }`} href={`tel:${ user.get('phone').number }`}>
          <span className="participant-phone__text">
            {`Call ${ user.get('first_name') }:`}
          </span>
      {" "}
      <span className="participant-phone__number">
            {user.get('phone').number}
          </span>
    </a>;
  }
}, [ParticipantStore], ({getStore}) => {
  return {
    user: getStore(ParticipantStore).get()
  };
});



// WEBPACK FOOTER //
// ./src/main/app/components/participant-phone/ParticipantPhone.js