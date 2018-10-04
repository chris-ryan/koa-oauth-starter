import { getCollection } from './index';

// getSessionStore:
// returns object containing the methods required & defined by koa-session-store
export function getSessionStore() {
  return {
    get: async (key, maxAge, { rolling }) => {
      console.log('getting session store from db');
      getCollection('sessions').then((col) => {
        col.findOne({_id: key}).then((doc) => {
          return doc.sess;
        });
      }).catch(err => console.error(err));
    },
    set: async (key, sess, maxAge, { rolling, changed }) => {
      console.log('setting session store from db');
      getCollection('sessions').then((col) => {
        col.insertOne({_id: key, maxAge, sess});
      }).catch(err => console.error(err));
    },
    destroy: async (key) => { 
      getCollection('sessions').then((col) => {
        col.deleteOne({_id: key});
      }).catch(err => console.error(err));
    }
  }
  // return {
  //   get: (key, maxAge, { rolling }) => {
  //     collection.findOne({_id: key}).then((doc) => doc.sess);
  //   },
  //   set: async (key, sess, maxAge, { rolling, changed }) => {
  //     await collection.insertOne({_id: key, maxAge, sess})
  //     .catch(err => console.err(err));
  //   },
  //   destroy: async (key) => {
  //     await collection.deleteOne({_id: key}).catch(err => console.err(err));
  //   }
  // }
}