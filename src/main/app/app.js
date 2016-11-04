import {DataStore} from './stores/DataStore';
import Fluxible from 'fluxible';
import {FormStore} from './stores/FormStore';
import {ModalStore} from './stores/ModalStore';
import {SequenceStore} from './stores/SequenceStore';
import {AccountStore} from './stores/AccountStore';
import {adminSequenceStores} from './stores/AdminSequenceStores';
import {AlertStore} from './stores/AlertStore';
import {CounterStore} from './stores/CounterStore';
import {dataStores} from './stores/DataStores';
import {LocalStore} from './stores/LocalStore';
import {PaymentStore} from './stores/PaymentStore';
import {AppStore} from './stores/AppStore';
import {sequenceStores} from './stores/SequenceStores';
import pull from 'lodash/pull';

const app = new Fluxible();
const pendingActions = [];

AppStore.prototype.waitForPendingActions = () => {
  const {length} = pendingActions;

  if (length) {
    return Promise.all(pendingActions).then(results => length);
  } else {
    return Promise.resolve(0);
  }
};

app.plug({
  name: 'componentPlugin',

  plugContext: function (options, context, app) {
    return {
      plugComponentContext(componentContext, context, app) {
        componentContext.getComponentContext = () => componentContext;
        componentContext.getSerializedState = () => app.dehydrate(context);
        componentContext.executeAction = async function(action, payload, callback) {
          const answer = context.executeAction(action, payload, callback);
          pendingActions.push(answer);

          try {
            return await answer;
          } finally {
            pull(pendingActions, answer);
          }
        };
      },
      plugActionContext(actionContext) {
        actionContext.executeAction = async function(action, payload, callback) {
          const answer = context.executeAction(action, payload, callback);
          pendingActions.push(answer);

          try {
            return await answer;
          } finally {
            pull(pendingActions, answer);
          }
        };
      }
    };
  }
});

app.registerStore(LocalStore);
app.registerStore(ModalStore);
app.registerStore(AlertStore);
app.registerStore(DataStore);
app.registerStore(CounterStore);
app.registerStore(SequenceStore);
app.registerStore(AccountStore);
app.registerStore(FormStore);
app.registerStore(PaymentStore);
app.registerStore(AppStore);

dataStores.forEach(app.registerStore.bind(app));
sequenceStores.forEach(app.registerStore.bind(app));
adminSequenceStores.forEach(app.registerStore.bind(app));

export {app};



// WEBPACK FOOTER //
// ./src/main/app/app.js