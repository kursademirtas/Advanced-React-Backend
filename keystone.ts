import {User} from './schemas/User';
import {Product} from './schemas/Product';
import { createSchema, config } from '@keystone-next/keystone/schema';
import { createAuth } from '@keystone-next/auth';
import  {withItemData, statelessSessions } from '@keystone-next/keystone/session';


import 'dotenv/config';

const databaseURL = process.env.DATABASE_URL;
const sessionConfig = {
	maxAge:60 * 60 * 24* 360, //how long they user signed in
	secret: process.env.COOKIE_SECRET,
};


const { withAuth } = createAuth({
	listKey: 'User',
	identityField:'email',
	secretField:'password',
	initFirstItem:{
		fields:['name', 'email', 'password'],
		//To-do add a initial roles here
	}
})


export default withAuth(config({
	//@ts-ignore
	server: {
		cors: {
			origin: [process.env.FRONTEND_URL],
			credentials:true,
		},
	},
	db: {
		adapter: 'mongoose',
		url: databaseURL,
		// todo: add data seeding
	},
	lists:createSchema({
		User,
		Product
		//schema items go in here
	}),
	ui: {
		
		isAccessAllowed:({session}) => {
			console.log(session)
			return !!session?.data
		},
	},
	session: withItemData(statelessSessions(sessionConfig), {
		User: `id`
	})
}))