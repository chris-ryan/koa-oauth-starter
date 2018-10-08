import * as bcrypt from 'bcrypt';
import { ObjectID } from 'mongodb';
import { getCollection } from '../../db/index';

export default class User {
  constructor(user) {
    // required properties
    this.username = user.username;
    this.password = user.password;
    //optional properties
    if (user._id) this._id = user._id;
  }
  // INSTANCE METHODS
  async delete() {
    console.log(`deleting user: ${this.username} from database`);
    const collection = await getCollection('users').catch(err => console.error(err));
    return await collection.deleteOne({'username': this.username});
  }

  async exists(){
    return await this.constructor.findByUsername(this.username); // returns null if not found
  }

  async save() {
    const collection = await getCollection('users').catch(err => console.error(err));
    let result = {};

    console.log(`saving user: ${this.username} to database`);
    if(this._id){ // if user is already in the db...
      // update the document
      result = await collection.findOneAndReplace({'_id': this._id}, this)
      .catch(err => console.error(err));
    } else { // otherwise, insert a new document
      result = await collection.insertOne(this)
      .catch(err => console.error(err));
    }
    return result.insertedId;
  }
  
  // STATIC METHODS
  static async findById(id){
    id = new ObjectID(id);
    const collection = await getCollection('users').catch(err => console.error(err));
    return await collection.findOne({'_id': id});
  }
  static async findByUsername(username){
    const collection = await getCollection('users').catch(err => console.error(err));
    return await collection.findOne({'username': username});
  }

  static hashPassword(password){
    console.log('hashing password');
    const saltRounds = 5;
    return bcrypt.hashSync(password, saltRounds);
  }
}