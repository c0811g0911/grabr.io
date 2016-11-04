import React from 'react';
import {FormattedMessage} from 'react-intl';

const {string, func} = React.PropTypes;

export class Confirm extends React.Component {
  static displayName = 'Confirm';

  static propTypes = {
    intlKey: string,
    action: func.isRequired,
    close: func.isRequired
  };

  static defaultProps = {
    intlKey: 'shared.are_you_sure'
  };

  render() {
    const {intlKey, action, close} = this.props;

    return <div className="modal__container">
      <section className="modal__copy">
        <FormattedMessage id={intlKey}/>
      </section>
      <section>
        <button className="modal__button grabr-button" onClick={() => {
          action();
          close();
        }}>
          <FormattedMessage id="shared.yes"/>
        </button>
        <button className="modal__button grabr-button" onClick={() => {
          close();
        }}>
          <FormattedMessage id="shared.no"/>
        </button>
      </section>
    </div>;
  }

}



// WEBPACK FOOTER //
// ./src/main/app/components/_confirm/Confirm.js