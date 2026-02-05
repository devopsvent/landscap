import { defineAuth, secret } from "@aws-amplify/backend";

const CALLBACK_URL_PROD = "https://portal.customscape.ai/";
const CALLBACK_URL_DEV = "http://localhost:3000/authentication/signin";
/**
 * Define and configure your auth resource
 * @see https://docs.amplify.aws/gen2/build-a-backend/auth
 */
export const auth = defineAuth({
	loginWith: {
		email: true,
		externalProviders: {
			google: {
				clientId: secret("GOOGLE_CLIENT_ID"),
				clientSecret: secret("GOOGLE_CLIENT_SECRET"),
				scopes: ["email"],
			},
			facebook: {
				clientId: secret("FACEBOOK_CLIENT_ID"),
				clientSecret: secret("FACEBOOK_CLIENT_SECRET"),
				scopes: ["public_profile"],
			},
			callbackUrls: [CALLBACK_URL_PROD],
			logoutUrls: [CALLBACK_URL_PROD],
		},
	},
	userAttributes: {
		email: {
			required: true,
		},
		givenName: {
			required: false,
			mutable: true,
		},
		familyName: {
			required: false,
			mutable: true,
		},
		phoneNumber: {
			required: false,
			mutable: true,
		},
		"custom:country": {
			dataType: "String",
			mutable: true,
		},
		"custom:state": {
			dataType: "String",
			mutable: true,
		},
	},
});
