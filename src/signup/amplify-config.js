import { Amplify } from 'aws-amplify';
import awsExports from './amplify-output.json'; // Ensure this file is generated when you set up Amplify CLI or Studio

Amplify.configure(awsExports);
