import { getCollection } from './index';

// getSessionStore:
// returns object containing the methods needed by koa-session-store
export function getSessionStore() {
  return {
    get: async (key, maxAge, { rolling }) => {
      console.log('getting session store from db');
      const sessCol = await getCollection('sessions');
      const doc = await sessCol.findOne({_id: key});
      if (doc) return doc.session;
      return null;
    },
    set: async (key, session, maxAge, { rolling, changed }) => {
      console.log('setting session store from db');
      const sessCol = await getCollection('sessions');
      await sessCol.updateOne({_id: key},{ $set: {_id: key, maxAge, session}},{ upsert: true});
    },
    destroy: async (key) => {
      console.log('destroying session');
      const sessCol = await getCollection('sessions');
      await sessCol.deleteOne({_id: key});
    }
  }
}
