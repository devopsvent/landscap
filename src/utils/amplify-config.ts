import config from "../../amplify_outputs.json";

const amplifyConfig = {
	...config,
	...{
		auth: {
			...config.auth,
			user_pool_id: "us-east-2_0nHds69C4",
			user_pool_client_id: "7ijmsdb0jtfhl3flftostfnj57",
			identity_pool_id: "us-east-2:8043825f-55f8-473e-8151-d051c7d72a18",
			oauth: {
				...config.auth.oauth,
				domain: "customscape-ai-production-auth.auth.us-east-2.amazoncognito.com",
				redirectSignIn: "https://portal.customscape.ai/",
				redirectSignOut: "https://portal.customscape.ai/",
			},
		},
	},
};

export default amplifyConfig;
